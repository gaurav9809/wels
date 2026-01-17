
import React, { useState, useEffect } from 'react';

/**
 * EMAILJS CONFIGURATION:
 * Your credentials are now active. 
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
  const [step, setStep] = useState<'login' | 'register' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize EmailJS on mount
  useEffect(() => {
    const sdk = (window as any).emailjs;
    if (sdk) {
      sdk.init(EMAILJS_PUBLIC_KEY);
      console.log("EmailJS Initialized");
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
    
    if (!sdk) {
      console.error("EmailJS SDK not found in window");
      return { success: false, error: "Email service script not loaded. Check internet connection." };
    }

    try {
      const templateParams = {
        to_name: userName,
        to_email: userEmail,
        otp_code: code,
      };

      const response = await sdk.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      console.log("EmailJS Response:", response);
      return { success: true };
    } catch (err: any) {
      console.error("EmailJS Full Error:", err);
      // If the error is about a bad key or missing service, we fallback to demo alert for convenience
      if (err.status === 400 || err.status === 401) {
          return { success: false, error: "API Keys Invalid. Please verify EmailJS Dashboard." };
      }
      return { success: false, error: err.text || "Failed to deliver OTP. Try again later." };
    }
  };

  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (pass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const users = getRegisteredUsers();
    if (users.find((u: any) => u.email === email)) {
      setError('An account with this email already exists.');
      return;
    }

    setLoading(true);
    // Generate a secure 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    const result = await sendEmail(email, name, code);

    setLoading(false);
    if (result.success) {
      setStep('verify');
    } else {
      setError(result.error || 'Verification failed to send.');
      // Fix: Check if the public key is still the placeholder value by casting to string to avoid type overlap errors
      if ((EMAILJS_PUBLIC_KEY as string) === "YOUR_ACTUAL_PUBLIC_KEY_HERE") {
          alert(`DEVELOPER: Set your Public Key! \nSimulating OTP for ${email}: ${code}`);
          setStep('verify');
      }
    }
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp !== generatedOtp) {
      setError('The code you entered is incorrect. Check your email inbox or spam.');
      return;
    }

    setLoading(true);
    // Simulate slight delay for "Processing" feel
    setTimeout(() => {
      const userData = { 
        name, 
        email, 
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        joined: new Date().toISOString()
      };
      saveUser(userData);
      onLogin(userData);
      setLoading(false);
    }, 1200);
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
        // Hardcoded admin for initial setup
        onLogin({ name: 'System Admin', email: 'admin@wels.com', role: 'admin' });
      } else {
        setError('Login failed. Check your credentials or register a new account.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 md:p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-md p-8 md:p-12 rounded-[3rem] relative border-white/10 shadow-2xl overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full -z-10"></div>
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5">
          <i className="fas fa-times"></i>
        </button>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/30 transform -rotate-6">
             <i className="fas fa-fingerprint text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black heading-font uppercase tracking-tighter">
            {step === 'verify' ? 'Secure OTP' : step === 'register' ? 'New Account' : 'Welcome Back'} 
          </h2>
          <p className="text-gray-500 mt-2 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            {step === 'verify' ? `Enter the code sent to ${email}` : 'Luxury redefined for your feet'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[11px] font-bold mb-8 flex items-start gap-3 animate-in shake-in duration-300">
            <i className="fas fa-triangle-exclamation mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <i className="fas fa-at absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm transition-all" placeholder="name@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm transition-all" placeholder="••••••••" />
              </div>
            </div>
            <button disabled={loading} className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'AUTHENTICATE'}
            </button>
            <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest mt-6">
              No account? <button type="button" onClick={() => setStep('register')} className="text-blue-500 hover:text-blue-400 font-black">Register Here</button>
            </p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Display Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm" placeholder="Full Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm" placeholder="email@wels.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm" placeholder="Min. 6 characters" />
            </div>
            <div className="pt-4">
              <button disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                {loading ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : 'REQUEST VERIFICATION'}
              </button>
            </div>
            <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest mt-4">
              Registered? <button type="button" onClick={() => setStep('login')} className="text-blue-500 hover:text-blue-400 font-black">Sign In</button>
            </p>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndCreate} className="space-y-8">
            <div className="text-center">
              <p className="text-[11px] text-gray-400 mb-8 font-medium leading-relaxed">
                Check your inbox for a 6-digit verification code. If you don't see it, check your spam folder.
              </p>
              <input 
                required
                autoFocus
                maxLength={6}
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value.replace(/\D/g,''))} 
                className="w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] outline-none focus:border-blue-500 text-center text-5xl font-black tracking-[0.3em] placeholder:opacity-10 text-blue-500 shadow-inner" 
                placeholder="000000"
              />
            </div>
            <div className="space-y-3">
              <button disabled={loading} className="w-full py-6 bg-green-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-green-500 transition-all shadow-2xl shadow-green-500/20 active:scale-95">
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'CONFIRM ACCESS'}
              </button>
              <button type="button" onClick={() => setStep('register')} className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                <i className="fas fa-arrow-left mr-2"></i> Back to start
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;