import 'dotenv/config'

export default {
    name: "Laca",
    version: '1.0.1',
    extra: {
        googleAPI: process.env.GOOGLE_MAPS_API_KEY
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#4b8fd2"
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