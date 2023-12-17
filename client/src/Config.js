global.config = {
    "PUBLIC_URL": "http://192.168.1.24:8080",
    "ROUTE_NAME": "/aotm",
    "SESSION_TIME": "15",
    "SESSION_IDLE_TIME": "15",
    "SECRET_KEY": "6D283755BAF744671B72B67BB22E3",
}
global.updateConfig = (newConfig) => {
    global.config = {
      ...global.config,
      ...newConfig,
    };
};

module.exports = global.config;