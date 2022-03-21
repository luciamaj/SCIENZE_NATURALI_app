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

                    urlPattern: new RegExp(this.$store.getters.baseUrl+'/service/rest/v1/mostra-attiva'),

                    handler: 'NetworkFirst',

                },
                {

                    urlPattern: new RegExp(this.$store.getters.baseUrl+'/service/rest/v1/app-schede-audible'),

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