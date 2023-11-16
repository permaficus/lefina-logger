import {
    RBMQ_URL,
    RBMQ_QUEUE_NAME,
    LOGGER_STORAGE_TYPE
} from '../../constant/config.js'
import { logger } from './logger.utils.js';
import { log } from '../controller/logger.js';
import amqplib from 'amqplib';
import chalk from 'chalk'

let attemptCount = 0;

export const retrieveMessageFromBroker = async () => {
    
    let rbmq, channel = null;

    try {      
        rbmq = await amqplib.connect(RBMQ_URL)
        channel = await rbmq.createChannel()
    } catch (error) {

        attemptCount++;

        console.info(`Retrying connect to: ${chalk.yellow(RBMQ_URL.split('@')[1])}, attempt: ${chalk.red(attemptCount)}`)

        if (attemptCount >= 5) {
            console.log(chalk.red('\nCannot connect to RabbitMQ Service'))
            logger.error('Cannot connect to RabbitMQ Service')
            return;
        }

        setTimeout(retrieveMessageFromBroker, 5000)
        return;
    }

    await channel.assertQueue(RBMQ_QUEUE_NAME)
    await channel.consume(RBMQ_QUEUE_NAME, msg => {
        if (msg) {

            const { level, details  } = JSON.parse(msg.content);

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
                    
                    console.warn(error)

                }

            }

            channel.ack(msg)

        }
    })

    process.once('SIGINT', async() => {
        await channel.close();
        await rbmq.close();
    })

    attemptCount = 0;
    console.log(chalk.green("\n[*] Waiting for messages. To exit press CTRL+C\n"));

}
