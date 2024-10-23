const crypto = require('crypto');
const base64 = require('base-64');

const configKeys = [
    "662ede816988e58fb6d057d9d85605e0",
    // Other keys...
];

function decrypt(encryptedContent, hideMes = false) {
    try {
        const configFile = JSON.parse(encryptedContent);
        const parts = configFile['d'].split('.');
        const iv = Buffer.from(parts[1], 'base64');
        const data = Buffer.from(parts[0], 'base64');

        const key = crypto.createHash('md5').update(configKeys[1] + " " + configFile['v']).digest('hex');
        const cipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key), iv);

        const decrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        return parseConfig(JSON.parse(decrypted.toString()), hideMes);
    } catch (error) {
        console.error(`Decryption failed! Error: ${error.message}`);
        return null;
    }
}

module.exports = { fileSockshttp: decrypt };
