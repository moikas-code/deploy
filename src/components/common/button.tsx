import React from 'react';

export default function Button({
  children,
  ...props
}: {
  children: any;
  [key: string]: any;
}) {
  return (
    <button
    disabled={props.disabled}
      className={`${props.className ? props.className : ''} btn`}
      onClick={props.onClick}>
      {children}
    </button>
  );
}
