
import { auth as adminAuth } from "firebase-admin";
import { cookies } from "next/headers";
import { getFirebaseAdminApp } from "./firebase-admin";

getFirebaseAdminApp();

export async function getAuthenticatedUser() {
    const session = cookies().get("session")?.value;

    if (!session) {
        return null;
    }

    try {
        const decodedIdToken = await adminAuth().verifySessionCookie(session, true);
        const user = await adminAuth().getUser(decodedIdToken.uid);
        return user;
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return null;
    }
}
