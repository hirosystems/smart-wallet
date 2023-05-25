import { SMART_WALLET_CONTRACT_NAME } from "../utils/smart-wallet-utils";

export const smartWalletContract = { // TODO: this needs to be copied from the smart wallet contract
  name: SMART_WALLET_CONTRACT_NAME,
  source: `
  ;; title: IntelliSign Wallet
  ;; version: 0.1
  ;; summary: Smart Wallet
  ;; description:
  ;;   The IntelliSign wallet contract let's you secure your assets with a smart
  ;; contract that implements a rules-based access control system, protecting
  ;; your assets from theft or loss.
  
  ;; traits
  ;;
  (use-trait nft-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)
  (use-trait ft-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)
  
  ;; constants
  ;;
  
  ;; Error codes
  (define-constant ERR_TOO_MANY_SIGNERS (err u100))
  (define-constant ERR_TOO_MANY_RULES (err u101))
  
  ;; Rule kinds
  ;; limits the amount of STX that can be transferred
  (define-constant STX_RULE u0)
  ;; limits the amount of an FT that can be transferred
  (define-constant FT_RULE  u1)
  ;; limits specific ids of an NFT that can be transferred
  (define-constant NFT_RULE u2)
  ;; limits recipients to an allow list
  (define-constant ALLOW_LIST_RULE u3)
  ;; checks recipients against a deny list
  (define-constant DENY_LIST_RULE u4)
  
  
  ;; data vars
  ;;
  
  ;; List of rules that apply to this wallet
  (define-data-var rules (list 64 { id: uint, kind: uint, asset: (optional principal), amount-or-id: uint }) (list))
  
  ;; Next identifier to use for a rule
  (define-data-var next-rule-id uint u0)
  
  ;; List of cosigners that can approve transactions
  (define-data-var cosigners (list 4 principal) (list))
  
  ;; Next identifier to use for a pending transaction
  (define-data-var next-tx-id uint u0)
  
  ;; data maps
  ;;
  
  ;; List of all rules that apply to this wallet, mapping rule ID to index in the list
  (define-map rule-indices uint uint)
  
  ;; Map an FT contract to the rules associated with it. List elements are rule IDs.
  (define-map ft-rules principal (list 64 uint))
  
  ;; Map an NFT contract to the rules associated with it. List elements are rule IDs.
  (define-map nft-rules principal (list 64 uint))
  
  ;; Allow-list for recipients (use map for effieciency)
  (define-map allow-list principal bool)
  
  ;; Transactions waiting for cosigners
  (define-map pending-txs
    uint 
    {
      ;; contract that will be called; none indicates an STX transfer
      contract: (optional principal),
      recipient: principal,
      amount-or-id: uint,
      memo: (optional (buff 34)),
      owner: principal,
      cosigners: (list 4 principal),
    }
  )
  
  ;; public functions
  ;;
  
  (define-public (add-signer (signer principal))
    (let ((signers (var-get cosigners)))
      (ok (var-set cosigners (unwrap! (as-max-len? (append signers signer) u4) ERR_TOO_MANY_SIGNERS)))
    )
  )
  
  (define-public (remove-signer (signer principal))
    ;; (var-set cosigners (get filtered (fold filter-signer (var-get cosigners) { to-remove: signer, filtered: (list)})))
    (ok (fold filter-signer (var-get cosigners) { to-remove: signer, filtered: (list)}))
  )
  
  ;; STX transfer
  (define-public (transfer-stx (amount uint) (recipient principal) (opt-memo (optional (buff 34))))
    ;; check if this transaction requires a cosigner
    (if
      (get requires-cosign
        (fold apply-stx-rule
          (var-get rules)
          { amount: amount, recipient: recipient, requires-cosign: false }
        )
      )
      (let ((txid (var-get next-tx-id)))
        (var-set next-tx-id (+ txid u1))
        (map-set pending-txs txid
          {
            contract: none,
            recipient: recipient,
            amount-or-id: amount,
            memo: opt-memo,
            owner: tx-sender,
            cosigners: (list),
          }
        )
        (ok { pending: (some txid), result: none })
      )
      (ok {
        pending: none,
        result: (some (match opt-memo
          memo (as-contract (stx-transfer-memo? amount tx-sender recipient memo))
          (as-contract (stx-transfer? amount tx-sender recipient))
        ))
      })
    )
  )
  
  ;; SIP-009 transfer
  ;; (define-public (transfer-nft (asset-contract <nft-trait>) (id uint) (recipient principal) (opt-memo (optional (buff 34))))
  ;;   (begin
  ;;     (if (is-some opt-memo) (print (unwrap-panic opt-memo)) 0x)            
  ;;     (as-contract (contract-call? asset-contract transfer id tx-sender recipient))
  ;;   )
  ;; )
  
  ;; SIP-010 transfer
  ;; (define-public (transfer-ft (asset-contract <ft-trait>) (amount uint) (recipient principal) (opt-memo (optional (buff 34))))
  ;;   (as-contract (contract-call? asset-contract transfer amount tx-sender recipient opt-memo))
  ;; )
  
  ;; Co-sign an existing STX transfer
  (define-public (cosign-stx (txid uint))
    (ok { pending: none, result: none })
  )
  
  ;; Co-sign an existing NFT transfer
  (define-public (cosign-nft (txid uint) (nft <nft-trait>))
    (ok { pending: none, result: none })
  )
  
  ;; Co-sign an existing FT transfer
  (define-public (cosign-ft (txid uint) (ft <ft-trait>))
    (ok { pending: none, result: none })
  )
  
  ;; Add an STX rule to the wallet
  (define-public (add-stx-rule (amount-or-id uint))
    (let (
        (rule-id (var-get next-rule-id))
        (rule { id: rule-id, kind: STX_RULE, asset: none, amount-or-id: amount-or-id })
        (saved-rules (var-get rules)))
      (var-set rules (unwrap! (as-max-len? (append saved-rules rule) u64) ERR_TOO_MANY_RULES))
      (var-set next-rule-id (+ rule-id u1))
      (map-set rule-indices rule-id (len saved-rules))
      (ok true)
    )
  )
  
  ;; Add an NFT rule to the wallet
  (define-public (add-nft-rule (asset-contract <nft-trait>) (asset-id uint))
    (let (
        (rule-id (var-get next-rule-id))
        (rule { id: rule-id, kind: NFT_RULE, asset: (some (contract-of asset-contract)), amount-or-id: asset-id })
        (saved-rules (var-get rules))
        (opt-contract-rules (map-get? nft-rules (contract-of asset-contract)))
        (contract-rules (match opt-contract-rules
          existing-rules (unwrap! (as-max-len? (append existing-rules rule-id) u64) ERR_TOO_MANY_RULES)
          (list rule-id)
        ))
      )
      (var-set rules (unwrap! (as-max-len? (append saved-rules rule) u64) ERR_TOO_MANY_RULES))
      (var-set next-rule-id (+ rule-id u1))
      (map-set rule-indices rule-id (len saved-rules))
      (map-set nft-rules (contract-of asset-contract) contract-rules)
      (ok true)
    )
  )
  
  ;; TODO: delete-rule
  
  ;; read only functions
  ;;
  
  (define-read-only (get-signers) (var-get cosigners))
  
  (define-read-only (get-rules)
    (var-get rules)
  )
  
  ;; private functions
  ;;
  
  ;; Filter a signer from a list of signers
  (define-private (filter-signer (signer principal) (data { to-remove: principal, filtered: (list 4 principal)}))
    (if (is-eq signer (get to-remove data))
      data
      { to-remove: (get to-remove data), filtered: (unwrap-panic (as-max-len? (append (get filtered data) signer) u4)) }
    )
  )
  
  ;; Apply a rule to an STX transfer
  (define-private (apply-stx-rule
      (rule { id: uint, kind: uint, asset: (optional principal), amount-or-id: uint })
      (state { amount: uint, recipient: principal, requires-cosign: bool })
    )
    (let ((requires-cosign
          (or
            (and (is-eq (get kind rule) STX_RULE)
              (>= (get amount state) (get amount-or-id rule)))
            (and (is-eq (get kind rule) ALLOW_LIST_RULE)
              (is-none (map-get? allow-list (get recipient state))))
          ))
        )
      { amount: (get amount state), recipient: (get recipient state), requires-cosign: requires-cosign }
    )
  )
  `,
};
