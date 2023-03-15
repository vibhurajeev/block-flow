import { ICoder } from "./coder.js";

export interface ICoderConfig {
  [topic: string]: ICoder
}
