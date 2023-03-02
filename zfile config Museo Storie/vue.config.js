
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

        appleMobileWebAppStatusBarStyle: 'blue',
              
    //   workboxPluginMode: 'GenerateSW',
       workboxPluginMode: "InjectManifest",

        workboxOptions: {
           
           swSrc: "src/service-worker.js",
          
        }

    }

}