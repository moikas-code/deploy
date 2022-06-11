import TAKO from '../../tako';
export default {
  Query: {
    Owned_Collections: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {blockChain, address, continuation, size} = args.input;

      return await TAKO.getCollectionsByOwner({
        blockChain,
        address,
        continuation,
        size,
      });
    },
    Collection_Info: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {blockChain, address} = args.input;
      return await TAKO.getcollectionByAddress({
        blockchain: blockChain,
        address,
      });
    },
    Collection_NFTS: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {
        address,
        size,
        continuation,
      }: {address: string; size: number; continuation: string} = args.input;
      return await TAKO.getNftsByContractAddress(address, size, continuation);
    },
    Query_Activity: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {
        address,
        activityType,
        continuation,
        cursor,
        size,
        sort,
      }: {
        activityType: any[];
        address: string;
        continuation: string;
        cursor: string;
        size: number;
        sort: 'LATEST_FIRST' | 'EARLIEST_FIRST';
      } = args.input;

      return await TAKO.getActivity(
        address,
        activityType,
        continuation,
        cursor,
        size,
        sort
      );
    },
    Query_All_Activity: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {
        continuation,
        cursor,
        sort,
        size,
      }: {
        continuation: string;
        cursor: string;
        sort: 'LATEST_FIRST' | 'EARLIEST_FIRST';
        size: number;
      } = args.input;

      return await TAKO.getAllActivity(continuation, cursor, sort, size);
    },
    Query_All_Sell_Orders: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {
        blockchains,
        continuation,
        cursor,
        origin,
        size,
      }: {
        blockchains: string[];
        continuation: string;
        cursor: string;
        origin: string;
        size: number;
      } = args.input;

      return await TAKO.getAllSellOrders({
        blockchains,
        continuation,
        cursor,
        size,
        origin,
      });
    },
    get_orders_by_nft_id: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      console.log(args.input);
      return await TAKO.get_orders_by_nft_id(args.input.address);
    },
  },
};
//   get_all_items: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_all_items(args.input);
//   },
//   get_item_by_nft_id: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_item_by_nft_id(args.input.address);
//   },

//   get_bids_by_nft_id: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_bids_by_nft_id(args.input.address);
//   },
//   get_items_by_owner: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_items_by_owner(args.input.address);
//   },
//   get_nfts_from_contract_address: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_nfts_from_contract_address(
//       args.input.address
//     );
//   },
// },
// Mutation: {
//TODO: MOVE TO OWN FILE
// createAuth: async (
//   parent: object,
//   args: any,
//   _context: any,
//   info: object
// ) => await createAuth(parent, args, _context, info),
// updateAuth: async (
//   parent: object,
//   args: any,
//   _context: any,
//   info: object

// ) => await updateAuth(parent, args, _context, info),
