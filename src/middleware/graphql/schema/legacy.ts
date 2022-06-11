export const AuthInputs = `
  input queryInput {
    address: String
    blockChain: String
    size: Int
    continuation: String
    start_date: String
  }
`;

export const RaribleQueries = `
get_nfts_from_contract_address(input: queryInput): Collection_Data
get_all_items(input: queryInput): Collection_Data
get_items_by_owner(input: queryInput): Collection_Data
get_item_by_nft_id(input: queryInput): NFTMetadataType
get_orders_by_nft_id(input: queryInput): [NFTOrderDataType]
get_bids_by_nft_id(input: queryInput): [NFTOrderDataType]
`;

// export const AuthMutations = `

// `;
