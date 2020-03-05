module.exports = {
  publicPath: '/',
  pwa: {
    name: 'Onix Map',
    themeColor: '#0093ff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: { skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://onix-systems-map-backend\.staging\.onix\.ua/users'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  },
};

