import express from 'express';
import cors from 'cors';
import { router } from '../router/router.js';
import { SERVICE_LOCAL_PORT, NODE_ENV } from '../../constant/config.js';

const server = new express();

const init = async () => {

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(cors());
    server.use(router)

}

export { init, server, SERVICE_LOCAL_PORT, NODE_ENV }