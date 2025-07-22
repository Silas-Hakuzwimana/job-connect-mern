import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import authService from '../services/authService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const navigate = useNavigate();
    const redirectTo = (url) => {
        navigate(url);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Client-side validation
        if (!email.trim()) {
            setErrors({ email: 'Email address is required' });
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword({ email });
            setEmailSent(true);
            toast.success('Password reset instructions sent to your email');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
            toast.error(errorMessage);

            // Handle specific error cases
            if (error.response?.status === 404) {
                setErrors({ email: 'No account found with this email address' });
            } else if (error.response?.status === 429) {
                setErrors({ email: 'Too many requests. Please wait before trying again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Check your email
                        </h2>

                        <p className="text-gray-600 mb-6">
                            We've sent password reset instructions to{' '}
                            <span className="font-medium text-gray-900">{email}</span>
                        </p>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                Didn't receive the email? Check your spam folder or
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <Link
                                to="#"
                                onClick={() => redirectTo('/login')}
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium text-sm transition-colors duration-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                            <Mail className="h-8 w-8 text-indigo-600" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Forgot your password?
                        </h2>

                        <p className="text-gray-600">
                            No worries! <br></br>Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    className={`
                    block w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200
                    placeholder-gray-400 text-gray-900
                    focus:outline-none focus:ring-0
                    ${errors.email
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
                                        }
                  `}
                                    placeholder="Enter your email address"
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className="
                w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
              "
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending reset link...
                                </div>
                            ) : (
                                'Send reset link'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium text-sm transition-colors duration-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to sign in
                            </Link>
                        </div>

                        <p className="mt-4 text-xs text-gray-500 text-center">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}