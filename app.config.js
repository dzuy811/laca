import 'dotenv/config'

export default {
    name: "Laca",
    version: '1.0.0',
    extra: {
        googleAPI: process.env.GOOGLE_MAPS_API_KEY
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
        package: "com.RMIT.laca",
        versionCode: 1,
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY
            }
        },
        googleServicesFile: "./google-services.json"

    }
}