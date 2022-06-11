import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {connect as redux} from 'react-redux';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import {setPortalContinuation} from '../actions/session';
import Blockies from 'react-blockies';
import {ContractAddress} from '@rarible/types';
import {IRaribleSdk} from '@rarible/sdk/build/domain';

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
  onPress: any;
  setPortalContinuation: any;
}
async function checkURL(url) {
  try {
    // console.log(_url);
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

function Featured_NFT({
  sdk,
  address,
  connection,
  blockchain,
  _id,
  onClose,
  onPress,
  setPortalContinuation,
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
  const [creatorAddress, setCreatorAddress] = useState<any>('');
  const [tokenData, setTokenData] = useState<any>({});
  const [completed, setCompleted] = React.useState(false);
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
  const {loading, error, data} = useQuery(query, {
    variables: {
      input: {
        blockChain: '',
        continuation: '',
        size: 1,
        // start_date: JSON.stringify(queryDate[1]),
      },
    },
    onCompleted: ({get_all_items}) => {
      if (get_all_items !== null) {
        checkURL(get_all_items.url).then(
          async (type: any): Promise<void> => {
            await setMimeType(type);
          }
        );
        get_all_items.nfts[0] !== null &&
          get_all_items.nfts[0].creators !== null &&
          setCreatorAddress(
            get_all_items.nfts[0].creators[0].address.split(':')[1]
          );
        setTokenData({
          totalsupply: get_all_items.totalSupply,
          nft: get_all_items.nfts[0],
          continuation: get_all_items.continuation,
        });

        setCompleted(true);
      }
    },
  });

  if (loading)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
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
        <div
          className='position-relative d-flex flex-column border border-white rounded pointer'
          onClick={() => onPress(tokenData?.nft.id)}>
          <div className='nft-wrapper d-flex flex-column justify-content-center  align-items-start h-100 w-100 '>
            <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100 col'>
              <div className='d-flex flex-column justify-content-center align-items-center  w-100 h-100 p-2'>
                <div className='w-100 image-wrap'>
                  {console.log(
                    'https://akkoros.mypinata.cloud/ipfs/' +
                      tokenData?.nft.url.split('ipfs/')[1]
                  )}
                  <MediaViewer
                    styling={'w-100 h-100'}
                    mimeType={mimetype}
                    previewUri={tokenData?.nft.url}
                    displayUri={tokenData?.nft.url}
                    artifactUri={tokenData?.nft.url}
                    type={'ipfs'}
                  />
                </div>
              </div>
            </div>
            <div className=' d-flex flex-column justify-content-between align-items-start w-100'>
              <div className='d-flex flex-column w-100 p-1'>
                <div className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center w-100 mb-3'>
                  {/* {console.log(tokenData.nft)} */}
                  {creatorAddress !== null && (
                    <span className=' mx-2' title={creatorAddress}>
                      <Blockies
                        seed={creatorAddress}
                        size={7}
                        scale={4}
                        className='d-flex flex-row justify-content-center align-items-center border border-white rounded-circle'
                      />
                    </span>
                  )}
                  <div className='d-flex flex-column align-items-start justify-content-evenly'>
                    <p className='nft-title text-truncate text-break d-flex flex-row align-items-center mx-2 mb-0'>
                      {tokenData?.nft.name}
                    </p>
                    <p className=' mx-2 mb-0'>{tokenData?.nft.blockchain}</p>
                  </div>
                </div>
              </div>
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

export default redux(mapStateToProps, {setPortalContinuation})(Featured_NFT);
