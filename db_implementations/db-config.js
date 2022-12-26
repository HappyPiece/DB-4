import {initializeApp} from "./firebase-app.js";
import {getDatabase} from "./firebase/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCFHKZ-2xzt9PxD16etyMXRd41YXrS_LnM",
    authDomain: "hospitals-m4.firebaseapp.com",
    databaseURL: "https://hospitals-m4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hospitals-m4",
    storageBucket: "hospitals-m4.appspot.com",
    messagingSenderId: "1084364188345",
    appId: "1:1084364188345:web:08163f7c40ad0a38954968",
    measurementId: "G-JKXPGPZRLT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db};