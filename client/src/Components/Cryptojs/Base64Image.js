import { useState, useEffect } from 'react';
import axios from 'axios';
import encryption from '../Cryptojs/Encryption';

const Base64Image = (imageUrl) => {
    const [apiResponse, setApiResponse] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { 
                    'Content-Type': 'application/json'
                };
                const backendURL = global.config.BACKEND_URL;
                const postUrl = backendURL+'api/imgencrypt';
                const encryptedData = encryption(imageUrl);
                const response = await axios.post(postUrl, { encryptedData }, { headers });
                setApiResponse(response.data.encryptImgData);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [imageUrl]);
    return apiResponse;
};

export default Base64Image;