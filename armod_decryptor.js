const crypto = require('crypto');
const base64 = require('base-64');
const { unescape } = require('querystring');

const ENCRYPTION_KEY = "YXJ0dW5uZWw3ODc5Nzg5eA==";

function decryptConfig(encryptedConfig) {
    const key = Buffer.from(ENCRYPTION_KEY, 'base64');
    const cipher = crypto.createDecipheriv('aes-128-ecb', key, null);
    const decrypted = Buffer.concat([cipher.update(Buffer.from(encryptedConfig, 'base64')), cipher.final()]);
    return decrypted.toString('utf-8');
}

function processConfig(config) {
    const patternVmess = /^ar-(vmess):\/\//;
    const patternSSH = /^ar-(ssh|vless|socks|trojan-go|trojan|ssr):\/\//;

    if (patternVmess.test(config)) {
        const encryptedConfig = config.replace(patternVmess, '');
        const decryptedConfig = decryptConfig(encryptedConfig);
        const decodedConfig = unescape(decryptedConfig);
        return formatDecryptionResult("VMess", decodedConfig);
    } else if (patternSSH.test(config)) {
        const encryptedConfig = config.replace(patternSSH, '');
        const decryptedConfig = decryptConfig(encryptedConfig);
        const decodedConfig = unescape(decryptedConfig);
        return formatDecryptionResult("SSH", decodedConfig.replace(/&/g, '\n').replace(/\?/g, '\n'));
    } else {
        return "Invalid config or unlock config";
    }
}

function formatDecryptionResult(configType, decryptedConfig) {
    return `Decrypted ${configType} Config:\n${decryptedConfig}`;
}

module.exports = { processConfig };
