// Register.js dosyası içindeki return (...) kısmını bununla değiştirin

import React, { useState } from "react"; // useState import edildiğinden emin olun
import { useNavigate, Link } from "react-router-dom"; // useNavigate ve Link import edildiğinden emin olun
import { register } from "../services/authService"; // register fonksiyonu import edildiğinden emin olun

// Custom font adınız (tailwind.config.js'ye eklediyseniz)
const customFontClass = "font-poppins"; // 'font-poppins' yerine kendi font adınızı yazın

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            // Başarılı kayıt sonrası login'e yönlendir
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Kayıt olurken hata oluştu.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* Başlık: Daha koyu, daha kalın font, alt boşluk ve custom font (Yeşil ton) */}
            <h2 className={`text-3xl font-extrabold text-center text-green-900 ${customFontClass}`}>
                Kayıt Ol
            </h2>

            {/* Başlık Altına Dekoratif Çizgi: Daha belirgin (Yeşil ton) */}
            <div className="h-1.5 w-20 bg-green-600 mx-auto rounded-full mt-2 mb-10"></div> {/* Yükseklik, genişlik, renk, boşluklar arttırıldı */}

            {error && <p className="text-red-500 text-sm text-center mb-6">{error}</p>} {/* Hata mesajı boşluğu */}

            {/* Ad Input: Çerçevesiz, alt çizgili, arka plan renkli, gelişmiş odaklanma stili (Yeşil odak) */}
            <input
                type="text"
                name="firstName"
                placeholder="Ad"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-b-2 border-gray-300 rounded-t-md focus:outline-none focus:border-green-600 transition duration-200 mb-6 placeholder-gray-500" // Login stilleri uygulandı, focus:border-green-600
                required
            />
            {/* Soyad Input: Çerçevesiz, alt çizgili, arka plan renkli, gelişmiş odaklanma stili (Yeşil odak) */}
            <input
                type="text"
                name="lastName"
                placeholder="Soyad"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-b-2 border-gray-300 rounded-t-md focus:outline-none focus:border-green-600 transition duration-200 mb-6 placeholder-gray-500" // Login stilleri uygulandı, focus:border-green-600
                required
            />
            {/* E-posta Input: Çerçevesiz, alt çizgili, arka plan renkli, gelişmiş odaklanma stili (Yeşil odak) */}
            <input
                type="email"
                name="email"
                placeholder="E-posta"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-b-2 border-gray-300 rounded-t-md focus:outline-none focus:border-green-600 transition duration-200 mb-6 placeholder-gray-500" // Login stilleri uygulandı, focus:border-green-600
                required
            />
            {/* Şifre Input: Çerçevesiz, alt çizgili, arka plan renkli, gelişmiş odaklanma stili (Yeşil odak) */}
            <input
                type="password"
                name="password"
                placeholder="Şifre"
                value={form.password}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-b-2 border-gray-300 rounded-t-md focus:outline-none focus:border-green-600 transition duration-200 mb-8 placeholder-gray-500" // Login stilleri uygulandı, focus:border-green-600, butondan önce mb-8
                required
            />
            {/* Kayıt Ol Butonu: Gradient arka plan, daha fazla padding, gelişmiş hover ve focus stilleri (Yeşil ton) */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-semibold py-4 rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" // Login buton stilleri uygulandı, renkler yeşil tonlarına çevrildi, focus:ring-green-500
            >
                Kayıt Ol
            </button>

            {/* Giriş Yap Linki: Üst boşluk arttırıldı, metin rengi (Yeşil ton) */}
            <p className="mt-10 text-sm text-center text-gray-700">
                Zaten bir hesabın var mı?{" "}
                {/* Link to the Login route (Yeşil ton) */}
                <Link to="/" className="text-green-800 hover:underline hover:text-green-900 transition duration-200">
                    Giriş Yap
                </Link>
            </p>
        </form>
    );
}