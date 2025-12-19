# SecureVault Setup Guide

## Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the backend:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Testing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Register" to create a new account
3. Enter:
   - Username (e.g., "john")
   - Login Password (for authentication)
   - Master Password (for encryption/decryption)
   - Confirm Master Password
4. After registration, you'll be logged in automatically
5. Click "Add Password" to store a new password
6. Enter:
   - App Name (e.g., "Gmail")
   - Username (e.g., "john@gmail.com")
   - Password (the password to store)
   - Master Password (to encrypt the password)
7. Your password will be stored encrypted
8. Click "Show Password" to decrypt and view it
9. Enter your master password in the modal
10. The decrypted password will be shown for 30 seconds

## API Testing

You can test the API directly using curl:

### Register a User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "loginPassword": "login123",
    "masterPassword": "master123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "loginPassword": "login123"
  }'
```

### Add a Password (requires JWT token)
```bash
TOKEN="<your-jwt-token>"
curl -X POST http://localhost:8080/vault/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "appName": "Gmail",
    "appUsername": "test@gmail.com",
    "password": "MySecretPassword",
    "masterPassword": "master123"
  }'
```

### Get All Passwords (masked)
```bash
TOKEN="<your-jwt-token>"
curl -X GET http://localhost:8080/vault/passwords \
  -H "Authorization: Bearer $TOKEN"
```

### Show/Decrypt a Password
```bash
TOKEN="<your-jwt-token>"
curl -X POST http://localhost:8080/vault/show/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "masterPassword": "master123"
  }'
```

### Delete a Password
```bash
TOKEN="<your-jwt-token>"
curl -X DELETE http://localhost:8080/vault/delete/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Security Features

### Password Security
- **Login Password**: Hashed with BCrypt (cost factor 10)
- **Master Password**: Hashed with BCrypt (cost factor 10)
- **Stored Passwords**: Encrypted with AES-256-CBC

### Encryption Details
- **Algorithm**: AES-256-CBC
- **Key Derivation**: PBKDF2 with HMAC-SHA256
- **Iterations**: 65,536
- **IV**: Unique 16-byte random IV per encryption
- **Salt**: Unique 16-byte random salt per encryption

### Authentication
- **Token Type**: JWT (JSON Web Token)
- **Token Storage**: Memory only (not localStorage)
- **Token Expiration**: 24 hours
- **Token Location**: Authorization header (Bearer token)

### Authorization
- All vault endpoints require valid JWT token
- User ownership validated on all operations
- Master password verified before decryption

## Database

### H2 Console (Development Only)
Access the H2 console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:securevault`
- Username: `sa`
- Password: (leave empty)

### Tables
- `users` - User accounts with hashed passwords
- `password_entries` - Encrypted password entries

## Production Deployment

### Backend Configuration

1. Update `application.properties` to use PostgreSQL:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/securevault
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
```

2. Add PostgreSQL dependency to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

3. Disable H2 console:
```properties
spring.h2.console.enabled=false
```

4. Build production JAR:
```bash
mvn clean package
java -jar target/securevault-backend-1.0.0.jar
```

### Frontend Configuration

1. Update API URL in `src/services/authService.js` and `src/services/vaultService.js`:
```javascript
const API_URL = 'https://your-production-domain.com';
```

2. Build for production:
```bash
npm run build
```

3. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

### Security Checklist for Production

- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure CORS for specific domains
- [ ] Use strong JWT secret key
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Implement account lockout after failed attempts
- [ ] Add password strength requirements
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Set up database backups
- [ ] Enable security headers
- [ ] Conduct security audit
- [ ] Implement audit logging

## Troubleshooting

### Backend Issues

**Problem**: Port 8080 already in use
```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>
```

**Problem**: Database connection issues
- Check H2 console is accessible
- Verify JDBC URL in application.properties
- Check logs in console output

### Frontend Issues

**Problem**: API connection refused
- Verify backend is running on port 8080
- Check CORS configuration in SecurityConfig
- Verify API URLs in service files

**Problem**: Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload
- Backend: Maven Spring Boot plugin supports hot reload
- Frontend: Vite provides instant HMR (Hot Module Replacement)

### Debugging
- Backend: Enable debug logs in `application.properties`:
```properties
logging.level.com.securevault=DEBUG
```
- Frontend: Use browser DevTools console and Network tab

### Code Style
- Backend: Follow Java conventions, use Lombok for boilerplate
- Frontend: Follow React best practices, use functional components

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the security documentation
3. Check backend logs for error messages
4. Use browser DevTools for frontend issues

## License

This is a demonstration project for educational purposes.
