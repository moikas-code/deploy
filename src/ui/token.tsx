import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {connect as redux} from 'react-redux';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import {setPortalContinuation} from '../actions/session';
import AKKORO_LIB from '../akkoro_lib';
import {
  ItemId,
  BigNumber,
  toUnionAddress,
  OrderId,
  toBigNumber,
  ContractAddress,
} from '@rarible/types';
import {IRaribleSdk} from '@rarible/sdk/build/domain';
import {truncateAddress} from '../lib/moiWeb3';
import {event} from '../utility/analytics';
import Select from 'react-select';
import {Input} from '../common/input';
import Button from '../components/common/button';
import {parse} from 'dotenv';
import {useRouter} from 'next/router';
import OrderItems from '../components/OrderItems';
let MediaViewer = dynamic(() => import('../components/media-viewer'), {
  ssr: false,
});

interface TokenProps {
  sdk: IRaribleSdk;
  address: any;
  connection: any;
  blockchain: any;
  portal_continuation: string;
  setPortalContinuation: (portal_continuation: string) => void;
}
async function checkURL(url) {
  try {
    let blob = await fetch('https://akkoros.herokuapp.com/' + url).then((r) =>
      r.blob()
    );
    let dataUrl = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    // now do something with `dataUrl`

    dataUrl = dataUrl.split(':')[1];
    dataUrl = dataUrl.split(';')[0];
    // console.log(dataUrl);
    if (dataUrl.includes('text')) {
      return 'image/SVG';
    }

    if (dataUrl.includes('application/octet-stream')) {
      return 'image/png';
    }
    return await dataUrl;
  } catch (error) {
    console.log(error);
    return 'image/png';
  }
}

