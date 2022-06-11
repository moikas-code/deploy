import React, {ReactNode, useEffect, useState, useContext} from 'react';
import {useRouter} from 'next/router';
import {connect as redux} from 'react-redux';
import {setSDK, setTab, setShowOptions} from '../actions/session';
import {truncateAddress} from '../lib/moiWeb3';
import Image from 'next/image';
import Blockies from 'react-blockies';
import {connector} from '../connector-setup';

import {ConnectorContext} from '../../src/components/connector/sdk-connection-provider';
// import dynamic from 'next/dynamic';
import Button from '../components/common/button';
import {Options} from '../sdk/sdk-wallet-connector';
import {ConnectOptions} from '../components/connect-options';

function Layout({
  sdk,
  children,
  address,
  blockchain,
  setShowOptions,
  showOptions,
  setSDK,
}: {
  sdk: any;
  children: (sdk: any) => JSX.Element;
  address: string;
  blockchain: string;
  setShowOptions: any;
  showOptions: boolean;
  setSDK: any;
}) {
  const connection = useContext(ConnectorContext);
  const [show, setShow] = useState<boolean>(false);
  // const [showOptions, setShowOptions] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    console.log(connection.state.status);
    connection.state.status == 'connected' && setShowOptions(false);
    let wallet =
      connection.state.connection &&
      connection.state.connection.wallet !== undefined
        ? connection.state.connection.wallet
        : null;

    setSDK({
      sdk: connection.sdk,
      address: connection.walletAddress,
      connection,
      blockchain:
        wallet !== null ? connection.state.connection.wallet.blockchain : '',
    });
  }, [sdk, address, connection, blockchain]);
  // console.log(connection)
  return (
    <>
      <style global jsx>
        {`
          html,
          body,
          #__next,
          #__next > div {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: end;
          }
          #__next {
            -moz-box-orient: vertical !important;
            -moz-box-direction: normal !important;
            flex-direction: column !important;
            -moz-box-pack: end !important;
            justify-content: flex-end !important;
            // display: -webkit-flex !important;
          }
          .navbar {
            background-color: #121111;
            z-index: 1;
            max-height: 100px;
            min-height: 80px;
          }
          .akkro-sub-menu {
            z-index: 2;
            top: 80px;
            right: 5px;
            min-height: 125px;
            width: 175px;
            background-color: #121111;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          }
          .bg-akkoro-dark {
            background-color: #121111;
          }
          .navbar-brand {
            min-height: 80px;
            cursor: pointer;
          }

          .content-wrapper {
            height: calc(100% - 100px);
            display: flex;
            align-self: bottom;
          }
          .status-text {
            font-size: 10px;
            text-align: center;
          }
          .login-btn {
            width: 5rem;
          }
          .create-btn {
            color: #fff;
          }
          .create-btn:hover {
            background-color: #eee;
            color: #000 !impotant;
            text-decoration: underline;
            font-weight: bold;
          }

          .profile-icon,
          .chain-icon {
            width: 25px !important;
            height: 25px !important;
            background-color: #eee;
            cursor: pointer;
          }
          .pointer {
            cursor: pointer;
          }
          .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          .overflow-y-scroll {
            overflow-y: scroll;
          }
          .z-2 {
            z-index: 2;
          }
          .z-3 {
            z-index: 3;
          }
        `}
      </style>
      {/* NAV BAR */}
      <div className='navbar d-flex flex-column justify-content-center align-items-center pt-0 pb-3 w-100'>
        <div className='d-flex flex-row justify-content-between align-items-center w-100 h-100  border-bottom border-light px-3'>
          {/* BRANDNAME */}
          <div className='navbar-brand m-0 d-flex flex-row justify-content-between align-items-center'>
            <a onClick={() => router.push('/')}>AKKOROS</a>
          </div>

          {/* CONNECT BUTTON and WALLET ADDRESS */}
          {/* We Are Currently In Pre-Alpha */}
          <div className='d-flex flex-row py-3 justify-content-center align-items-center'>
            {address !== null && address !== undefined && (
              <>
                <Button
                  buttonStyle='create-btn d-none d-sm-block mx-3 text-capitalize btn border rounded-pill text-capitalize w-100'
                  onPress={() => {
                    setShow(false);
                    router.push(
                      `/portal/create/${connection.blockchain.toLowerCase()}/`
                    );
                  }}>
                  create
                </Button>
                <br />
              </>
            )}
            <div className='d-flex flex-row position-relative'>
              {address !== null && address !== undefined ? (
                <div
                  className={`ps-4 d-none  d-sm-flex flex-row justify-content-center align-items-center`}>
                  <span
                    onClick={() => router.push('/portal/profile')}
                    className='d-flex flex-row justify-content-center align-items-center'
                    title={address !== undefined ? address : ''}>
                    <Blockies
                      seed={address !== null ? address + '' : ''}
                      size={7}
                      scale={4}
                      className='profile-icon d-flex flex-row justify-content-center align-items-center border border-white rounded-circle'
                    />
                  </span>
                </div>
              ) : (
                <Button
                  onPress={() => {
                    setShowOptions(!showOptions);
                    // console.log('object');
                  }}
                  buttonStyle=' login-btn mx-2 d-flex flex-row btn btn-outline-light'>
                  Log In
                </Button>
              )}
            </div>

            <Button
              onPress={() => setShow(!show)}
              buttonStyle=' btn btn-outline-light'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-list'
                viewBox='0 0 16 16'>
                <path
                  fill-rule='evenodd'
                  d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      {show && (
        <span className='akkro-sub-menu position-fixed d-flex flex-column justify-content-between align-items-center bg-akkoro-dark p-3 z-3'>
          <p className='pointer' title={address}>
            {truncateAddress(address)}
          </p>{' '}
          {address !== null && address !== undefined && (
            <>
              <Button
                buttonStyle='create-btn d-block d-sm-none mx-3 text-capitalize btn border rounded-pill text-capitalize w-100'
                onPress={() => {
                  setShow(false);
                  router.push(
                    `/portal/create/${connection.blockchain.toLowerCase()}/`
                  );
                }}>
                create
              </Button>
              <br />

              <Button
                buttonStyle='create-btn mx-3 text-capitalize btn border rounded-pill text-capitalize w-100'
                onPress={() => {
                  setShow(false);
                  router.push(`/portal/profile/`);
                }}>
                My Profile
              </Button>
              <br />
            </>
          )}
          <Button
            buttonStyle='create-btn mx-3 text-capitalize btn border rounded-pill text-capitalize w-100'
            onPress={() => {
              setShow(false);
              router.push(`/faq/`);
            }}>
            F.A.Q.
          </Button>
          <br />
        </span>
      )}
      <div className='position-relative content-wrapper d-flex flex-column mt-3 justify-content-start align-items-center'>
        {children}
        {showOptions && (
          <div className='position-absolute top-50 start-50 translate-middle h-100 w-100 bg-black d-flex justify-content-center align-items-center'>
            <ConnectOptions />
          </div>
        )}
      </div>
    </>
  );
}
const mapStateToProps = (state: any) => ({
  connection: state.session.connection,
  showOptions: state.session.showOptions,
  blockchain: state.session.blockchain,
});
export default redux(mapStateToProps, {setSDK, setTab, setShowOptions})(Layout);
