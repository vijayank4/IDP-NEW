import decryption from '../Cryptojs/Decryption';

export const GetApi = ( postUrl ) => {
    try {

        let xhr = new XMLHttpRequest();
        xhr.open("GET", postUrl, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
        const data = decryption(JSON.parse(xhr.responseText));
        return data;
        
    } catch (error) {
        return error;
    }
};