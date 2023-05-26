
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
(define-constant ERR_TOO_MANY_SIGNERS     (err u100))
(define-constant ERR_TOO_MANY_RULES       (err u101))
(define-constant ERR_PERMISSION_DENIED    (err u102))
(define-constant ERR_TX_NOT_FOUND         (err u103))
(define-constant ERR_ALREADY_SIGNED       (err u104))
(define-constant ERR_TOO_MANY_PENDING_TXS (err u105))
(define-constant ERR_INVALID_TX_TYPE      (err u106))
(define-constant ERR_CONTRACT_MISMATCH    (err u107))
(define-constant ERR_INTERNAL             (err u999))

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

;; Owner of this wallet. Only the owner can initiate transactions
(define-data-var owner principal tx-sender)

;; List of rules that apply to this wallet
(define-data-var rules (list 64 { id: uint, kind: uint, asset: (optional principal), amount-or-id: uint }) (list))

;; Next identifier to use for a rule
(define-data-var next-rule-id uint u0)

;; List of cosigners that can approve transactions
(define-data-var cosigners (list 4 principal) (list))

;; Next identifier to use for a pending transaction
(define-data-var next-tx-id uint u0)

;; Add list of outstanding txids
(define-data-var pending-txids (list 64 uint) (list))

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
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)
    (ok (var-set cosigners (unwrap! (as-max-len? (append signers signer) u4) ERR_TOO_MANY_SIGNERS)))
  )
)

(define-public (remove-signer (signer principal))
  (begin
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)
    ;; (var-set cosigners (get filtered (fold filter-signer (var-get cosigners) { to-remove: signer, filtered: (list)})))
    (ok (fold filter-signer (var-get cosigners) { to-remove: signer, filtered: (list)}))
  )
)

;; STX transfer
(define-public (transfer-stx (amount uint) (recipient principal) (opt-memo (optional (buff 34))))
  (begin
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)

    ;; check if this transaction requires a cosigner
    (if
      (get requires-cosign
        (fold apply-stx-rule
          (var-get rules)
          { amount: amount, recipient: recipient, requires-cosign: false }
        )
      )
      ;; cosigner required, return pending transaction
      (let ((txid (var-get next-tx-id)))
        (var-set next-tx-id (+ txid u1))
        (var-set pending-txids (unwrap! (as-max-len? (append (var-get pending-txids) txid) u64) ERR_TOO_MANY_PENDING_TXS))
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
      ;; no co-signer required; execute transfer
      (ok {
        pending: none,
        result: (some (match opt-memo
          memo (as-contract (stx-transfer-memo? amount tx-sender recipient memo))
          (as-contract (stx-transfer? amount tx-sender recipient))
        ))
      })
    )
  )
)

;; SIP-009 transfer
(define-public (transfer-nft (asset-contract <nft-trait>) (id uint) (recipient principal) (opt-memo (optional (buff 34))))
  (let ((contract-rules (map-get? nft-rules (contract-of asset-contract))))
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)

    ;; check if this transaction requires a cosigner
    (if
      (and
        (is-some contract-rules)
        (get requires-cosign
          (fold apply-nft-rule
            (map get-rule (unwrap-panic contract-rules))
            { asset-contract: (contract-of asset-contract), id: id, recipient: recipient, requires-cosign: false }
          )
        )
      )
      ;; cosigner required, return pending transaction
      (let ((txid (var-get next-tx-id)))
        (var-set next-tx-id (+ txid u1))
        (var-set pending-txids (unwrap! (as-max-len? (append (var-get pending-txids) txid) u64) ERR_TOO_MANY_PENDING_TXS))
        (map-set pending-txs txid
          {
            contract: (some (contract-of asset-contract)),
            recipient: recipient,
            amount-or-id: id,
            memo: opt-memo,
            owner: tx-sender,
            cosigners: (list),
          }
        )
        (ok { pending: (some txid), result: none })
      )
      ;; no co-signer required; execute transfer
      (ok {
        pending: none,
        result: (some (begin
          (if (is-some opt-memo) (print (unwrap-panic opt-memo)) 0x)
          (as-contract (contract-call? asset-contract transfer id tx-sender recipient))
        ))
      })
    )
  )
)

