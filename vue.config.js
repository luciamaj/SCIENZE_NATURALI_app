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

                    urlPattern: new RegExp('/'),

                    handler: 'CacheFirst',

                },

            ]

        }

    }

}