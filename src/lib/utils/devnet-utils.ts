interface DevnetWallet {
  mnemonic: string;
  secretKey: string;
  stxAddress: string;
  btcAddress: string;
}

// copied from devnet.toml
export const devnetDeployerWallet: DevnetWallet = {
  mnemonic:
    'twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw',
  secretKey:
    '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601',
  stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  btcAddress: 'mqVnk6NPRdhntvfm4hh9vvjiRkFDUuSYsH',
};

// copied from devnet.toml
export const devnetWallets: DevnetWallet[] = [
  {
    mnemonic:
      'sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild',
    secretKey:
      '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801',
    stxAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    btcAddress: 'mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC',
  },
  {
    mnemonic:
      'hold excess usual excess ring elephant install account glad dry fragile donkey gaze humble truck breeze nation gasp vacuum limb head keep delay hospital',
    secretKey:
      '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101',
    stxAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    btcAddress: 'muYdXKmX9bByAueDe6KFfHd5Ff1gdN9ErG',
  },
  {
    mnemonic:
      'cycle puppy glare enroll cost improve round trend wrist mushroom scorpion tower claim oppose clever elephant dinosaur eight problem before frozen dune wagon high',
    secretKey:
      'd655b2523bcd65e34889725c73064feb17ceb796831c0e111ba1a552b0f31b3901',
    stxAddress: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
    btcAddress: 'mvZtbibDAAA3WLpY7zXXFqRa3T4XSknBX7',
  },
  {
    mnemonic:
      'board list obtain sugar hour worth raven scout denial thunder horse logic fury scorpion fold genuine phrase wealth news aim below celery when cabin',
    secretKey:
      'f9d7206a47f14d2870c163ebab4bf3e70d18f5d14ce1031f3902fbbc894fe4c701',
    stxAddress: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
    btcAddress: 'mg1C76bNTutiCDV3t9nWhZs3Dc8LzUufj8',
  },
  {
    mnemonic:
      'hurry aunt blame peanut heavy update captain human rice crime juice adult scale device promote vast project quiz unit note reform update climb purchase',
    secretKey:
      '3eccc5dac8056590432db6a35d52b9896876a3d5cbdea53b72400bc9c2099fe801',
    stxAddress: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
    btcAddress: 'mweN5WVqadScHdA81aATSdcVr4B6dNokqx',
  },
  {
    mnemonic:
      'area desk dutch sign gold cricket dawn toward giggle vibrant indoor bench warfare wagon number tiny universe sand talk dilemma pottery bone trap buddy',
    secretKey:
      '7036b29cb5e235e5fd9b09ae3e8eec4404e44906814d5d01cbca968a60ed4bfb01',
    stxAddress: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
    btcAddress: 'mzxXgV6e4BZSsz8zVHm3TmqbECt7mbuErt',
  },
  {
    mnemonic:
      'prevent gallery kind limb income control noise together echo rival record wedding sense uncover school version force bleak nuclear include danger skirt enact arrow',
    secretKey:
      'b463f0df6c05d2f156393eee73f8016c5372caa0e9e29a901bb7171d90dc4f1401',
    stxAddress: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
    btcAddress: 'n37mwmru2oaVosgfuvzBwgV2ysCQRrLko7',
  },
  {
    mnemonic:
      'female adjust gallery certain visit token during great side clown fitness like hurt clip knife warm bench start reunion globe detail dream depend fortune',
    secretKey:
      '6a1a754ba863d7bab14adbbc3f8ebb090af9e871ace621d3e5ab634e1422885e01',
    stxAddress: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
    btcAddress: 'n2v875jbJ4RjBnTjgbfikDfnwsDV5iUByw',
  },
];

// [accounts.faucet]
// mnemonic: "shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform",
// secret_key: 'de433bdfa14ec43aa1098d5be594c8ffb20a31485ff9de2923b2689471c401b801'
// stx_address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6'
// btc_address: 'mjSrB3wS4xab3kYqFktwBzfTdPg367ZJ2d'

// [devnet]
// disable_stacks_explorer = false
// disable_stacks_api = false
// # disable_subnet_api = false
// # disable_bitcoin_explorer = true
// # working_dir = "tmp/devnet"
// # stacks_node_events_observers = ["host.docker.internal:8002"]
// # miner_mnemonic = "fragile loan twenty basic net assault jazz absorb diet talk art shock innocent float punch travel gadget embrace caught blossom hockey surround initial reduce"
// # miner_derivation_path = "m/44'/5757'/0'/0/0"
// # faucet_mnemonic = "shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform"
// # faucet_derivation_path = "m/44'/5757'/0'/0/0"
// # orchestrator_port = 20445
// # bitcoin_node_p2p_port = 18444
// # bitcoin_node_rpc_port = 18443
// # bitcoin_node_username = "devnet"
// # bitcoin_node_password = "devnet"
// # bitcoin_controller_block_time = 30_000
// # stacks_node_rpc_port = 20443
// # stacks_node_p2p_port = 20444
// # stacks_api_port = 3999
// # stacks_api_events_port = 3700
// # bitcoin_explorer_port = 8001
// # stacks_explorer_port = 8000
// # postgres_port = 5432
// # postgres_username = "postgres"
// # postgres_password = "postgres"
// # postgres_database = "postgres"
// # bitcoin_node_image_url = "quay.io/hirosystems/bitcoind:devnet-v3"
// # stacks_node_image_url = "quay.io/hirosystems/stacks-node:devnet-v3"
// stacks_node_image_url = "stacksbrice/stacks-node:devnet-2.4.0.0.0"
// # stacks_api_image_url = "hirosystems/stacks-blockchain-api:latest"
// # stacks_explorer_image_url = "hirosystems/explorer:latest"
// # bitcoin_explorer_image_url = "quay.io/hirosystems/bitcoin-explorer:devnet"
// # postgres_image_url = "postgres:14"
// # enable_subnet_node = true
// # subnet_node_image_url = "hirosystems/stacks-subnets:0.5.0"
// # subnet_leader_mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
// # subnet_leader_derivation_path = "m/44'/5757'/0'/0/0"
// # subnet_contract_id = "ST13F481SBR0R7Z6NMMH8YV2FJJYXA5JPA0AD3HP9.subnet-v1-2"
// # subnet_node_rpc_port = 30443
// # subnet_node_p2p_port = 30444
// # subnet_events_ingestion_port = 30445
// # subnet_node_events_observers = ["host.docker.internal:8002"]
// # subnet_api_image_url = "hirosystems/stacks-blockchain-api:7.1.0-subnets.1"
// # subnet_api_postgres_database = "subnet_api"

// # For testing in epoch 2.1 / using Clarity2
// # epoch_2_0 = 100
// # epoch_2_05 = 102
// # epoch_2_1 = 106
// # pox_2_activation = 109

// # Send some stacking orders
// [[devnet.pox_stacking_orders]]
// start_at_cycle = 3
// duration = 12
// wallet = "wallet_1"
// slots = 2
// btc_address = "mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC"

// [[devnet.pox_stacking_orders]]
// start_at_cycle = 3
// duration = 12
// wallet = "wallet_2"
// slots = 1
// btc_address = "muYdXKmX9bByAueDe6KFfHd5Ff1gdN9ErG"

// [[devnet.pox_stacking_orders]]
// start_at_cycle = 3
// duration = 12
// wallet = "wallet_3"
// slots = 1
// btc_address = "mvZtbibDAAA3WLpY7zXXFqRa3T4XSknBX7"
