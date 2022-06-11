import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import moment from 'moment';
import Button from './common/button';
import {truncateAddress} from '../lib/moiWeb3';
import TabButton from './TabButton';
import TakoLink from './TakoLink';
import useInterval from '../utility/useInterval';
import TAKO from '../tako';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';
const query = gql`
  query Sell_Orders($input: QueryInput!) {
    Query_All_Sell_Orders(input: $input) {
      continuation
      orders {
        id
        filled
        platform
        status
        startedAt
        endedAt
        makeStock
        cancelled
        createdAt
        lastUpdatedAt
        makePrice
        makePriceUsd
        maker
        make {
          type {
            type
            contract
            tokenId
            uri
            creators {
              address
            }
            royalties {
              address
              value
            }
          }
          value
        }
        takerPrice
        takerPriceUsd
        taker
        take {
          type {
            type
            contract
            blockchain
          }
          value
        }
      }
    }
  }
`;

export default function OrderWidget({blockchains}: {blockchains: string[]}) {
  const [complete, setComplete] = React.useState<boolean>(false);
  const [showContract, setContractBool] = React.useState<boolean>(false);
  const [showUser, setUserBool] = React.useState<boolean>(false);
  const [showNFT, setNFTBool] = React.useState<boolean>(false);
  const [_orders, setOrders] = React.useState<Array<any>>([[]]);
  const [cursor, setCursor] = React.useState<string>('');
  const [continuation, setContinuation] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(0);

  const ref = React.useRef<number>(null);
  const [load, setLoad] = React.useState<boolean>(false);
  const fetchMoreNFTS = async () => {
    if (complete) {
      const fetchedMore = await refetch({
        input: {
          blockchains: ['ETHEREUM', 'POLYGON', 'FLOW', 'TEZOS', 'SOLANA'],
          size: 50,

          continuation: continuation,
        },
      });
      if ((await fetchedMore.data.Query_All_Sell_Orders) !== null) {
        const {orders, continuation} = await fetchedMore.data
          .Query_All_Sell_Orders;
        let NFT_ARRAY = [..._orders, orders]
          .flat()
          .sort((a, b) =>
            new Date(b.lastUpdatedAt) > new Date(a.lastUpdatedAt) ? 1 : -1
          );
        let row = 1;
        const rowSize = 50;
        let arr: any[] = [];
        let arr2: any[] = [];

        await NFT_ARRAY.map((researcher, key) => {
          if (arr.length == rowSize) {
            arr2.push(arr);
            arr = [];
          }
          if (NFT_ARRAY.length == key + 1 && !arr.includes(researcher)) {
            arr.push(researcher);
            arr2.push(arr);
          } else {
            arr.push(researcher);
          }
        });
        setOrders(arr2);
        setCursor(cursor);
        setContinuation(continuation);
        setPage(page + 1);

        setLoad(false);
      }
    }
  };
  const [Query_All_Sell_Orders, {loading, error, data, refetch}] = useLazyQuery(
    query,
    {
      onCompleted: ({Query_All_Sell_Orders}: any) => {
        console.log(Query_All_Sell_Orders);
        if (
          Query_All_Sell_Orders !== null &&
          Query_All_Sell_Orders !== undefined
        ) {
          setOrders([Query_All_Sell_Orders.orders]);
          setCursor(Query_All_Sell_Orders.cursor);
          setContinuation(Query_All_Sell_Orders.continuation);
          setComplete(true);
        }
      },
    }
  );

  React.useEffect(() => {
    Query_All_Sell_Orders({
      variables: {
        input: {
          blockchains: ['ETHEREUM', 'POLYGON', 'FLOW', 'TEZOS', 'SOLANA'],
          size: 50,

          continuation: continuation,
        },
      },
    });
    return () => {
      setOrders([[]]);
      setComplete(false);
    };
  }, [blockchains]);

  return (
    <>
      <style jsx>
        {`
          .activity-wrapper {
            height: calc(100% - 108px);
          }
          .activity-labels {
            min-width: 1200px;
          }
        `}
      </style>{' '}
      <h2> Order Wall</h2>
      <br />
      1% Service Fee to Maintain the Platform and bring you new features
      <div
        className={` ${
          !load && complete ? '' : 'activity-wrapper'
        } d-flex flex-column justify-content-start`}>
        {!load && error && (
          <>
            <div className=' d-inline-flex flex-column border border-dark p-2 mb-5 overflow-auto h-100 w-100'>
              <div
                className={
                  'activity-labels d-flex flex-column justify-content-center w-100 border-bottom border-dark'
                }>
                <div className='d-flex flex-row'>
                  <p className='m-0 px-2 h6 width-15rem'>Age</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Platform</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Supply</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Price</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Price USD</p> |
                  {/* <p className='m-0 px-2 h6 width-10rem'>Contract</p> | */}
                  <p className='m-0 px-2 h6 width-10rem'>Blockchain</p> |
                </div>
              </div>
              {
                <p className='m-0 text-center'>
                  No Orders Found, Please Try Again, or Check Back Later
                </p>
              }
            </div>
          </>
        )}
        {(load || loading) && (
          <>
            <div className=' d-inline-flex flex-column border border-dark p-2 mb-5 overflow-auto h-100 w-100'>
              <div
                className={
                  'activity-labels d-flex flex-column justify-content-center w-100 border-bottom border-dark'
                }>
                <div className='d-flex flex-row'>
                  <p className='m-0 px-2 h6 width-15rem'>Age</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Platform</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Supply</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Price</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Price USD</p> |
                  {/* <p className='m-0 px-2 h6 width-10rem'>Contract</p> | */}
                  <p className='m-0 px-2 h6 width-10rem'>Blockchain</p> |
                </div>
              </div>
              {
                <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100'>
                  <p>Loading Orders...</p>
                  <br />
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              }
            </div>
          </>
        )}
        {!load && complete && (
          <>
            <div className=' d-inline-flex flex-column border border-dark p-2 mb-5 overflow-auto h-100 w-100'>
              <div
                className={
                  'activity-labels d-flex flex-column justify-content-center w-100 border-bottom border-dark'
                }>
                <div className='d-flex flex-row'>
                  <p className='m-0 px-2 h6 width-15rem'>Age</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Platform</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Supply</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Price</p> |
                  <p className='m-0 px-2 h6 width-10rem'>Price USD</p> |
                  {/* <p className='m-0 px-2 h6 width-10rem'>Contract</p> | */}
                  <p className='m-0 px-2 h6 width-10rem'>Blockchain</p> |
                </div>
              </div>
              {_orders.length > 0 && typeof _orders[page] ? (
                _orders[page].map((item: any, key: number) => (
                  <Order_Item
                    key={key}
                    id={item.id}
                    platform={item.platform}
                    status={item.status}
                    makeStock={item.makeStock}
                    createdAt={item.lastUpdatedAt}
                    makePrice={item.makePrice}
                    makePriceUsd={item.makePriceUsd}
                    make={item.make}
                    take={item.take}
                  />
                ))
              ) : (
                <p className='m-0 text-center'>
                  No Orders Found, Please Try Again, or Search Using Another
                  Address
                </p>
              )}
            </div>
          </>
        )}
        <div>Page: {page + 1}</div>
        <div className='d-flex flex-row'>
          <Button
            onClick={() => {
              page > 0 && setPage(page - 1);
              if (ref !== null && ref.current !== null) {
                ref.current.scrollTop = 0;
              }
            }}>
            Previous
          </Button>
          <Button
            disabled={load}
            onClick={async () => {
              if (page === _orders.length - 1) {
                setLoad(true);
                await fetchMoreNFTS();
              } else {
                setPage(page + 1);
              }
            }}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

function Order_Item({
  id,
  platform,
  status,
  makeStock,
  createdAt,
  makePrice,
  makePriceUsd,
  make,
  take,
}: {
  id: string;
  platform: string;
  status: string;
  makeStock: string;
  createdAt: string;
  makePrice: string;
  makePriceUsd: string;
  make: any;
  take: any;
}) {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;
  const _date = new Date(Date.parse(createdAt));
  const [chainId, setChainId] = React.useState<number>(1);
  const currencyABRV = (_blockchain: string) => {
    switch (_blockchain) {
      case 'ETHEREUM':
      case 'ethereum':
        return 'ETH';
      case 'TEZOS':
      case 'tezos':
        return 'XTZ';
      case 'FLOW':
      case 'flow':
        return 'FLOW';
      case 'POLYGON':
      case 'polygon':
        return 'MATIC';
      case 'SOLANA':
      case 'solana':
        return 'SOL';
      default:
        return 'ETH';
    }
  };
  React.useEffect(() => {
    console.log(
      (id.split(':')[0] == blockchain && chainId == 1) ||
        (id.split(':')[0] == 'POLYGON' && chainId == 137)
    );
    typeof window !== 'undefined' &&
      setChainId(window.web3.currentProvider.networkVersion);
  }, []);
  return (
    <>
      <style jsx>{`
        .activity-item {
          min-width: 1200px;
        }
      `}</style>
      <div
        id={id}
        className={
          'activity-item d-flex flex-column justify-content-center border-bottom border-dark w-100'
        }>
        <div className='d-flex flex-row'>
          <p
            title={moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            className='m-0 px-2  width-15rem'>
            {moment(_date, 'YYYYMMDD').fromNow()}
          </p>{' '}
          | <p className='m-0  px-2 width-10rem'>{platform}</p> |{' '}
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {makeStock}
            </p> |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {makePrice} {currencyABRV(id.split(':')[0])}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              ${makePriceUsd}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {id.split(':')[0]}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem pointer text-truncate'>
              {typeof make.type !== 'undefined' && make.type.contract !== null && (
                <a
                  rel='noopener noreferrer'
                  target='_blank'
                  href={`https://rarible.com/token/${
                    make.type.contract.split(':')[0] === 'ETHEREUM'
                      ? ''
                      : make.type.contract.split(':')[0].toLowerCase()
                  }/${make.type.contract.split(':')[1]}:${make.type.tokenId}`}>
                  View on RArible
                </a>
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate pointer'>
              {connection.state.status === 'connected' &&
              ((id.split(':')[0] == blockchain && chainId == 1) ||
                (id.split(':')[0] == 'POLYGON' && chainId == 137)) ? (
                <div
                  onClick={async () => {
                    return await TAKO.buy_nft({
                      sdk: sdk,
                      amount: '1',
                      order_id: id,
                      blockchain: id.split(':')[0],
                    }).catch((e) => {
                      console.log(e.message);
                      // setError(e.message)
                    });
                  }}
                  className=''>
                  Buy 1 of {makeStock}
                </div>
              ) : (
                <>Connect w/ {id.split(':')[0]} Wallet</>
              )}
            </p>{' '}
            |{' '}
          </>
        </div>
      </div>
    </>
  );
}
