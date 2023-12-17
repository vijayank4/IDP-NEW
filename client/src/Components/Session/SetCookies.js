import Cookies from 'js-cookie';

const SetCookies = (cookieName, cookieData, expireTime) => {
    if(cookieData !== '' && cookieData !== null)
    {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + (expireTime * 60 * 1000));
        Cookies.set(cookieName, cookieData, { expires: expirationDate });
    }
    else
    {
        return cookieData;
    }
};

export default SetCookies;
