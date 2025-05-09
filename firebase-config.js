// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYf7ai9Y-pxFfoclvB5txrMYHM3YBsgE0",
    authDomain: "videostream8546.firebaseapp.com",
    databaseURL: "https://videostream8546-default-rtdb.firebaseio.com",
    projectId: "videostream8546",
    storageBucket: "videostream8546.firebasestorage.app",
    messagingSenderId: "205110268085",
    appId: "1:205110268085:web:e6222083e6da7c75ffeefc",
    measurementId: "G-8Z446PP8XK"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


