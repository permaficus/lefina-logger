import {
    RBMQ_URL,
    RBMQ_QUEUE_NAME,
    LOGGER_STORAGE_TYPE
} from '../../constant/config.js'
import { logger } from './logger.utils.js';
import { log } from '../controller/logger.js';
import amqplib from 'amqplib';


export const retrieveMessageFromBroker = async () => {

    const rbmq = await amqplib.connect(RBMQ_URL);
    const channel = await rbmq.createChannel();
    
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

    console.log(" [*] Waiting for messages. To exit press CTRL+C\n");

}
