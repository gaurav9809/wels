
import React, { useState, useEffect } from 'react';

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
    if ((window as any).emailjs) {
      (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const sendEmail = async (targetEmail: string, targetName: string, code: string) => {
    const sdk = (window as any).emailjs;
    if (!sdk) return { success: false, error: "EmailJS SDK not found" };

    // Sabse important check: email khali toh nahi?
    if (!targetEmail || targetEmail.trim() === "") {
      return { success: false, error: "Recipient email is missing." };
    }

    try {
      const templateParams = { 
        to_name: targetName, 
        user_email: targetEmail.trim(), // Aapke template mein {{user_email}} hona chahiye
        otp_code: code,
        message: `Your WELS verification code is: ${code}`
      };
      
      await sdk.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.text || "SMTP Error" };
    }
  };

  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Yahan hum state ki jagah direct input se value le rahe hain safety ke liye
    const currentEmail = email.trim();
    const currentName = name.trim();

    if (!currentEmail || !currentName) {
      setError("Please enter both Name and Email.");
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
      // Agar error aaye toh hum code display kar denge taki user block na ho
      setError(`Notice: ${result.error}. Dev Code: ${code}`);
      setStep('verify');
    }
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Incorrect verification code.');
      return;
    }

    const userData = { 
      name, 
      email, 
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user' 
    };
    
    setStep('success');
    setTimeout(() => onLogin(userData), 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: 'User', email, role: email.includes('admin') ? 'admin' : 'user' });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] relative border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <i className="fas fa-times"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {step === 'register' ? 'Join WELS' : step === 'verify' ? 'Verify Email' : step === 'success' ? 'Welcome!' : 'Login'}
          </h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-xl text-center font-bold uppercase">{error}</div>}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500" placeholder="Password" />
            <button className="w-full py-4 bg-white text-black rounded-xl font-black tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all">SIGN IN</button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-4">No account? <button type="button" onClick={() => setStep('register')} className="text-blue-500">Register</button></p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-4">
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500" placeholder="Full Name" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500" placeholder="Password" />
            <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black tracking-widest text-xs shadow-lg shadow-blue-600/20">
              {loading ? 'SENDING CODE...' : 'GET VERIFICATION CODE'}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-4">Already a member? <button type="button" onClick={() => setStep('login')} className="text-blue-500">Login</button></p>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndCreate} className="space-y-6">
            <input required maxLength={6} type="text" value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-3xl font-black tracking-[0.5em]" placeholder="000000" />
            <button className="w-full py-4 bg-green-600 text-white rounded-xl font-black tracking-widest text-xs shadow-lg shadow-green-600/20">VERIFY & REGISTER</button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-10">
            <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <p className="font-black text-xl uppercase">Success!</p>
            <p className="text-[10px] text-gray-500 mt-2">Redirecting to store...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
