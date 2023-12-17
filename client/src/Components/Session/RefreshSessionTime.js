import { useEffect } from 'react';
import Cookies from 'js-cookie';
import GetCookies from './GetCookies';
import { useNavigate } from 'react-router-dom';
const routeProject = global.config.ROUTE_NAME;
const RefreshSessionTime = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(GetCookies('access_user') !== undefined)
        {
            if(GetCookies('session_time') !== undefined)
            {
                if(GetCookies('session_time') > new Date().getTime())
                {
                    const expirationTime = global.config.SESSION_TIME;
                    const currentDate = new Date();
                    const expirationDate = new Date(currentDate.getTime() + (expirationTime * 60 * 1000));
                    let currentSessionTime = currentDate.getTime() + (expirationTime * 60 * 1000);
                    Cookies.set('access_user', GetCookies('access_user'), { expires: expirationDate });
                    Cookies.set('session_time', currentSessionTime, { expires: expirationDate });
                }             
            }
            else
            {
                const expirationTime = global.config.SESSION_TIME;
                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + (expirationTime * 60 * 1000));
                let currentSessionTime = currentDate.getTime() + (expirationTime * 60 * 1000);
                Cookies.set('session_time', currentSessionTime, { expires: expirationDate });
            }
        }
        else
        {
            navigate(routeProject+"/sessionexpired");
        }
    }, [navigate]);
};

export default RefreshSessionTime;