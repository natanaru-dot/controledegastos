import {

    auth,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "./firebase.js";

import { saveUserProfile } from "./firestore.js";

import {

    EmailAuthProvider,

    reauthenticateWithCredential,

    updatePassword

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
export async function changePassword(
    currentPassword,
    newPassword
) {

    if (!auth.currentUser) {
        throw new Error("Usuário não autenticado.");
    }

    const credential =
        EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

    await reauthenticateWithCredential(
        auth.currentUser,
        credential
    );

    await updatePassword(
        auth.currentUser,
        newPassword
    );

}

export {

    auth,

    onAuthStateChanged

};