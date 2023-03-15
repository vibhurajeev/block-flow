import { ConsumerGlobalConfig } from "node-rdkafka";

export interface IConsumerConfig extends ConsumerGlobalConfig {
    maxBufferLength?: number,
    maxRetries?: number,
    connectionTimeout?: number
} 
