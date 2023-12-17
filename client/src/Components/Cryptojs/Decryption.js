import CryptoJS from 'crypto-js';

const Decryption = (getData) => {
    if(getData !== '' && getData !== null && getData !== undefined)
    {
        const secretKey = global.config.SECRET_KEY;
        const bytes = CryptoJS.AES.decrypt(getData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    else
    {
        return getData;
    }
};

export default Decryption;