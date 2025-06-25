import React, { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

function Register() {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const email = watch('email');

  const sendOtp = async () => {
    if (!email) {
      toast.warn('Please enter a valid email');
      return;
    }
    try {
      const response = await axios.post('/auth/send-otp', { email });
      console.log(response.data);
      toast.success('OTP sent successfully');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('/auth/register', data);
      toast.success('Registration successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <input className="register-input" placeholder="Name" {...register('name')} required />
      <input
        className="register-input"
        placeholder="Email"
        type="email"
        {...register('email')}
        required
        onBlur={sendOtp}
      />

      {otpSent && (
        <div className="register-otp-box">
          {[...Array(4)].map((_, i) => (
            <input
              key={i}
              maxLength={1}
              className="register-otp-input"
              required
              {...register(`otp${i + 1}`)}
            />
          ))}
        </div>
      )}

      <div className="register-password-wrapper">
        <input
          className="register-input"
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          required
        />
        <span className="register-eye-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <button className="register-button" type="submit">Register</button>
    </form>
  );
}

export default memo(Register);