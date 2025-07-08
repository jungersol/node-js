const logger = require("./logger");
const instance = null;
class LoggerClass{
    constructor(instance){
        if(!instance){
            instance = this;
        }
        return instance;
    }

    #createLogObject(email, locacion, proc_type, log){
        return {
            email, locacion, proc_type, log
        };

    }

    info(email, location, proc_type, log){
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }
    warn(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }
    error(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }
    verbose(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }
    silly(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }
    http(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }
    debug(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.info(logs);
    }

}

module.exports = new LoggerClass();