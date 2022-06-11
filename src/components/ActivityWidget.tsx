import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import moment from 'moment';
import Button from './common/button';
import {truncateAddress} from '../lib/moiWeb3';
import TabButton from './TabButton';
import TakoLink from './TakoLink';
import useInterval from '../utility/useInterval';
const query = gql`
  query Activites($input: QueryInput!) {
    Query_Activity(input: $input) {
      cursor
      continuation
      activities {
        contract {
          id
          type
          from
          owner
          contract
          tokenId
          itemId
          value
          purchase
          transactionHash
          date
          reverted
          left {
            maker
            hash
          }
          right {
            maker
            hash
          }
          source
          buyer
          seller
          buyerOrderHash
          sellerOrderHash
          price
          priceUsd
          hash
          auction {
            id
            contract
            type
            seller
            endTime
            minimalStep
            minimalPrice
            createdAt
            lastUpdatedAt
            buyPrice
            buyPriceUsd
            pending
            status
            ongoing
            hash
            auctionId
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
          }
          bid {
            type
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
            buyer
            amount
            date
            status
          }
        }
        user {
          id
          type
          from
          owner
          contract
          tokenId
          itemId
          value
          purchase
          transactionHash
          date
          reverted
          left {
            maker
            hash
          }
          right {
            maker
            hash
          }
          source
          buyer
          seller
          buyerOrderHash
          sellerOrderHash
          price
          priceUsd
          hash
          auction {
            id
            contract
            type
            seller
            endTime
            minimalStep
            minimalPrice
            createdAt
            lastUpdatedAt
            buyPrice
            buyPriceUsd
            pending
            status
            ongoing
            hash
            auctionId
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
          }
          bid {
            type
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
            buyer
            amount
            date
            status
          }
        }
        nft {
          id
          type
          from
          owner
          contract
          tokenId
          itemId
          value
          purchase
          transactionHash
          date
          reverted
          left {
            maker
            hash
          }
          right {
            maker
            hash
          }
          source
          buyer
          seller
          buyerOrderHash
          sellerOrderHash
          price
          priceUsd
          hash
          auction {
            id
            contract
            type
            seller
            endTime
            minimalStep
            minimalPrice
            createdAt
            lastUpdatedAt
            buyPrice
            buyPriceUsd
            pending
            status
            ongoing
            hash
            auctionId
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
          }
          bid {
            type
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
            buyer
            amount
            date
            status
          }
        }
      }
    }
  }
`;

