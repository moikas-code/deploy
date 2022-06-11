import React, {useEffect, useState} from 'react';
import {toUnionAddress} from '@rarible/types';
import NFT_CARD from '../components/nft_card';
import {gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import {connect as redux} from 'react-redux';
import Button from '../components/common/button';
import {setPortalContinuation} from '../actions';

function NFTView({
  address,
  blockchain,
  portal_continuation,
  setPortalContinuation,
  nfts,
  loading,
  error,
  completed,
  onScroll,
  onClick,
}: any): React.ReactElement {
  const ref = React.useRef<any>(null);
  const router = useRouter();

  function topFunction() {
    if (ref !== null && ref.current !== null) {
      ref.current.scrollTop = 0;
    }
  }

  if (loading)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100'>
        Loading...
      </div>
    );
  if (error)
    return (
      <div className='d-flex flex-row justify-content-center align-items-center w-100 h-100 text-red'>
        Error: {error.message}
      </div>
    );

  if (completed) {
    return (
      <>
        <style global jsx>
          {`
            .nft_gallery {
              height: 100%;
              max-height: calc(100% - 75px);
            }
            .wallet-grid {
              box-sizing: border-box;

              display: grid;
              grid-template-columns: repeat(5, 1fr);
              max-width: 1425px;
              width: 100%;

              grid-gap: var(30px);
              gap: var(30px);
              padding: 10px;
            }

            @media (max-width: 1380px) {
              .wallet-grid {
                grid-template-columns: repeat(4, 1fr);
              }
            }
            @media (max-width: 1150px) {
              .wallet-grid {
                grid-template-columns: repeat(3, 1fr);
              }
            }
            @media (max-width: 1000px) {
              .wallet-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (max-width: 768px) {
              .wallet-grid {
                grid-template-columns: repeat(1, 1fr);
              }
            }
          `}
        </style>
        <div
          ref={ref}
          onScroll={onScroll}
          className='overflow-y-scroll nft_gallery d-flex flex-column  align-items-center'>
          <div className='wallet-grid w-100'>
            {nfts
              ?.filter(({name, url}) => {
                return (
                  name !== '[WAITING TO BE SIGNED]' &&
                  name !== 'Unnamed item' &&
                  name !== '' &&
                  name !== 'Unnamed' &&
                  name !== 'Untitled' &&
                  url !== ''
                );
              })
              .map((nft?: any, key?: number) => {
                return (
                  <NFT_CARD
                    key={key}
                    rarible_data={nft}
                    onPress={(e) =>
                      onClick({
                        blockChain: nft.blockchain,
                        id: e,
                      })
                    }
                  />
                );
              })}
          </div>
        </div>
      </>
    );
  }

  return <div />;
}

const mapStateToProps = (state) => ({
  sdk: state.session.sdk,
  address: state.session.address,
  connection: state.session.connection,
  blockchain: state.session.blockchain,
  portal_continuation: state.session.portal_continuation,
});
export default redux(mapStateToProps, {setPortalContinuation})(NFTView);
