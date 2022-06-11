import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import moment from 'moment';
import Button from './common/button';
import {truncateAddress} from '../lib/moiWeb3';
import TabButton from './TabButton';
import TakoLink from './TakoLink';
import useInterval from '../../src/utility/useInterval';
import {style} from '@mui/system';

const query = gql`
  query Activites($input: QueryInput) {
    Query_All_Activity(input: $input) {
      cursor
      continuation
      activities {
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
`;
var i = 0;
export default function ActivityWidget() {
  const ref = React.useRef<number>(null);
  const [load, setLoad] = React.useState<boolean>(false);
  const [complete, setComplete] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [scrollPosH, setscrollPosH] = React.useState<number>(0);
  const [scrollHeight, setscrollHeight] = React.useState<number>(0);
  const [showNFT, setNFTBool] = React.useState<boolean>(false);
  const [activity, setActivity] = React.useState([[]]);
  const [_cursor, setCursor] = React.useState<string>('');
  const [continuation, setContinuation] = React.useState<string>('');

  const [Query_All_Activity, {loading, error, data, refetch}] = useLazyQuery(
    query,
    {
      onCompleted: ({Query_All_Activity}: any) => {
        // console.log(Query_All_Activity);
        if (Query_All_Activity !== null && Query_All_Activity !== undefined) {
          setActivity([Query_All_Activity.activities]);
          setCursor(Query_All_Activity.cursor);
          setContinuation(Query_All_Activity.continuation);
          setComplete(true);
          setLoad(false);
        }
      },
    }
  );

  const fetchMoreNFTS = async () => {
    if (complete) {
      const fetchedMore = await refetch({
        input: {
          sort: 'LATEST_FIRST',
          continuation: '',
          cursor: _cursor,
          size: 50,
        },
      });
      if ((await fetchedMore.data.Query_All_Activity) !== null) {
        const {activities, cursor, continuation} = await fetchedMore.data
          .Query_All_Activity;
        let NFT_ARRAY = [...activity, activities]
          .flat()
          .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
        let row = 1;
        const rowSize = 50;
        let arr: any[] = [];
        let arr2: any[] = [];

        const _arr = await NFT_ARRAY.map((researcher, key) => {
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
        setActivity(arr2);
        setCursor(cursor);
        setContinuation(continuation);
        setPage(page + 1);
        if (ref && ref.current) {
          ref.current.scrollTop = 0;
        }
        setLoad(false);
      }
    }
  };
  React.useEffect(() => {
    Query_All_Activity({
      variables: {
        input: {
          sort: 'LATEST_FIRST',
          continuation: continuation,
          cursor: '',
          size: 50,
        },
      },
    });
    return ()=>{
      setLoad(true)
    }
  }, []);

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
      </style>

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
                  <p className='m-0 px-2 width-15rem'>Age</p> |
                  <p className='m-0 px-2 width-10rem'>Type</p> |
                  <p className='m-0 px-2 width-10rem'>Token ID</p> |
                  <p className='m-0 px-2 width-10rem'>From</p> |
                  <p className='m-0 px-2 width-10rem'>Owner</p> |
                  <p className='m-0 px-2 width-10rem'>Contract</p> |
                </div>
              </div>
              {
                <p className='m-0 text-center'>
                  No Activity Found, Please Try Again, or Check Back Later
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
        {!load && complete && (
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
                  <p className='m-0 px-2 width-10rem'>Blockchain</p> |
                </div>
              </div>
              {activity.length > 0 && typeof activity[page] !== 'undefined' ? (
                activity[page].map((item: any, key) => (
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
                    blockchain={item.id.split(':')[0]}
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
              if (page === activity.length - 1) {
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

function Activity_Item({
  id,
  date,
  type,
  from,
  contractAddress,
  tokenId,
  owner,
  contract,
  blockchain,
}: {
  id: string;
  date: string;
  type: string;
  from: string;
  contractAddress: string;
  tokenId: string;
  owner: string;
  contract: any;
  blockchain: string;
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
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {blockchain !== null && blockchain}
            </p>{' '}
            |{' '}
          </>
        </div>
      </div>
    </>
  );
}
