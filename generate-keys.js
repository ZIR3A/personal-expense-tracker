const crypto = require('crypto');

const generateKeyPair = (keyType) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return { publicKey, privateKey };
};

const accessKeys = generateKeyPair('access');
const refreshKeys = generateKeyPair('refresh');

require('fs').writeFileSync('keys/access-private.pem', accessKeys.privateKey);
require('fs').writeFileSync('keys/access-public.pem', accessKeys.publicKey);
require('fs').writeFileSync('keys/refresh-private.pem', refreshKeys.privateKey);
require('fs').writeFileSync('keys/refresh-public.pem', refreshKeys.publicKey);

console.log('Keys generated successfully');