// firebase-config-admin.js (SIRF ADMIN KE LIYE)

import "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyBieX9ymlSZH_nGc17YukhmrIvNOpBzF_M",
  authDomain: "quickkart-shop-status.firebaseapp.com",
  databaseURL: "https://quickkart-shop-status-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quickkart-shop-status",
  storageBucket: "quickkart-shop-status.appspot.com",
  messagingSenderId: "603872368115",
  appId: "1:603872368115:web:3ed732f3c7afe934ee2e86"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

// Sirf zaroori cheezein hi export karein
export { db, auth, storage };