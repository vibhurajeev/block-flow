import { ProducerGlobalConfig } from "node-rdkafka";


export interface IProducerConfig extends ProducerGlobalConfig {
    topic: string;
    pollInterval?: number,
    connectionTimeout?: number,
    flushTimeout?: number
}
