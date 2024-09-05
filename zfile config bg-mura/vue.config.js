
module.exports = {
    pwa: {
        name: "Mura di Bergamo",
        theme_color: '#382F2D',
        msTileColor: '#000',

        manifestOptions:{
            name: `'Mura di Bergamo'`,
            short_name:`'Mura di Bergamo'`,
            start_url: `'.'`,
            display: 'fullscreen',
            theme_color:'#382F2D',

        },
        iconPaths: {
            favicon32: 'img/icons/msBergamo/favicon-32x32.png',
            favicon16: 'img/icons/msBergamo/favicon-16x16.png',
            appleTouchIcon: 'img/msBergamo/mipmap-hdpi/ic_launcher_round.png',
            maskIcon: 'img/icons/safari-pinned-tab.svg',
            msTileImage: 'img/icons/msBergamo/mipmap-xxhdpi/ic_launcher.png'
        },
        appleMobileWebAppCapable: 'yes',

        appleMobileWebAppStatusBarStyle: '#382F2D',
              
    //   workboxPluginMode: 'GenerateSW',
       workboxPluginMode: "InjectManifest",

        workboxOptions: {
           
           swSrc: "src/service-worker.js",
          
        }

    }

}