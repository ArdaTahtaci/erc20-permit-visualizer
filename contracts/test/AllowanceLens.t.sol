// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/visualizer/AllowanceLens.sol";
import "../src/tokens/PermitERC20.sol";

contract PermitERC20Mock is PermitERC20 {
    constructor() PermitERC20("MockPermitToken", "MPT") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract AllowanceLensTest is Test {
    PermitERC20Mock token;
    AllowanceLens lens;

    uint256 ownerPk;
    address owner;
    address spender;

    function setUp() public {
        token = new PermitERC20Mock();
        lens = new AllowanceLens();

        ownerPk = 0xA11CE;
        owner = vm.addr(ownerPk);
        spender = address(0xBEEF);

        // owner'a token dağıt
        token.mint(owner, 1_000 ether);
    }

    /// ─────────────────────────────────────────────
    /// TEST 1: Lens, permit verilmeden önce allowance=0 göstermeli
    /// ─────────────────────────────────────────────
    function test_initialViewIsCorrect() public view{
        AllowanceLens.PermitView memory viewData =
            lens.getView(address(token), owner, spender);

        assertEq(viewData.allowance, 0);
        assertEq(viewData.nonce, 0);
        assertEq(viewData.token, address(token));
        assertEq(viewData.owner, owner);
        assertEq(viewData.spender, spender);
        assertEq(viewData.name, "MockPermitToken");
        assertEq(viewData.symbol, "MPT");
    }

    /// ─────────────────────────────────────────────
    /// internal helper: EIP-712 digest oluşturma
    /// ─────────────────────────────────────────────
    function _digest(
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

        return keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                structHash
            )
        );
    }

    /// ─────────────────────────────────────────────
    /// TEST 2: Permit sonrası lens doğru allowance & nonce göstermeli
    /// ─────────────────────────────────────────────
    function test_lensReflectsPermit() public {
        uint256 value = 500 ether;
        uint256 deadline = block.timestamp + 1 hours;

        uint256 nonce = token.nonces(owner);

        bytes32 digest = _digest(
            owner,
            spender,
            value,
            nonce,
            deadline
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, digest);

        token.permit(owner, spender, value, deadline, v, r, s);

        // lens view
        AllowanceLens.PermitView memory viewData =
            lens.getView(address(token), owner, spender);

        assertEq(viewData.allowance, value, "lens allowance mismatch");
        assertEq(viewData.nonce, nonce + 1, "lens nonce mismatch");
        assertEq(viewData.domainSeparator, token.DOMAIN_SEPARATOR());
    }

    /// ─────────────────────────────────────────────
    /// TEST 3: transferFrom ile allowance azalınca lens de güncellenmeli
    /// ─────────────────────────────────────────────
    function test_lensUpdatesAfterTransferFrom() public {
        uint256 value = 300 ether;
        uint256 deadline = block.timestamp + 1 hours;

        uint256 nonce = token.nonces(owner);

        // permit oluştur ve imzala
        bytes32 digest = _digest(owner, spender, value, nonce, deadline);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, digest);
        token.permit(owner, spender, value, deadline, v, r, s);

        // spender owner adına harcama yapıyor
        uint256 spendAmount = 120 ether;

        vm.prank(spender);
        token.transferFrom(owner, address(0xCAFE), spendAmount);

        // lens ile oku
        AllowanceLens.PermitView memory viewData =
            lens.getView(address(token), owner, spender);

        assertEq(viewData.allowance, value - spendAmount);
        assertEq(viewData.nonce, nonce + 1); // nonce değişmez
    }
}
