import {useState} from 'react';
import {truncateAddress} from '../lib/moiWeb3';
import WalletButtonItem from './walletbuttonitem';
function WalletButton({
  isConnected = false,
  address = '',
  onPress = () => {},
  onConnect = () => {},
}) {
  return (
    <div className={`position-relative  wallet-button h-100`}>
      <style jsx>
        {`
          .wallet-button {
            width: 175px;
            background-color: #fff;
          }
        `}
      </style>
      {isConnected ? (
        <div
          className={`wallet-button-address hover-blackflame d-flex flex-column align-items-center justify-content-center px-3 h-100 w-100 cursor-pointer`}
          onClick={() => {
            onPress();
          }}>
          {truncateAddress(address)}
        </div>
      ) : (
        <div
          className={`wallet-button-address hover-blackflame d-flex flex-column align-items-center justify-content-center px-3 h-100 w-100 cursor-pointer`}
          onClick={() => {
            onConnect();
          }}>
          CONNECT
        </div>
      )}
    </div>
  );
}
export default WalletButton;
