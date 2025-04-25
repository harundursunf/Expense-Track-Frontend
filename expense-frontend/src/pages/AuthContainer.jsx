import React from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const customFontClass = "font-poppins";

export default function AuthContainer() {
  const location = useLocation();
  const isLogin = location.pathname === "/";

  const containerClasses = `
    h-screen flex items-center justify-center relative overflow-hidden
    bg-gray-100
  `;

  const formWrapperBaseClasses = `
    absolute top-1/2 -translate-y-1/2 w-full max-w-md
    bg-white p-8 rounded-xl shadow-md
    transition-all duration-500 ease-in-out
  `;

  const loginClasses = `${formWrapperBaseClasses} ${
    isLogin
      ? "left-1/4 transform -translate-x-1/2 opacity-100 pointer-events-auto"
      : "left-1/4 transform -translate-x-[150%] opacity-0 pointer-events-none"
  }`;

  const registerClasses = `${formWrapperBaseClasses} ${
    !isLogin
      ? "left-3/4 transform -translate-x-1/2 opacity-100 pointer-events-auto"
      : "left-3/4 transform translate-x-[50%] opacity-0 pointer-events-none"
  }`;

  const textContainerClasses = `
    absolute top-1/2 -translate-y-1/2 w-1/2 h-full
    flex items-center justify-center p-8
    text-gray-700 font-bold uppercase text-center
    ${customFontClass}
    transition-all duration-500 ease-in-out
    ${isLogin ? "left-1/2 opacity-100" : "right-1/2 opacity-100"}
  `;

  return (
    <div className={containerClasses}>
      <div className={textContainerClasses}>
        {isLogin ? (
          <p className="text-2xl md:text-3xl lg:text-4xl">
            Giderlerinizi Akıllıca Yönetin <br /> Finansal Geleceğinizi <br /> Güvence Altına Alın
          </p>
        ) : (
          <p className="text-2xl md:text-3xl lg:text-4xl">
            BÜTÇENİZİ PLANLAYIN <br /> TASARRUF HEDEFLERİNİZE <br /> KOLAYCA ULAŞIN
          </p>
        )}
      </div>

      <div className={loginClasses}>
        <Login />
      </div>

      <div className={registerClasses}>
        <Register />
      </div>
    </div>
  );
}
