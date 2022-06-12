import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';

import Select from 'react-select';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/common/button';
// @ts-ignore
import Modal from '@/src/components/common/modal';
// @ts-ignore
import Input from '@/src/components/common/input';
// @ts-ignore
import ToggleButton from '@/src/components/ToggleButton';
// @ts-ignore
import TAKO from '@/src/tako';
import {gql, useLazyQuery} from '@apollo/client';
// @ts-ignore
import {_metadata, _metadataTypes} from '../src/lib/metadataSchema';
// @ts-ignore
import FormInputs from '../src/components/FormInputs';
// @ts-ignore
import nft from '../src/lib/nft-storage';
// @ts-ignore
import MediaViewer from '../src/components/media-viewer';

import Navbar from '../src/components/Navbar';
import {
  toUnionAddress,
  UnionAddress,
  BigNumber,
  toBigNumber,
} from '@rarible/types';
import NFTInput from '../src/components/NFTInput';
import {ConnectOptions} from '../src/views/connect/connect-options';
import {setDefaultResultOrder} from 'dns/promises';
type MintFormProps = any;
interface NFTFormProps extends MintFormProps {
  address: UnionAddress;
  sdk: any;
  wallerAddress: any;
}

export default function Dragon() {
  const router = useRouter();
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;

  const _blockchain =
    typeof connection?.walletAddress?.split(':')[0] !== 'undefined'
      ? connection?.walletAddress?.split(':')[0]
      : '';
  const _address: string = connection.walletAddress?.split(':')[1];

  const [contractAddress, setContractAddress] = useState<any>(null);
  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [continuation, setContinuation] = useState<string | string[]>('');
  const [collections, setCollections] = useState<Array<any>>([]);
  const [_error, setError] = useState<any>('');
  const [assetType, setAssetType] = useState<any>('');
  const [contract, setContract] = useState<any>({
    name: '',
    symbol: '',
    baseURI: '',
    contractURI: '',
    isUserToken: false,
    operators: [],
  });
  const query = gql`
    query Collections($input: QueryInput!) {
      Owned_Collections(input: $input) {
        total
        continuation
        collections {
          id
          parent
          blockchain
          type
          name
          symbol
          owner
          features
          minters
          meta {
            name
            description
            content {
              width
              height
              url
              representation
              mimeType
              size
            }
            externalLink
            sellerFeeBasisPoints
            feeRecipient
          }
        }
      }
    }
  `;
  const [Owned_Collections, {loading, error, data}] = useLazyQuery(query, {
    onCompleted: async ({Owned_Collections}) => {
      if (Owned_Collections !== null && Owned_Collections !== undefined) {
        let cleanCollections: Array<any> = [];
        for await (var collection of Owned_Collections.collections.filter(
          ({features}) =>
            features.includes('MINT_WITH_ADDRESS' || 'MINT_AND_TRANSFER')
        )) {
          async function getNFTTotal(id) {
            const nftTotal = await TAKO.get_nfts_by_collection({
              sdk,
              collection: id,
            });
            return nftTotal.total;
          }

          const total = await getNFTTotal(collection.id);
          if (
            ![
              'POLYGON:0xe9722a06a7f2ec8523c1aa70cbead9743c7e776c',
              'POLYGON:0x2a890a07f9805f1338f4c6aede84ec45b77fa335',
              'POLYGON:0x37f5694f04bd9a9c6c0d2c2629f6a70bbfdef3ff',
              'ETHEREUM:0x2e24c674ac13eff59c0e289ceb63e0c8e696e152',
              'POLYGON:0x05dd2e2986a5bde3dd98fd49f7f7e4c0517c8811',
              'POLYGON:0x72922f1de9a9a7b19009e9b05b918f29280e0ce1',
              'POLYGON:0x5ed105bb186613163169685519ac8ec7c2f1aa48',
              'POLYGON:0x761769937e86a838ec63acca2f035cefdec12c0c',
              'POLYGON:0xa92d3e618f54817c53ec7e92f24659eff59e7a02',
              'POLYGON:0xc50ab6be157f08020787b8cb11d631fcce78e3dd',
              'POLYGON:0xc58529ab24db69a2a4d8aeb3ed1a9f50dbf16fa1',
              'POLYGON:0xfd5af2d8acb567fe8033112b4398351147d6d358',
              'POLYGON:0x3c798ac3ba87a9abd550c3040862f14508b87308',
              'POLYGON:0x84842a1c4016c917c64c2b52664f264d1876eda4',
              'POLYGON:0x4cb1bc245fe0f0e1e15ec9d97fe00479079f5cb9',
              'POLYGON:0x99e508775089e093c0adb0e25a5573d5f2fca4a8',
            ].includes(collection.id)
          ) {
            cleanCollections.push({
              label: `${collection.name} | ${collection.type} | # of items: ${total}`,
              value: collection.id,
              type: collection.type,
              total,
            });
          }
        }

        setCollections(cleanCollections.sort((a, b) => b.total - a.total));

        setComplete(true);
      }
    },
  });

  useEffect((): any => {
    typeof _address !== 'undefined' &&
      typeof _blockchain !== 'undefined' &&
      Owned_Collections({
        variables: {
          input: {
            blockChain: _blockchain,
            address: _address,
            continuation: continuation,
            size: 100,
          },
        },
      });
    setContract({
      ...contract,
      operators: [
        `${
          _blockchain === 'POLYGON' || _blockchain === 'ETHEREUM'
            ? 'ETHEREUM'
            : _blockchain
        }:${_address}`,
      ],
    });
    return () => {
      setComplete(false);
    };
  }, [_address, _blockchain]);

  function getDeployRequest(_blockchain: string) {
    switch (_blockchain) {
      case 'POLYGON':
      case 'ETHEREUM':
        return {
          blockchain: _blockchain as any,
          asset: {
            assetType: assetType.value,
            arguments: {
              name: contract.name,
              symbol: contract.symbol,
              baseURI: contract.baseURI,
              contractURI: contract.contractURI,
              isUserToken: contract.isUserToken,
              operators: contract.operators,
            },
          },
        } as any;
      case 'TEZOS':
        return {
          blockchain: _blockchain as any,
          asset: {
            assetType: assetType.value,
            arguments: {
              name: contract.name,
              symbol: contract.symbol,
              contractURI: contract.contractURI,
              isUserToken: contract.isUserToken,
              operators: contract.operators,
            },
          },
        } as any;
      default:
        throw new Error('Unsupported blockchain');
    }
  }

  if (loading) {
    return (
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
        <h1>Deploy | Tako Labs</h1>
        <hr />
        <p>Deploy Your NFT Contracts with Us ❤</p>
        <p>We Support: Ethereum, Polygon, and Tezos</p>
        <br />
        Loading
      </div>
    );
  }
  return (
    <>
      <style jsx>
        {`
          .nft-form {
            max-width: 800px;
          }
          .nft-wrapper {
            width: 200px;
          }
          .icon-wrapper {
            height: 300px;
            max-width: 800px;
          }
        `}
      </style>
      <SEO
        title={`Tako Labs - DEPLOY`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <Navbar />
      {connection.state.status === 'disconnected' ||
      connection.state.status === 'initializing' ||
      connection === undefined ||
      typeof connection === 'undefined' ? (
        <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
          <h1>Deploy | Tako Labs</h1>
          <hr />
          <p>Deploy Your NFT Contracts with Us ❤</p>
          <p>We Support: Ethereum, Polygon, and Tezos</p>

          <p>Please Connect to Continue with App</p>
          <Button
            className={'btn btn-outline-dark'}
            onClick={() => {
              router.push('/connect');
            }}>
            Connect
          </Button>
          <br />
        </div>
      ) : !show ? (
        <div className='nft-form w-100 d-flex flex-column justify-content-center mx-auto border border-dark m-5'>
          <div className='d-flex flex-column m-3'>
            <p>Your Network: {_blockchain}</p>
            <Input
              label={'Collection Name* (min. 3 characters)'}
              value={contract.name}
              onChange={(e) => setContract({...contract, name: e.target.value})}
              type='text'></Input>
            <Input
              label={'Collection Symbol* (min. 2 characters)'}
              value={contract.symbol}
              onChange={(e) =>
                setContract({...contract, symbol: e.target.value})
              }
              type='text'></Input>
            <div className=' my-1'>
              <p className='mb-0'>Contract Type* (select one)</p>
              <Select
                className='text-black h-100 w-100'
                options={((): any => {
                  switch (_blockchain) {
                    case 'POLYGON':
                    case 'ETHEREUM':
                      return [
                        {label: 'ERC721 (Singles)', value: 'ERC721'},
                        {label: 'ERC1155 (Multiples)', value: 'ERC1155'},
                      ];
                    case 'TEZOS':
                      return [{label: 'NFT', value: 'NFT'}, ,];

                    default:
                      break;
                  }
                })()}
                value={assetType}
                onChange={(e) => {
                  setAssetType(e);
                  // console.log(e);
                }}
              />
            </div>
            <ToggleButton
              label={'Allow Public Minting?'}
              getToggleStatus={(res) => {
                setContract({...contract, isUserToken: !res});
              }}
            />
            <div className='my-3'>
              <Button
                className={`btn-outline-dark`}
                onClick={() => {
                  setShowOptions(!showOptions);
                }}>
                Advanced Options:
              </Button>
              {showOptions && (
                <div className=' mt-3 d-flex flex-column'>
                  <Input
                    label={'Contract URI'}
                    value={contract.contractURI}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        contractURI: e.target.value,
                      })
                    }
                    type='text'></Input>
                  <Input
                    label={'Base URI'}
                    value={contract.baseURI}
                    onChange={(e) =>
                      setContract({...contract, baseURI: e.target.value})
                    }
                    type='text'></Input>
                </div>
              )}
            </div>
            {
              <Button
                disabled={
                  contract.name.length < 3 ||
                  contract.symbol.length < 2 ||
                  assetType.length < 1
                }
                className={`btn-outline-dark`}
                onClick={async () => {
                  console.log(getDeployRequest(_blockchain as any));
                  setShow(true);
                  TAKO.createCollection(
                    sdk,
                    getDeployRequest(_blockchain as any)
                  )
                    .then((res) => {
                      console.log(res);

                      if (res.code === 4001) {
                        setShow(false);
                        setError('User Cancelled Transaction');
                      } else if (res.code === parseInt('-32603')) {
                        setShow(false);
                        setError('Transaction Underpriced, Please Try Again and Check your Gas');
                      } else {
                        setContractAddress(res);
                      }
                    })
                    .catch((err) => {
                      console.log(err, err.code == 4001);
                      if (err.code == 4001) {
                        setShow(false);
                      }
                    });
                }}>
                Deploy
              </Button>
            }
            <p className='mx-auto'>
              Make sure to check your Gas before you approve to ensure your
              transaction goes through
            </p>
            <br />
            <p>{_error}</p>
          </div>
        </div>
      ) : (
        <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
          <h1>Deploy | Tako Labs</h1>
          <hr />
          <p>Deploy Your NFT Contracts with Us ❤</p>
          <p>We Support: Ethereum, Polygon, and Tezos</p>

          {contractAddress === null ? (
            <p>Deploying</p>
          ) : (
            <p>
              Your Contract Address:{' '}
              <a
                target={'_blank'}
                href={`https://rarible.com/collection/${
                  contractAddress.split(':')[0] === 'ETHEREUM'
                    ? ''
                    : contractAddress.split(':')[0].toLowerCase()
                }/${contractAddress.split(':')[1]}/items`}>
                {contractAddress.split(':')[1]}
              </a>
            </p>
          )}
          <Button
            disabled={false}
            className={`btn-outline-dark`}
            onClick={async () => {
              setShow(false);
              setError('');
              setContract({
                name: '',
                symbol: '',
                baseURI: '',
                contractURI: '',
                isUserToken: false,
                operators: [],
              });
            }}>
            Close
          </Button>
        </div>
      )}
    </>
  );
}
