"use client";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const watchAuthState = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
