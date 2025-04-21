import React, { useState } from "react"; // useState import edildiğinden emin olun
import { useNavigate, Link } from "react-router-dom"; // useNavigate ve Link import edildiğinden emin olun
import { login } from "../services/authService"; // login fonksiyonu import edildiğinden emin olun

// Custom font adınız (tailwind.config.js'ye eklediyseniz)
const customFontClass = "font-poppins"; // 'font-poppins' yerine kendi font adınızı yazın

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      console.log("Login cevabı:", res); // 🔥 BUNU EKLE
      localStorage.setItem("token", res.token); // ✔ Doğru olan bu!


      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Giriş başarısız.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {/* Başlık: Daha koyu, daha kalın font, alt boşluk ve custom font */}
      <h2 className={`text-3xl font-extrabold text-center text-gray-800 ${customFontClass}`}>
        Giriş Yap
      </h2>

      {/* Başlık Altına Dekoratif Çizgi: Daha belirgin */}
      <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mt-2 mb-10"></div> {/* Yükseklik, genişlik, renk, boşluklar arttırıldı */}

      {error && <p className="text-red-500 text-sm text-center mb-6">{error}</p>} {/* Hata mesajı boşluğu */}

      {/* E-posta Input: Çerçevesiz, alt çizgili, arka plan renkli, gelişmiş odaklanma stili */}
      <input
        type="email"
        name="email"
        placeholder="E-posta"
        value={form.email}
        onChange={handleChange}
        className="w-full p-4 bg-gray-50 border-b-2 border-gray-300 rounded-t-md focus:outline-none focus:border-blue-600 transition duration-200 mb-6 placeholder-gray-500" // p-3.5 -> p-4, border kaldırıldı, border-b-2 eklendi, bg-gray-50 eklendi, rounded-t-md eklendi, focus:border-blue-500 -> focus:border-blue-600, mb-4 -> mb-6, placeholder-gray-400 -> placeholder-gray-500
        required
      />
      {/* Şifre Input: Çerçevesiz, alt çizgili, arka plan renkli, gelişmiş odaklanma stili */}
      <input
        type="password"
        name="password"
        placeholder="Şifre"
        value={form.password}
        onChange={handleChange}
        className="w-full p-4 bg-gray-50 border-b-2 border-gray-300 rounded-t-md focus:outline-none focus:border-blue-600 transition duration-200 mb-8 placeholder-gray-500" // p-3.5 -> p-4, border kaldırıldı, border-b-2 eklendi, bg-gray-50 eklendi, rounded-t-md eklendi, focus:border-blue-500 -> focus:border-blue-600, mb-6 -> mb-8, placeholder-gray-400 -> placeholder-gray-500
        required
      />
      {/* Giriş Butonu: Gradient arka plan, daha fazla padding, gelişmiş hover ve focus stilleri */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // bg rengi gradient ile değişti, text-lg -> text-xl, font-bold -> font-semibold, py-3 -> py-4, shadow-md -> shadow-lg, hover:bg kaldırıldı, hover:shadow-lg ve hover:-translate-y-1 eklendi, duration-200 -> duration-300, ease-in-out eklendi
      >
        Giriş Yap
      </button>

      {/* Kayıt Ol Linki: Üst boşluk arttırıldı, metin rengi */}
      <p className="mt-10 text-sm text-center text-gray-700"> {/* mt-8 -> mt-10, text-gray-600 -> text-gray-700 */}
        Hesabın yok mu?{" "}
        <Link to="/register" className="text-blue-800 hover:underline hover:text-blue-900 transition duration-200"> {/* Renkler biraz koyulaştırıldı */}
          Kayıt Ol
        </Link>
      </p>
    </form>
  );
}