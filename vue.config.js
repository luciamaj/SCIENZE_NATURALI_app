
module.exports = {
    pwa: {
        name: "MS Bergamo",
        theme_color: '#086a9f',
        msTileColor: '#000',

        manifestOptions:{
            name: `'MS Bergamo'`,
            short_name:`'MS Bergamo'`,
            start_url: `'.'`,
            display: 'fullscreen',
            theme_color:'#086a9f',

        },
        iconPaths: {
            favicon32: 'img/icons/msBergamo/favicon-32x32.png',
            favicon16: 'img/icons/msBergamo/favicon-16x16.png',
            appleTouchIcon: 'img/msBergamo/mipmap-hdpi/ic_launcher_round.png',
            maskIcon: 'img/icons/safari-pinned-tab.svg',
            msTileImage: 'img/icons/msBergamo/mipmap-xxhdpi/ic_launcher.png'
        },
        appleMobileWebAppCapable: 'yes',

        appleMobileWebAppStatusBarStyle: '086a9f',
              
    //   workboxPluginMode: 'GenerateSW',
       workboxPluginMode: "InjectManifest",

        workboxOptions: {
           
           swSrc: "src/service-worker.js",
            /*exclude: [

                /\.map$/, 

                /manifest\.json$/ 

            ],
            

            navigateFallback: '/index.html',

            runtimeCaching: [

                {

                    urlPattern: new RegExp('/offline'),

                    handler: 'staleWhileRevalidate',

                },
                {
                    
                    urlPattern: new RegExp(process.env.VUE_APP_BASE_URL+ '/service/rest/v1/mostra-attiva'),

                    handler: 'NetworkFirst',

                },
                {

                    urlPattern: new RegExp(process.env.VUE_APP_BASE_URL+'/service/rest/v1/app-schede-audible'),

                    handler: 'NetworkFirst',

                },

                {

                    urlPattern: new RegExp('/'),

                    handler: 'CacheFirst',

                },

                {

                    urlPattern: new RegExp(process.env.VUE_APP_BASE_URL+'/upload/'),

                    handler: 'CacheFirst',

                },
                
                


            ]*/

        }

    }

}