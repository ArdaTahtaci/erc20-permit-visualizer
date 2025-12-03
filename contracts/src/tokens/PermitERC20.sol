// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CleanERC20.sol";
import "../interfaces/IERC20Permit.sol";

contract PermitERC20 is CleanERC20, IERC20Permit {
    mapping(address => uint256) public override nonces;

    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );

    constructor(string memory name, string memory symbol)
        CleanERC20(name, symbol, 18){
            uint256 chainId;
            assembly {
                chainId := chainid()
            }
            DOMAIN_SEPARATOR = keccak256(
                abi.encode(
                    keccak256(
                        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                    ),
                    keccak256(bytes(name)),
                    keccak256(bytes("1")),
                    chainId,
                    address(this)
                )
            );
        }

        /**
        * @notice EIP-2612 Permit
        */

        function permit(
            address owner,
            address spender,
            uint256 value,
            uint256 deadline,
            uint8 v,
            bytes32 r,
            bytes32 s
        ) external override {
            require(block.timestamp <= deadline, "PERMIT_EXPIRED");

            bytes32 structHash = keccak256(
                abi.encode(
                    PERMIT_TYPEHASH,
                    owner,
                    spender,
                    value,
                    nonces[owner]++,
                    deadline
                )
            );  

            bytes32 digest = keccak256(
                abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
            );  

            address recoveredAddress = ecrecover(digest, v, r, s);
            require(recoveredAddress == owner, "INVALID_SIG");

            allowance[owner][spender] = value;
            emit Approval(owner, spender, value);   
        }

}