import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    updateProfile,
    sendEmailVerification,
    getAdditionalUserInfo,
    fetchSignInMethodsForEmail
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account",
});

/* ---------- EMAIL SIGNUP ---------- */
export const signupWithEmail = async (name, email, password) => {

    const methods = await fetchSignInMethodsForEmail(auth, email);

    if (methods.length > 0) {

        if (methods.includes("google.com")) {
            throw new Error("ACCOUNT_EXISTS_GOOGLE");
        }

        if (methods.includes("password")) {
            throw new Error("ACCOUNT_EXISTS_PASSWORD");
        }
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
        await updateProfile(result.user, {
            displayName: name,
        });
    }

    await sendEmailVerification(result.user);

    return result.user;
};

/* ---------- GOOGLE AUTH ---------- */
const handleGoogleAuth = async () => {
    // 👉 1. Detect if the user is on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // 👉 2. Mobile users get the Redirect flow (Bypasses popup blockers)
        // Note: This will navigate the user away from your app to Google, 
        // then bounce them back. Our new AuthContext will catch them when they return!
        await signInWithRedirect(auth, googleProvider);
    } else {
        // 👉 3. Desktop users keep the smooth Popup flow
        const result = await signInWithPopup(auth, googleProvider);
        const additionalInfo = getAdditionalUserInfo(result);

        return {
            user: result.user,
            isNewUser: additionalInfo?.isNewUser || false
        };
    }
};

export const signupWithGoogle = handleGoogleAuth;
export const loginWithGoogle = handleGoogleAuth;
/* ---------- EMAIL LOGIN ---------- */
export const loginWithEmail = async (email, password) => {

    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (!user.emailVerified) {
        throw new Error("EMAIL_NOT_VERIFIED");
    }

    return user;
};