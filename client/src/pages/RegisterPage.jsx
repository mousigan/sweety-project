import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
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
      <h1 className="text-2xl font-semibold text-black text-center mb-2">Create an account</h1>
      <p className="text-sm text-[#86868B] text-center mb-8">Start tracking your glucose with Sweety</p>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input label="Full Name" id="name" type="text" value={form.name}
          onChange={handleChange('name')} placeholder="John Doe" error={errors.name} />
        <Input label="Email" id="email" type="email" value={form.email}
          onChange={handleChange('email')} placeholder="you@example.com" error={errors.email} />
        <Input label="Password" id="password" type="password" value={form.password}
          onChange={handleChange('password')} placeholder="At least 6 characters" error={errors.password} />
        <Input label="Confirm Password" id="confirmPassword" type="password" value={form.confirmPassword}
          onChange={handleChange('confirmPassword')} placeholder="Confirm your password" error={errors.confirmPassword} />
        <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
      </form>
      <p className="text-sm text-[#86868B] text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#007AFF] font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
