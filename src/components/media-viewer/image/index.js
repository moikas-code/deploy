import React from 'react';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Image from 'next/image';
import styles from './styles.module.scss';
function arrayContains(needle, arrhaystack) {
  const haystack = arrhaystack
    .map((item) => {
      // /(https?|ftp):\/\/[\.[a-zA-Z0-9\/\-]+/
      // console.log(
      //   item,
      //   needle.split(
      //     /(https:\/\/rarible.mypinata.cloud\/ipfs\/)[\.[a-zA-Z0-9\/\-]+/g
      //   )[1]
      // );

      return needle.indexOf(item) > -1;
    })
    .filter(function (val) {
      return val == true;
    });
  // console.log([haystack], [haystack[0]].length > -1, [haystack]);
  return haystack.length > 0;
}
// function arrayContains(needle, arrhaystack) {
//   const haystack = arrhaystack
//     .map((item) => {
//       /(https?|ftp):\/\/[\.[a-zA-Z0-9\/\-]+/;

//       const regex = new RegExp(item, 'g'); // correct way

//       if (
//         needle
//           .replace(regex, 'https://akkoros.mypinata.cloud/ipfs/')
//           .split('ipfs/')[0] == 'https://akkoros.mypinata.cloud/'
//       ) {
//         return needle.replace(regex, 'https://akkoros.mypinata.cloud/ipfs/');
//       }
//     })
//     .filter(function (val) {
//       return val !== null && val !== undefined && val !== '';
//     });

//   return haystack.length > 0;
// }
export const ImageComponent = ({
  artifactUri,
  displayUri,
  previewUri,
  onDetailView,
  preview,
  displayView,
  styling,
}) => {
  let src = onDetailView ? artifactUri : displayUri || artifactUri;
  const [show, setShow] = React.useState(false);
  return (
    <div
      className={` d-flex flex-row justify-content-center align-items-center h-100 w-100`}>
      <style jsx>{`
        .mv-img {
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
          border-width: 0 px;
          border-style: solid;
          background-color: #fff;
          border-color: rgb(255, 255, 255);
          vertical-align: inherit;
          min-height: 0 px;
          min-width: 0 px;
          flex-shrink: 0;
          flex-direction: column;
          flex-basis: auto;
          display: flex;
          -webkit-box-align: stretch;
          align-items: stretch;
        }
        .mg-thumbnail {
          object-fit: contain;
        }
      `}</style>
      {arrayContains(src, [
        'akkoros.mypinata.cloud/ipfs/',
        'rarible.mypinata.cloud/ipfs/',
      ]) ? (
        <Image
          objectFit='contain'
          priority={true}
          quality={100}
          width={800}
          height={800}
          className={`${show ? 'd-block' : 'd-none'} mv-img mg-thumbnail`}
          src={src || ''}
          alt=''
          onLoadingComplete={() => {
            setShow(true);
          }}
        />
      ) : (
        <div className='h-100 '>
          <LazyLoadImage
            className={`lazy-loaded h-100`}
            src={src || ''}
            alt=''
          />
        </div>
      )}
    </div>
  );
};
