import React from 'react';
import {toUnionAddress} from '@rarible/types';
import NFT_CARD from '../components/nft_card';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import {connect as redux} from 'react-redux';

function Wallet({
  address,
  connection,
  portal_continuation,
}: any): React.ReactElement {
  const router = useRouter();
  const [walletData, setWalletData] = React.useState([]);
  const [completed, setCompleted] = React.useState(false);
  const query = gql`
    query WalletNFTS($input: RaribleInput) {
      get_items_by_owner(input: $input) {
        totalSupply
        nfts {
          id
          name
          blockchain
          price
          url
        }
      }
    }
  `;

  const [get_items_by_owner, {loading, error, data}] = useLazyQuery(query, {
    variables: {
      input: {
        address: connection.blockchain + ':' + address,
      },
    },
    onCompleted: ({get_items_by_owner}) => {
      if (get_items_by_owner !== null) {
        setWalletData(get_items_by_owner);
        setCompleted(true);
      }
    },
  });

  React.useEffect(() => {
    connection !== null && address !== undefined && get_items_by_owner();
  }, [connection, address]);

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
        <style jsx>
          {`
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
        <div className=' d-flex flex-column  align-items-center h-100'>
          <h6 className='text-center mt-2'>
            My Collection: <p>{walletData?.totalSupply} Owned</p>
          </h6>

          <div className='wallet-grid w-100 h-100'>
            {walletData.nfts?.map((nft?: any, key?: number) => {
              return (
                <NFT_CARD
                  key={key}
                  rarible_data={nft}
                  onPress={(e): any => {
                    return e;
                  }}
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
  portal_continuation: state.session.portal_continuation,
});
export default redux(mapStateToProps, {})(Wallet);
