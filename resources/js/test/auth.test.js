/**
 * @jest-environment jsdom
 */
import { telegramAuth } from '../services/auth';
import axios from 'axios';

// Mock localStorage
const localStorageMock = {
    store: {},
    clear() {
        this.store = {};
    },
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = String(value);
    },
    removeItem(key) {
        delete this.store[key];
    }
};

global.localStorage = localStorageMock;

// Mock Telegram WebApp data
const mockTelegramData = {
    WebApp: {
        initDataUnsafe: {
            user: {
                id: 12345678,
                username: 'test_user',
                first_name: 'Test',
                phone_number: '+1234567890'
            },
            auth_date: Math.floor(Date.now() / 1000),
            hash: 'mock_hash_value'
        },
        ready: jest.fn()
    }
};

// Mock axios
jest.mock('axios', () => ({
    post: jest.fn(),
    defaults: {
        headers: {
            common: {}
        }
    }
}));

describe('Telegram Authentication', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Reset axios mock
        jest.clearAllMocks();
        // Setup Telegram mock
        window.Telegram = mockTelegramData;
    });

    test('successful login', async () => {
        const mockToken = 'mock_jwt_token';
        const mockResponse = { data: { token: mockToken } };
        
        // Mock successful API response
        axios.post.mockResolvedValueOnce(mockResponse);

        // Attempt login
        const result = await telegramAuth.login();

        // Verify API call
        expect(axios.post).toHaveBeenCalledWith('/telegram/admin/login', {
            id: mockTelegramData.WebApp.initDataUnsafe.user.id,
            username: mockTelegramData.WebApp.initDataUnsafe.user.username,
            first_name: mockTelegramData.WebApp.initDataUnsafe.user.first_name,
            phone: mockTelegramData.WebApp.initDataUnsafe.user.phone_number,
            auth_date: mockTelegramData.WebApp.initDataUnsafe.auth_date,
            hash: mockTelegramData.WebApp.initDataUnsafe.hash
        });

        // Verify token storage
        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
        expect(result).toEqual(mockResponse.data);
    });

    test('login failure - Telegram WebApp not available', async () => {
        window.Telegram = undefined;
        await expect(telegramAuth.login()).rejects.toThrow('Telegram WebApp is not available');
    });

    test('login failure - user data not available', async () => {
        window.Telegram.WebApp.initDataUnsafe.user = null;
        await expect(telegramAuth.login()).rejects.toThrow('Telegram user data is not available');
    });

    test('logout', () => {
        // Setup initial state
        localStorage.setItem('token', 'test_token');
        axios.defaults.headers.common['Authorization'] = 'Bearer test_token';

        // Perform logout
        telegramAuth.logout();

        // Verify cleanup
        expect(localStorage.getItem('token')).toBeNull();
        expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });

    test('isAuthenticated', () => {
        expect(telegramAuth.isAuthenticated()).toBe(false);
        
        localStorage.setItem('token', 'test_token');
        expect(telegramAuth.isAuthenticated()).toBe(true);
        
        localStorage.removeItem('token');
        expect(telegramAuth.isAuthenticated()).toBe(false);
    });
});