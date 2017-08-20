cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "ionic-plugin-keyboard.keyboard",
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechRecognition",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechRecognition.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechRecognition"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechRecognitionError",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechRecognitionError.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechRecognitionError"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechRecognitionAlternative",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechRecognitionAlternative.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechRecognitionAlternative"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechRecognitionResult",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechRecognitionResult.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechRecognitionResult"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechRecognitionResultList",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechRecognitionResultList.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechRecognitionResultList"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechRecognitionEvent",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechRecognitionEvent.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechRecognitionEvent"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechGrammar",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechGrammar.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechGrammar"
        ]
    },
    {
        "id": "org.apache.cordova.speech.speechrecognition.SpeechGrammarList",
        "file": "plugins/org.apache.cordova.speech.speechrecognition/www/SpeechGrammarList.js",
        "pluginId": "org.apache.cordova.speech.speechrecognition",
        "clobbers": [
            "SpeechGrammarList"
        ]
    },
    {
        "id": "cordova-plugin-tts.tts",
        "file": "plugins/cordova-plugin-tts/www/tts.js",
        "pluginId": "cordova-plugin-tts",
        "clobbers": [
            "TTS"
        ]
    },
    {
        "id": "cordova-plugin-datepicker.DatePicker",
        "file": "plugins/cordova-plugin-datepicker/www/android/DatePicker.js",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.0.6",
    "cordova-plugin-device": "1.1.5",
    "cordova-plugin-splashscreen": "4.0.2",
    "cordova-plugin-statusbar": "2.2.2",
    "cordova-plugin-whitelist": "1.3.2",
    "ionic-plugin-keyboard": "2.2.1",
    "cordova-plugin-compat": "1.1.0",
    "org.apache.cordova.speech.speechrecognition": "0.1.2",
    "cordova-plugin-crosswalk-webview": "2.3.0",
    "cordova-plugin-tts": "0.2.3",
    "cordova-plugin-datepicker": "0.9.2"
};
// BOTTOM OF METADATA
});