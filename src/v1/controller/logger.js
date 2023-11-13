import { logger } from "../libs/logger.utils.js";

export class log {

    static create = async (req, res) => {

        const { level, message } = req.body;

        const Do = {
            ...(level.error && { logging: logger.error(message) })
        }

        Do.logging

        res.status(201).end();
    }

}