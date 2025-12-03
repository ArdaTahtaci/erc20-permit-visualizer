export const lensAbi = [
    {
        type: "function",
        name: "getView",
        stateMutability: "view",
        inputs: [
            { name: "token", type: "address", internalType: "address" },
            { name: "owner", type: "address", internalType: "address" },
            { name: "spender", type: "address", internalType: "address" }
        ],
        outputs: [
            {
                name: "viewData",
                type: "tuple",
                internalType: "struct AllowanceLens.PermitView",
                components: [
                    { name: "token", type: "address", internalType: "address" },
                    { name: "owner", type: "address", internalType: "address" },
                    { name: "spender", type: "address", internalType: "address" },
                    { name: "allowance", type: "uint256", internalType: "uint256" },
                    { name: "nonce", type: "uint256", internalType: "uint256" },
                    { name: "domainSeparator", type: "bytes32", internalType: "bytes32" },
                    { name: "name", type: "string", internalType: "string" },
                    { name: "symbol", type: "string", internalType: "string" }
                ]
            }
        ]
    }
] as const;
