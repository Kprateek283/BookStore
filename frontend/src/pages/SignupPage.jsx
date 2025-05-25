import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const SignupPage = () => {
    const { loading, registerUser, alert, clearAlert } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
        adminKey: '',
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await registerUser(formData);
        if (result.success) {
            navigate('/login');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={clearAlert}
                    />
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            required
                        />
                        
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                        
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {formData.role === 'admin' && (
                            <Input
                                label="Admin Key"
                                type="password"
                                name="adminKey"
                                value={formData.adminKey}
                                onChange={handleChange}
                                placeholder="Enter admin key"
                                required
                            />
                        )}
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Button
                            variant="default"
                            type="submit"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>

                        <div className="text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <button
                                type="button"
                                onClick={goToLogin}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Sign in here
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
