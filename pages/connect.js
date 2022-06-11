import React from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {ConnectOptions} from '../src/views/connect/connect-options';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';

export default function Connect() {
  const router = useRouter();
  const connection = React.useContext(ConnectorContext);
  console.log(connection.state.status);
  return (
    <>
      <style jsx>{`
        .w-161 {
          width: 12.5rem;
        }
      `}</style>
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
        {connection.state.status !== 'connected' ? (
          <h4>Please Connect to Continue with App</h4>
        ) : (
          <h4>You Are Connected</h4>
        )}
        <br/>
        <ConnectOptions />
        <br />
        <Link href={'/'}>
          <a className='fnt-color-black text-decoration-none btn btn-outline-dark w-161'>
            Go Back
          </a>
        </Link>
      </div>
    </>
  );
}
