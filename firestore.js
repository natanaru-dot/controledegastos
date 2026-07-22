import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export async function updateUserProfile(uid, data) {

    await updateDoc(
        doc(db, "users", uid),
        data
    );

}

export async function saveUserProfile(user, name) {

    await setDoc(
        doc(db, "users", user.uid),
        {
            name,
            email: user.email,
            avatar: null,
            theme: "dark",
            sharedBoxId: null,
            createdAt: new Date().toISOString()
        }
    );

}

export async function loadUserProfile(uid) {

    const docRef = doc(
        db,
        "users",
        uid
    );

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return docSnap.data();

} 