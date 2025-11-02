"use client";
import { useState } from "react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* 햄버거 버튼 */}
      <button
        className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 p-2 border rounded-md"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <span
          className={`block h-1 w-6 bg-black transition-transform ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block h-1 w-6 bg-black transition-opacity ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block h-1 w-6 bg-black transition-transform ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* 메뉴 */}
      <div
        className={`absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col p-2">
          <li className="p-2 hover:bg-gray-100 rounded">Home</li>
          <li className="p-2 hover:bg-gray-100 rounded">About</li>
          <li className="p-2 hover:bg-gray-100 rounded">Contact</li>
        </ul>
      </div>
    </div>
  );
}
