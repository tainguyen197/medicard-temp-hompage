import admin from "firebase-admin";
import type { Bucket } from "@google-cloud/storage";

let bucket: Bucket | undefined;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set."
      );
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    const storageBucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!storageBucketName) {
      throw new Error(
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucketName,
    });

    bucket = admin.storage().bucket(); // Initialize bucket here after app init

  } catch (error) {
    console.error("Firebase Admin Initialization Error: ", error);
    // bucket remains undefined
  }
} else {
  // If app is already initialized, try to get the bucket directly
  try {
    bucket = admin.storage().bucket();
  } catch (error) {
    console.error("Failed to get Firebase Storage bucket on re-init: ", error);
    // bucket remains undefined
  }
}

export { bucket }; 