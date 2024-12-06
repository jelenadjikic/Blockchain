import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "",
  authDomain: "react-upload-file-c6abe.firebaseapp.com",
  projectId: "react-upload-file-c6abe",
  storageBucket: "react-upload-file-c6abe.appspot.com",
  messagingSenderId: "400899261959",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)