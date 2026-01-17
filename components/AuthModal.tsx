
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

  const sendEmail = async (userEmail: string, userName: string, code: string) => {
    const sdk = (window as any).emailjs;
    if (!sdk) return { success: false, error: "Email service not ready." };

    try {
      const templateParams = { 
        to_name: userName, 
        user_email: userEmail.trim(), // This must match the field in your EmailJS template
        otp_code: code,
        message: `Your verification code is ${code}`
      };
      
      await sdk.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.text || "Failed to send email." };
    }
  };

  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const targetEmail = email.trim();
    const targetName = name.trim();

    if (!targetEmail || !targetName) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    const result = await sendEmail(targetEmail, targetName, code);
    setLoading(false);

    if (result.success) {
      setStep('verify');
    } else {
      // Bypassing error for demo if SMTP fails, but showing the code
      setError(`Notice: ${result.error}. Dev Bypass Code: ${code}`);
      setStep('verify');
    }
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Incorrect code.');
      return;
    }

    const userData = { 
      name, 
      email, 
      role: email.includes('admin') ? 'admin' : 'user' 
    };
    
    setStep('success');
    setTimeout(() => onLogin(userData), 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simple login simulation
    setTimeout(() => {
      onLogin({ name: 'User', email, role: email.includes('admin') ? 'admin' : 'user' });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] relative border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <i className="fas fa-times"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase">
            {step === 'register' ? 'Create Account' : step === 'verify' ? 'Enter Code' : 'Welcome Back'}
          </h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">{error}</div>}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" placeholder="Password" />
            <button className="w-full py-4 bg-white text-black rounded-xl font-black">LOGIN</button>
            <p className="text-center text-xs text-gray-500">No account? <button type="button" onClick={() => setStep('register')} className="text-blue-500">Register</button></p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-4">
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" placeholder="Full Name" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" placeholder="Email" />
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" placeholder="Password (min 6)" />
            <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black">
              {loading ? 'SENDING...' : 'REGISTER'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndCreate} className="space-y-4">
            <input required type="text" value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-2xl font-black" placeholder="000000" />
            <button className="w-full py-4 bg-green-600 text-white rounded-xl font-black">VERIFY</button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-10">
            <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <p className="font-bold">SUCCESS! LOGGING IN...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
