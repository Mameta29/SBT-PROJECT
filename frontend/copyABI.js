import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(
  __dirname,
  '../out/SoulboundToken.sol/SoulboundToken.json'
);
const destPath = path.resolve(__dirname, 'src/contracts/SoulboundToken.json');

async function copyABI() {
  try {
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(sourcePath, destPath);
    console.log('ABI file copied successfully');
  } catch (err) {
    console.error('Error copying ABI file:', err);
  }
}

copyABI();