function Token_View({
  sdk,
  address,
  connection,
  blockchain,
  portal_continuation,
  setPortalContinuation,
}: TokenProps) {
  const router = useRouter();
  const queryDate = {
    1: Date.now() - 86400000 * 3,
  };
  const [sell_price, setSell_Price] = useState(0);
  const [mimetype, setMimeType] = useState('');
  const [ownership_status, setOwnershipStatus] = useState(false);
  const [currency, setCurrency] = useState<any>({
    value: {
      '@type': 'ERC20',
      contract: 'ETHEREUM:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' as ContractAddress,
    },
    label: 'WETH',
  });
  const [currencyOptions, setCurrencyOptions] = useState<any>([]);
  const [tokenData, setTokenData] = useState<any>({});
  const [completed, setCompleted] = useState<any>(false);
  const query = gql`
    query AllNFTS($input: RaribleInput) {
      get_all_items(input: $input) {
        totalSupply
        continuation
        nfts {
          id
          name
          description
          blockchain
          price
          url
          creators {
            address
          }
          lazySupply
          supply
          sellers
          mintedAt
          bestSellOrder {
            id
            fill
            platform
            status
          }
        }
      }
    }
  `;
  // console.log(connection);
  const {loading, error, data} = useQuery(query, {
    variables: {
      input: {
        blockChain: '',
        continuation: portal_continuation,
        size: 1,
        // start_date: JSON.stringify(queryDate[1]),
      },
    },
    onCompleted: ({get_all_items}) => {
      if (get_all_items !== null) {
        const {nfts, continuation} = get_all_items;
        nfts &&
          nfts[0]?.name !== undefined &&
          [
            '[WAITING TO BE SIGNED]',
            'Unnamed item',
            '',
            'Unnamed',
            'Untitled',
          ].includes(nfts[0]?.name) &&
          setPortalContinuation(continuation);
        nfts &&
          nfts[0]?.url !== undefined &&
          checkURL(nfts[0]?.url).then(async (type: any) => {
            setMimeType(type);
          });
          console.log(get_all_items);
        setTokenData(get_all_items);
        setCompleted(true);
      }
    },
  });
  const {continuation} = data?.get_all_items || {};

  useEffect(() => {
    connection !== undefined &&
      connection !== null &&
      AKKORO_LIB.getCurrencyOptions(connection.blockchain).then((options) => {
        setCurrency(options[0]);
        setCurrencyOptions(options);
      });
  }, []);
  if (error)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100 text-red'>
        Error: {error.message}
      </div>
    );

  if (loading)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  if (completed) {
    return (
      <>
        <style global jsx>{`
          html,
          body,
          #__next,
          #__next > div {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: end;
          }
          .css-2613qy-menu {
            position: absolute;
            margin-top: 1px;
            font: 10px;
            bottom: 100%; /* added this attribute */
          }
          .nft-title {
            overflow-wrap: break-word;
            font-size: 30px;
            line-height: 1.25;
            font-family: inherit;
            font-weight: 700;
            vertical-align: inherit;
          }
          .tkn-btns {
            max-height: 50px;
          }

          input {
            width: 100% !important;
          }
          .image-wrap {
            height: 100%;
            max-height: 800px !important;
          }
          .img-container {
            max-width: calc(100% - 515px);
          }
          .order-wrapper {
            width: 515px;
            min-width: 515px;
            height: 100%;
          }
          @media (max-width: 1200px) {
            .img-container {
              max-width: calc(100% - 400px);
            }
            .order-wrapper {
              width: 400px;
              min-width: 400px;
              height: 100%;
            }
          }

          //max
          @media (max-width: 991px) {
            .image-wrap {
              height: 100%;
              max-height: 600px !important;
            }
            .order-wrapper {
              // width: 350px;
              min-width: 350px;
              width: 60%;
              height: 100%;
            }
          }

          @media (max-width: 767px) {
            .img-container {
              max-width: 100%;
            }
            .order-wrapper {
              // width: 350px;
              min-width: 350px;
              width: 90%;
              height: 100%;
            }
          }
          @media (max-width: 575px) {
            .order-wrapper {
              // width: 350px;
              min-width: 350px;
              width: 95%;
              height: 100%;
            }
          }
          @media (max-width: 400px) {
            .img-container {
              max-width: 100%;
            }
            .order-wrapper {
              width: 350px;
              min-width: 350px;
              height: 100%;
            }
          }
        `}</style>

        {tokenData.nfts[0] !== undefined && (
          <div className='content-wrapper d-flex flex-column flex-lg-row justify-content-center align-items-center h-100 w-100 '>
            <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100 col'>
              <div className='d-flex flex-column justify-content-center align-items-center  w-100 h-100 p-2'>
                <div className='w-100 image-wrap'>
                  <MediaViewer
                    styling={'w-100 h-100'}
                    mimeType={mimetype}
                    previewUri={tokenData.nfts[0].url}
                    displayUri={tokenData.nfts[0].url}
                    artifactUri={tokenData.nfts[0].url}
                    type={'ipfs'}
                  />
                </div>
              </div>
            </div>
            <div className='order-wrapper d-flex flex-column justify-content-between align-items-start pe-3 ms-3 pb-2'>
              <div className='d-flex flex-column w-100'>
                <h1 className='nft-title'>{tokenData.nfts[0]?.name}</h1>
                <h6>{tokenData.nfts[0]?.blockchain}</h6>
                <a
                  href={`${`https://rarible.com/token/`}${
                    tokenData.nfts[0].id.split(':')[1]
                  }:${tokenData.nfts[0].id.split(':')[2]}`}
                  target={'_blank'}
                  rel='norefferal'>
                  visit on rarible.com
                </a>
                <p>Total Supply: {<>{tokenData.nfts[0]?.supply}</>}</p>
                {/* <p>{nfts[0]?.description}</p> */}
              </div>
              {tokenData.nfts !== undefined &&
                tokenData.nfts[0] !== undefined &&
                connection !== null &&
                connection.blockchain === tokenData.nfts[0]?.blockchain &&
                connection.status !== 'initializing' &&
                connection.status !== 'disconnected' &&
                connection.status !== 'connecting' && (
                  <OrderItems
                    sdk={sdk}
                    nid={tokenData.nfts[0]?.id}
                    address={address}
                    blockchain={connection.blockchain}
                  />
                )}
              <div className='d-flex flex-row justify-content-between align-items-end btn-group w-100'>
                <Button
                  buttonStyle='w-100 btn btn-outline-light tkn-btns'
                  onPress={async () => {
                    await setPortalContinuation(continuation);
                  }}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <div />;
}

function Order_Items({
  sdk,
  nid,
  address = '',
  blockchain = '',
}: {
  sdk: IRaribleSdk;
  nid: string;
  address: string;
  blockchain: string;
}) {
  const query = gql`
    query NFT_ORDER_DATA($input: RaribleInput) {
      get_orders_by_nft_id(input: $input) {
        id
        platform
        status
        makeStock
        createdAt
        makePrice
        makePriceUsd
        maker
      }
    }
  `;
  // console.log(nid);
  const {loading, error, data} = useQuery(query, {
    variables: {
      input: {
        address: nid,
      },
    },
  });
  if (loading)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100'>
        <div class='spinner-border' role='status'>
          <span class='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100 text-red'>
        <div className='mx-auto'>No Orders Found</div>
      </div>
    );
  return (
    <>
      {/* {console.log(data)} */}
      <style global jsx>{`
        .order-content-wrapper {
          min-height: 380px;
        }
        .order-content {
          overflow-y: scroll;
        }
      `}</style>
      <div className='order-content-wrapper d-flex flex-column justify-content-start align-items-center w-100 h-100'>
        <hr className='text-white border-bottom border-white w-100 mx-auto px-3 text-center' />
        <h6 className='text-left'>Orders:</h6>
        <div className='order-content d-flex flex-column justify-content-start align-items-start w-100 h-100  px-4 border-start border-end  border-white'>
          {data.get_orders_by_nft_id.filter((order) => order.status == 'ACTIVE')
            .length > 0 ? (
            data.get_orders_by_nft_id
              .filter((order) => order.status == 'ACTIVE')
              .map((order, key) => {
                const id = order.id as OrderId;
                // console.log(order);
                return (
                  <div
                    key={key}
                    className='d-flex flex-column justify-content-between align-items-start border border-white py-3 px-2 my-2 w-100 rounded pointer'>
                    <p className='mb-0 fs-6 px-2  '>
                      Author:{' '}
                      <span
                        title={order.maker.split(':')[1]}
                        className='mx-2 border-bottom'>
                        {truncateAddress(order.maker.split(':')[1])}
                      </span>
                    </p>{' '}
                    <div className='d-flex flex-column flex-sm-row flex-lg-column justify-content-sm-start w-100'>
                      <p className='fs-6 px-2'>
                        {' '}
                        For Sell:{' '}
                        <span className='mx-2 border-bottom'>
                          {order.makeStock}
                        </span>
                      </p>
                    </div>
                    {/* <div className='d-flex flex-row align-items-center'>
                      <p className='mb-0 mx-2'>
                        {' '}
                        Price: <br />
                        
                        {blockchain == 'ETHEREUM'
                          ? 'ETH'
                          : blockchain == 'TEZOS'
                          ? 'XTZ'
                          : 'FLOW'}{' '}
                        + 1% Fee
                      </p>
                    </div> */}
                    {order.maker !==
                      toUnionAddress(blockchain + ':' + address) && (
                      <Button
                        onPress={() =>
                          AKKORO_LIB.buy_nft({
                            sdk,
                            amount: '1' as BigNumber,
                            order_id: id as OrderId,
                            blockchain,
                          })
                        }
                        buttonStyle='btn btn-outline-success w-100'>
                        Buy 1 For
                        <span title='1% Service Fee' className='mx-1'>
                          {parseFloat(order.makePrice).toFixed(4)} + 1%
                        </span>
                      </Button>
                    )}
                  </div>
                );
              })
          ) : (
            <div className='mx-auto'>No Orders Found</div>
          )}
        </div>
      </div>
    </>
  );
}
// function Bid_Items({
//   sdk,
//   nid,
//   address = '',
//   blockchain = '',
// }: {
//   sdk: IRaribleSdk;
//   nid: string;
//   address: string;
//   blockchain: string;
// }) {
//   // console.log(nid)
//   const query = gql`
//     query NFT_ORDER_DATA($input: RaribleInput) {
//       get_bids_by_nft_id(input: $input) {
//         id
//         platform
//         status
//         makeStock
//         createdAt
//         makePrice
//         makePriceUsd
//         maker
//       }
//     }
//   `;

//   const {loading, error, data} = useQuery(query, {
//     variables: {
//       input: {
//         address: nid,
//       },
//     },
//   });
//   if (loading)
//     return (
//       <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100'>
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100 text-red'>
//         Error: {error.message}
//       </div>
//     );
//   return (
//     <>
//       <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100'>
//         <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100'>
//           <h6>Bids:</h6>
//           {console.log(data)}
//           {data.get_bids_by_nft_id.map((order) => {
//             const id = order.id as OrderId;
//             return (
//               <div className='border border-white p-5 m-2'>
//                 {/* <div>Order ID: {order.id}</div> */}
//                 <div>Seller: {order.maker}</div>
//                 <div>For Sell: {order.makeStock}</div>
//                 {/* <div>Status: {order.status}</div> */}
//                 <div>Order Created: {order.createdAt}</div>
//                 <div>
//                   Price: {order.makePrice}ETH + 1% Service fee ={' '}
//                   {(
//                     parseFloat(order.makePrice) +
//                     0.01 * parseFloat(order.makePrice)
//                   ).toString()}
//                 </div>
//                 {
//                   <button
//                     onClick={() =>
//                       AKKORO_LIB.buy_nft({
//                         sdk,
//                         amount: '1' as BigNumber,
//                         order_id: id as OrderId,
//                         blockchain,
//                       })
//                     }
//                     className='btn btn-outline-success'>
//                     Buy
//                   </button>
//                 }
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }
const mapStateToProps = (state) => ({
  sdk: state.session.sdk,
  address: state.session.address,
  connection: state.session.connection,
  blockchain: state.session.blockchain,
  portal_continuation: state.session.portal_continuation,
});

export default redux(mapStateToProps, {setPortalContinuation})(Token_View);
