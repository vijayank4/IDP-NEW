import Cookies from 'js-cookie';

const GetCookies = (cookieName) => {
    if(cookieName !== '' && cookieName !== null && cookieName !== undefined)
    {
        const cookieObject = Cookies.get();
        return cookieObject[cookieName];
    }
    else
    {
        return cookieName;
    }
};

export default GetCookies;
