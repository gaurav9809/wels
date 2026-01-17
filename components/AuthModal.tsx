
import React, { useState, useEffect } from 'react';

/**
 * EMAILJS CONFIGURATION:
 * Public Key: RsSh8gz6mGD7O6Z8q
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
    // Ensure EmailJS is initialized
    if ((window as any).emailjs) {
      (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const getRegisteredUsers = () => {
    const data = localStorage.getItem('wels_registered_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUserToDB = (userData: any) => {
    const users = getRegisteredUsers();
    users.push(userData);
    localStorage.setItem('wels_registered_users', JSON.stringify(users));
  };

  const sendEmail = async (userEmail: string, userName: string, code: string) => {
    const sdk = (window as any).emailjs;
    if (!sdk) return { success: false, error: "Email Service not loaded." };

    // Validating email presence before sending to prevent "Recipient address is empty" error
    if (!userEmail || userEmail.trim() === "") {
      return { success: false, error: "Email address is required." };
    }

    try {
      const templateParams = { 
        to_name: userName, 
        user_email: userEmail, // Primary variable for most templates
        reply_to: "noreply@wels.shoes",
        message: `Your WELS verification code is: ${code}`,
        otp_code: code 
      };
      
      const response = await sdk.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log("EmailJS Success:", response);
      return { success: true };
    } catch (err: any) {
      console.error("EmailJS Error details:", err);
      return { success: false, error: err.text || "SMTP Error" };
    }
  };

  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Capture current values locally to avoid state lag issues
    const currentEmail = email.trim();
    const currentName = name.trim();

    if (pass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const users = getRegisteredUsers();
    if (users.find((u: any) => u.email.toLowerCase() === currentEmail.toLowerCase())) {
      setError('This email is already registered.');
      return;
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    const result = await sendEmail(currentEmail, currentName, code);
    setLoading(false);

    if (result.success) {
      setStep('verify');
    } else {
      // If EmailJS fails (like daily limit or config issue), we show the code so you aren't blocked
      setError(`Verification notice: ${result.error}. Dev Code: ${code}`);
      setStep('verify');
    }
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('The code you entered is incorrect.');
      return;
    }

    setLoading(true);
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@wels.com';
    const userData = { 
      name: name, 
      email: email, 
      role: isAdmin ? 'admin' : 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    // Persist and redirect
    saveUserToDB(userData);
    setStep('success');
    setLoading(false);
    
    // Brief delay to show the success checkmark then log in
    setTimeout(() => {
      onLogin(userData);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const users = getRegisteredUsers();
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        onLogin(foundUser);
      } else if (email.toLowerCase() === 'admin@wels.com') { 
        // Admin quick access
        const adminUser = { name: 'Admin User', email: 'admin@wels.com', role: 'admin' };
        onLogin(adminUser);
      } else {
        setError('No account found with these credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] relative border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <i className="fas fa-times"></i>
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <i className={`fas ${step === 'success' ? 'fa-check' : step === 'verify' ? 'fa-envelope-open-text' : 'fa-lock'} text-white text-2xl`}></i>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {step === 'success' ? 'Verified!' : step === 'verify' ? 'Verification' : step === 'register' ? 'Join WELS' : 'Member Login'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="your@email.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="••••••••" />
            </div>
            <button disabled={loading} className="w-full py-4 bg-white text-black rounded-xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'SIGN IN'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-6">
              Need an account? <button type="button" onClick={() => setStep('register')} className="text-blue-500">Register</button>
            </p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="your@email.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Min 6 chars" />
            </div>
            <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-purple-600 transition-all shadow-xl">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'GET OTP CODE'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-6">
              Back to <button type="button" onClick={() => setStep('login')} className="text-blue-500">Login</button>
            </p>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndCreate} className="space-y-6">
            <p className="text-center text-xs text-gray-400">Enter the 6-digit code sent to your email.</p>
            <input required maxLength={6} type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-4xl font-black tracking-[0.4em] outline-none focus:border-blue-500" placeholder="000000" />
            <button disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-green-500 transition-all">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'COMPLETE REGISTRATION'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-10 text-center animate-in zoom-in-95 duration-500">
            <i className="fas fa-check-circle text-7xl text-green-500 mb-6"></i>
            <p className="text-xl font-black uppercase">Account Created</p>
            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">Redirecting to store...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
