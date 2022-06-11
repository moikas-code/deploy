import axios from 'axios';
import {MintType} from '@rarible/sdk/build/types/nft/mint/domain';
if (typeof window === 'undefined') require('dotenv').config();
var name = 'akkoro_Lib';
var version = '0.0.1';
var baseURL = 'https://api.rarible.org/';
var dev_baseURL = 'https://api-dev.rarible.org/';
var validate = 'v0.1/signature/validate';
var items = 'v0.1/items';
var ownerships = 'v0.1/ownerships';
var collections = 'v0.1/collections';

function cleanUrl(needle: string, arrhaystack: string[]) {
  const haystack = arrhaystack
    .map((item) => {
      const regex = new RegExp(item, 'g'); // correct way
      if (needle.split(item).length > 0) {
        if (needle.split('ipfs/')[0] == 'https://rarible.mypinata.cloud/') {
          return needle;
        } else if (needle.split('ipfs/')[0] == item) {
          return needle.replace(regex, 'https://akkoros.mypinata.cloud/ipfs/');
        } else if (needle.indexOf('ipfs://') > -1) {
          return needle.replace(
            'ipfs://',
            'https://akkoros.mypinata.cloud/ipfs/'
          );
        }

        return needle;
      }
    })
    .filter(function (val) {
      return val !== null && val !== undefined && val !== '';
    });

  return haystack.length > 0 ? haystack[0] : needle;
}

