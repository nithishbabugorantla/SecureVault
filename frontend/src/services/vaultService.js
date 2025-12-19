import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/vault';

class VaultService {
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${authService.getToken()}`
    };
  }

  async getAllPasswords() {
    const response = await axios.get(`${API_URL}/passwords`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async addPassword(appName, appUsername, password, masterPassword) {
    const response = await axios.post(`${API_URL}/add`, {
      appName,
      appUsername,
      password,
      masterPassword
    }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async showPassword(id, masterPassword) {
    const response = await axios.post(`${API_URL}/show/${id}`, {
      masterPassword
    }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async deletePassword(id) {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }
}

export default new VaultService();
