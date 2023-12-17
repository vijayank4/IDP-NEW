import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const routeProject = global.config.ROUTE_NAME;
const sessionTime = global.config.SESSION_IDLE_TIME;
const SessionTimeout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let timeoutId;
    const startSessionTimer = () => {
      timeoutId = setTimeout(() => {
        const cookieNames = Object.keys(Cookies.get());
        cookieNames.forEach(cookieName => Cookies.remove(cookieName));
        navigate(routeProject+"/sessionexpired");
      }, (sessionTime * 60 * 1000));
    };

    const resetSessionTimer = () => {
      clearTimeout(timeoutId);
      startSessionTimer();
    };

    startSessionTimer();

    // Attach event listeners or API calls to reset the session timer when user interacts with the app
    const handleInteraction = () => {
      resetSessionTimer();
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    // Clean up event listeners and the timer on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [navigate]);

  return (
    <></>
  );
};

export default SessionTimeout;