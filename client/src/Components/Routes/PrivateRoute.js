import { Navigate, Outlet } from 'react-router-dom';
import GetCookies from '../Session/GetCookies';
const PrivateRoute = () => {
    const routeProject = global.config.ROUTE_NAME; 
    let auth = {'token':GetCookies('access_user')}
    return (
        auth.token ? <Outlet/> : <Navigate to={routeProject+"/login"} />
    )
}

export default PrivateRoute;
