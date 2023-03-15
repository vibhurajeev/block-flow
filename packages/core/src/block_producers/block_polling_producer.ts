import { IProducedBlock, ProducedBlocksModel, IProducedBlocksModel } from "./produced_blocks_model.js";
import { IBlockProducerConfig } from "../interfaces/block_producer_config.js";
import { IProducerConfig } from "../interfaces/producer_config.js";
import { BlockGetter } from "../block_getters/block_getter.js";
import { BlockProducer } from "./block_producer.js";
import { Coder } from "../coder/protobuf_coder.js";
import { BlockPoller } from "../block_subscription/block_polling.js";
import { Database } from "../mongo/database.js";
import Eth from "web3-eth";

export class BlockPollerProducer extends BlockProducer {
    /**
     * Factory method to simplify the initiation of the BlockProducer based on polling
     * 
     * @param {IBlockProducerConfig} config 
     * 
     * @returns {Promise<BlockPollerProducer>}
     */
    public static async new(config: IBlockProducerConfig): Promise<BlockPollerProducer> {
        const endpoint = config.rpcWsEndpoints?.[0] || "";
        const startBlock = config.startBlock || 0;
        const mongoUrl = config.mongoUrl || "mongodb://localhost:27017/open-api";
        const blockPollingTimeout = config.blockPollingTimeout || 2000;
        const maxRetries = config.maxRetries || 0;
        const maxReOrgDepth = config.maxReOrgDepth || 0;

        delete config.rpcWsEndpoints;
        delete config.startBlock;
        delete config.mongoUrl;
        delete config.maxReOrgDepth;
        delete config.maxRetries;
        delete config.blockPollingTimeout;

        const database = new Database(mongoUrl);
        await database.connect();
      
        const blockGetter = new BlockGetter(
            //@ts-ignore
            new Eth(endpoint),
            maxRetries
        );

        return new BlockPollerProducer(
            new Coder(
                "block",
                "blockpackage",
                "Block"
            ),
            config as IProducerConfig,
            new BlockPoller(
                blockGetter,
                blockPollingTimeout
            ),
            blockGetter,
            database.model<IProducedBlock, IProducedBlocksModel<IProducedBlock>>(
                "ProducedBlocks",
                ProducedBlocksModel,
                "producedblocks"
            ),
            startBlock,
            maxReOrgDepth
        );
    }
}
