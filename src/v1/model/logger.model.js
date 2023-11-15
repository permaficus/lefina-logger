import { DB } from "../libs/prisma.utils.js";
import { logger } from "../libs/logger.utils.js";

export class logModel {

    static create = async ( data ) => {

        const { level, source, code, environment, details } = data;

        const logging =  await DB.logs.create({
            data: {
                ...(level.error && { level: 'ERROR' }),
                ...(level.info && { level: 'INFO' }),
                source: source,
                code: code,
                environment: environment,
                details: details
            }
        })

        logger.info(`Creating log: ${JSON.stringify(logging)}`)
    }

    static read = async (level) => {

        try {
            
            const report = await DB.logs.findMany({
                where: {
                    level: level
                },
                orderBy: {
                    createAt: 'desc'
                }
            })
    
            return report;

        } catch (error) {
            
            throw error

        }

    }

}