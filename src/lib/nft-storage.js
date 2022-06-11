import { NFTStorage, File, Blob } from 'nft.storage';
const api = process.env.NFT_STORAGE_KEY;
const nft_storage = new NFTStorage({ token: api });
class NFT_STORAGE {
  /**********
   * NFT ACTIONS
   * **************/
   getCIDStatus = async (cid) => {
    try {
      const cidStatus =
        nft_storage !== undefined && (await nft_storage.status(cid));
      return cidStatus;
    } catch (error) {
      throw error;
    }
  };
  // Deletes a CID
   deleteByCID = async (cid) => {
    try {
      const cidStatus =
        nft_storage !== undefined && (await nft_storage.delete(cid));
      return cidStatus;
    } catch (error) {
      throw error;
    }
  };
  // Check if CID is valid
   checkByCID = async (cid) => {
    try {
      const cidStatus =
        nft_storage !== undefined && (await nft_storage.check(cid));
      return cidStatus;
    } catch (error) {
      throw error;
    }
  };
  //Stores File and Returns IPFS CID
   storeAsFile = async (file) => {
    try {
      const _file = new File([file], file[0].name, file[0].type);
      return _file;
    } catch (error) {
      throw error;
    }
  };
  //Stores File Blob and Returns IPFS CID
   storeFileAsBlob = async (file) => {
    try {
      const cid =
        nft_storage !== undefined &&
        (await nft_storage.storeBlob(
          new Blob([Array.isArray(file) ? file[0] : file])
        ));
      return cid;
    } catch (error) {
      throw error;
    }
  };

  //Stores Multiple Files Into Directory and Returns IPFS CID
   storeMultiFile = async (files) => {
    let _files = [];
    let i = 0;
    try {
      for await (var file of files) {
        const _file = new File([file], i);
        _files.push(_file);
      }

      const cid =
        nft_storage !== undefined && (await nft_storage.storeDirectory(_files));

      return cid;
    } catch (error) {
      throw error;
    }
  };
}
const nft = new NFT_STORAGE();
export default nft;