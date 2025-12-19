# 🔐 SecureVault - Multi-User Password Manager

A production-quality, security-focused password manager built with Spring Boot and React.

## 🏗️ Architecture

### Backend (Spring Boot 3 + Java 17)
- **Authentication**: JWT-based authentication with BCrypt password hashing
- **Encryption**: AES-256-CBC for password storage
- **Key Derivation**: PBKDF2 with 65536 iterations
- **Database**: H2 (in-memory) for development, PostgreSQL-ready for production

### Frontend (React + Vite + Tailwind CSS)
- **State Management**: In-memory JWT token storage (secure)
- **UI Components**: Modal-based password operations
- **Security**: No localStorage usage, auto-hide decrypted passwords

## 🔒 Security Features

1. **Dual Password System**:
   - Login Password: For authentication (BCrypt hashed)
   - Master Password: For vault encryption/decryption (BCrypt hashed)

2. **Encryption**:
   - AES-256-CBC encryption for stored passwords
   - PBKDF2 key derivation from master password
   - Unique IV (Initialization Vector) for each password
   - Unique salt for each encryption operation

3. **Access Control**:
   - JWT-based authentication
   - Master password verification before decryption
   - User ownership validation on all operations

4. **Best Practices**:
   - Passwords masked by default
   - No plaintext password storage
   - No encryption key storage
   - Sensitive data never logged
   - Auto-hide decrypted passwords after 30 seconds

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication (Public)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Vault (Protected)
- `GET /vault/passwords` - Get all passwords (masked)
- `POST /vault/add` - Add new password
- `POST /vault/show/{id}` - Decrypt and show password
- `DELETE /vault/delete/{id}` - Delete password

## 🗄️ Database Schema

### User Table
- id (Primary Key)
- username (unique)
- loginPasswordHash (BCrypt)
- masterPasswordHash (BCrypt)
- createdAt

### PasswordEntry Table
- id (Primary Key)
- userId (Foreign Key)
- appName
- appUsername
- encryptedPassword (AES-256)
- createdAt

## 🔐 Security Flow

### Registration
1. User provides username, login password, master password
2. Both passwords hashed with BCrypt
3. User created in database
4. JWT token issued

### Login
1. User provides username and login password
2. Login password verified against BCrypt hash
3. JWT token issued

### Add Password
1. User provides app details and master password
2. Master password verified against BCrypt hash
3. Password encrypted with AES-256 using key derived from master password
4. Encrypted password stored in database

### Show Password (Critical)
1. User clicks "Show Password" button
2. Modal prompts for master password
3. Master password verified against BCrypt hash
4. Only if verified: password decrypted using master password
5. Plaintext password shown temporarily (30 seconds)
6. Password auto-hidden for security

## 🛡️ Security Constraints

- ❌ Never auto-decrypt passwords
- ❌ Never expose passwords without master password verification
- ❌ Never store encryption keys
- ❌ Never store plaintext passwords
- ❌ Never log sensitive data
- ✅ Always validate user ownership
- ✅ Always mask passwords in list views
- ✅ Always use HTTPS in production

## 📦 Project Structure

```
SecureVault/
├── backend/
│   ├── src/main/java/com/securevault/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── JwtAuthFilter.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── VaultController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── VaultService.java
│   │   │   ├── CryptoService.java
│   │   │   └── JwtService.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   └── PasswordEntry.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── PasswordRepository.java
│   │   └── dto/
│   │       ├── RegisterRequest.java
│   │       ├── LoginRequest.java
│   │       ├── AddPasswordRequest.java
│   │       └── ShowPasswordRequest.java
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PasswordCard.jsx
│   │   │   ├── ShowPasswordModal.jsx
│   │   │   └── AddPasswordModal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VaultDashboard.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── vaultService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🧪 Testing

### Test User Flow
1. Open `http://localhost:3000`
2. Register with username, login password, and master password
3. Add a new password entry
4. View passwords (masked by default)
5. Click "Show Password" and enter master password
6. Delete a password entry

## 🔧 Production Deployment

### Backend
1. Replace H2 with PostgreSQL in `application.properties`
2. Set strong JWT secret key
3. Enable HTTPS
4. Configure CORS for production domain
5. Set `spring.jpa.hibernate.ddl-auto=validate`

### Frontend
1. Update API URL in services
2. Build for production: `npm run build`
3. Deploy to CDN or static hosting
4. Ensure HTTPS

## 📝 License

This project is a demonstration of secure password management practices.

## ⚠️ Disclaimer

This is a demonstration project. For production use:
- Conduct thorough security audits
- Implement rate limiting
- Add 2FA support
- Use hardware security modules for key storage
- Implement password strength requirements
- Add audit logging
- Implement account recovery mechanisms