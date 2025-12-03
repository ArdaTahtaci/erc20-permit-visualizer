// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../tokens/PermitERC20.sol";

interface IERC20Basic {
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
}

contract AllowanceLens {
    struct PermitView {
        address token;
        address owner;
        address spender;
        uint256 allowance;
        uint256 nonce;
        bytes32 domainSeparator;
        string name;
        string symbol;
    }

    function getView(
        address token,
        address owner,
        address spender
    ) external view returns (PermitView memory viewData) {
        PermitERC20 permitToken = PermitERC20(token);
        IERC20Basic erc20 = IERC20Basic(token);

        viewData.token = token;
        viewData.owner = owner;
        viewData.spender = spender;

        // Allowance (ERC20)
        viewData.allowance = erc20.allowance(owner, spender);

        // Nonce (Permit)
        viewData.nonce = permitToken.nonces(owner);

        // Domain Separator (Permit)
        viewData.domainSeparator = permitToken.DOMAIN_SEPARATOR();

        // Metadata (UX için iyi olur)
        viewData.name = erc20.name();
        viewData.symbol = erc20.symbol();
    }
}
