"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "../../components/PageContainer";
import { signInWithEmailAndPassword } from "firebase/auth"; // 로그인용 Firebase 함수
import { auth } from "../firebase"; // firebase.ts에서 가져오기

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // 에러 초기화
    try {
      // Firebase auth로 로그인
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // 로그인 성공 후 홈으로 이동
    } catch (err: any) {
      setError(err.message); // 로그인 실패 시 에러 메시지 출력
    }
  };

  return (
    <PageContainer>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">로그인</h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            이메일과 비밀번호를 입력해주세요.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="이메일"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-400 text-white rounded-xl shadow hover:bg-blue-500 transition"
            >
              로그인
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
            계정이 없으신가요?{" "}
            <a href="/signup" className="text-green-400 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
