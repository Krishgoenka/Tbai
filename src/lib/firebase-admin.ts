
import { initializeApp, getApps, App, cert, ServiceAccount } from "firebase-admin/app";

// This check ensures the server doesn't crash if the environment variable is missing.
if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set. Please add it to your environment variables.");
}

const serviceAccount: ServiceAccount = {
    projectId: "technobillion-ai-platform",
    clientEmail: "firebase-adminsdk-3y1n4@technobillion-ai-platform.iam.gserviceaccount.com",
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
}

let app: App;

export function getFirebaseAdminApp(): App {
  if (app) {
    return app;
  }

  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    return app;
  }
  
  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "technobillion-ai-platform.appspot.com",
  });

  return app;
}
