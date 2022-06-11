const {NFTStorage, File} = require('nft.storage');
const {getFilesFromPath, filesFromPath} = require('files-from-path');
require('dotenv').config();
const fs = require('fs');
const token = process.env.NFT_STORAGE_KEY;
async function main() {
  const path = process.argv.slice(2);

  // File destination.txt will be created or overwritten by default.
  await fs.copyFile(__dirname+'/.env', __dirname+ '/out/env', async  (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
    const files = await getFilesFromPath(path);
  
    const storage = new NFTStorage({token});
    let cleanFiles = [];
    for await (const f of files) {
      console.log(f.name.replace('/out/', ''));
      f.name = f.name.replace('env', '.env');
      f.name = f.name.replace('/out', '');
      cleanFiles.push(f);
      // { name: '/path/to/me', stream: [Function: stream] }
    }
    await console.log(`storing ${files.length} file(s) from ${path},`);
    const cid = await storage.storeDirectory(files, {
      pathPrefix: path, // see the note about pathPrefix below
      hidden: false, // use the default of false if you want to ignore files that start with '.'
    });
    console.log(`ipfs://${cid}`);
  
    const content = `dnslink=/ipfs/${cid}`;
  
    const execSync = require('child_process').execSync;
    // import { execSync } from 'child_process';  // replace ^ if using ES modules
  
    const output = execSync(
      `vercel dns add takolabs.io _dnslink  TXT ${content}`,
      {encoding: 'utf-8'}
    ); // the default is 'buffer'
    console.log('Output was:\n', output);
    try {
      fs.writeFileSync(__dirname + '/dns.txt', content);
      //file written successfully
      console.log('witter', __dirname + '/dns.txt');
    } catch (err) {
      console.error(err);
    }
  
    const status = await storage.status(cid);
    console.log(status);
  });
}
main();
