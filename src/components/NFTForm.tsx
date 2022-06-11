import {ReactNode, useEffect, useState, useContext} from 'react';
import NFTInput from './NFTInput';
import Button from './common/button';
import {connect} from 'react-redux';
import Select from 'react-select';
// @ts-ignore
import {_metadata, _metadataTypes} from '../lib/metadataSchema.ts';
import FormInputs from './FormInputs';

import nft from '../lib/nft-storage';
import MediaViewer from './media-viewer';
import {MintRequest} from '@rarible/sdk/build/types/nft/mint/mint-request.type';
import {PrepareMintResponse} from '@rarible/sdk/build/types/nft/mint/domain';
import {
  toUnionAddress,
  UnionAddress,
  BigNumber,
  toBigNumber,
} from '@rarible/types';
import Input from './common/input';
import TAKO from '../tako';
import {ConnectorContext} from './connector/sdk-connection-provider';

// import {BigNumber} from 'ethers';

type MintFormProps = FormProps<MintRequest> & {
  response: PrepareMintResponse;
};
interface NFTFormProps extends MintFormProps {
  address: UnionAddress;
  sdk: any;
  wallerAddress: any;
}

function ToggleButton({
  label,
  getToggleStatus,
  defaultStatus = false,
}: {
  label?: string | ReactNode;
  getToggleStatus: (e: any) => boolean;
  defaultStatus?: boolean;
}) {
  const [selected, toggleSelected] = useState<boolean>(defaultStatus);

  useEffect(() => {
    getToggleStatus(selected);
  }, [selected]);
  return (
    <>
      <style jsx>{`
        .toggle-container {
          width: 70px;
          background-color: #c4c4c4;
          cursor: pointer;
          user-select: none;
          border-radius: 3px;
          padding: 2px;
          height: 32px;
          position: relative;
        }

        .dialog-button {
          font-size: 14px;
          line-height: 16px;
          font-weight: bold;
          cursor: pointer;
          background-color: #002b49;
          color: white;
          padding: 8px 12px;
          border-radius: 18px;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          min-width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 38px;
          min-width: unset;
          border-radius: 3px;
          box-sizing: border-box;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          position: absolute;
          top: 0;
          left: 34px;
          transition: all 0.3s ease;
        }

        .disabled {
          background-color: #707070;
          left: 0px;
        }
      `}</style>
      <div className='d-flex flex-column justify-content-center align-items-start'>
        <p className='mb-0 me-2'>{label}</p>

        <div
          className='toggle-container  mx-2'
          onClick={() => {
            toggleSelected(!selected);
          }}>
          <div className={`dialog-button h-100 ${selected ? '' : 'disabled'}`}>
            {selected ? '✔' : '❌'}
          </div>
        </div>
      </div>
    </>
  );
}

function NFTForm({address, onSubmit, response}: NFTFormProps) {
  const connection = useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;
  const [collection, setCollectionAddress] = useState<UnionAddress>(
    'ETHEREUM:0xb6837da7da62faedd38257658b240cfa123ef601' as UnionAddress
  );
  const [supply, setSupply] = useState<number>(1);
  const [lazyMint, setLazyMint] = useState<boolean>(true);
  const [royalties, setRoyalties] = useState<number>(0);
  const [currency, setCurrency] = useState<any>({
    value: {id: '1', '@type': 'ETH'},
    label: 'ETH',
  });
  const [currencyOptions, setCurrencyOptions] = useState<any>([]);
  const [sell_price, setSell_Price] = useState(0);
  const [sell_toggle, setSell_Toggle] = useState(true);

  const [state, setState] = useState({
    ..._metadata,
    type: '',
    attributes: [],
    token: '',
    disable: true,
    showInput: false,
    showMedia: false,
    isLoading: false,
    cid: '',
    canMint: false,
  });

  const handleFormResponses = (e: any, data: any) => {
    if (
      _metadataTypes[data + 'Type'] == 'string' ||
      _metadataTypes[data + 'Type'] == 'url' ||
      _metadataTypes[data + 'Type'] == 'color'
    ) {
      setState({...state, [data]: e.target.value});
    }
  };
  useEffect(() => {
    process.env.AKKORO_ENV == 'prod' &&
      setCollectionAddress(
        toUnionAddress('ETHEREUM:0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8')
      );
    TAKO.getCurrencyOptions(blockchain).then((options: any[]) => {
      console.log(options);
      setCurrency({
        value: {id: '1', '@type': 'ETH'},
        label: 'ETH',
      });
      setCurrencyOptions(
        blockchain == 'ETHEREUM'
          ? [
              {
                value: {id: '1', '@type': 'ETH'},
                label: 'ETH',
              },
              ...options,
            ]
          : options
      );
    });
    switch (blockchain) {
      case 'ETHEREUM':
        process.env.AKKORO_ENV == 'prod' &&
          setCollectionAddress(
            toUnionAddress(
              'ETHEREUM:0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8'
            )
          );
        break;
      case 'TEZOS':
        process.env.AKKORO_ENV == 'prod'
          ? setCollectionAddress(
              toUnionAddress('TEZOS:KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS')
            )
          : setCollectionAddress(
              toUnionAddress('TEZOS:KT1BMB8m1QKqbbDDZPXpmGVCaM1cGcpTQSrw')
            );
        break;
      case 'FLOW':
        process.env.AKKORO_ENV == 'prod'
          ? setCollectionAddress(
              toUnionAddress('FLOW:A.01ab36aaf654a13e.RaribleNFT')
            )
          : setCollectionAddress(
              toUnionAddress('FLOW:A.ebf4ae01d1284af8.RaribleNFT')
            );
        break;
      default:
        break;
    }
  }, []);
  const error = validate(state.token, supply, response);
  return (
    <>
      <style global jsx>
        {`
          .nft-mint-form {
            overflow-y: scroll;
          }
          .form-mx {
            max-width: 800px;
          }
          input {
            width: 100% !important;
          }
          .file-widget {
            max-width: 18.75rem;
            max-width: 37.5rem;
          }
          .royalty-btn {
            min-width: 4.6875rem;
            margin: 0.5rem;
          }
          .nft-img-preview img {
            object-fit: contain;
          }
          .nft-img-preview img,
          .nft-video-preview video {
            max-height: 300px;
          }
          .loader {
            position: fixed; /* Sit on top of the page content */
            top: 0;
            left: 0;
            background-color: grey;
            z-index: 100; /* Specify a stack order in case you're using a different order for other elements */
            cursor: pointer; /* Add a pointer on hover */
            opacity: 50%;
          }
          .loader div {
            opacity: 100%;
          }
        `}
      </style>
      <div
        className={
          'nft-mint-form d-flex flex-column justify-content-center align-items-center'
        }>
        <div className='rounded overflow-md-scroll d-flex flex-column justify-content-between align-items-center p-1 h-100 w-100'>
          <div className='d-flex  flex-column  flex-wrap justify-content-around align-items-center mx-2 w-100'>

          </div>
        </div>
      </div>
      {state.isLoading && (
        <div
          className={`w-100 h-100 loader d-flex flex-column justify-content-center align-items-center`}>
          <div className='mx-auto text-uppercase mb-3'>
            Minting NFT
            <hr />
          </div>
          <div className='spinner-border mx-auto' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}


export default NFTForm;

function validate(uri: string, supply: any, prepareResponse: any) {
  const a = parseInt(supply);
  if (isNaN(a)) {
    return 'supply can not be parsed';
  }
  return undefined;
}
