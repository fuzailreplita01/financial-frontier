import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {config as configDotenv} from 'dotenv'
import path, {resolve} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname)


configDotenv({
  path: resolve(__dirname, "../.env")
})
console.log(process.env)

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error("Missing Firebase admin configuration. Please set the FIREBASE_PROJECT_ID environment variable.");
}

// Initialize Firebase Admin with default credentials
const app = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const adminAuth = getAuth(app);
