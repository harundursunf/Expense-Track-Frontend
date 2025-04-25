![giriş](https://github.com/user-attachments/assets/acd14124-6da1-44e1-946e-200de3da68a0)
![gider tablo](https://github.com/user-attachments/assets/22606da8-bac4-4006-8c4a-7e81429d585b)
![gider ekle](https://github.com/user-attachments/assets/07b99a07-faf7-4ec4-a329-4c78ddf9cabd)

![dashboard](https://github.com/user-attachments/assets/3d3afcfd-9bac-4249-ba3d-7a9dec156a5c)


# 💸 Kişisel Gider Takip Uygulaması - Frontend

Bu proje, kişisel giderlerinizi takip etmenizi sağlayan bir web uygulamasının ön yüzüdür. React, Vite ve Tailwind CSS kullanılarak geliştirilmiştir. Arka uç kısmı ise ASP.NET Core 9 ile JWT kimlik doğrulama sistemi entegre edilerek oluşturulmuştur.

## 🚀 Başlarken

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- Vite (global olarak kurulu değilse, proje bağımlılıklarıyla birlikte gelir)
- Tailwind CSS (proje içinde yapılandırılmıştır)
- Arka uç için ASP.NET Core 9 API (JWT kimlik doğrulama ile)

### Kurulum

1. Projeyi klonlayın:

   ```bash
   git clone https://github.com/harundursunf/Expense-Track-Frontend.git
   cd Expense-Track-Frontend
   ```


2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```


3. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```


4. Tarayıcınızda `http://localhost:5173/` adresini ziyaret ederek uygulamayı görüntüleyebilirsiniz.

## 🧩 Özellikler

- Kullanıcı kaydı ve girişi (JWT kimlik doğrulama)
- Gider ekleme, düzenleme ve silme
- Giderleri kategoriye göre gruplama
- Aylık ve yıllık gider özetleri
- Duyarlı ve kullanıcı dostu arayüz (Tailwind CSS ile)
- Arka uç ile güvenli API iletişimi

## 🛠️ Kullanılan Teknolojiler

- React
- Vite
- Tailwind CSS
- ASP.NET Core 9 (arka uç)
- JWT 

## 📁 Proje Yapısı


```bash
Expense-Track-Frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
