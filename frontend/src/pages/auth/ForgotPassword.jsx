import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter new password, 3 = success
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { email, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12 w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {/* ─── Step 1: Enter Email ─── */}
          {step === 1 && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg mx-auto mb-6">
                  <KeyRound size={20} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-text-main">Reset Password</h2>
                <p className="text-text-muted text-sm">Enter the email associated with your account</p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setError('');
                  if (!email) {
                    setError('Please enter your email');
                    return;
                  }
                  setStep(2);
                }}
                className="space-y-5"
              >
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="glass-input pl-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="forgot-email"
                  />
                </div>

                <button type="submit" className="btn-cinematic-primary w-full mt-8" id="forgot-continue-btn">
                  Continue <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-text-muted">
                Remember your password?{' '}
                <Link to="/login" className="text-text-main hover:text-primary-500 transition-colors font-semibold">
                  Sign In
                </Link>
              </p>
            </motion.div>
          )}

          {/* ─── Step 2: Enter New Password ─── */}
          {step === 2 && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-text-main to-gray-800 flex items-center justify-center shadow-lg mx-auto mb-6">
                  <Lock size={20} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-text-main">New Password</h2>
                <p className="text-text-muted text-sm">
                  Choose a strong password for <span className="font-medium text-text-main">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    className="glass-input pl-11 pr-11"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    id="forgot-new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-main transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    className="glass-input pl-11 pr-11"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    id="forgot-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-main transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength indicator */}
                <div className="px-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          newPassword.length >= i * 3
                            ? newPassword.length >= 12
                              ? 'bg-emerald-500'
                              : newPassword.length >= 8
                              ? 'bg-amber-500'
                              : 'bg-red-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-light mt-1.5">
                    {newPassword.length === 0
                      ? 'Enter a password'
                      : newPassword.length < 6
                      ? 'Too short'
                      : newPassword.length < 8
                      ? 'Fair'
                      : newPassword.length < 12
                      ? 'Good'
                      : 'Strong'}
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="btn-cinematic flex-shrink-0"
                    id="forgot-back-btn"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-cinematic-primary flex-1"
                    id="forgot-reset-btn"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ─── Step 3: Success ─── */}
          {step === 3 && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg mx-auto mb-6">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-text-main">Password Reset!</h2>
              <p className="text-text-muted text-sm mb-8">
                Your password has been updated successfully. You can now sign in with your new credentials.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="btn-cinematic-primary w-full"
                id="forgot-signin-btn"
              >
                Sign In <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
