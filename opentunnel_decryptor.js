const crypto = require('crypto');
const base64 = require('base-64');

function decrypt(encryptedContent) {
    const arrContent = encryptedContent.split('.');
    const salt = Buffer.from(arrContent[0].trim(), 'base64');
    const nonce = Buffer.from(arrContent[1].trim(), 'base64');
    const cipher = Buffer.from(arrContent[2].trim(), 'base64');
    
    const cipherText = cipher.slice(0, -16);
    const configEncPassword = "B1m93p$$9pZcL9yBs0b$jJwtPM5VG@Vg";
    
    const pbkdf2Key = crypto.pbkdf2Sync(configEncPassword, salt, 1000, 16, 'sha256');
    
    try {
        const decipher = crypto.createDecipheriv('aes-128-gcm', pbkdf2Key, nonce);
        const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
        return decrypted.toString('utf-8');
    } catch (e) {
        return "Failed to decrypt AES.";
    }
}

module.exports = { tnlDecryptor: decrypt };
