const crypto = require('crypto');
const base64 = require('base-64');

const KEY = "X25ldHN5bmFfbmV0bW9kXw==";

function decrypt(encryptedData) {
    try {
        const keyBytes = Buffer.from(KEY, 'base64');
        const decipher = crypto.createDecipheriv('aes-128-ecb', keyBytes, null);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'base64')), decipher.final()]);
        return decrypted.toString('utf-8');
    } catch (error) {
        return `Error during decryption: ${error.message}`;
    }
}

module.exports = { decryptFile: decrypt };
