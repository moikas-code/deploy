import { connect } from 'react-redux';
import Modal from './common/modal';
import Button from './common/button';
import { login } from '../actions/';
import { event } from 'utility/analytics';

function LoginModal({
  handleShow = () => {
    return;
  },
  login,
}) {
  return (
    <Modal>
      <div className={`d-flex flex-row justifuy-content-between w-100`}>
        <div className={`d-flex flex-column w-100 align-items-start`}>
          <Button
            onPress={async () => {
              try {
                await login();
                await handleShow();
                await event({
                  action: 'login',
                });
              } catch (error) {
                console.log(error);
              }
            }}
            buttonStyle={'border border-dark'}
          >
            Connect With Metamask or Trust
          </Button>
        </div>
        <Button onPress={() => handleShow()}>Close</Button>
      </div>
    </Modal>
  );
}
export default connect(null, { login })(LoginModal);
