import React from 'react';
import {useRouter} from 'next/router';
//@ts-ignore
import TAKO from '@/src/tako';
import SEO from '../SEO';
import Button from '../common/button';
import SearchBar from '../Searchbar';
import {ConnectorContext} from '../connector/sdk-connection-provider';
import OrderWidget from '../OrderWidget';
export default function _Index() {
  const router = useRouter();
  const [hideHowTo, setShowHowTO] = React.useState(true);
  const [address, setAddress] = React.useState('');
  const [err, setErr] = React.useState('');
  const [showErr, setShowErr] = React.useState(false);
  return (
    <>
      <SEO
        title='Tako Labs'
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <style jsx>
        {`
          .mt-neg-5 {
            margin-top: -5rem;
          }
          .explorer {
            max-width: 600px;
            width: 100%;
            padding: 1rem;
          }
          .how-to-card {
            max-width: 25.5rem;
            width: 100%;
          }
          .how-to-card p {
            margin-bottom: 0;
          }
        `}
      </style>
      <div className='h-100 w-100 d-flex flex-column p-2'>
       
        {/* <div className=' d-inline-flex flex-column p-2 mb-3 explorer'>
          <div className='d-flex flex-column'>
            <SearchBar
              placeholder={
                'ETHEREUM:0x1337694208oO8314Bf3ac0769B87262146D879o3'
              }
              label={'Enter Address (Collection,User,NFT)'}
              value={address}
              errorMessage={err}
              isError={err.length > 0}
              onSubmit={(): any => {
                TAKO.validateAddress(address)
                  .then((res) => {
                    if (res.isValid) {
                      setErr('');
                      setShowErr(false);
                      router.push(`/o/${res.address}`);
                    } else {
                      console.log('res', res);
                      setErr(res.error);
                      setShowErr(true);
                    }
                  })
                  .catch((err) => {
                    console.log('err', err);
                    setErr(err);
                    setShowErr(true);
                  });
              }}
              onChange={(e) => setAddress(e)}
            />
            <span className='position-relative d-block w-100'>
              <Button
                className='btn btn-outline-dark'
                onClick={() => setShowHowTO(!hideHowTo)}>
                How to Query
              </Button>
              {!hideHowTo && (
                <div className='how-to-card d-flex flex-column justify-content-center my-3 position-absolute bg-white p-3 border border-dark'>
                  <p className='w-100'>
                    NFT - BLOCKCHAIN:COLLECTION_ADDRESS:NFT_ID
                  </p>
                  <p>USER - BLOCKCHAIN:ADDRESS</p>
                  <p>COLLECTION - BLOCKCHAIN:ADDRESS</p>
                </div>
              )}
            </span>
          </div>
        </div> */}
        <OrderWidget />
      </div>
    </>
  );
}
