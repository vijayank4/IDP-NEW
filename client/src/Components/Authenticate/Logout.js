import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import encryption from '../Cryptojs/Encryption';
import decryption from '../Cryptojs/Decryption';
import GetCookies from '../Session/GetCookies';
import Cookies from 'js-cookie';
import toastr from 'toastr';

function Logout() {
    const navigate = useNavigate();
    const shouldLog = useRef(true);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (shouldLog.current) 
        {
            setLoading(true)
            if(GetCookies('access_user') !== undefined)
            {
                shouldLog.current = false;
                const userData = JSON.parse(decryption(GetCookies('access_user')));
                const postData = JSON.stringify({user_id:userData['login_id']});
                const encryptedData = encryption(postData);
                const apiUrl = global.config.PUBLIC_URL+'/api/logout';
                async function fetchData() {
                    try {
                        const response = await axios.post(apiUrl, {encryptedData});
                        if(response.status === 200)
                        {
                            setLoading(true);
                            const cookieNames = Object.keys(Cookies.get());
                            cookieNames.forEach(cookieName => Cookies.remove(cookieName));
                            window.location.href = global.config.ROUTE_NAME+"/login"; 
                        }
                    } 
                    catch (error) 
                    {
                        setLoading(false)
                        toastr.error(error.message+'!', 'Error', {
                            timeOut: 3000,
                            progressBar: true,
                            closeButton: true,
                            showMethod: 'slideDown',
                            hideMethod: 'slideUp',
                        });
                    }
                }
                fetchData();
            }
            else
            {
                setLoading(false)
                navigate(global.config.ROUTE_NAME+"/login");
            }
        }
    },[navigate]);
    return (
        <>
            {loading && (
                <div className="page-loader">
                    <div className="spinner-border spin-loader text-dark" role="status"></div>
                    <span className="cont-loader">Still loading, Just a moment...</span>
                </div>
            )}
        </>
    )
}

export default Logout;