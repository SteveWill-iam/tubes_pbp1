import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { setLoading, setError, loginSuccess } from '../redux/slices/authSlice';
import apiClient from '../api/client';
import {
  TextField, Button, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Step,
  Stepper, StepLabel,
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen'
import api from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

   // Forgot password dialog state
  const [forgotOpen, setForgotOpen] = useState(false)
  const [fpStep, setFpStep] = useState(0) // 0=email, 1=otp, 2=newpass
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState('')
  const [fpResetToken, setFpResetToken] = useState('')
  const [fpNewPassword, setFpNewPassword] = useState('')
  const [fpLoading, setFpLoading] = useState(false)
  const [fpStatus, setFpStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(setLoading(true));

    try {
      const response = await apiClient.post('/auth/login', { username, password });
      dispatch(loginSuccess(response.data));
      navigate('/admin');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Forgot Password steps ────────────────────────────────────────────────
  const handleOpenForgot = () => {
    setForgotOpen(true)
    setFpStep(0)
    setFpEmail('')
    setFpOtp('')
    setFpResetToken('')
    setFpNewPassword('')
    setFpStatus(null)
  }

  const handleForgotClose = () => {
    setForgotOpen(false)
    setFpStatus(null)
  }

  const handleSendOtp = async () => {
    if (!fpEmail) return
    setFpLoading(true)
    setFpStatus(null)
    try {
      await apiClient.post('/auth/forgot-password', { email: fpEmail })
      setFpStep(1)
      setFpStatus({ type: 'success', msg: 'A 6-digit code has been sent to your email. Check your inbox!' })
    } catch (err: any) {
      setFpStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to send code. Try again.' })
    } finally {
      setFpLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!fpOtp) return
    setFpLoading(true)
    setFpStatus(null)
    try {
      const res = await apiClient.post('/auth/verify-otp', { email: fpEmail, otp: fpOtp })
      setFpResetToken(res.data.reset_token)
      setFpStep(2)
      setFpStatus(null)
    } catch (err: any) {
      setFpStatus({ type: 'error', msg: err.response?.data?.error || 'Invalid or expired code.' })
    } finally {
      setFpLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!fpNewPassword) return
    setFpLoading(true)
    setFpStatus(null)
    try {
      await apiClient.post('/auth/reset-password', { reset_token: fpResetToken, newPassword: fpNewPassword })
      setFpStatus({ type: 'success', msg: 'Password reset! You can now sign in.' })
      setTimeout(() => { setForgotOpen(false); setFpStep(0) }, 2500)
    } catch (err: any) {
      setFpStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to reset password.' })
    } finally {
      setFpLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-red-700">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full border-4 border-yellow-400">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">🔐 Admin Login</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter password"
              required
            />
          </div>

          {localError && <div className="text-red-600 text-sm mb-4 p-2 bg-red-100 rounded">{localError}</div>}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg">
            Login
          </button>
        </form>

        <Button variant="text" onClick={handleOpenForgot} size="small" sx={{ fontWeight: 600 }}>
          Forgot Password?
        </Button>
              {/* ── Forgot Password Dialog — 3-step OTP flow ────────────────────── */}
        <Dialog open={forgotOpen} onClose={handleForgotClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOpenIcon color="primary" />
            <span>Reset Password</span>
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={fpStep} sx={{ mb: 3, mt: 1 }}>
              <Step><StepLabel>Email</StepLabel></Step>
              <Step><StepLabel>Verify Code</StepLabel></Step>
              <Step><StepLabel>New Password</StepLabel></Step>
            </Stepper>

            {fpStatus && (
              <Alert severity={fpStatus.type} sx={{ mb: 2 }}>{fpStatus.msg}</Alert>
            )}

            {fpStep === 0 && (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  Enter your email address and we'll send a 6-digit verification code.
                </DialogContentText>
                <TextField
                  label="Email" type="email" fullWidth required autoFocus
                  value={fpEmail} onChange={(e) => setFpEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                />
              </>
            )}

            {fpStep === 1 && (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  Enter the 6-digit code sent to <strong>{fpEmail}</strong>. It expires in 10 minutes.
                </DialogContentText>
                <TextField
                  label="Verification Code" fullWidth required autoFocus
                  value={fpOtp} onChange={(e) => setFpOtp(e.target.value)}
                  slotProps={{ htmlInput: { maxLength: 6, style: { letterSpacing: '0.4em', fontSize: 22, textAlign: 'center' } } }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                />
                <Button variant="text" size="small" sx={{ mt: 1 }} onClick={() => { setFpStep(0); setFpStatus(null) }}>
                  ← Change email
                </Button>
              </>
            )}

            {fpStep === 2 && (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  Code verified! Enter your new password.
                </DialogContentText>
                <TextField
                  label="New Password" type="password" fullWidth required autoFocus
                  value={fpNewPassword} onChange={(e) => setFpNewPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleForgotClose} disabled={fpLoading}>Cancel</Button>
            {fpStep === 0 && (
              <Button onClick={handleSendOtp} variant="contained" disabled={fpLoading || !fpEmail}>
                {fpLoading ? <CircularProgress size={20} /> : 'Send Code'}
              </Button>
            )}
            {fpStep === 1 && (
              <Button onClick={handleVerifyOtp} variant="contained" disabled={fpLoading || fpOtp.length < 6}>
                {fpLoading ? <CircularProgress size={20} /> : 'Verify Code'}
              </Button>
            )}
            {fpStep === 2 && (
              <Button onClick={handleResetPassword} variant="contained" color="success" disabled={fpLoading || fpNewPassword.length < 6}>
                {fpLoading ? <CircularProgress size={20} /> : 'Reset Password'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Demo credentials */}
        <div className="mt-6 pt-6 border-t-2 border-yellow-400 bg-yellow-50 p-4 rounded\">\n          <p className="text-center text-xs text-red-600 mb-2 font-bold\">📝 Demo Credentials:</p>\n          <p className="text-center text-sm text-gray-700\">Username: <span className="font-mono font-bold text-red-600\">admin</span></p>\n          <p className="text-center text-sm text-gray-700\">Password: <span className="font-mono font-bold text-red-600\">admin123</span></p>\n        </div>
      </div>
    </div>
  );
};
