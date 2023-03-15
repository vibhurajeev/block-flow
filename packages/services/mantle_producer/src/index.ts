import { BlockPollerProducer } from "blockflow-core/block_producers/block_polling_producer";
import { Logger } from "blockflow-core/logger";
import dotenv from 'dotenv';

dotenv.config();
Logger.create({
    sentry: {
        dsn: process.env.SENTRY_DSN,
        level: 'error'
    },
    datadog: {
        api_key: process.env.DATADOG_API_KEY,
        service_name: process.env.DATADOG_APP_KEY
    }
});

BlockPollerProducer.new(
    {
        startBlock: parseInt(process.env.START_BLOCK as string),
        rpcWsEndpoints: process.env.RPC_WS_ENDPOINT_URL_LIST ? [process.env.RPC_WS_ENDPOINT_URL_LIST] : [""],
        blockPollingTimeout: parseInt(process.env.BLOCK_POLLING_TIMEOUT as string),
        topic: process.env.PRODUCER_TOPIC || "5001.blocks",
        maxReOrgDepth: 96,
        maxRetries: 5,
        mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/',
        "bootstrap.servers": process.env.KAFKA_CONNECTION_URL || "localhost:9092",
        "security.protocol": "plaintext"
    },
).then(producer => {
    producer.on("blockProducer.fatalError", (error) => {
        Logger.error(`Block producer exited. ${error.message}`);

        process.exit(1); //Exiting process on fatal error. Process manager needs to restart the process.
    });
    
    producer.start().catch((error) => {
        Logger.error(error);
    });
});
