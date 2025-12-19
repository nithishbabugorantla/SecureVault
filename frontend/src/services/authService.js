import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

class AuthService {
  constructor() {
    // Store JWT token in memory (not localStorage for security)
    this.token = null;
    this.username = null;
  }

  async register(username, loginPassword, masterPassword) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      loginPassword,
      masterPassword
    });
    
    if (response.data.token) {
      this.token = response.data.token;
      this.username = response.data.username;
    }
    
    return response.data;
  }

  async login(username, loginPassword) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      loginPassword
    });
    
    if (response.data.token) {
      this.token = response.data.token;
      this.username = response.data.username;
    }
    
    return response.data;
  }

  logout() {
    this.token = null;
    this.username = null;
  }

  getToken() {
    return this.token;
  }

  getUsername() {
    return this.username;
  }

  isAuthenticated() {
    return this.token !== null;
  }
}

export default new AuthService();
