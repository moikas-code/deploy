
function WalletButtonItem({
  text = '',
  onPress = () => {
    console.log('connecting...');
  },
  walletItemStyle = '',
}:{text:string, onPress:() => void, walletItemStyle?:string}) {
  return (
    <div
      className={`wallet-button-item pointer d-flex flex-row justify-content-start border-start border-bottom border-dark ps-2 me-1 ${walletItemStyle}`}
      onClick={() => onPress()}
    >
      {text}
    </div>
  );
}
export default WalletButtonItem;
