import dotenv from 'dotenv';
dotenv.config().parsed;

export const SERVICE_LOCAL_PORT = process.env.SERVICE_LOCAL_PORT
export const DATABASE_URL = process.env.DATABASE_URL || 'http://localhost:3030'
export const NODE_ENV = process.env.NODE_ENV || 'development'