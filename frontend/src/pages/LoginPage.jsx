import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError('');
    if (touched[name]) {
      const newErrors = { ...errors };
      if (name === 'email') {
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(value)) newErrors.email = 'Please enter a valid email address';
        else delete newErrors.email;
      }
      if (name === 'password') {
        if (!value.trim()) newErrors.password = 'Password is required';
        else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters';
        else delete newErrors.password;
      }
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate();
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError('');
    try {
      await loginUser(form.email, form.password);
      navigate(location.state?.from || '/products', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page" id="login-page">
      {/* Animated background elements */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-container">
        <div className="login-card" id="login-card">
          <div className="login-header">
            <span className="login-brand-icon">✦</span>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to your AuraShine account
            </p>
          </div>

          {serverError && (
            <div className="server-error" id="server-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {serverError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate id="login-form">
            <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''} ${form.email && !errors.email ? 'is-valid' : ''}`}>
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
              </div>
              {errors.email && touched.email && (
                <span className="form-error" id="email-error">{errors.email}</span>
              )}
            </div>

            <div className={`form-group ${errors.password && touched.password ? 'has-error' : ''} ${form.password && !errors.password ? 'is-valid' : ''}`}>
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <div className="input-wrapper has-password-toggle">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && touched.password && (
                <span className="form-error" id="password-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={`login-btn ${isSubmitting ? 'is-loading' : ''}`}
              disabled={isSubmitting}
              id="login-submit-btn"
            >
              {isSubmitting ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="login-link" id="signup-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
