import { IBlockWorkerMessage } from "../interfaces/block_worker_message.js";
import { parentPort, workerData } from "worker_threads";
import { BlockGetter } from "./block_getter.js";

if (!workerData || !parentPort) {
    process.exit(1);
}

const blockGetter = BlockGetter.new(
    workerData.endpoint,
    workerData.maxRetries
);

parentPort.on("message", async (message: {
    blockNumber: number, 
    callBackId: number
}) => {
    try {
        parentPort?.postMessage(
            {
                callBackId: message.callBackId,
                error: null,
                block: await blockGetter.getBlockWithTransactionReceipts(message.blockNumber)
            } as IBlockWorkerMessage
        );
    } catch (error) {
        parentPort?.postMessage(
            {
                callBackId: message.callBackId,
                error: error
            } as IBlockWorkerMessage
        );
    }
});
