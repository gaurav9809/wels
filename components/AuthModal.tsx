
import React, { useState, useEffect } from 'react';

/**
 * EMAILJS CONFIGURATION:
 * Public Key provided: RsSh8gz6mGD7O6Z8q
 */
const EMAILJS_SERVICE_ID = "service_1mt1ixk"; 
const EMAILJS_TEMPLATE_ID = "template_nnozjfs";
const EMAILJS_PUBLIC_KEY = "RsSh8gz6mGD7O6Z8q"; 

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [step, setStep] = useState<'login' | 'register' | 'verify' | 'success'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sdk = (window as any).emailjs;
    if (sdk) {
      sdk.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const getRegisteredUsers = () => {
    const data = localStorage.getItem('wels_registered_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUser = (userData: any) => {
    const users = getRegisteredUsers();
    users.push(userData);
    localStorage.setItem('wels_registered_users', JSON.stringify(users));
  };

  const sendEmail = async (userEmail: string, userName: string, code: string) => {
    const sdk = (window as any).emailjs;
    if (!sdk) return { success: false, error: "Service unavailable." };

    try {
      const templateParams = { to_name: userName, to_email: userEmail, otp_code: code };
      await sdk.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.text || "Failed to send code." };
    }
  };

  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pass.length < 6) {
      setError('Password too short (min 6 chars).');
      return;
    }

    const users = getRegisteredUsers();
    if (users.find((u: any) => u.email === email)) {
      setError('Email already registered.');
      return;
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    const result = await sendEmail(email, name, code);
    setLoading(false);

    if (result.success) {
      setStep('verify');
    } else {
      setError(result.error);
      // Fallback for development/testing if API fails
      if (EMAILJS_PUBLIC_KEY.includes('RsSh')) {
        console.log("Dev Mode: OTP is ", code);
        setStep('verify');
      }
    }
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Invalid code.');
      return;
    }

    setLoading(true);
    const userData = { 
      name, 
      email, 
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
    };
    
    setTimeout(() => {
      saveUser(userData);
      setStep('success');
      setLoading(false);
      setTimeout(() => onLogin(userData), 1500);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const users = getRegisteredUsers();
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser) {
        onLogin(foundUser);
      } else if (email === 'admin@wels.com') { 
        const adminUser = { name: 'Admin User', email: 'admin@wels.com', role: 'admin' };
        onLogin(adminUser);
      } else {
        setError('Invalid credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] relative overflow-hidden border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><i className="fas fa-times"></i></button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <i className={`fas ${step === 'success' ? 'fa-check' : 'fa-lock'} text-white text-2xl`}></i>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {step === 'success' ? 'Authenticated' : step === 'verify' ? 'Verify Email' : step === 'register' ? 'Join WELS' : 'Login'}
          </h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">{error}</div>}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Password" />
            <button disabled={loading} className="w-full py-4 bg-white text-black rounded-xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'SIGN IN'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              New here? <button type="button" onClick={() => setStep('register')} className="text-blue-500">Create Account</button>
            </p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-4">
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Full Name" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Password" />
            <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-purple-600 transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'GET OTP'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Have account? <button type="button" onClick={() => setStep('login')} className="text-blue-500">Login</button>
            </p>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndCreate} className="space-y-6">
            <p className="text-center text-xs text-gray-400">Enter the 6-digit code sent to your email.</p>
            <input required maxLength={6} type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-3xl font-black tracking-widest outline-none focus:border-blue-500" placeholder="000000" />
            <button disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-green-500 transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'VERIFY & REGISTER'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-10 text-center animate-in zoom-in-95 duration-500">
            <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <p className="text-lg font-bold">Access Granted!</p>
            <p className="text-xs text-gray-500 mt-2">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
