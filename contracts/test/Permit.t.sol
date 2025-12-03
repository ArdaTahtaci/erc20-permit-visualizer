// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/tokens/PermitERC20.sol";

/// @dev a mock for testing PermitERC20
contract PermitERC20Mock is PermitERC20 {
    constructor() PermitERC20("MockToken", "MCK") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract PermitERC20Test is Test {
    PermitERC20Mock public token;

    uint256 ownerPrivateKey;
    address owner;
    address spender;
    address other;

    function setUp() public {
        token = new PermitERC20Mock();

        ownerPrivateKey = 0xA11CE;
        owner = vm.addr(ownerPrivateKey);
        spender = address(0xB0B);
        other = address(0xC0C);

        token.mint(owner, 1000 ether);
    }

    // --------------- internal helper ---------------

    function _buildPermitDigest(
        address _owner,
        address _spender,
        uint256 _value,
        uint256 _nonce,
        uint256 _deadline
    ) internal view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                token.PERMIT_TYPEHASH(),
                _owner,
                _spender,
                _value,
                _nonce,
                _deadline
            )
        );

        return
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    token.DOMAIN_SEPARATOR(),
                    structHash
                )
            );
    }

    // --------------- TEST 1: happy path ---------------

    function test_permitSetsAllowanceAndIncrementsNonce() public {
        uint256 value = 500 ether;
        uint256 deadline = block.timestamp + 1 hours;

        uint256 nonceBefore = token.nonces(owner);
        assertEq(nonceBefore, 0, "initial nonce should be 0");

        bytes32 digest = _buildPermitDigest(
            owner,
            spender,
            value,
            nonceBefore,
            deadline
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);

        // permit çağrısı
        token.permit(owner, spender, value, deadline, v, r, s);

        // allowance düzgün set edildi mi?
        uint256 allowanceAfter = token.allowance(owner, spender);
        assertEq(allowanceAfter, value, "allowance should equal permit value");

        // nonce +1 oldu mu?
        uint256 nonceAfter = token.nonces(owner);
        assertEq(nonceAfter, nonceBefore + 1, "nonce should increment");
    }

    // --------------- TEST 2: expired permit ---------------

    function test_permitRevertsWhenExpired() public {
        uint256 value = 100 ether;
        uint256 deadline = block.timestamp - 1; // geçmiş zaman

        uint256 nonce = token.nonces(owner);

        bytes32 digest = _buildPermitDigest(
            owner,
            spender,
            value,
            nonce,
            deadline
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);

        vm.expectRevert(bytes("PERMIT_EXPIRED"));
        token.permit(owner, spender, value, deadline, v, r, s);
    }

    // --------------- TEST 3: invalid signer ---------------

    function test_permitRevertsWithInvalidSigner() public {
        uint256 value = 100 ether;
        uint256 deadline = block.timestamp + 1 hours;

        uint256 nonce = token.nonces(owner);

        bytes32 digest = _buildPermitDigest(
            owner,
            spender,
            value,
            nonce,
            deadline
        );

        // Yanlış private key ile sign ediyoruz (attacker)
        uint256 attackerPk = 0xDEADBEEF;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(attackerPk, digest);

        vm.expectRevert(bytes("INVALID_SIG"));
        token.permit(owner, spender, value, deadline, v, r, s);
    }

    // --------------- TEST 4: domain separator doğrulama ---------------

    function test_domainSeparatorMatchesEIP712Spec() public view {
        // Kontrattaki DOMAIN_SEPARATOR ile manuel hesapladığımız aynı mı?
        (string memory n, , , ) = _getTokenMeta();

        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        bytes32 expectedDomainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes(n)),
                keccak256(bytes("1")),
                chainId,
                address(token)
            )
        );

        assertEq(
            token.DOMAIN_SEPARATOR(),
            expectedDomainSeparator,
            "DOMAIN_SEPARATOR mismatch"
        );
    }

    function _getTokenMeta()
        internal
        view
        returns (string memory, string memory, uint8, uint256)
    {
        // name() ve symbol() public state'den otomatik getter
        string memory n = token.name();
        string memory s = token.symbol();
        uint8 d = token.decimals();
        uint256 supply = token.totalSupply();
        return (n, s, d, supply);
    }

    // --------------- TEST 5: transferFrom spends allowance ---------------

    function test_transferFromAfterPermitSpendsAllowance() public {
        uint256 value = 400 ether;
        uint256 deadline = block.timestamp + 1 hours;

        uint256 nonce = token.nonces(owner);

        bytes32 digest = _buildPermitDigest(
            owner,
            spender,
            value,
            nonce,
            deadline
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);

        // Önce permit ile allowance veriyoruz
        token.permit(owner, spender, value, deadline, v, r, s);

        // spender, owner adına harcama yapacak
        uint256 spendAmount = 150 ether;

        vm.prank(spender);
        token.transferFrom(owner, other, spendAmount);

        // allowance azalmalı
        uint256 remainingAllowance = token.allowance(owner, spender);
        assertEq(
            remainingAllowance,
            value - spendAmount,
            "allowance should decrease after transferFrom"
        );

        // bakiyeler de doğru mu?
        assertEq(token.balanceOf(owner), 1_000 ether - spendAmount);
        assertEq(token.balanceOf(other), spendAmount);
    }

    // --------------- TEST 6: multiple permits increments nonce ---------------

    function test_multiplePermitsUseSequentialNonces() public {
        uint256 deadline = block.timestamp + 1 hours;

        // 1. permit
        {
            uint256 value1 = 100 ether;
            uint256 nonce1 = token.nonces(owner);

            bytes32 digest1 = _buildPermitDigest(
                owner,
                spender,
                value1,
                nonce1,
                deadline
            );

            (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(
                ownerPrivateKey,
                digest1
            );
            token.permit(owner, spender, value1, deadline, v1, r1, s1);

            assertEq(token.nonces(owner), nonce1 + 1);
            assertEq(token.allowance(owner, spender), value1);
        }

        // 2. permit (nonce farklı)
        {
            uint256 value2 = 300 ether;
            uint256 nonce2 = token.nonces(owner);

            bytes32 digest2 = _buildPermitDigest(
                owner,
                spender,
                value2,
                nonce2,
                deadline
            );

            (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(
                ownerPrivateKey,
                digest2
            );
            token.permit(owner, spender, value2, deadline, v2, r2, s2);

            // nonce yine +1
            assertEq(token.nonces(owner), nonce2 + 1);
            // allowance son permit değeriyle overwrite edilir
            assertEq(token.allowance(owner, spender), value2);
        }
    }
}
