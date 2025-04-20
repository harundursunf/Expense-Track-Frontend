import React from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login"; // Dosya yolunu projenize göre ayarlayın
import Register from "./Register"; // Dosya yolunu projenize göre ayarlayın

// Custom font adınız (tailwind.config.js'ye eklediyseniz)
const customFontClass = "font-poppins"; // 'font-poppins' yerine kendi font adınızı yazın

export default function AuthContainer() {
  const location = useLocation();
  const isLogin = location.pathname === "/";

  // Ana container stilleri - Arka plan eski haline döndü
  const containerClasses = `
    h-screen flex items-center justify-center relative overflow-hidden
    bg-gray-100 // Düz gri arka plan
  `;

  // Formları sarmalayan div'ler için temel stiller - Gölge ve yuvarlaklık eski haline döndü
  const formWrapperBaseClasses = `
    absolute top-1/2 -translate-y-1/2 w-full max-w-md
    bg-white p-8 rounded-xl shadow-md // rounded-2xl -> rounded-xl, shadow-xl -> shadow-md
    transition-all duration-500 ease-in-out
  `;

  // Login formunun stilleri (Aynı kalıyor)
  const loginClasses = `${formWrapperBaseClasses} ${
    isLogin
      ? "left-1/4 transform -translate-x-1/2 opacity-100 pointer-events-auto"
      : "left-1/4 transform -translate-x-[150%] opacity-0 pointer-events-none"
  }`;

  // Register formunun stilleri (Aynı kalıyor)
  const registerClasses = `${formWrapperBaseClasses} ${
    !isLogin // is on /register route
      ? "left-3/4 transform -translate-x-1/2 opacity-100 pointer-events-auto"
      : "left-3/4 transform translate-x-[50%] opacity-0 pointer-events-none"
  }`;

  // Metin container'ı için stiller - Custom font yine burada kalsın
  const textContainerClasses = `
    absolute top-1/2 -translate-y-1/2 w-1/2 h-full
    flex items-center justify-center p-8
    text-gray-700 font-bold uppercase text-center
    ${customFontClass} // Custom font sınıfı
    transition-all duration-500 ease-in-out
    ${isLogin
      ? "left-1/2 opacity-100"
      : "right-1/2 opacity-100"
    }
  `;

  return (
    <div className={containerClasses}>
      {/* Metin Container'ı */}
      <div className={textContainerClasses}>
        {/* Gelir Gider Temalı Metin */}
        {isLogin ? (
            <p className="text-2xl md:text-3xl lg:text-4xl">
              FİNANSAL GELECEĞİNİZİ İNŞA EDİN <br/> GELİR VE GİDERLERİNİZ <br/> PARMAK UÇLARINIZDA
            </p>
        ) : (
            <p className="text-2xl md:text-3xl lg:text-4xl">
              BÜTÇENİZİ PLANLAYIN <br/> TASARRUF HEDEFLERİNİZE <br/> KOLAYCA ULAŞIN
            </p>
        )}
      </div>

      {/* Form Wrapper - Login */}
      <div className={loginClasses}>
        <Login /> {/* Login componentinin içeriğini değiştireceğiz */}
      </div>

      {/* Form Wrapper - Register */}
      <div className={registerClasses}>
        <Register />
      </div>
    </div>
  );
}