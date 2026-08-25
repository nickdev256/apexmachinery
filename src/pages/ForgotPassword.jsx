import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import logo from '../assets/logo.jpg';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="Apex Machinery" />
          <span>APEX MACHINERY</span>
        </Link>

        {sent ? (
          <div className="auth-sent">
            <Icon name="check" size={40} />
            <h1>Check Your Email</h1>
            <p>We&apos;ve sent password reset instructions to <strong>{email}</strong>.</p>
            <Link to="/login" className="btn btn-primary btn-block">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h1>Reset Your Password</h1>
            <p>Enter your account email and we&apos;ll send you a link to reset your password.</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="field">
                <label>Email Address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send Reset Link <Icon name="arrowRight" size={16} />
              </button>
            </form>
            <p className="auth-switch"><Link to="/login">Back to Sign In</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
