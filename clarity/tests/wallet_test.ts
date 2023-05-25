import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';
import type * as indexTs from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import {
  Clarinet,
  Tx,
  types,
} from 'https://deno.land/x/clarinet@v1.6.0/index.ts';

Clarinet.test({
  name: 'Ensure that add-signer works',
  async fn(chain: indexTs.Chain, accounts: Map<string, indexTs.Account>) {
    // arrange: set up the chain, state, and other required elements
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // act: perform actions related to the current test
    const block = chain.mineBlock([
      Tx.contractCall(
        'wallet',
        'add-signer',
        [types.principal(wallet1.address)],
        deployer.address
      ),
    ]);

    // assert: review returned data, contract state, and other requirements
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const result = chain.callReadOnlyFn(
      `${deployer.address}.wallet`,
      'get-signers',
      [],
      deployer.address
    );
    assertEquals(result.result, `[${wallet1.address}]`);
  },
});

Clarinet.test({
  name: 'Ensure that add-stx-rule works',
  async fn(chain: indexTs.Chain, accounts: Map<string, indexTs.Account>) {
    // arrange: set up the chain, state, and other required elements
    const deployer = accounts.get('deployer')!;

    // act: perform actions related to the current test
    const block = chain.mineBlock([
      Tx.contractCall(
        'wallet',
        'add-stx-rule',
        [types.uint(100_000_000)],
        deployer.address
      ),
    ]);

    // assert: review returned data, contract state, and other requirements
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const result = chain.callReadOnlyFn(
      `${deployer.address}.wallet`,
      'get-rules',
      [],
      deployer.address
    );
    assertEquals(
      result.result,
      '[{amount-or-id: u100000000, asset: none, id: u0, kind: u0}]'
    );
  },
});

Clarinet.test({
  name: 'Ensure that STX transfer with no rules works',
  async fn(chain: indexTs.Chain, accounts: Map<string, indexTs.Account>) {
    // arrange: set up the chain, state, and other required elements
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // act: perform actions related to the current test
    const block = chain.mineBlock([
      // Deposit STX into the smart wallet
      Tx.transferSTX(
        200_000_000,
        `${deployer.address}.wallet`,
        deployer.address
      ),
      // Transfer STX from the smart wallet to wallet1
      Tx.contractCall(
        'wallet',
        'transfer-stx',
        [
          types.uint(100_000_000),
          types.principal(wallet1.address),
          types.none(),
        ],
        deployer.address
      ),
    ]);

    // assert: review returned data, contract state, and other requirements
    assertEquals(block.receipts.length, 2);
    block.receipts[0].result.expectOk().expectBool(true);
    const result = block.receipts[1].result.expectOk().expectTuple();
    result.pending.expectNone();
    result.result.expectSome().expectOk().expectBool(true);

    const { assets } = chain.getAssetsMaps();
    assertEquals(assets.STX[wallet1.address], 100_000_100_000_000);
    assertEquals(assets.STX[`${deployer.address}.wallet`], 100_000_000);
  },
});

Clarinet.test({
  name: 'Ensure that STX transfer below the rule limit works',
  async fn(chain: indexTs.Chain, accounts: Map<string, indexTs.Account>) {
    // arrange: set up the chain, state, and other required elements
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // act: perform actions related to the current test
    const block = chain.mineBlock([
      // Add a rule to require cosigner for > 200 STX
      Tx.contractCall(
        'wallet',
        'add-stx-rule',
        [types.uint(200_000_000)],
        deployer.address
      ),
      // Deposit STX into the smart wallet
      Tx.transferSTX(
        200_000_000,
        `${deployer.address}.wallet`,
        deployer.address
      ),
      // Transfer STX from the smart wallet to wallet1
      Tx.contractCall(
        'wallet',
        'transfer-stx',
        [
          types.uint(100_000_000),
          types.principal(wallet1.address),
          types.none(),
        ],
        deployer.address
      ),
    ]);

    // assert: review returned data, contract state, and other requirements
    assertEquals(block.receipts.length, 3);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectBool(true);
    const result = block.receipts[2].result.expectOk().expectTuple();
    result.pending.expectNone();
    result.result.expectSome().expectOk().expectBool(true);

    const { assets } = chain.getAssetsMaps();
    assertEquals(assets.STX[wallet1.address], 100_000_100_000_000);
    assertEquals(assets.STX[`${deployer.address}.wallet`], 100_000_000);
  },
});

