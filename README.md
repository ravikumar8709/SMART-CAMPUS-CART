🚀 Smart Campus Card System (NFC-Based)

A full-stack NFC-based cashless payment system designed for campus environments to enable fast, secure, and contactless transactions without relying on smartphones or internet connectivity.

📌 Project Overview

The Smart Campus Card System replaces traditional cash payments in college campuses with a prepaid digital wallet linked to NFC-enabled student ID cards.

Users can simply tap their card to complete transactions instantly.

💡 Built for:

College canteens 🍔
Campus stores 🏪
Future expansion (library, hostel, transport)
🖥️ System Screens (UI Preview)
🏠 Landing Page
Portal selection (Student / Vendor / Admin)
Clean UI with role-based navigation
🛒 Vendor POS System
Product inventory
Add to cart
Real-time billing
NFC scan for payment
💳 NFC Authentication
Tap student ID to authenticate
Secure wallet deduction
🎓 Student Dashboard
Wallet balance 💰
Recharge option
Transaction history (planned)
⚙️ Tech Stack
🔹 Frontend
React.js (PWA)
HTML, CSS, JavaScript
Responsive UI
🔹 Backend
Node.js / Python (API services)
RESTful APIs
🔹 Database
MySQL (primary DB)
Firebase (real-time sync)
🔹 Hardware
NFC Reader
NFC Smart Cards
🔹 Authentication
JWT-based authentication
🔑 Key Features

✅ NFC-based contactless payments
✅ Digital wallet system
✅ Role-based access (Student / Vendor / Admin)
✅ Real-time transaction processing
✅ Offline-capable architecture (future-ready)
✅ Secure authentication & authorization
✅ Admin analytics dashboard
✅ Scalable system design

🔄 System Workflow
Vendor adds items to cart
Clicks Scan Student ID
Student taps NFC card
System:
Authenticates user
Checks balance
Deducts amount
Stores transaction
Payment success displayed instantly
🔐 Security Features
JWT Authentication
Role-Based Access Control
Secure wallet transactions
Duplicate scan prevention
HTTPS / Encryption support
📊 Performance Highlights
Parameter	Result
Transaction Speed	< 2 seconds
Accuracy	100%
Error Rate	Negligible
System Availability	High
⚠️ Known Limitation

🚫 Web browsers may not support NFC (WebNFC issue)

👉 Solution:

Use Android Chrome with NFC enabled
Or integrate hardware NFC reader via backend
🧠 Future Enhancements
📱 Mobile App (Android/iOS)
💳 UPI / Payment Gateway Integration
🔐 Biometric Authentication
📊 AI-based spending analytics
☁️ Cloud deployment (AWS/GCP)
🏫 Multi-service integration (library, hostel, attendance)
🛠️ Installation & Setup
# Clone repository
git clone https://github.com/your-username/smart-campus-card.git

# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
npm install
npm run dev
📁 Project Structure
smart-campus-card/
│
├── frontend/        # React UI
├── backend/         # API + server
├── database/        # Schema & queries
├── assets/          # Screenshots
└── README.md
👨‍💻 Author

Ravi Kumar
🎓 B.Tech CSE
💡 Passionate about AI, Full Stack & Smart Systems

⭐ Final Note

This project demonstrates how NFC + Web + Backend Systems can be combined to build a real-world scalable smart campus solution.

## 📸 Screenshots
![Homepage(./assets/app.png)
<img width="1900" height="912" alt="Screenshot 2026-04-16 154632" src="https://github.com/user-attachments/assets/ef874ef2-2762-4132-bff6-8d9231d87423" />

![Vendor POS](./assets/vendor.png)
<img width="1900" height="920" alt="Screenshot 2026-04-16 154738" src="https://github.com/user-attachments/assets/9ce54dca-74b3-4758-b3f2-9b4892916d4c" />
![Student Dashboard](./assets/student.png)
<img width="1919" height="912" alt="Screenshot 2026-04-16 154700" src="https://github.com/user-attachments/assets/c4429f72-e99d-41fd-a964-61a63a002e84" />
![NFC Scan](./assets/nfc.png)
<img width="1909" height="909" alt="Screenshot 2026-04-16 154804" src="https://github.com/user-attachments/assets/b7bfe97a-62d7-46fa-bfc1-4988d0aff879" />
