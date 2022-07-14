
module.exports = {

    pwa: {
        name: "Biblioteca Sonora",
        theme_color: '#086a9f',
        msTileColor: '#000',

        manifestOptions:{
            name: `'Biblioteca Sonora'`,
            short_name:`'Biblioteca Sonora'`,
            start_url: `'.'`,
            display: 'fullscreen',
            theme_color:'#086a9f',

        },
        iconPaths: {
            favicon32: 'img/icons/favicon-32x32.png',
            favicon16: 'img/icons/favicon-16x16.png',
            appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
            maskIcon: 'img/icons/safari-pinned-tab.svg',
            msTileImage: 'img/icons/msapplication-icon-144x144.png'
        },
        appleMobileWebAppCapable: 'yes',

        appleMobileWebAppStatusBarStyle: 'blue',
              
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