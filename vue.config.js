module.exports = {

    pwa: {

        appleMobileWebAppCapable: 'yes',

        appleMobileWebAppStatusBarStyle: 'blue',

        workboxPluginMode: 'GenerateSW',

        workboxOptions: {

            exclude: [

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

                    urlPattern: new RegExp('https://dataoversound.eadev.it/dataoversound-swi/service/rest/v1/mostra-attiva'),

                    handler: 'NetworkFirst',

                },
                {

                    urlPattern: new RegExp('https://dataoversound.eadev.it/dataoversound-swi/service/rest/v1/app-schede-audible'),

                    handler: 'NetworkFirst',

                },

                {

                    urlPattern: new RegExp('/'),

                    handler: 'CacheFirst',

                },
                


            ]

        }

    }

}