import { logger } from "../libs/logger.utils.js";
import { logModel } from "../model/logger.model.js";

export class log {

    static create = async (data) => {

        try {
            
            await logModel.create(data)

        } catch (error) {
            
            logger.error(error)

        }
    }

    static read = async (req, res) => {

        try {

            const report = await logModel.read(req.params.level);
            res.status(200).json(report).end();
            
        } catch (error) {
            
            logger.error(error)
        }

    }

}