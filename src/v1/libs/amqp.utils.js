import {
    RBMQ_URL,
    RBMQ_QUEUE_NAME,
    LOGGER_STORAGE_TYPE
} from '../../constant/config.js'
import { logger } from './logger.utils.js';
import { log } from '../controller/logger.js';
import amqplib from 'amqplib';
import chalk from 'chalk'
import EventEmitter from 'events'

class RabbitConnector extends EventEmitter {
    constructor(){
        super()
        this.connection = null
        this.attempt = 0
        this.maxAttempt = 20
        this.userCloseConnection = false
        this.onError = this.onError.bind(this)
        this.onClosed = this.onClosed.bind(this)
    }
    setClosingState = (value) => {
        this.userCloseConnection = value
    }
    connect = async () => {

        try {
            const conn = await amqplib.connect(RBMQ_URL)
    
            conn.on('error', this.onError)
            conn.on('close', this.onClosed)
    
            this.emit('connected', conn)
            this.connection = conn
            this.attempt = 0
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                this.emit('ECONNREFUSED', error.message);
                if (this.attempt >= this.maxAttempt) {
                    return;
                }
            }
    
            if ((/ACCESS_REFUSED/g).test(error.message) == true) {
                this.emit('ACCREFUSED', error.message);
                return;
            }
            
            this.onError(error)
        }
    }

    reconnect = () => {
        this.attempt++
        this.emit('reconnect', this.attempt)
        setTimeout((async () => await this.connect()), 5000);
    }

    onError = (error) => {
        this.connection = null,
        this.emit('error', error)
        if (error.message !== 'Connection closing') {
            this.reconnect();
        }
    }

    onClosed = () => {
        this.connection = null
        this.emit('close', this.connection)
        if (!this.userCloseConnection) {
            this.reconnect();
        }
    }
}

export const retrieveMessageFromBroker = async () => {
    const rbmq = new RabbitConnector();
    rbmq.connect();
    rbmq.on('connected', async conn => {
        console.log(chalk.yellow(`[RBMQ] Connected to ${chalk.greenBright(RBMQ_URL.split('@')[1])}`))
        const channel = await conn.createChannel();
        await channel.consume(RBMQ_QUEUE_NAME, msg => {
            if (msg) {
                const { level, details } = JSON.parse(msg.content);

                if (LOGGER_STORAGE_TYPE == 'file') {
                    const Do = {
                        ...(level.error && { logging: logger.error(details) }),
                        ...(level.info && { logging: logger.info(details) }),
                        ...(level.warn && { logging: logger.warn(details) })
                    }
    
                    Do.logging
                } else {
                    try {
                        log.create(JSON.parse(msg.content))
                    } catch (error) {
                        logger.error(error)
                        return;
                    }
                }

                channel.ack(msg)
            }
            
        })

        process.once('SIGINT', async () => {
            rbmq.setClosingState(true)
            await channel.close();
            await conn.close();
        })

        console.log(chalk.green("\n[*] Waiting for messages. To exit press CTRL+C\n"));

    })

    rbmq.on('error', error => {
        console.info(chalk.red(`[RBMQ] Error: ${error.message}`))
    })
    rbmq.on('reconnect', count => {
        console.info(`[RBMQ] Retrying connect to: ${chalk.yellow(RBMQ_URL.split('@')[1])}, attempt: ${chalk.green(count)}`)
    })
    rbmq.on('ECONNREFUSED', () => {
        logger.error(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`)
        console.error(chalk.red(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`))
        return;
    })
}
