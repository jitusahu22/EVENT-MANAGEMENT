import API from './API';

export const authService = {
  login: async (username, password) => {
    const response = await API.post('/auth/login/', { username, password });
    return response.data;
  },
  logout: async () => {
    const response = await API.post('/auth/logout/');
    return response.data;
  }
};

export const membershipService = {
  getMemberships: async () => {
    const response = await API.get('/membership/');
    return response.data;
  },
  addMembership: async (data) => {
    const response = await API.post('/membership/add/', data);
    return response.data;
  },
  updateMembership: async (id, action) => {
    // action: 'extend' or 'cancel'
    const response = await API.put(`/membership/update/${id}/`, { action });
    return response.data;
  }
};

export const transactionService = {
  getTransactions: async () => {
    const response = await API.get('/transactions/');
    return response.data;
  }
};

export const reportService = {
  getSummary: async () => {
    const response = await API.get('/reports/summary/');
    return response.data;
  }
};
