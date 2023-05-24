
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that add-signer works",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // arrange: set up the chain, state, and other required elements
        let deployer = accounts.get("deployer")!;
        let wallet_1 = accounts.get("wallet_1")!;

        // act: perform actions related to the current test
        let block = chain.mineBlock([
            Tx.contractCall('wallet', 'add-signer', [
                types.principal(wallet_1.address),
            ], deployer.address),
        ]);

        // assert: review returned data, contract state, and other requirements
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
    },
});
