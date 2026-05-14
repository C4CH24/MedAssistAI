const axios = require('axios');

class SMSService {
    constructor() {
        this.apiKey = process.env.AT_API_KEY;
        this.username = process.env.AT_USERNAME;
        this.senderId = process.env.AT_SENDER_ID || 'MedAssistAI';
        this.baseURL = 'https://api.africastalking.com/version1/messaging';
    }

    async sendSMS(phoneNumber, message) {
        try {
            // Format phone number (remove +254 if present)
            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            const response = await axios.post(
                this.baseURL,
                new URLSearchParams({
                    username: this.username,
                    to: formattedPhone,
                    message: message,
                    from: this.senderId
                }),
                {
                    headers: {
                        'apiKey': this.apiKey,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const result = response.data;
            
            if (result.SMSMessageData?.Recipients?.[0]?.status === 'Success') {
                return {
                    success: true,
                    messageId: result.SMSMessageData.Recipients[0].messageId,
                    cost: result.SMSMessageData.Recipients[0].cost
                };
            } else {
                return {
                    success: false,
                    error: result.SMSMessageData?.Message || 'SMS sending failed'
                };
            }
        } catch (error) {
            console.error('SMS Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    async sendBulkSMS(recipients) {
        const results = await Promise.all(
            recipients.map(r => this.sendSMS(r.phoneNumber, r.message))
        );
        
        return {
            success: results.every(r => r.success),
            results
        };
    }

    formatPhoneNumber(phone) {
        // Remove any non-digit characters
        let cleaned = phone.replace(/\D/g, '');
        
        // If starts with 254, remove it
        if (cleaned.startsWith('254')) {
            cleaned = cleaned.substring(3);
        }
        
        // Ensure it's 9 digits
        if (cleaned.length === 9) {
            return '254' + cleaned;
        }
        
        return phone;
    }

    async checkBalance() {
        try {
            const response = await axios.get(
                'https://api.africastalking.com/version1/user',
                {
                    headers: {
                        'apiKey': this.apiKey,
                        'Accept': 'application/json'
                    }
                }
            );

            return {
                success: true,
                balance: response.data.UserData.balance
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new SMSService();
