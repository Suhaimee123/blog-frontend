import React, { useState } from 'react';
import axios from '../config/axios';
import { useNavigate, Link } from 'react-router-dom'; // ✅ เพิ่ม Link

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/auth/signup', form);
      alert('Signup successful');
      navigate('/blog');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-3 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>

      {/* ✅ ลิงก์กลับไปหน้า Login */}
      <p className="text-center mt-3">
        มีบัญชีอยู่แล้ว?{' '}
        <Link to="/login" className="text-decoration-none">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
};

export default Signup;
