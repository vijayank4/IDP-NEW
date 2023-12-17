import { useState } from 'react';
import axios from 'axios';
import encryption from '../Cryptojs/Encryption';
import decryption from '../Cryptojs/Decryption';

const PostApi = async ( postUrl, postData ) => {
    const [apiResponse, setApiResponse] = useState('');
    try {
        const encryptedData = encryption(postData);
        const response = await axios.post(postUrl,  {encryptedData});
        setApiResponse(decryption(response.data));
    } catch (error) {
        setApiResponse(error.message);
    }
    return apiResponse;
};

export default PostApi;