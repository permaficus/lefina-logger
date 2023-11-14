import {
    RBMQ_EXCHANGE_NAME,
    RBMQ_ROUTING_KEY,
    RBMQ_URL,
    RBMQ_QUEUE_NAME
} from '../../constant/config.js'
import { logger } from './logger.utils.js';
import amqplib from 'amqplib';


export const retrieveMessageFromBroker = async () => {

    const rbmq = await amqplib.connect(RBMQ_URL, 'heartbeat=60');
    const channel = await rbmq.createChannel();
    
    await channel.assertQueue(RBMQ_QUEUE_NAME)
    await channel.consume(RBMQ_QUEUE_NAME, msg => {
        if (msg) {
            
            const { level, message } = JSON.parse(msg.content);

            const Do = {
                ...(level.error && { logging: logger.error(message) }),
                ...(level.info && { logging: logger.info(message) }),
                ...(level.warn && { logging: logger.warn(message) })
            }
    
            Do.logging

            channel.ack(msg)
        }
    })

    console.log(" [*] Waiting for messages. To exit press CTRL+C\n");

}
