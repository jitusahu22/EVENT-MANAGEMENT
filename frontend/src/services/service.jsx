import API from './API';

export const authService = {
  register: async (username, password, email) => {
    const response = await API.post('/auth/register/', { username, password, email });
    return response.data;
  },
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
  getMembershipByNumber: async (membershipNumber) => {
    const response = await API.get(`/membership/update/${membershipNumber}/`);
    return response.data;
  },
  addMembership: async (data) => {
    const response = await API.post('/membership/add/', data);
    return response.data;
  },
  updateMembership: async (membershipNumber, action) => {
    // action: 'extend' or 'cancel'
    const response = await API.put(`/membership/update/${membershipNumber}/`, { action });
    return response.data;
  },
  deleteMembership: async (membershipNumber) => {
    const response = await API.delete(`/membership/delete/${membershipNumber}/`);
    return response.data;
  }
};

export const transactionService = {
  getTransactions: async () => {
    const response = await API.get('/transactions/');
    return response.data;
  },
  getTransactionById: async (id) => {
    const response = await API.get(`/transactions/${id}/`);
    return response.data;
  },
  getTransactionsByMember: async (membershipNumber) => {
    const response = await API.get(`/transactions/member/${membershipNumber}/`);
    return response.data;
  }
};

export const reportService = {
  getSummary: async () => {
    const response = await API.get('/reports/summary/');
    return response.data;
  },
  getDetailedReport: async () => {
    const response = await API.get('/reports/detailed/');
    return response.data;
  },
  getRevenueByPeriod: async (period) => {
    const response = await API.get(`/reports/revenue/?period=${period}`);
    return response.data;
  }
};

export const maintenanceService = {
  getMaintenanceRecords: async () => {
    const response = await API.get('/maintenance/');
    return response.data;
  },
  createMaintenanceRecord: async (data) => {
    const response = await API.post('/maintenance/create/', data);
    return response.data;
  },
  updateMaintenanceRecord: async (id, data) => {
    const response = await API.put(`/maintenance/update/${id}/`, data);
    return response.data;
  },
  deleteMaintenanceRecord: async (id) => {
    const response = await API.delete(`/maintenance/delete/${id}/`);
    return response.data;
  }
};