const TAKO = {
  // Validate Queries
  validateAddress: async (address: string) => {
    try {
      let _cleanAddress: string = '';
      const colonCount: number = (address.match(new RegExp(':', 'g')) || [])
        .length;
      if (colonCount === 0 || colonCount > 2) {
        throw 'Invalid Format must include : between blockchain and address(ex. ETHEREUM:0x1337694208oO8314Bf3ac0769B87262146D879o3)';
      }
      const _blockchain = address.split(':')[0].toUpperCase();
      const _address = address.split(':')[1];
      const _id = address.split(':')[2];
      const isSupported = [
        'ETHEREUM',
        'SOLANA',
        'POLYGON',
        'TEZOS',
        'FLOW',
      ].includes(_blockchain);
      if (!isSupported) {
        throw "Blockchain isn't supported";
      }
      if (colonCount === 1) {
        if (
          typeof _address === 'undefined' ||
          (typeof _address !== 'undefined' && _address.length === 0)
        ) {
          throw 'Contract/User Address is undefined';
        }

        let addr_pref = _address.substring(0, 2);
        addr_pref = addr_pref.toLowerCase();
        switch (addr_pref) {
          case '0x':
          case 'tz':
          case 'kt':
          case 'a.':
          case 'a1':
            break;
          default:
            if (_address.length === 44) {
              break;
            }
            throw 'Invalid Address';
        }

        _cleanAddress = `${_blockchain}:${_address}`;
      }
      if (colonCount === 2) {
        if (typeof _id === 'undefined') {
          throw 'NFT ID is undefined';
        } else if (typeof _id !== 'undefined' && _id.length === 0) {
          throw 'NFT ID is undefined';
        }
        _cleanAddress = `${_blockchain}:${_address}:${_id}`;
      }
      return {
        address: _cleanAddress,
        isValid: true,
      };
    } catch (error) {
      return {
        address: address,
        isValid: false,
        error: error,
      };
    }
  },

  // FIlters
  filterByProperty(array: any[], propertyName: string): any[] {
    var occurrences: any = {};

    return array.filter(function (x) {
      var property = x[propertyName];
      if (occurrences[property]) {
        return false;
      }
      occurrences[property] = true;
      return true;
    });
  },
  // QUERYIES
  getCurrencyOptions: async (blockchain: string) => {
    switch (blockchain) {
      case 'ETHEREUM':
        return [
          {
            value: {
              '@type': 'ERC20',
              contract: 'ETHEREUM:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            },
            label: 'WETH',
          },
        ];
      case 'TEZOS':
        return [
          {
            value: {
              '@type': 'NATIVE',
            },
            label: 'XTZ',
          },
        ];
      case 'FLOW':
        return [
          {
            value: {
              '@type': 'NATIVE',
            },
            label: 'FLOW',
          },
        ];
      default:
        break;
    }
  },
  //

  getCollectionsByOwner: async ({
    blockChain,
    address,
    continuation = '',
    size = 10,
  }: {
    blockChain: string;
    address: string;
    continuation: string;
    size: number;
  }) => {
    try {
      var _blockchain = blockChain;
      // base url
      const base = process.env.DEV === 'false' ? baseURL : dev_baseURL;

      if (typeof blockChain === 'undefined') {
        throw new Error('blockChain is undefined');
      }
      if (typeof address === 'undefined') {
        throw new Error('Address is undefined');
      }
      //       if(typeof address.split(':')[1] === undefined){
      // throw new Error('Address is undefined');
      //       }
      if (blockChain === 'POLYGON') {
        _blockchain = 'ETHEREUM';
      }
      //fetch
      return await fetch(
        `${base}${collections}/byOwner/?blockchains=${blockChain}&owner=${_blockchain}:${address}&${continuation}&${size}` as string,
        {
          method: 'GET',
        }
      ).then(async (res) => res.json());
    } catch (error) {}
  },
  getcollectionByAddress: async ({
    address,
  }: {
    blockchain: any;
    address: any;
  }) => {
    // base url
    const base = process.env.DEV === 'false' ? baseURL : dev_baseURL;
    if (typeof address === 'undefined') {
      throw new Error('Address is undefined');
    }
    if (
      typeof address.split(0) === 'undefined' ||
      typeof address.split(1) === 'undefined'
    ) {
      throw new Error('Address is not Formatted Properly');
    }
    const url = await `${base}${collections}/${
      address.split(':')[0]
    }:${address.split(':')[1].toLowerCase()}`;
    //fetch
    return await fetch(url as string, {
      method: 'GET',
    }).then(async (res) => res.json());
  },
  get_all_collections: async ({sdk}: {sdk: any}) => {
    return await sdk.apis.collection.getAllCollections({});
  },

  get_ownership_status: async (address: any, nft_id: any) => {
    return await TAKO.get_ownership_by_nft_id(nft_id).then(
      async ({ownerships, total}) => {
        const items_owned = await ownerships.filter(({owner}: {owner: any}) => {
          // console.log(_owner);
          return owner == address;
        });
        return items_owned.length > 0 ? true : false;
      }
    );
  },

  get_ownership_by_nft_id: async (address: any) => {
    // console.log(address);
    const url = ((!process.env.DEV ? baseURL : dev_baseURL) +
      ownerships +
      '/byItem' +
      `?itemId=${address}`) as string;

    return await fetch(url, {
      method: 'GET',
    }).then((res) => res.json());
  },
  get_bids_by_nft_id: async (address: any) => {
    // console.log(address);
    const url =
      (!process.env.DEV ? baseURL : dev_baseURL) +
      'v0.1/orders/bids/byItem/' +
      `?itemId=${address}&status=ACTIVE`;
    // console.log(url);
    let data = await fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) =>
        res.orders.map(async (item: any) => {
          // console.log(item);
          const asArray = Object.entries(item);
          const filtered = asArray.filter(([key, value]) =>
            [
              'platform',
              'fill',
              'id',
              'status',
              'makeStock',
              'createdAt',
              'makePrice',
              'makePriceUsd',
              'maker',
            ].includes(key)
          );

          // const filtered2 = asubArray.filter(([key, value]) =>
          //   [''].includes(key)
          // );

          const filteredObj1 = Object.fromEntries(filtered);
          // const filteredObj2 = Object.fromEntries(filtered2);
          // const content = await item.meta.content;
          return await {
            ...(await filteredObj1),
            // ...filteredObj2,
          };
        })
      );

    // console.log('clean', data);
    return await data;
  },
  get_orders_by_nft_id: async (address: any) => {
    // console.log('address', address);
    const url = baseURL + 'v0.1/orders/sell' + '/byItem' + `?itemId=${address}`;
    // console.log(url);
    let data = await fetch(url, {
      method: 'GET',
    })
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((res) =>
        res.orders.map(async (item: any) => {
          // console.log(item);
          const asArray = Object.entries(item);
          const filtered = asArray.filter(([key, value]) =>
            [
              'platform',
              'fill',
              'id',
              'status',
              'makeStock',
              'createdAt',
              'makePrice',
              'makePriceUsd',
              'maker',
            ].includes(key)
          );

          // const filtered2 = asubArray.filter(([key, value]) =>
          //   [''].includes(key)
          // );

          const filteredObj1 = Object.fromEntries(filtered);
          // const filteredObj2 = Object.fromEntries(filtered2);
          // const content = await item.meta.content;
          // console.log(item.make);
          return await {
            ...(await filteredObj1),
            // ...filteredObj2,
            make: {
              type: {
                type: item.make.type['@type'],

                contract: item.make.type.contract,
                tokenId: item.make.type.tokenId,
              },
              value: item.make.value,
            },
          };
        })
      );
    console.log('clean', await data);
    // console.log('clean', clean);
    return await data;
  },
  getNftsByContractAddress: async (
    address: string,
    size: number,
    continuation = ''
  ) => {
    const base = process.env.DEV === 'false' ? baseURL : dev_baseURL;
    const url = (base +
      items +
      '/byCollection/' +
      `?collection=${address}&size=${size}&continuation=${continuation}`) as string;

    return await fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then(async (res) => {
        return {
          ...res,
          items: await res.items.map(async (item: any) => {
            return await TAKO.get_item_by_nft_id(item.id);
          }),
        };
      });
  },
  getActivity: async (
    address: string,
    activityType: any[],
    continuation: string,
    cursor: string,
    size: number,
    sort: 'LATEST_FIRST' | 'EARLIEST_FIRST'
  ) => {
    const _activity = await activityType
      .filter(
        (e) =>
          ![
            'CANCEL',
            'GET_BID',
            'MAKE_BID',
            'TRANSFER_FROM',
            'TRANSFER_TO',
          ].includes(e)
      )
      .map((item: any) => item);
    const _user_activity = await activityType
      .filter((e) => !['BID', 'TRANSFER', 'CANCEL'].includes(e))
      .map((item: any) => item);

    const base = process.env.DEV === 'false' ? baseURL : dev_baseURL;

    var urlUser =
      base +
      'v0.1/activities' +
      `/byUser?user=${address}&type=${_user_activity.join(
        ','
      )}&continuation=${continuation}&cursor=${cursor}&sort=${sort}`;

    var urlItem =
      base +
      'v0.1/activities' +
      `/byItem?itemId=${address}&type=${_activity.join(
        ','
      )}&continuation=${continuation}&cursor=${cursor}&sort=${sort}`;

    const urlContract = (base +
      'v0.1/activities' +
      `/byCollection?collection=${address}&type=${_activity.join(
        ','
      )}&continuation=${continuation}&cursor=${cursor}&sort=${sort}`) as string;
    let data: any;
    const contract = await fetch(urlContract, {
      method: 'GET',
    });
    const item = await fetch(urlItem, {
      method: 'GET',
    });
    const user = await fetch(urlUser, {
      method: 'GET',
    });
    data = {
      activities: {
        user: [],
        nft: [],
        contract: [],
      },
      continuation: '',
      cursor: '',
    };

    if (contract.status === 200) {
      const v = await contract.json();
      // console.log(v)
      const activities = data.activities;
      activities.contract = v.activities;
      var continuation: string = data.continuation;
      var cursor: string = data.continuation;
      continuation = v.continuation;
      cursor = v.cursor;
    }
    if (item.status === 200) {
      const v = await item.json();
      const activities = data.activities;
      activities.nft = v.activities;
      var continuation: string = data.continuation;
      var cursor: string = data.continuation;
      continuation = v.continuation;
      cursor = v.cursor;
    }
    if (user.status === 200) {
      const v = await user.json();
      const activities = data.activities;
      activities.user = v.activities;
      var continuation: string = data.continuation;
      var cursor: string = data.continuation;
      continuation = v.continuation;
      cursor = v.cursor;
    }
    let activities = data.activities;
    activities = {
      contract: await activities.contract.map(async (activity: any) => {
        activity['type'] = '';
        activity['type'] = await activity['@type'];
        delete activity['@type'];
        return await activity;
      }),
      user: await activities.user.map(async (activity: any) => {
        activity['type'] = '';
        activity['type'] = await activity['@type'];
        delete activity['@type'];
        return await activity;
      }),
      nft: await activities.nft.map(async (activity: any) => {
        activity['type'] = '';
        activity['type'] = await activity['@type'];
        delete activity['@type'];
        return await activity;
      }),
    };
    console.log(data.cursor);
    return {
      activities: await activities,
      ...data,
    };
  },
  getAllActivity: async (
    continuation: string,
    cursor: string,
    sort: 'LATEST_FIRST' | 'EARLIEST_FIRST',
    size: number
  ) => {
    const type = [
      'TRANSFER',
      'MINT',
      'BURN',
      'BID',
      'LIST',
      'SELL',
      'CANCEL_LIST',
      'CANCEL_BID',
      'AUCTION_BID',
      'AUCTION_CREATED',
      'AUCTION_CANCEL',
      'AUCTION_FINISHED',
      'AUCTION_STARTED',
      'AUCTION_ENDED',
    ];
    const base = process.env.DEV === 'false' ? baseURL : dev_baseURL;

    var url =
      base +
      'v0.1/activities' +
      `/all?type=${type.join(
        ','
      )}&continuation=${continuation}&cursor=${cursor}&sort=${sort}&size=${size}`;
    // console.log(url);
    let _data: any = await fetch(url, {
      method: 'GET',
    }).then((res) => res.json());
    const activities =
      typeof _data.activities !== 'undefined' ? _data.activities : [];
    return {
      activities: await activities.map(async (activity: any) => {
        activity['type'] = '';
        activity['type'] = await activity['@type'];
        delete activity['@type'];
        return await activity;
      }),
      ..._data,
    };
  },
  getAllSellOrders: async ({
    blockchains,
    continuation,
    cursor,
    size,
    origin,
  }: {
    blockchains: string[];
    continuation: string;
    cursor: string;
    size: number;
    origin: string;
  }) => {
    const base = process.env.DEV === 'false' ? baseURL : dev_baseURL;

    var url =
      base +
      'v0.1/orders' +
      `/all?status=ACTIVE&sort=LAST_UPDATE_DESC&blockchains=${blockchains.join(
        ','
      )}&continuation=${continuation}&size=${size}`;
    // console.log(url);
    let _data: any = await fetch(url, {
      method: 'GET',
    }).then((res) => res.json());

    return {
      ..._data,
      orders: await _data.orders
        .filter((order: any) => {
          return (
            order.makePrice !== null &&
            order.makePrice !== undefined &&
            order.makePrice.length > 0
          );
        })
        .map(async (order: any) => {
          const _o = {
            ...order,
            make: {
              ...order.make,
              type: {
                ...order.make.type,
                type: await order.make['type']['@type'],
              },
            },
            take: {
              ...order.take,
              type: {
                ...order.take.type,
                type: await order.take['type']['@type'],
              },
            },
          };
          // console.log(_o);
          return _o;
        }),
    };
  },
  get_all_items: async ({
    blockChain,
    size,
    continuation,
    start_date,
  }: {
    blockChain: string;
    size: number;
    continuation: any;
    start_date: number;
  }) => {
    try {
      // base url
      const base = process.env.DEV !== 'true' ? baseURL : dev_baseURL;
      // api url
      let url = `${base}${items}/all/?size=${size}&continuation=${continuation}&lastUpdatedFrom=${JSON.stringify(
        Date.now() - 86400000 * 3
      )}` as string;
      //fetch
      let data = await fetch(url, {
        method: 'GET',
      }).then(async (res) => res.json());
      // nft_list
      const nft_list = await data.items.map(async (item: any) => {
        const asArray = Object.entries(item);
        const asubArray = Object.entries(item?.meta);
        const filtered = asArray.filter(([key, value]) =>
          ['tokenId', 'blockchain', 'id', 'bestSellOrder', 'supply'].includes(
            key
          )
        );
        const filtered2 = asubArray.filter(([key, value]) =>
          ['name', 'description'].includes(key)
        );

        const filteredObj1 = Object.fromEntries(filtered);
        const filteredObj2 = Object.fromEntries(filtered2);
        const content = await item.meta.content;
        return await {
          ...filteredObj1,
          ...filteredObj2,
          url:
            content[0] !== undefined
              ? cleanUrl(content[0].url, ['ipfs://', 'https://ipfs.io/ipfs/'])
              : '',
          creators: await item?.creators.map(({account}: any) => {
            return {address: account};
          }),
        };
      });
      //nft_query
      const nft_query = {
        totalSupply: data.total,
        continuation: data.continuation,
        nfts: await nft_list,
      };
      return nft_query;
    } catch (error) {
      console.log(error);
    }
  },
  get_items_by_owner: async (address: any) => {
    try {
      const base = process.env.DEV !== 'true' ? baseURL : dev_baseURL;
      let url = (base + items + '/byOwner/' + `?owner=${address}`) as string;
      // console.log(process.env.DEV, url);
      let data = await fetch(url, {
        method: 'GET',
      }).then(async (res) => res.json());
      return {
        totalSupply: data.total,
        nfts: data.items.map(async (item: any) => {
          const asArray = Object.entries(item);
          const asubArray = Object.entries(item?.meta);
          const filtered = asArray.filter(([key, value]) =>
            ['tokenId', 'blockchain', 'id', 'bestSellOrder', 'supply'].includes(
              key
            )
          );
          const filtered2 = asubArray.filter(([key, value]) =>
            ['name'].includes(key)
          );
          const filteredObj1 = Object.fromEntries(filtered);
          const filteredObj2 = Object.fromEntries(filtered2);
          const content = await item.meta.content;

          return {
            ...filteredObj1,
            ...filteredObj2,
            url: content[0] !== undefined ? content[0].url : '',
          };
        }),
      };
    } catch (error) {
      console.log(error);
    }
  },
  get_item_by_nft_id: async (nft_id: any) => {
    try {
      let url = baseURL + items + '/' + `${nft_id}`;

      return await fetch(url, {
        method: 'GET',
      }).then(async (res) => res.json());
    } catch (error) {
      console.log(error);
    }
  },
  get_nfts_by_collection: async ({
    sdk,
    collection,
  }: {
    sdk: any;
    collection: any;
  }) => {
    if (!sdk) return;
    return await sdk.apis.item.getItemsByCollection({collection});
  },
  get_nft_data: async ({sdk, collection}: {sdk: any; collection: any}) => {
    if (!sdk) return;
    return await sdk.nft.mint({collection: collection});
  },
  // MUTATIONS
  createCollection: async (sdk: any, collectionRequest: any) => {
    try {
      if (!sdk) return;
      const result = await sdk.nft.createCollection(collectionRequest);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  mint: async ({
    sdk,
    collection,
    data,
  }: {
    sdk: any;
    collection: any;
    data: any;
  }) => {
    if (!sdk) return;
    const mintAction = await sdk.nft
      .mint({
        collectionId: collection,
      })
      .catch((error: any) => {
        console.log(error);
      });
    const nft_data = await mintAction.submit(data).catch((error: any) => {
      console.log(error);
    });

    if (nft_data.type === MintType.ON_CHAIN) {
      await nft_data.transaction.wait();
    }
    return await nft_data.itemId;
  },
  sell_nft: async ({
    sdk,
    nft_id,
    amount,
    price,
    blockchain,
    currency,
  }: {
    sdk: any;
    nft_id: any;
    amount: any;
    price: number;
    blockchain: string;
    currency: any;
  }) => {
    console.log(sdk, nft_id, amount, price, blockchain, currency);
    if (!sdk) return;
    const {
      supportedCurrencies, // list of currency types supported by the blockchain (ETH, ERC20 etc.)
      maxAmount, // max amount of the NFT that can be put on sale
      baseFee, // present it to a user, it's a base protocol fee that is taken on the trade
      submit, // use this Action to submit information after user input
    } = await sdk.order.sell({itemId: nft_id});
    // if (amount <= maxAmount) {
    console.log(supportedCurrencies);
    const orderId = await submit({
      amount,
      price: price,
      currency:
        blockchain == 'POLYGON' || blockchain == 'POLYGON'
          ? {
              '@type': 'ETH',
              blockchain: blockchain,
            }
          : blockchain == 'TEZOS'
          ? {
              '@type': 'TEZ',
              blockchain: blockchain,
            }
          : blockchain == ' FLOW'
          ? {
              '@type': 'FLOW',
              blockchain: blockchain,
            }
          : {},
      originFees:
        blockchain == 'POLYGON'
          ? [
              {
                account: 'POLYGON:0x877728846bFB8332B03ac0769B87262146D777f3' as any,
                value: 5,
              },
            ]
          : blockchain == 'ETHEREUM'
          ? [
              {
                account: 'ETHEREUM:0x877728846bFB8332B03ac0769B87262146D777f3' as any,
                value: 5,
              },
            ]
          : blockchain == 'TEZOS'
          ? [
              {
                account: 'TEZOS:tz1Q5duBxjCNy1c5Kba63Mf5Jqz9wyKqXFAk' as any,
                value: 5,
              },
            ]
          : blockchain == ' FLOW'
          ? [
              {
                account: 'FLOW:0x54607bd2c9da71d0' as any,
                value: 5,
              },
            ]
          : [],
    });
    await console.log(orderId);
    // }
    return orderId;
  },
  bid_nft: async ({
    sdk,
    nft_id,
    amount,
    price,
    blockchain,
    currency,
  }: {
    sdk: any;
    nft_id: any;
    amount: any;
    price: number;
    blockchain: string;
    currency: any;
  }) => {
    console.log(sdk, nft_id, amount, price, blockchain);
    const {
      supportedCurrencies, // list of currency types supported by the blockchain (ETH, ERC20 etc.)
      maxAmount, // max amount of the NFT that can be put on sale
      baseFee, // present it to a user, it's a base protocol fee that is taken on the trade
      submit, // use this Action to submit information after user input
    } = await sdk.order.bid({itemId: nft_id});
    // if (amount <= maxAmount) {
    const orderId = await submit({
      amount,
      price: price,
      currency: currency,
      originFees:
        blockchain == 'ETHEREUM'
          ? [
              {
                account: 'ETHEREUM:0x3E874472Da434f8E1252E95430a65e8F516ED00d' as any,
                value: 100,
              },
            ]
          : blockchain == 'TEZOS'
          ? [
              {
                account: 'TEZOS:tz1Q5duBxjCNy1c5Kba63Mf5Jqz9wyKqXFAk' as any,
                value: 100,
              },
            ]
          : blockchain == ' FLOW'
          ? [
              {
                account: 'FLOW:0x54607bd2c9da71d0' as any,
                value: 100,
              },
            ]
          : [],
    });
    await console.log(orderId);
    // }
  },
  buy_nft: async ({
    sdk,
    order_id,
    amount,
    blockchain,
  }: {
    sdk: any;
    order_id: any;
    amount: any;
    blockchain: string;
  }) => {
    const {
      maxAmount, // max amount of NFTs available for purchase
      baseFee, // fee that will be taken from the buyer
      originFeeSupport, // if smart contract supports custom origin fees
      payoutsSupport, // if smart contract supports payouts
      supportsPartialFill, // if smart contract supports partial fills
      submit, // use this Action to submit information after user input
    } = await sdk.order.buy({orderId: order_id});
    // if (amount <= maxAmount) {
    const orderId = await submit({
      amount,
      originFees:
        blockchain == 'ETHEREUM'
          ? [
              {
                account: 'ETHEREUM:0x877728846bFB8332B03ac0769B87262146D777f3' as any,
                value: 100,
              },
            ]
          : blockchain == 'POLYGON'
          ? [
              {
                account: 'POLYGON:0x877728846bFB8332B03ac0769B87262146D777f3' as any,
                value: 100,
              },
            ]
          : blockchain == 'TEZOS'
          ? [
              {
                account: 'TEZOS:tz1RrvP2FtnWAgGYKfoKSkLXYoqyHfXQjs8i' as any,
                value: 100,
              },
            ]
          : blockchain == ' FLOW'
          ? [
              {
                account: 'FLOW:0x54607bd2c9da71d0' as any,
                value: 100,
              },
            ]
          : blockchain == 'SOLANA'
          ? [
              {
                account: 'SOLANA:98jiC2PfMNqLwUrabW3LxE15dfHCyaNX5V6nxHaP96NQ' as any,
                value: 100,
              },
            ]
          : [],
    });
    await console.log(orderId);
    // }
  },
};

export default TAKO;
