const express = require('express');
const { processConfig } = require('./armod_decryptor');
const { decryptFile } = require('./netmod_decryptor');
const { fileSockshttp } = require('./sockshttp_decryptor');
const { tnlDecryptor } = require('./opentunnel_decryptor');

const router = express.Router();

// Decrypt API route
router.post('/decrypt', (req, res) => {
    const encryptedContent = req.body.encryptedContent;
    if (!encryptedContent) {
        return res.status(400).json({ result: 'No encrypted content provided' });
    }
    try {
        const result = processConfig(encryptedContent);
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ result: `Error: ${error.message}` });
    }
});

// Decrypt file route
router.post('/decrypt-file', (req, res) => {
    const fileContent = req.body.fileContent;
    if (!fileContent) {
        return res.status(400).json({ result: 'No file content provided' });
    }
    try {
        const result = decryptFile(fileContent);
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ result: `Error: ${error.message}` });
    }
});

// Decrypt sockshttp file route
router.post('/file_sockshttp', (req, res) => {
    const fileContent = req.body.fileContent;
    if (!fileContent) {
        return res.status(400).json({ result: 'No file content provided' });
    }
    try {
        const result = fileSockshttp(fileContent);
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ result: `Error: ${error.message}` });
    }
});

// Decrypt opentunnel file route
router.post('/file_opentunnel', (req, res) => {
    const fileContent = req.body.fileContent;
    if (!fileContent) {
        return res.status(400).json({ result: 'No file content provided' });
    }
    try {
        const result = tnlDecryptor(fileContent);
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ result: `Error: ${error.message}` });
    }
});

module.exports = router;
