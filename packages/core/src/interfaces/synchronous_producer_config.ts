import { IProducerConfig } from "./producer_config.js";

export interface ISynchronousProducerConfig extends IProducerConfig {
    deliveryTimeout?: number
}
