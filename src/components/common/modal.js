import {useEffect} from 'react';
import Button from './button';
export default function Modal({children, onClose,isAbsolute}) {
  useEffect(() => {}, []);
  return (
    <div className='modal z-2 bg-black d-block' tabIndex='-1' role='dialog'>
      <div
        className={`${
          isAbsolute ? 'position-absolute top-50 start-50 translate-middle' : 'mx-auto mt-5'
        } w-100 modal-dialog m-0 z-3`}
        role='document'>
        <div className='modal-content'>
          <Button onClick={() => onClose()}>Close</Button>
          <div className='modal-body'>{children}</div>
        </div>
      </div>
    </div>
  );
}
