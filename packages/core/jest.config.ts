import type { JestConfigWithTsJest } from "ts-jest"

const jestConfig: JestConfigWithTsJest = {
    "transform": {
        "^.+\\.(j|t)s?$": "babel-jest"
    },
    extensionsToTreatAsEsm: ['.ts'], 
    clearMocks: true,
    coverageThreshold: {
        global: {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": 80
        },
    }, 
    coveragePathIgnorePatterns: [
        "<rootDir>/dist/block_producers/produced_blocks_model"
    ]
}

export default jestConfig
