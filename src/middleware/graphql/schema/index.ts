import {gql} from 'apollo-server-micro';

const typeDefs = gql`
  input QueryInput {
    address: String
    blockChain: String
    blockchains: [String]
    size: Int
    continuation: String
    cursor: String
    sort: String
    activityType: [String]
    start_date: String
  }

  type Collection_Data {
    items: [COLLECTION_ITEM]
    totalSupply: Int
    continuation: String
  }

  type COLLECTION_OBJ {
    total: Int
    continuation: String
    collections: [COLLECTION]
  }

  type COLLECTION {
    id: String!
    parent: String
    blockchain: String!
    type: String!
    name: String!
    symbol: String
    owner: String
    features: [String]
    minters: [String]
    meta: COLLECTION_META
  }

  type COLLECTION_META {
    name: String!
    description: String
    content: [META_CONTENT]
    externalLink: String
    sellerFeeBasisPoints: Int
    feeRecipient: String
  }

  type META_CONTENT {
    type: String
    width: Int
    height: Int
    url: String
    representation: String
    mimeType: String
    size: Int
  }

  type COLLECTION_ITEM {
    id: String!
    tokenId: String!
    blockchain: String!
    collection: String
    contract: String
    creators: [Creators]
    lazySupply: String!
    mintedAt: String
    lastUpdatedAt: String
    meta: COLLECTION_ITEM_META
    deleted: Boolean
  }

  type COLLECTION_ITEM_META {
    name: String!
    description: String
    attributes: [COLLECTION_ITEM_ATTRIBUTE]
    content: [META_CONTENT]
    restrictions: [String]
  }

  type COLLECTION_ITEM_ATTRIBUTE {
    key: String!
    value: String
    type: String
    format: String
  }
  type ALL_SELL_ORDERS {
    continuation: String
    orders: [SELL_ORDER]
  }

  type SELL_ORDER {
    id: String
    filled: Boolean
    platform: String
    status: String
    startedAt: String
    endedAt: String
    makeStock: String
    cancelled: Boolean
    createdAt: String
    lastUpdatedAt: String
    makePrice: String
    takerPrice: String
    makePriceUsd: String
    takerPriceUsd: String
    maker: String
    taker: String
    make: TAKER_MAKER
    take: TAKER_MAKER
    salt: String
  }
  type TAKER_MAKER {
    type: ASSET_TYPE
    value: String
  }
  type ASSET_TYPE {
    type: String
    contract: String
    blockchain: String
    tokenId: String
    uri: String
    creators: [Creators]
    royalties: [ROYALTIES]
  }

  type NFTOrderDataType {
    id: String
    platform: String
    status: String
    makeStock: String
    createdAt: String
    makePrice: String
    makePriceUsd: String
    maker: String
    make: _DataType
    supply: String
  }

  type _DataType {
    type: DataType
    value: String
  }
  type DataType {
    type: String
    contract: String
    tokenId: String
    value: String
  }

  type Creators {
    address: String
    value: Int
  }

  type All_ACTIVITY {
    continuation: String
    cursor: String
    activities: [ACTIVITY_ITEM]
  }
  type ACTIVITY {
    continuation: String
    cursor: String
    activities: ACTIVITIES
  }
  type ACTIVITIES {
    user: [ACTIVITY_ITEM]
    contract: [ACTIVITY_ITEM]
    nft: [ACTIVITY_ITEM]
  }

  type ACTIVITY_ITEM {
    type: String
    from: String
    owner: String
    contract: String
    tokenId: String
    itemId: String
    value: String
    purchase: Boolean
    transactionHash: String
    id: String
    date: String
    reverted: Boolean
    left: LEFT_RIGHT
    right: LEFT_RIGHT
    source: String
    nft: _activityNFT
    payment: _activityPayment
    buyer: String
    seller: String
    buyerOrderHash: String
    sellerOrderHash: String
    price: String
    priceUsd: String
    amountUsd: String
    hash: String
    make: _DataType
    take: _DataType
    auction: _activityAuction
    bid: _activityBid
  }
  type _activityNFT {
    type: _DataType
    value: String
  }
  type _activityPayment {
    type: _DataType
    value: String
  }
  type _activityAuction {
    id: String
    contract: String
    type: String
    seller: String
    sell: _DataType
    buy: _DataType
    endTime: String
    minimalStep: String
    minimalPrice: String
    createdAt: String
    lastUpdatedAt: String
    buyPrice: String
    buyPriceUsd: String
    pending: [String]
    status: String
    ongoing: Boolean
    hash: String
    auctionId: String
    data: _auctionData
  }
  type _auctionData {
    dataType: String
    originFees: [Creators]
    payouts: [Creators]
    startTime: String
    duration: String
    buyOutPrice: String
  }

  type LEFT_RIGHT {
    maker: String
    hash: String
  }

  type _activityBid {
    type: String
    data: _auctionData
    buyer: String
    amount: String
    date: String
    status: String
  }
  type ROYALTIES {
    address: String
    value: Int
  }

  type Query {
    Owned_Collections(input: QueryInput): COLLECTION_OBJ
    Collection_Info(input: QueryInput): COLLECTION
    Collection_NFTS(input: QueryInput): Collection_Data
    Query_Activity(input: QueryInput): ACTIVITY
    Query_All_Activity(input: QueryInput): All_ACTIVITY
    Query_All_Sell_Orders(input: QueryInput): ALL_SELL_ORDERS
    get_orders_by_nft_id(input: QueryInput): [NFTOrderDataType]
  }
`;

export default typeDefs;
