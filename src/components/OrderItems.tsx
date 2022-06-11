import React, {useState, useEffect} from 'react';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import {truncateAddress} from '../lib/moiWeb3';
import {
  ItemId,
  BigNumber,
  toUnionAddress,
  OrderId,
  toBigNumber,
  ContractAddress,
} from '@rarible/types';
import Button from '../components/common/button';
import {connect} from 'react-redux';
import TAKO from '../tako';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';
type CreateCollectionRequest = /*unresolved*/ any;
type CreateCollectionBlockchains = /*unresolved*/ any;
function OrderItems({
  nid,
}: {
  // sdk: IRaribleSdk;
  nid: string;
}) {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;

  const [orderData, setOrderData] = React.useState([]);
  const [showOrders, setShowOrders] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const query = gql`
    query NFT_ORDER_DATA($input: QueryInput) {
      get_orders_by_nft_id(input: $input) {
        id
        platform
        status
        makeStock
        createdAt
        makePrice
        makePriceUsd
        maker
        make {
          type {
            type
            contract
            tokenId
          }
          value
        }
      }
    }
  `;

  const [get_orders_by_nft_id,{loading, error, data}] = useLazyQuery(query, {
    variables: {
      input: {
        address: nid,
      },
    },
    onCompleted: ({get_orders_by_nft_id}) => {
      console.log(get_orders_by_nft_id)
      if (
        typeof get_orders_by_nft_id !== 'undefined' &&
        get_orders_by_nft_id !== null
      ) {
        setOrderData(
          get_orders_by_nft_id.filter((order: any) => order.status === 'ACTIVE')
        );
        setCompleted(true);
      }
    },
  });
  React.useEffect(()=>{
    get_orders_by_nft_id({
      variables: {
        input: {
          address: nid,
        },
      },
    });
    
  },[nid])
  if (error) return null;
  if (loading) return null;

  if (completed) {
    return (
      <>
        <style global jsx>{`
          .order-content-wrapper {
            max-height: 155px;
            padding-bottom: 10px;
          }
          .order-content {
            overflow-y: scroll;
          }
        `}</style>

        <div className='order-content-wrapper d-flex flex-column justify-content-start align-items-start w-100 h-100'>
          Open Orders
          <div className='order-content d-flex flex-column justify-content-start align-items-start w-100 h-100  px-4'>
            {orderData.length > 0 ? (
              orderData.map((order: any, key) => {
                const id = order.id as OrderId;
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
                    <p className='mb-0 fs-6 px-2  '>
                      Platform:{' '}
                      <span className='mx-2 border-bottom'>
                        {order.platform}
                      </span>
                    </p>{' '}
                    <div className='d-flex flex-column flex-sm-row flex-lg-column justify-content-sm-start'>
                      <p className='fs-6 px-2'>
                        {' '}
                        For Sell:{' '}
                        <span className='mx-2 border-bottom'>
                          {order.makeStock}
                        </span>
                      </p>
                    </div>
                    {nid.split(':')[0] == blockchain ? (
                      <div>
                        <Button
                          onClick={async () => {
                            return await TAKO.buy_nft({
                              sdk,
                              amount: '1' as BigNumber,
                              order_id: id as OrderId,
                              blockchain: nid.split(':')[0],
                            }).catch((e) => {
                              console.log(e.message);
                              // setError(e.message)
                            });
                          }}
                          className='btn btn-outline-success w-100'>
                          Buy 1 of {order.makeStock} for
                          <span title={order.makePrice} className='mx-1'>
                            ${parseFloat(order.makePriceUsd).toFixed(4)} + 1%
                            Service Fee
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <>Connect With {nid.split(':')[0]} Wallet</>
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

  return null;
}
const mapStateToProps = (state: any) => ({
  connection: state.session.connection,
});
export default connect(mapStateToProps)(OrderItems);
