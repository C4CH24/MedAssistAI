import api from './api';

class ReminderService {
  async getAllReminders() {
    try {
      const response = await api.get('/reminders');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getReminder(id) {
    try {
      const response = await api.get(`/reminders/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createReminder(reminderData) {
    try {
      const response = await api.post('/reminders', reminderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateReminder(id, reminderData) {
    try {
      const response = await api.put(`/reminders/${id}`, reminderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteReminder(id) {
    try {
      const response = await api.delete(`/reminders/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAsTaken(reminderId) {
    try {
      const response = await api.post(`/reminders/${reminderId}/taken`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async snoozeReminder(reminderId, minutes = 15) {
    try {
      const response = await api.post(`/reminders/${reminderId}/snooze`, { minutes });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getReminderSettings() {
    try {
      const response = await api.get('/users/reminder-settings');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateReminderSettings(settings) {
    try {
      const response = await api.put('/users/reminder-settings', settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data.errors
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500
      };
    }
  }
}

export default new ReminderService();
