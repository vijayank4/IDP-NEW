import Cookies from 'js-cookie';

const generateSessionId = (user_data) => {

    const sessionTime = global.config.SESSION_TIME;
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + (sessionTime * 60 * 1000));
    let currentSessionTime = currentDate.getTime() + (sessionTime * 60 * 1000);
    Cookies.set('access_user', user_data, { expires: expirationDate });
    Cookies.set('session_time', currentSessionTime, { expires: expirationDate });
};

export default generateSessionId;