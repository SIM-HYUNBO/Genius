// firebase.ts (또는 firebase.js)

import { initializeApp, getApp, getApps } from "firebase/app"; // getApp, getApps 사용
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: "AIzaSyAqtBgAtH4PIxQJLoSHTzdRpEh4_N8y4xI",
  authDomain: "login-70224.firebaseapp.com",
  projectId: "login-70224",
  storageBucket: "login-70224.appspot.com", // 수정된 부분
  messagingSenderId: "156916080839",
  appId: "1:156916080839:web:bffe727082182ad2d25ee2"
};


// Firebase 초기화
// 이미 Firebase 앱이 초기화되어 있지 않다면 초기화
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
