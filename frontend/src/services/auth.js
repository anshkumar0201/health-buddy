import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendEmailVerification
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account",
});

export const signupWithEmail = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name
    if (name) {
        await updateProfile(result.user, {
            displayName: name,
        });
    }

    await sendEmailVerification(result.user);

    return result.user;
};

export const signupWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};



/* ---------- LOGIN ---------- */
export const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const user = result.user;

    // 🚨 Block login if email not verified
    if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in");
    }

    return user;
};

/* ---------- GOOGLE ---------- */
export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};