;; SIP-010 transfer
(define-public (transfer-ft (asset-contract <ft-trait>) (amount uint) (recipient principal) (opt-memo (optional (buff 34))))
  (let ((contract-rules (map-get? ft-rules (contract-of asset-contract))))
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)

    ;; check if this transaction requires a cosigner
    (if
      (and
        (is-some contract-rules)
        (get requires-cosign
          (fold apply-ft-rule
            (map get-rule (unwrap-panic contract-rules))
            { asset-contract: (contract-of asset-contract), amount: amount, recipient: recipient, requires-cosign: false }
          )
        )
      )
      ;; cosigner required, return pending transaction
      (let ((txid (var-get next-tx-id)))
        (var-set next-tx-id (+ txid u1))
        (var-set pending-txids (unwrap! (as-max-len? (append (var-get pending-txids) txid) u64) ERR_TOO_MANY_PENDING_TXS))
        (map-set pending-txs txid
          {
            contract: (some (contract-of asset-contract)),
            recipient: recipient,
            amount-or-id: amount,
            memo: opt-memo,
            owner: tx-sender,
            cosigners: (list),
          }
        )
        (ok { pending: (some txid), result: none })
      )
      ;; no co-signer required; execute transfer
      (ok {
        pending: none,
        result: (some (as-contract (contract-call? asset-contract transfer amount tx-sender recipient opt-memo)))
      })
    )
  )
)

;; Co-sign an existing STX transfer
(define-public (cosign-stx (txid uint))
  (let ((pending (unwrap! (map-get? pending-txs txid) ERR_TX_NOT_FOUND))
        (recipient (get recipient pending))
        (amount (get amount-or-id pending))
        (opt-memo (get memo pending)))
    (asserts! (is-signer tx-sender) ERR_PERMISSION_DENIED)
    (asserts! (is-none (index-of? (get cosigners pending) tx-sender)) ERR_ALREADY_SIGNED)
    (var-set pending-txids (filter-uint txid (var-get pending-txids)))
    (ok {
      pending: none,
      result: (some (match (get memo pending)
        memo (as-contract (stx-transfer-memo? (get amount-or-id pending) tx-sender (get recipient pending) memo))
        (as-contract (stx-transfer? amount tx-sender recipient))
      ))
    })
  )
)

;; Co-sign an existing NFT transfer
(define-public (cosign-nft (txid uint) (nft <nft-trait>))
    (let ((pending (unwrap! (map-get? pending-txs txid) ERR_TX_NOT_FOUND))
        (saved-contract (unwrap! (get contract pending) ERR_INVALID_TX_TYPE))
        (recipient (get recipient pending))
        (amount (get amount-or-id pending))
        (opt-memo (get memo pending)))
    (asserts! (is-signer tx-sender) ERR_PERMISSION_DENIED)
    (asserts! (is-none (index-of? (get cosigners pending) tx-sender)) ERR_ALREADY_SIGNED)
    (asserts! (is-eq (contract-of nft) saved-contract) ERR_CONTRACT_MISMATCH)
    (var-set pending-txids (filter-uint txid (var-get pending-txids)))
    (ok {
      pending: none,
      result: (some (begin
          (if (is-some (get memo pending)) (print (unwrap-panic opt-memo)) 0x)
          (as-contract (contract-call? nft transfer
            (get amount-or-id pending)
            tx-sender
            (get recipient pending)
          ))))
    })
  )
)

;; Co-sign an existing FT transfer
(define-public (cosign-ft (txid uint) (ft <ft-trait>))
  (let ((pending (unwrap! (map-get? pending-txs txid) ERR_TX_NOT_FOUND))
        (saved-contract (unwrap! (get contract pending) ERR_INVALID_TX_TYPE))
        (recipient (get recipient pending))
        (amount (get amount-or-id pending))
        (opt-memo (get memo pending)))
    (asserts! (is-signer tx-sender) ERR_PERMISSION_DENIED)
    (asserts! (is-none (index-of? (get cosigners pending) tx-sender)) ERR_ALREADY_SIGNED)
    (asserts! (is-eq (contract-of ft) saved-contract) ERR_CONTRACT_MISMATCH)
    (var-set pending-txids (filter-uint txid (var-get pending-txids)))
    (ok {
      pending: none,
      result: (some
        (as-contract (contract-call? ft transfer
          (get amount-or-id pending)
          tx-sender
          (get recipient pending)
          (get memo pending)
        )))
    })
  )
)

;; Add an STX rule to the wallet
(define-public (add-stx-rule (amount uint))
  (let (
      (rule-id (var-get next-rule-id))
      (rule { id: rule-id, kind: STX_RULE, asset: none, amount-or-id: amount })
      (saved-rules (var-get rules)))
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)
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
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)
    (var-set rules (unwrap! (as-max-len? (append saved-rules rule) u64) ERR_TOO_MANY_RULES))
    (var-set next-rule-id (+ rule-id u1))
    (map-set rule-indices rule-id (len saved-rules))
    (map-set nft-rules (contract-of asset-contract) contract-rules)
    (ok true)
  )
)

