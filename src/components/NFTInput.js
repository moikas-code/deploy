import Input from './common/input.tsx';
import nft from '../lib/nft-storage';

export default function NFTInput({id, onChange, label, accept}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <Input
        type={'file'}
        accept={accept}
        inputStyle='w-100'
        onChange={async (e) => {
          e.target.files.length > 0
            ? nft.storeFileAsBlob(e.target.files[0]).then(async (data) => {
                onChange({
                  cid: data,
                  status: await nft.getCIDStatus(data),
                  fileType: e.target.files[0].type,
                });
              })
            : onChange({cid: ''});
          // data.length > 0
          //   ? onChange({
          //       cid: data,
          //       status: await nft.getCIDStatus(data),
          //       fileType: e.target.files[0].type,
          //     })
          //   : onChange({cid: data});
        }}
      />
    </>
  );
}
