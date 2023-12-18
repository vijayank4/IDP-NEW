import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Authenticate/Login';
import Logout from './Components/Authenticate/Logout';
import ForgotPassword from './Components/Authenticate/ForgotPassword';
import SessionTimeout from './Components/Session/SessionTimeout';
import SessionExpired from './Components/Session/SessionExpired';
import NotFound from './Components/Errors/404Error';
import ModuleNotFound from './Components/Errors/ModuleNotFound';
import RefreshSessionTime from './Components/Session/RefreshSessionTime';
import PrivateRoute from './Components/Routes/PrivateRoute';
import UserRoleDetails from './Components/Routes/UserRoleDetails';
import GetCookies from './Components/Session/GetCookies';
import StaticPage from './Components/Layouts/StaticPage';
import { useSelector } from 'react-redux';

const App = () => {

  const loading = UserRoleDetails();
  const routeProject = global.config.ROUTE_NAME; 
  const routerObject = useSelector(state => state.objectRouters.data[0]);
  return (
    <React.Fragment>
      { loading ? (
        <div className="page-loader">
            <div className="spinner-border spin-loader text-dark" role="status"></div>
            <span className="cont-loader">Still loading, Just a moment...</span>
        </div>
        ) : (
          <Router>
            <Routes>
              {routerObject && (routerObject.map((route, index) => {
                try {
                  const Component = require(`./Components/${route.component}`).default;
                  return (
                    <Route key={index} path={routeProject+route.path} element={<StaticPage showStaticPage="true">
                      <Component />
                    </StaticPage>} />
                  );
                } catch (error) {
                  return (<Route key={index} path={routeProject+route.path} element={<ModuleNotFound />}/>)
                }
              }))}
              <Route path={routeProject+"/login"} element={<Login />}/>
              <Route path={routeProject+"/logout"}  element={<Logout />} />
              <Route path={routeProject+"/forgotpassword"}  element={<ForgotPassword />}/>
              <Route path={routeProject+"/sessionexpired"}  element={<SessionExpired />}/>
              <Route path="/*" element={<PrivateRoute />}/>
              <Route path="/" element={<Navigate replace to={routeProject+"/login"} /> }/>
            </Routes>
            {GetCookies('access_user') !== undefined && (
              <React.Fragment>
                <SessionTimeout />
                <RefreshSessionTime />
                <NotFound />
              </React.Fragment>
            )}
          </Router>
      )}
    </React.Fragment>
  );
}

export default App;
