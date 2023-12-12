import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOag5XID0IPtXmBObpd1qQZq-vUspjdPQ",
  authDomain: "bloggers--hub.firebaseapp.com",
  projectId: "bloggers--hub",
  storageBucket: "bloggers--hub.appspot.com",
  messagingSenderId: "92005196041",
  appId: "1:92005196041:web:c4023d5c33e17ae478f3d8",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
