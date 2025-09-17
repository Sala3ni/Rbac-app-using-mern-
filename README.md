# 🔐 RBAC Configurator - Permissions & Roles Management System

A complete **Role-Based Access Control (RBAC)** system with natural language configuration powered by AI.

## 🚀 Features

### ✅ Core Features
- **User Authentication** - Custom JWT-based login/signup system
- **Permission Management** - Full CRUD operations on permissions
- **Role Management** - Complete role management with permissions
- **Role-Permission Linking** - Visual interface to connect roles and permissions
- **User Management** - Assign roles to users with dynamic access control

### ⭐ Bonus Features
- **Natural Language Configuration** - AI-powered commands using Gemini API
- **Permission-Based Access Control** - Dynamic UI based on user permissions
- **Real-time Updates** - Instant permission changes reflection

## 🛠️ Tech Stack

### Frontend
- **React** - UI Framework
- **DaisyUI + TailwindCSS** - Styling
- **React Router** - Navigation
- **Context API** - State Management
- **Axios** - HTTP Client

### Backend
- **Node.js + Express** - Server Framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **Google Gemini AI** - Natural Language Processing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/rbac-configurator.git
cd rbac-configurator
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Frontend Setup
```bash
cd frontend/rbac-frontend
npm install
```

### 4. Run Application
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend/rbac-frontend
npm start
```

## 🎯 Usage

### Default Admin Account
- **Email:** admin@example.com
- **Password:** admin123

### Natural Language Commands
- `"Create a permission for managing users"`
- `"Give role Editor permission to edit articles"`
- `"Make a new role called Manager"`

## 📁 Project Structure

```
rbac-configurator/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business Logic
│   │   ├── middleware/     # Auth & RBAC
│   │   ├── models/        # Database Schemas
│   │   ├── routes/        # API Endpoints
│   │   └── utils/         # Helper Functions
│   └── server.js          # Main Server
├── frontend/
│   └── rbac-frontend/
│       ├── src/
│       │   ├── components/ # Reusable Components
│       │   ├── pages/     # Page Components
│       │   ├── services/  # API Services
│       │   └── context/   # State Management
└── README.md
```

## 🔐 Security Features

- **Password Hashing** with bcrypt
- **JWT Token Authentication**
- **Permission-Based Route Protection**
- **Input Validation & Sanitization**
- **CORS Configuration**
- **Environment Variables Protection**

## 🎨 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Role Management
![Roles](screenshots/roles.png)

### Natural Language Config
![AI Config](screenshots/ai-config.png)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Google Gemini AI for natural language processing
- MongoDB for database solutions
- React community for amazing tools

---

⭐ **Star this repository if you found it helpful!**