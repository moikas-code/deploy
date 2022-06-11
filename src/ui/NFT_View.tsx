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
  _id: any;
  onClose: any;
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

function NFT_View({
  sdk,
  address,
  connection,
  blockchain,
  _id,
  onClose,
}: TokenProps) {
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
  const [completed, setCompleted] = React.useState(false);
  const query = gql`
    query GetNFT($input: RaribleInput) {
      get_item_by_nft_id(input: $input) {
        id
        tokenId
        collection
        url
        name
        description
        price
        blockchain
        creators {
          address
          value
        }
        lazySupply
        supply
        mintedAt
        sellers
      }
    }
  `;
  console.log(sdk);
  const {loading, error, data} = useQuery(query, {
    variables: {
      input: {
        address: _id,
      },
    },
    onCompleted: ({get_item_by_nft_id}) => {
      console.log(get_item_by_nft_id);
      if (get_item_by_nft_id !== null) {
        const {
          id,
          tokenId,
          collection,
          url,
          name,
          description,
          price,
          blockchain,
          creators,
          lazySupply,
          supply,
          mintedAt,
          sellers,
        } = get_item_by_nft_id;
        checkURL(url).then(
          async (type: any): Promise<void> => {
            console.log(type);
            await setMimeType(type);
          }
        );
        setTokenData(get_item_by_nft_id);
        setCompleted(true);
      }
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
        Error: {error.message}
      </div>
    );
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
            // max-height: 600px !important;
          }
          .order-wrapper {
            width: 92%;
            min-width: 350px;
            height: 100%;
          }
        }

        @media (max-width: 767px) {
          .img-container {
            max-width: 100%;
          }
          .order-wrapper {
            min-width: 350px;
            height: 100%;
          }
        }
        @media (max-width: 575px) {
          .order-wrapper {
            min-width: 350px;
            height: 100%;
          }
        }
        @media (max-width: 400px) {
          .img-container {
            max-width: 100%;
          }
          .order-wrapper {
            width: 100%;
            min-width: 350px;
            height: 100%;
          }
        }
      `}</style>
      {completed && (
        <div className='d-flex flex-column bg-akkoro-dark  pb-5 pb-sm-0'>
          {' '}
          <div className='d-flex flex-row justify-content-end w-100'>
            <Button
              buttonStyle='btn text-white d-flex flex-row align-items-center justify-content-between'
              onPress={onClose}>
              <span className='mx-2'>Go Back</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-x-square'
                viewBox='0 0 16 16'>
                <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z' />
                <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
              </svg>
            </Button>
          </div>
          <div className='nft-wrapper d-flex flex-column flex-lg-row justify-content-center justify-content-lg-start  align-items-center align-items-lg-start h-100 w-100 '>
            <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100 col'>
              <div className='d-flex flex-column justify-content-center align-items-center  w-100 h-100 p-2'>
                <div className='w-100 image-wrap'>
                  <MediaViewer
                    styling={'w-100 h-100'}
                    mimeType={mimetype}
                    previewUri={tokenData?.url}
                    displayUri={tokenData?.url}
                    artifactUri={tokenData?.url}
                    type={'ipfs'}
                  />
                </div>
              </div>
            </div>
            <div className='order-wrapper d-flex flex-column justify-content-between align-items-start pe-3 ms-3 pb-2'>
              <div className='d-flex flex-column w-100'>
                <h1 className='nft-title'>{tokenData?.name}</h1>
                <h6>{tokenData?.blockchain}</h6>
                <a
                  href={`${`https://rarible.com/token/`}${
                    tokenData.id.split(':')[1]
                  }:${tokenData.id.split(':')[2]}`}
                  target={'_blank'}
                  rel='norefferal'>
                  visit on rarible.com
                </a>
                <p>Total Supply: {<>{tokenData?.supply}</>}</p>
                <p>{tokenData?.description}</p>
              </div>
              {tokenData !== null &&
                tokenData !== undefined &&
                connection !== undefined &&
                connection !== null &&
                connection.blockchain === tokenData?.blockchain &&
                connection.status !== 'initializing' &&
                connection.status !== 'disconnected' &&
                connection.status !== 'connecting' && (
                  <OrderItems
                    sdk={sdk}
                    nid={tokenData.id.toString()}
                    address={address}
                    blockchain={connection.blockchain}
                  />
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  address: state.session.address,
  connection: state.session.connection,
  blockchain: state.session.blockchain,
  portal_continuation: state.session.portal_continuation,
});

export default redux(mapStateToProps, {setPortalContinuation})(NFT_View);
