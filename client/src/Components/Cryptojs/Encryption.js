import CryptoJS from 'crypto-js';

const Encryption = (postData) => {
    if(postData !== '' && postData !== null && postData !== undefined)
    {
        const secretKey = global.config.SECRET_KEY;
        return CryptoJS.AES.encrypt(postData, secretKey).toString();
    }
    else
    {
        return postData;
    }
};

export default Encryption;