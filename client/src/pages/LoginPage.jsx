import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (!form.password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-black text-center mb-2">Welcome back</h1>
      <p className="text-sm text-[#86868B] text-center mb-8">Sign in to your Sweety account</p>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input label="Email" id="email" type="email" value={form.email}
          onChange={handleChange('email')} placeholder="you@example.com" error={errors.email} />
        <Input label="Password" id="password" type="password" value={form.password}
          onChange={handleChange('password')} placeholder="Enter your password" error={errors.password} />
        <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
      </form>
      <p className="text-sm text-[#86868B] text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-[#007AFF] font-medium hover:underline">Create one</Link>
      </p>
    </div>
  );
};

export default LoginPage;
