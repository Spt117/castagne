import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Keypair } from "@solana/web3.js";
import { promises as fs } from 'fs';

if (process.argv.length < 4) {
  console.error('Usage: ts-node decodeKeypair.ts <privateKey> <outputFile>');
  process.exit(1);
}

const privateKeyFile = process.argv[2];
const outputFile = process.argv[3];

(async () => {
  try {
    const privateKeyBase58 = await fs.readFile(privateKeyFile, 'utf8');
    const privateKey = bs58.decode(privateKeyBase58.trim());

    const keypair = Keypair.fromSecretKey(privateKey);
    const publicKeyString = keypair.publicKey.toString();
    const secretKeyArray = Array.from(keypair.secretKey);

    console.log('Public Key:', publicKeyString);
    await fs.writeFile(outputFile, JSON.stringify(secretKeyArray, null, 2));

    console.log(`Keypair saved to ${outputFile}`);
  } catch (error) {
    console.error('Error decoding keypair:', error);
  }
})();
