"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../app/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Reply {
  id: string;
  text: string;
  userEmail: string;
  createdAt: any;
}

interface Problem {
  id: string;
  text: string;
  userEmail: string;
  createdAt: any;
}

export default function MathProblem() {
  const [problemText, setProblemText] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>(null);

  // ✅ 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 문제 실시간 불러오기
  useEffect(() => {
    const q = query(collection(db, "problems"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProblems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Problem[]);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 문제 등록
  const handleProblemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!problemText.trim()) return;
    if (!user) {
      alert("로그인 후 문제를 올릴 수 있습니다!");
      return;
    }

    await addDoc(collection(db, "problems"), {
      text: problemText,
      userEmail: user.email,
      createdAt: Timestamp.now(),
    });

    setProblemText("");
  };

  // ✅ 문제 삭제 (본인만)
  const handleProblemDelete = async (id: string, userEmail: string) => {
    if (!user || user.email !== userEmail) {
      alert("본인 문제만 삭제할 수 있습니다!");
      return;
    }
    await deleteDoc(doc(db, "problems", id));
  };

  // ✅ 답글 등록
  const handleReplySubmit = async (problemId: string) => {
    const text = replyTexts[problemId];
    if (!text?.trim()) return;
    if (!user) {
      alert("로그인 후 답글을 작성할 수 있습니다!");
      return;
    }

    const repliesRef = collection(db, "problems", problemId, "replies");
    await addDoc(repliesRef, {
      text,
      userEmail: user.email,
      createdAt: Timestamp.now(),
    });

    setReplyTexts({ ...replyTexts, [problemId]: "" });
  };

  // ✅ 답글 삭제 (본인만)
  const handleReplyDelete = async (
    problemId: string,
    replyId: string,
    userEmail: string
  ) => {
    if (!user || user.email !== userEmail) {
      alert("본인 답글만 삭제할 수 있습니다!");
      return;
    }

    await deleteDoc(doc(db, "problems", problemId, "replies", replyId));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-800">수학 문제 공유</h1>

      {/* 문제 작성 */}
      <form onSubmit={handleProblemSubmit} className="flex mb-6 space-x-2">
        <textarea
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          placeholder={
            user ? "문제를 입력하세요" : "로그인 후 문제를 올릴 수 있습니다."
          }
          className="flex-1 border border-gray-300 rounded p-2 focus:outline-none"
          rows={3}
          disabled={!user}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            user ? "bg-green-400 hover:bg-green-500" : "bg-gray-400"
          }`}
          disabled={!user}
        >
          문제 올리기
        </button>
      </form>

      {/* 문제 리스트 */}
      <div className="space-y-6">
        {problems.map((problem) => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            replyText={replyTexts[problem.id] || ""}
            setReplyText={(text: string) =>
              setReplyTexts({ ...replyTexts, [problem.id]: text })
            }
            handleReplySubmit={handleReplySubmit}
            handleProblemDelete={handleProblemDelete}
            handleReplyDelete={handleReplyDelete}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ 문제 아이템
function ProblemItem({
  problem,
  replyText,
  setReplyText,
  handleReplySubmit,
  handleProblemDelete,
  handleReplyDelete,
  currentUser,
}: {
  problem: Problem;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReplySubmit: (problemId: string) => void;
  handleProblemDelete: (id: string, userEmail: string) => void;
  handleReplyDelete: (problemId: string, replyId: string, userEmail: string) => void;
  currentUser: any;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "problems", problem.id, "replies"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Reply[]);
    });
    return () => unsubscribe();
  }, [problem.id]);

  return (
    <div className="bg-yellow-50 p-4 rounded shadow">
      <div className="flex justify-between mb-2">
        <p className="font-medium text-blue-900">{problem.userEmail}</p>
        {currentUser && currentUser.email === problem.userEmail && (
          <button
            onClick={() => handleProblemDelete(problem.id, problem.userEmail)}
            className="text-red-500 hover:text-red-600"
          >
            삭제
          </button>
        )}
      </div>

      {/* 문제 텍스트 */}
      <pre className="whitespace-pre-wrap mb-3">{problem.text}</pre>

      {/* 답글 목록 */}
      <div className="space-y-2 pl-4 border-l border-gray-300 mt-3">
        {replies.map((r) => (
          <div key={r.id} className="flex justify-between items-start">
            <div>
              <p className="font-medium text-orange-800">{r.userEmail}</p>
              <pre className="whitespace-pre-wrap text-gray-700">{r.text}</pre>
            </div>
            {currentUser && currentUser.email === r.userEmail && (
              <button
                onClick={() => handleReplyDelete(problem.id, r.id, r.userEmail)}
                className="text-red-500 hover:text-red-600 ml-2"
              >
                삭제
              </button>
            )}
          </div>
        ))}

        {/* 답글 입력창 */}
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              currentUser ? "답글을 입력하세요" : "로그인 후 작성할 수 있습니다."
            }
            className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none"
            disabled={!currentUser}
          />
          <button
            onClick={() => handleReplySubmit(problem.id)}
            className={`px-3 py-1 rounded text-white ${
              currentUser ? "bg-blue-400 hover:bg-blue-500" : "bg-gray-400"
            }`}
            disabled={!currentUser}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
