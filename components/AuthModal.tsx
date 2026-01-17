
import React, { useState, useEffect } from 'react';

/**
 * EMAILJS CONFIGURATION
 */
const EMAILJS_SERVICE_ID = "service_1mt1ixk"; 
const EMAILJS_TEMPLATE_ID = "template_nnozjfs";
const EMAILJS_PUBLIC_KEY = "RsSh8gz6mGD7O6Z8q"; 

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

type AuthStep = 'login' | 'register' | 'verify' | 'success' | 'forgot-email' | 'forgot-verify' | 'reset-password';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if ((window as any).emailjs) {
      (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const sendEmail = async (targetEmail: string, targetName: string, code: string, isReset: boolean = false) => {
    const sdk = (window as any).emailjs;
    if (!sdk) return { success: false, error: "Email Service Not Loaded" };

    if (!targetEmail || targetEmail.trim() === "") {
      return { success: false, error: "Email address is missing." };
    }

    try {
      const templateParams = { 
        to_name: targetName, 
        user_email: targetEmail.trim(),
        otp_code: code,
        message: isReset 
          ? `WELS Security: Your password reset code is ${code}.`
          : `Welcome to WELS! Your verification code is ${code}.`
      };
      
      await sdk.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.text || "SMTP Server Error" };
    }
  };

  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const currentEmail = email.trim().toLowerCase();
    const currentName = name.trim();
    if (!currentEmail || !currentName) {
      setError("Please enter your name and email correctly.");
      return;
    }
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    const result = await sendEmail(currentEmail, currentName, code);
    setLoading(false);
    if (result.success) setStep('verify');
    else {
      setError(`Notice: ${result.error}. Dev Code: ${code}`);
      setStep('verify');
    }
  };

  const handleStartForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const currentEmail = email.trim().toLowerCase();
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('wels_registered_users') || '[]');
    const user = users.find((u: any) => u.email === currentEmail);
    
    if (!user && currentEmail !== 'admin@wels.com') {
      setError("No account found with this email.");
      return;
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    const result = await sendEmail(currentEmail, user?.name || "Member", code, true);
    setLoading(false);
    
    if (result.success) setStep('forgot-verify');
    else {
      setError(`Notice: ${result.error}. Dev Code: ${code}`);
      setStep('forgot-verify');
    }
  };

  const handleVerifyResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Incorrect code.');
      return;
    }
    setError('');
    setStep('reset-password');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    // In a real app, you'd update the DB. Here we update localStorage if needed.
    // For this prototype, we just confirm and send to success.
    setStep('success');
    setTimeout(() => {
      onLogin({ name: name || 'User', email, role: email.includes('admin') ? 'admin' : 'user' });
    }, 1500);
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('The code you entered is incorrect.');
      return;
    }
    const isAdmin = email.toLowerCase() === 'admin@wels.com' || email.toLowerCase().includes('admin');
    const userData = { 
      name, 
      email: email.toLowerCase(), 
      role: isAdmin ? 'admin' : 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    const users = JSON.parse(localStorage.getItem('wels_registered_users') || '[]');
    if (!users.find((u: any) => u.email === userData.email)) {
      users.push(userData);
      localStorage.setItem('wels_registered_users', JSON.stringify(users));
    }
    setStep('success');
    setTimeout(() => onLogin(userData), 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('wels_registered_users') || '[]');
      const found = users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) onLogin(found);
      else if (email.toLowerCase() === 'admin@wels.com') onLogin({ name: 'Admin', email: 'admin@wels.com', role: 'admin' });
      else {
        setError('Account not found. Please register first.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] relative border-white/10 shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20">
          <i className="fas fa-times"></i>
        </button>

        <div className="text-center mb-8 relative z-10">
          <div className="mb-4">
            <img 
              src="https://raw.githubusercontent.com/vibe-stream/cdn/main/WELS-logo.png" 
              alt="WELS" 
              className="h-10 mx-auto filter brightness-0 invert" 
            />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight">
            {step === 'login' && 'Welcome Back'}
            {step === 'register' && 'Join the Tribe'}
            {(step === 'verify' || step === 'forgot-verify') && 'Security Check'}
            {step === 'forgot-email' && 'Reset Password'}
            {step === 'reset-password' && 'New Credentials'}
            {step === 'success' && 'You\'re In'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black rounded-xl text-center uppercase">
            {error}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Email Address" />
            <div className="relative">
              <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Password" />
              <button type="button" onClick={() => setStep('forgot-email')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white">Forgot?</button>
            </div>
            <button disabled={loading} className="w-full py-4 bg-white text-black rounded-xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'SIGN IN'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-6">
              New here? <button type="button" onClick={() => setStep('register')} className="text-blue-500">Create Account</button>
            </p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-4">
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Full Name" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Password (Min 6)" />
            <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-purple-600 transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'GET OTP'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-6">
              Back to <button type="button" onClick={() => setStep('login')} className="text-blue-500">Login</button>
            </p>
          </form>
        )}

        {step === 'forgot-email' && (
          <form onSubmit={handleStartForgot} className="space-y-4">
            <p className="text-center text-[11px] text-gray-400 mb-2">Enter your email to receive a password reset code.</p>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Email Address" />
            <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-purple-600 transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'SEND RESET CODE'}
            </button>
            <button type="button" onClick={() => setStep('login')} className="w-full text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 hover:text-white">Return to Login</button>
          </form>
        )}

        {(step === 'verify' || step === 'forgot-verify') && (
          <form onSubmit={step === 'verify' ? handleVerifyAndCreate : handleVerifyResetCode} className="space-y-6">
            <p className="text-center text-xs text-gray-400">Enter the 6-digit code sent to your email.</p>
            <input required maxLength={6} type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-4xl font-black tracking-[0.4em] outline-none focus:border-blue-500" placeholder="000000" />
            <button disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-green-500 transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'VERIFY CODE'}
            </button>
          </form>
        )}

        {step === 'reset-password' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <p className="text-center text-[11px] text-gray-400 mb-2">Create a new secure password for your account.</p>
            <input required type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="New Password" />
            <button disabled={loading} className="w-full py-4 bg-white text-black rounded-xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              UPDATE & SIGN IN
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-10 text-center animate-in zoom-in-95 duration-500">
            <i className="fas fa-check-circle text-7xl text-green-500 mb-6"></i>
            <p className="text-xl font-black uppercase">Success!</p>
            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">Entering WELS Store...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
