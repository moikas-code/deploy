import React from 'react';
import dynamic from 'next/dynamic';
const MediaViewer = dynamic(() => import('../components/media-viewer'), {
  ssr: false,
});
async function checkURL(url) {
  try {
    let blob = await fetch('https://akkoros.herokuapp.com/' + url).then((r) =>
      r.blob()
    );
    let dataUrl = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    // now do something with `dataUrl`

    dataUrl = dataUrl.split(':')[1];
    dataUrl = dataUrl.split(';')[0];
    // console.log(dataUrl);
    if (dataUrl.includes('text')) {
      return 'image/SVG';
    }

    if (dataUrl.includes('application/octet-stream')) {
      return 'image/png';
    }
    return await dataUrl;
  } catch (error) {
    console.log(error);
    return 'image/png';
  }
}

function NFT_CARD({
  rarible_data,
  onPress,
}: {
  rarible_data: any;
  onPress: (e: any) => {};
}) {
  const [mimetype, setMimeType] = React.useState('');
  React.useEffect(() => {
    rarible_data &&
      rarible_data?.url !== undefined &&
      checkURL(rarible_data?.url).then(async (type) => {
        await setMimeType(type);
      });
  }, [rarible_data]);
  if (rarible_data == undefined) return <div>No NFT</div>;
  // console.log(rarible_data);

  return (
    <div>
      <style global jsx>
        {`
          .lazy-loaded {
            width: 100%;
          }
          .nft-card {
            width: 275px;
            min-height: 440px;
          }
          .nft-card .wrap {
            height: 100%;
            width: 100%;
            border: 3px solid var(--color-border);
            display: -webkit-flex;
            display: -moz-box;
            display: flex;
            align-items: start;
            -webkit-flex-direction: column;
            -moz-box-orient: vertical;
            -moz-box-direction: normal;
            flex-direction: column;
            -webkit-transition: all 0.1s;
            transition: all 0.1s;
            color: var(--color-black);
            font-weight: 400;
            text-decoration: none !important;
          }
          .card_thumbnail {
            width: 100%;
            position: relative;
            background-color: var(--color-black);
            background-size: contain;
            border-bottom: 3px solid var(--color-border);
          }
          .card_thumbnail img {
            -webkit-box-shadow: 0 2px 19px -7px rgb(0 0 0 / 67%);
            box-shadow: 0 2px 19px -7px rgb(0 0 0 / 67%);
          }

          .card_content {
            display: -webkit-flex;
            display: -moz-box;
            display: flex;
            -webkit-flex-direction: column;
            -moz-box-orient: vertical;
            -moz-box-direction: normal;
            flex-direction: column;
            padding: 8px;
            overflow-wrap: break-word;
            word-break: break-word;
            -webkit-flex-grow: 2;
            -moz-box-flex: 2;
            flex-grow: 2;
            -webkit-justify-content: space-between;
            -moz-box-pack: justify;
            justify-content: space-between;
          }

          @media (max-width: 1000px) {
            .nft-card {
              width: 345px;
              min-height: 506px;
            }
          }
        `}
      </style>
      <div
        className='nft-card border m-2 p-2 d-flex flex-row mx-auto align-items-start text-white'
        id={rarible_data?.id}
        onClick={() => onPress(rarible_data?.id)}>
        <div className='wrap  p-2'>
          <div className='card_thumbnail h-100 w-100 pb-3'>
            {/* {console.log(rarible_data?.media_type)} */}
            <MediaViewer
              // mimeType={rarible_data?.media_type}

              imageStyle='w-100 h-100 border border-white'
              // src={rarible_data?.url !== undefined ? rarible_data?.url : ''}

              mimeType={mimetype}
              previewUri={rarible_data.url}
              displayUri={rarible_data.url}
              artifactUri={rarible_data.url}
              type={'ipfs'}
            />
          </div>
          <div className='card_content d-flex flex-column mb-1 w-100'>
            <div className='text-truncate'>{rarible_data?.name}</div>
            <div>{rarible_data?.price}</div>
            <div>{rarible_data?.blockchain}</div>
          </div>
        </div>

        {/* <div className='p-2'>{item.meta.description}</div> */}
      </div>
    </div>
  );
}
export default NFT_CARD;
