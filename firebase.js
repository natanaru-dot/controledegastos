import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {

    getAuth,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyBrMa22wZieXoPoNAxP7KxUnFaAzaQ-IeE",

    authDomain: "nosso-caixa-6eb8a.firebaseapp.com",

    projectId: "nosso-caixa-6eb8a",

    storageBucket: "nosso-caixa-6eb8a.firebasestorage.app",

    messagingSenderId: "67666773473",

    appId: "1:67666773473:web:9be9850ff356ec5930bea0"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("✅ Firebase conectado!");

export {

    app,

    auth,

    db,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

};