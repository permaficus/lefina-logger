import dotenv from 'dotenv';
dotenv.config().parsed;

export const SERVICE_LOCAL_PORT = process.env.SERVICE_LOCAL_PORT
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const RBMQ_EXCHANGE_NAME = process.env.RBMQ_EXCHANGE_NAME
export const RBMQ_URL = process.env.RBMQ_URL
export const RBMQ_ROUTING_KEY = process.env.RBMQ_ROUTING_KEY
export const RBMQ_QUEUE_NAME = process.env.RBMQ_QUEUE_NAME