;; Add an FT rule to the wallet
(define-public (add-ft-rule (asset-contract <ft-trait>) (amount uint))
  (let (
      (rule-id (var-get next-rule-id))
      (rule { id: rule-id, kind: FT_RULE, asset: (some (contract-of asset-contract)), amount-or-id: amount })
      (saved-rules (var-get rules))
      (opt-contract-rules (map-get? ft-rules (contract-of asset-contract)))
      (contract-rules (match opt-contract-rules
        existing-rules (unwrap! (as-max-len? (append existing-rules rule-id) u64) ERR_TOO_MANY_RULES)
        (list rule-id)
      ))
    )
    (asserts! (is-owner tx-sender) ERR_PERMISSION_DENIED)
    (var-set rules (unwrap! (as-max-len? (append saved-rules rule) u64) ERR_TOO_MANY_RULES))
    (var-set next-rule-id (+ rule-id u1))
    (map-set rule-indices rule-id (len saved-rules))
    (map-set ft-rules (contract-of asset-contract) contract-rules)
    (ok true)
  )
)

;; TODO: delete-rule

;; read only functions
;;

(define-read-only (get-signers) (var-get cosigners))

(define-read-only (get-rules) (var-get rules))

(define-read-only (get-pending-txids) (var-get pending-txids))

(define-read-only (get-pending-txs)
  (map get-pending-tx-unsafe (var-get pending-txids))
)

(define-read-only (get-pending-tx (txid uint))
  (map-get? pending-txs txid)
)

;; private functions
;;

;; Check if p is an authorized signer
(define-private (is-signer (p principal))
  (is-some (index-of? (var-get cosigners) p))
)

(define-private (is-owner (p principal))
  (is-eq p (var-get owner))
)

;; Filter a signer from a list of signers
(define-private (filter-signer (signer principal) (data { to-remove: principal, filtered: (list 4 principal)}))
  (if (is-eq signer (get to-remove data))
    data
    { to-remove: (get to-remove data), filtered: (unwrap-panic (as-max-len? (append (get filtered data) signer) u4)) }
  )
)

;; Filter a uint from a list of uints
(define-private (filter-uint (n uint) (from (list 64 uint)))
  (get filtered (fold filter-uint-inner from { to-remove: n, filtered: (list)}))
)

(define-private (filter-uint-inner (n uint) (data { to-remove: uint, filtered: (list 64 uint)}))
  (if (is-eq n (get to-remove data))
    data
    { to-remove: (get to-remove data), filtered: (unwrap-panic (as-max-len? (append (get filtered data) n) u64)) }
  )
)

;; Retrieve a pending transaction by its txid
(define-private (get-pending-tx-unsafe (txid uint))
  (merge {txid: txid} (unwrap-panic (map-get? pending-txs txid)))
)

(define-private (get-rule (id uint))
  (unwrap-panic (element-at? (var-get rules) (unwrap-panic (map-get? rule-indices id))))
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
    (merge state { requires-cosign: requires-cosign })
  )
)

;; Apply a rule to an FT transfer
(define-private (apply-ft-rule
    (rule { id: uint, kind: uint, asset: (optional principal), amount-or-id: uint })
    (state { asset-contract: principal, amount: uint, recipient: principal, requires-cosign: bool })
  )
  (let ((requires-cosign
        (or
          (and (is-eq (get kind rule) FT_RULE)
            (>= (get amount state) (get amount-or-id rule)))
          (and (is-eq (get kind rule) ALLOW_LIST_RULE)
            (is-none (map-get? allow-list (get recipient state))))
        ))
      )
    (merge state { requires-cosign: requires-cosign })
  )
)

;; Apply a rule to an NFT transfer
(define-private (apply-nft-rule
    (rule { id: uint, kind: uint, asset: (optional principal), amount-or-id: uint })
    (state { asset-contract: principal, id: uint, recipient: principal, requires-cosign: bool })
  )
  (let ((requires-cosign
        (or
          (and (is-eq (get kind rule) NFT_RULE)
            (is-eq (get id state) (get amount-or-id rule)))
          (and (is-eq (get kind rule) ALLOW_LIST_RULE)
            (is-none (map-get? allow-list (get recipient state))))
        ))
      )
    (merge state { requires-cosign: requires-cosign })
  )
)