export default function ActivityWidget({address}: {address: string}) {
  const [complete, setComplete] = React.useState<boolean>(false);
  const [showContract, setContractBool] = React.useState<boolean>(false);
  const [showUser, setUserBool] = React.useState<boolean>(false);
  const [showNFT, setNFTBool] = React.useState<boolean>(false);
  const [activity, setActivity] = React.useState({
    contract: [],
    nft: [],
    user: [],
  });
  const [cursor, setCursor] = React.useState<string>('');
  const [continuation, setContinuation] = React.useState<string>('');

  const [Query_Activity, {loading, error, data, refetch}] = useLazyQuery(
    query,
    {
      onCompleted: ({Query_Activity}: any) => {
        if (Query_Activity !== null && Query_Activity !== undefined) {
          setActivity(Query_Activity.activities);
          setCursor(Query_Activity.cursor);
          setContinuation(Query_Activity.continuation);
          setComplete(true);
        }
      },
    }
  );

  React.useEffect(() => {
    Query_Activity({
      variables: {
        input: {
          address: address,
          activityType: [
            'TRANSFER',
            'BID',
            'SELL',
            'CANCEL',
            'BURN',
            'MINT',
            'CANCEL_BID',
            'CANCEL_LIST',
            'AUCTION_BID',
            'AUCTION_CREATED',
            'AUCTION_CANCEL',
            'AUCTION_FINISHED',
            'AUCTION_STARTED',
            'AUCTION_ENDED',
            'TRANSFER_FROM',
            'TRANSFER_TO',
            'MAKE_BID',
            'GET_BID',
          ],
          size: 50,
          sort: 'LATEST_FIRST',
          continuation: continuation,
          cursor: cursor,
        },
      },
    });
    return () => {
      setActivity({
        contract: [],
        nft: [],
        user: [],
      });
      setComplete(false);
    };
  }, [address]);

  React.useEffect(() => {
    if (activity.contract.length > 0) {
      setContractBool(true);
      setUserBool(false);
      setNFTBool(false);
      return;
    }

    if (activity.user.length > 0) {
      setContractBool(false);
      setUserBool(true);
      setNFTBool(false);
      return;
    }

    if (activity.nft.length > 0) {
      setContractBool(false);
      setUserBool(false);
      setNFTBool(true);
      return;
    }
  }, [activity]);

  return (
    <>
      <style jsx>
        {`
          .activity-labels {
            min-width: 1200px;
          }
        `}
      </style>
      <div className='d-flex flex-column justify-content-start h-100'>
        <div className='d-flex flex-row'>
          {activity.contract.length > 0 && (
            <Button
              className={`btn btn-outline-dark`}
              onClick={() => {
                setContractBool(true);
                setUserBool(false);
                setNFTBool(false);
              }}>
              Contract Activity
            </Button>
          )}
          {activity.user.length > 0 && (
            <Button
              className={`btn btn-outline-dark`}
              onClick={() => {
                setContractBool(false);
                setUserBool(true);
                setNFTBool(false);
              }}>
              User Activity
            </Button>
          )}
          {activity.nft.length > 0 && (
            <Button
              className={`btn btn-outline-dark`}
              onClick={() => {
                setContractBool(false);
                setUserBool(false);
                setNFTBool(true);
              }}>
              Nft Activity
            </Button>
          )}
        </div>
        {error && <p>{`${error.message}`}</p>}
        {loading && (
          <>
            <div className=' d-inline-flex flex-column border border-dark p-2 mb-5 overflow-auto h-100 w-100'>
              <div
                className={
                  'activity-labels d-flex flex-column justify-content-center w-100 border-bottom border-dark'
                }>
                <div className='d-flex flex-row'>
                  <p className='m-0 px-2 width-15rem'>Age</p> |
                  <p className='m-0 px-2 width-10rem'>Type</p> |
                  <p className='m-0 px-2 width-10rem'>Token ID</p> |
                  <p className='m-0 px-2 width-10rem'>From</p> |
                  <p className='m-0 px-2 width-10rem'>Owner</p> |
                  <p className='m-0 px-2 width-10rem'>Contract</p> |
                </div>
              </div>
              {
                <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100'>
                  <p>Loading Activity...</p>
                  <br />
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              }
            </div>
          </>
        )}
        {complete && (
          <>
            Latest Activity:{' '}
            {
              activity[
                `${
                  activity.contract.length > 0
                    ? 'contract'
                    : activity.user.length > 0
                    ? 'user'
                    : 'nft'
                }`
              ].length
            }
            <div className='d-inline-flex flex-column border border-dark p-2 mb-5 overflow-auto h-100 w-100'>
              <div
                className={
                  'activity-labels d-flex flex-column justify-content-center w-100 border-bottom border-dark'
                }>
                <div className='d-flex flex-row'>
                  <p className='m-0 px-2 width-15rem'>Age</p> |
                  <p className='m-0 px-2 width-10rem'>Type</p> |
                  <p className='m-0 px-2 width-10rem'>Token ID</p> |
                  <p className='m-0 px-2 width-10rem'>From</p> |
                  <p className='m-0 px-2 width-10rem'>Owner</p> |
                  <p className='m-0 px-2 width-10rem'>Contract</p> |
                </div>
              </div>
              {activity[
                `${showContract ? 'contract' : showUser ? 'user' : 'nft'}`
              ].length > 0 ? (
                activity[
                  `${showContract ? 'contract' : showUser ? 'user' : 'nft'}`
                ].map((item: any, key) => (
                  <Activity_Item
                    key={key}
                    id={item.id}
                    date={item.date}
                    type={item.type}
                    from={item.from}
                    contractAddress={item.contract}
                    tokenId={item.tokenId}
                    owner={item.owner}
                    contract={item.contract}
                  />
                ))
              ) : (
                <p className='m-0 text-center'>
                  No Activity Found, Please Try Again, or Search Using Another
                  Address
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Activity_Item({
  id,
  date,
  type,
  from,
  contractAddress,
  tokenId,
  owner,
  contract,
}: {
  id: string;
  date: string;
  type: string;
  from: string;
  contractAddress: string;
  tokenId: string;
  owner: string;
  contract: any;
}) {
  const _date = new Date(Date.parse(date));
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
            title={moment(date).format('MMMM Do YYYY, h:mm:ss a')}
            className='m-0 px-2 width-15rem'>
            {moment(_date, 'YYYYMMDD').fromNow()}
          </p>{' '}
          | <p className='m-0  px-2 width-10rem'>{type}</p> |{' '}
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {tokenId !== null ? (
                <TakoLink
                  href={`/o/${contractAddress}:${tokenId}`}
                  as={`/o/${from}`}>
                  {tokenId}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {from !== null ? (
                <TakoLink href={`/o/${from}`} as={`/o/${from}`}>
                  {from.split(':')[1]}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {owner !== null ? (
                <TakoLink href={`/o/${owner}`} as={`/o/${owner}`}>
                  {owner.split(':')[1]}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {contract !== null ? (
                <TakoLink href={`/o/${contract}`} as={`/o/${contract}`}>
                  {contract.split(':')[1]}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
        </div>
      </div>
    </>
  );
}
