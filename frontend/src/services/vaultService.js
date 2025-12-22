import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

class VaultService {
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${authService.getToken()}`
    };
  }

  async getAllPasswords() {
    const response = await axios.get(`${API_URL}/vault/passwords`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async addPassword(appName, appUsername, password, masterPin) {
    const response = await axios.post(`${API_URL}/vault/add`, {
      appName,
      appUsername,
      password,
      masterPin
    }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async showPassword(id, masterPin) {
    const response = await axios.post(`${API_URL}/vault/show/${id}`, {
      masterPin
    }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async deletePassword(id) {
    const response = await axios.delete(`${API_URL}/vault/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }
}

export default new VaultService();
