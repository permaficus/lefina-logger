import { 
    init, 
    server, 
    SERVICE_LOCAL_PORT,
    NODE_ENV
} from './v1/libs/server.utils.js'
import chalk from "chalk";

(async () => {

    await init();

    await server.listen(SERVICE_LOCAL_PORT, () => {
    
        console.log(
            `-----------------------------------------
            \n${chalk.black.bgGreenBright(`🚀 Logger Service is up and running!\n`
            )}\Mode: ${chalk.blueBright(
              `${NODE_ENV}`
            )}\nURL: ${chalk.blueBright(
              `http://localhost:${SERVICE_LOCAL_PORT}`
            )}\nTime: ${chalk.blueBright(
                `${new Date(Date.now())}`
            )}\n\n-----------------------------------------`
          );
    
    })

})()
