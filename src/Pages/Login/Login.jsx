import React, { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/authSlice';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/login', data);
      dispatch(setToken(res.data.token));
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <input className="login-input" placeholder="Email" type="email" {...register('email')} required />

      <div className="login-password-wrapper">
        <input
          className="login-input"
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          required
        />
        <span className="login-eye-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <button className="login-button" type="submit">Login</button>
    </form>
  );
}

export default memo(Login);