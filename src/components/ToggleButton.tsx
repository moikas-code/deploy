import {ReactNode, useEffect, useState} from 'react';

export default function ToggleButton({
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
