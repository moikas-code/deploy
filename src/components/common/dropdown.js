import { useRef, useEffect, useState } from 'react';
export default function Dropdown({ children, dropdownStyle }) {
  const [state, setState] = useState({ show: false });
  return (
    <>
      <style jsx>
        {`
          .moi-dropdown {
            cursor: pointer;
          }
        `}
      </style>
      <div
        className={`moi-dropdown border border-dark card p-1 my-1 ${dropdownStyle}`}
        onClick={() => setState({ ...state, show: !state.show })}
      >
        {!state.show ? <div>Click To Preview Metadata</div> : <> {children}</>}
      </div>
    </>
  );
}
