import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signupWithEmail = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name
    if (name) {
        await updateProfile(result.user, {
            displayName: name,
        });
    }

    return result.user;
};

export const signupWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};

/* ---------- LOGIN ---------- */
export const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
};

/* ---------- GOOGLE ---------- */
export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};