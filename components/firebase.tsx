// firebase.js (또는 firebaseConfig.js)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAqtBgAtH4PIxQJLoSHTzdRpEh4_N8y4xI", // 실제 apiKey로 변경
  authDomain: "login-70224.firebaseapp.com", // 실제 authDomain으로 변경
  projectId: "login-70224", // 실제 projectId로 변경
  storageBucket: "login-70224.appspot.com", // 실제 storageBucket으로 변경
  messagingSenderId: "156916080839", // 실제 messagingSenderId로 변경
  appId: "1:156916080839:web:43c9b966226ee2", // 실제 appId로 변경
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스들 불러오기
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Auth

export { app, db, auth };
