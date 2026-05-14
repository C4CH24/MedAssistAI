const request = require('supertest');

// prevent real DB connection during tests
jest.mock('../src/config/db', () => jest.fn());
// stub token generator to avoid needing JWT_SECRET
jest.mock('../src/utils/generateToken', () => ({
    generateToken: () => 'fake-token'
}));
// prevent reminder scheduler from starting cron jobs
jest.mock('../src/services/reminder.service', () => ({
    initializeScheduler: jest.fn()
}));

const app = require('../src/app');
const User = require('../src/models/User');

jest.mock('../src/models/User');

describe('Auth controller', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        // Clean up any timers or async operations
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    test('login returns 401 for deactivated account', async () => {
        const userObj = {
            phoneNumber: '745678901',
            isActive: false,
            comparePin: jest.fn().mockResolvedValue(true),
            updateLastActive: jest.fn()
        };
        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(userObj)
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ phoneNumber: '745678901', pin: '123456' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Account is deactivated');
    });

    test('login succeeds for active account with correct pin', async () => {
        const userObj = {
            phoneNumber: '745678901',
            isActive: true,
            comparePin: jest.fn().mockResolvedValue(true),
            updateLastActive: jest.fn(),
            profile: { phoneNumber: '745678901' }
        };
        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(userObj)
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ phoneNumber: '745678901', pin: '123456' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });
});