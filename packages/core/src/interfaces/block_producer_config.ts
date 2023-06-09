import { IProducerConfig } from "../interfaces/producer_config.js";

export interface IBlockProducerConfig extends IProducerConfig {
    startBlock?: number,
    rpcWsEndpoints?: string[],
    mongoUrl?: string, 
    maxReOrgDepth?: number, 
    maxRetries?: number,
    blockPollingTimeout?: number, 
    blockSubscriptionTimeout?: number
}
