// __tests__/components/AuthForm.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';
import AuthForm from '@/components/auth/AuthForm'; // Ensure this is imported correctly
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

describe('AuthForm', () => {
    const mockAuth = {
        secretKey: '',
        setSecretKey: jest.fn(),
        loading: false,
        error: '',
        authenticate: jest.fn(),
        setError: jest.fn(),
        snakeAnimation: new Animated.Value(0),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue(mockAuth);
    });

    it('should handle secret key input and clear error', () => {
        const { getByPlaceholderText } = render(<AuthForm />);

        const input = getByPlaceholderText('Enter Secret Key');

        fireEvent.changeText(input, 'test-secret-key');

        expect(mockAuth.setSecretKey).toHaveBeenCalledWith('test-secret-key');

        expect(mockAuth.setError).toHaveBeenCalledWith('');
    });

    it('should trigger authentication when validate button is pressed', () => {
        const { getByText } = render(<AuthForm />);

        // Find and press the validate button
        const validateButton = getByText('Validate Key');
        fireEvent.press(validateButton);

        expect(mockAuth.authenticate).toHaveBeenCalled();
    });
});