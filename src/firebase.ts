import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVre-_FtLWD2rgncnuJlGPyoUjzu_KqgU",
  authDomain: "nwitter-reloaded-36110.firebaseapp.com",
  projectId: "nwitter-reloaded-36110",
  storageBucket: "nwitter-reloaded-36110.appspot.com",
  messagingSenderId: "258701484701",
  appId: "1:258701484701:web:bc5b4e47bf719a7bc32a74",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
