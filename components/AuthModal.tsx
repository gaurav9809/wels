
import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // SPECIAL MASTER ADMIN AUTHENTICATION
    // You can use this special email/pass to bypass standard registration
    if (email === 'admin@wels.com' && pass === 'master123') {
      onLogin({ name: 'System Admin', email, role: 'admin' });
      return;
    }

    // Standard User Simulation (Check if registered in local storage)
    const users = JSON.parse(localStorage.getItem('wels_registered_users') || '[]');
    const found = users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (found) {
      onLogin(found);
    } else {
      setError('Unauthorized access or user not found. Use Master Admin keys or register.');
    }
  };

  const handleRegister = () => {
    const newUser = { name: 'New User', email, role: 'user' };
    const users = JSON.parse(localStorage.getItem('wels_registered_users') || '[]');
    users.push(newUser);
    localStorage.setItem('wels_registered_users', JSON.stringify(users));
    onLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><i className="fas fa-times"></i></button>
        <h2 className="text-3xl font-black heading-font uppercase mb-2">Secure <span className="text-blue-500">Access</span></h2>
        <p className="text-[10px] tech-font text-gray-500 uppercase tracking-widest mb-10">Verification Protocol Required</p>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black rounded-xl uppercase">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" placeholder="Identity (Email)" />
          <input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" placeholder="Access Key" />
          
          <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all uppercase tech-font">
            Authorize Session
          </button>
          
          <div className="flex items-center gap-4 py-6">
            <div className="h-[1px] flex-1 bg-white/5"></div>
            <span className="text-[9px] font-black text-gray-700">OR</span>
            <div className="h-[1px] flex-1 bg-white/5"></div>
          </div>

          <button type="button" onClick={handleRegister} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white">
            Create Basic Citizen Account
          </button>
        </form>
        
        <div className="mt-10 p-4 border border-blue-500/10 rounded-2xl">
           <p className="text-[8px] text-gray-600 tech-font uppercase tracking-widest leading-relaxed">
             Special Authenticate: Use <span className="text-blue-500">admin@wels.com</span> / <span className="text-blue-500">master123</span> for full site control.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
