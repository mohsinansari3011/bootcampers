import firebase from 'firebase'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBGM_rUlPtTf-F3lTcVhXmWFXj5zJ1k1qI",
    authDomain: "todoapp-3011.firebaseapp.com",
    databaseURL: "https://todoapp-3011.firebaseio.com",
    projectId: "todoapp-3011",
    storageBucket: "todoapp-3011.appspot.com",
    messagingSenderId: "600500129314"
};

const fire = firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();;
export { db, fire, auth};