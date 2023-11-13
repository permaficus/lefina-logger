
import winston from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const { combine, timestamp, printf, colorize, align, json } = winston.format;

const logTransport = [
    new winston.transports.Console(),
    new winston.transports.File({ 
        filename: 'log/error.log',
        level: 'error'
     }),
     new winston.transports.File({
        filename: 'log/info.log',
        level: 'info'
     })
]

export const logger = winston.createLogger({
    level: 'info',
    levels: levels,
    format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json(),
        printf(template => `[${template.timestamp}] ${template.level} : ${template.message}`)
    ),
    transports: logTransport
})