Clarinet.test({
  name: 'Ensure that STX transfer at or above the rule limit requires a cosigner',
  async fn(chain: indexTs.Chain, accounts: Map<string, indexTs.Account>) {
    // arrange: set up the chain, state, and other required elements
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // act: perform actions related to the current test
    const block = chain.mineBlock([
      // Add a rule to require cosigner for > 100 STX
      Tx.contractCall(
        'wallet',
        'add-stx-rule',
        [types.uint(100_000_000)],
        deployer.address
      ),
      // Deposit STX into the smart wallet
      Tx.transferSTX(
        200_000_000,
        `${deployer.address}.wallet`,
        deployer.address
      ),
      // Transfer STX from the smart wallet to wallet1
      Tx.contractCall(
        'wallet',
        'transfer-stx',
        [
          types.uint(100_000_000),
          types.principal(wallet1.address),
          types.none(),
        ],
        deployer.address
      ),
    ]);

    // assert: review returned data, contract state, and other requirements
    assertEquals(block.receipts.length, 3);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectBool(true);
    const result = block.receipts[2].result.expectOk().expectTuple();
    result.pending.expectSome().expectUint(0);
    result.result.expectNone();

    const { assets } = chain.getAssetsMaps();
    assertEquals(assets.STX[wallet1.address], 100_000_000_000_000);
    assertEquals(assets.STX[`${deployer.address}.wallet`], 200_000_000);
  },
});

Clarinet.test({
  name: 'Ensure that cosigning a pending STX transfer works',
  async fn(chain: indexTs.Chain, accounts: Map<string, indexTs.Account>) {
    // arrange: set up the chain, state, and other required elements
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // act: perform actions related to the current test
    const setupBlock = chain.mineBlock([
      // Deposit STX into the smart wallet
      Tx.transferSTX(
        200_000_000,
        `${deployer.address}.wallet`,
        deployer.address
      ),
      // Add a rule to require cosigner for > 100 STX
      Tx.contractCall(
        'wallet',
        'add-stx-rule',
        [types.uint(100_000_000)],
        deployer.address
      ),
      // Add a cosigner
      Tx.contractCall(
        'wallet',
        'add-signer',
        [types.principal(wallet1.address)],
        deployer.address
      ),
    ]);
    assertEquals(setupBlock.receipts.length, 3);
    setupBlock.receipts[0].result.expectOk().expectBool(true);
    setupBlock.receipts[1].result.expectOk().expectBool(true);
    setupBlock.receipts[2].result.expectOk().expectBool(true);

    const transferBlock = chain.mineBlock([
      // Transfer STX from the smart wallet to wallet1
      Tx.contractCall(
        'wallet',
        'transfer-stx',
        [
          types.uint(100_000_000),
          types.principal(wallet1.address),
          types.none(),
        ],
        deployer.address
      ),
    ]);
    assertEquals(transferBlock.receipts.length, 1);
    const result = transferBlock.receipts[0].result.expectOk().expectTuple();
    result.pending.expectSome().expectUint(0);
    result.result.expectNone();

    const txids = chain.callReadOnlyFn(
      `${deployer.address}.wallet`,
      'get-pending-txids',
      [],
      deployer.address
    );
    assertEquals(txids.result, '[u0]');
    const txs = chain.callReadOnlyFn(
      `${deployer.address}.wallet`,
      'get-pending-txs',
      [],
      deployer.address
    );
    assertEquals(
      txs.result,
      '[{amount-or-id: u100000000, contract: none, cosigners: [], memo: none, owner: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM, recipient: ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5, txid: u0}]'
    );

    const cosignBlock = chain.mineBlock([
      // Cosign the pending transfer
      Tx.contractCall('wallet', 'cosign-stx', [types.uint(0)], wallet1.address),
    ]);
    assertEquals(cosignBlock.receipts.length, 1);
    const cosignResult = cosignBlock.receipts[0].result
      .expectOk()
      .expectTuple();
    cosignResult.pending.expectNone();
    cosignResult.result.expectSome().expectOk().expectBool(true);

    const { assets } = chain.getAssetsMaps();
    assertEquals(assets.STX[wallet1.address], 100_000_100_000_000);
    assertEquals(assets.STX[`${deployer.address}.wallet`], 100_000_000);

    const txidsAfter = chain.callReadOnlyFn(
      `${deployer.address}.wallet`,
      'get-pending-txids',
      [],
      deployer.address
    );
    assertEquals(txidsAfter.result, '[]');
  },
});
