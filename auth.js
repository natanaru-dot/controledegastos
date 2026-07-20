import {

    auth,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "./firebase.js";

import { saveUserProfile } from "./firestore.js";

export async function registerUser(
    name,
    email,
    password
) {

    const credential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    await saveUserProfile(
        credential.user,
        name
    );

    return credential.user;

}

export async function loginUser(
    email,
    password
) {

    const credential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    return credential.user;

}

export async function logoutUser() {

    await signOut(auth);

}

export {

    auth,

    onAuthStateChanged

};