global.config = {
    "PUBLIC_URL": process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
    "ROUTE_NAME": process.env.REACT_APP_ROUTE_NAME,
    "SESSION_TIME": process.env.REACT_APP_SESSION_TIME,
    "SESSION_IDLE_TIME": process.env.REACT_APP_SESSION_IDLE_TIME,
    "SECRET_KEY": process.env.REACT_APP_SECRET_KEY
}

global.updateConfig = (newConfig) => {
    global.config = {
      ...global.config,
      ...newConfig,
    };
};

module.exports = global.config;