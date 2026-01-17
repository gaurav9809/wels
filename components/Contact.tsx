
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        <div className="reveal">
          <h2 className="text-4xl font-black heading-font mb-6 uppercase">Get in <span className="text-blue-500">Touch</span></h2>
          <p className="text-gray-400 mb-10">Have questions about sizing, drops, or shipping? Our team is available 24/7 to help you move faster.</p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-blue-500">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase">Email Us</p>
                <p className="font-bold">hello@velocity.shoes</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-blue-500">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase">Call Us</p>
                <p className="font-bold">+1 (888) VELOCITY</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-blue-500">
                <i className="fas fa-location-dot"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase">HQ Office</p>
                <p className="font-bold">123 Futurist Way, Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl reveal">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">FULL NAME</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">EMAIL</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">SUBJECT</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all appearance-none">
                <option>General Inquiry</option>
                <option>Shipping Question</option>
                <option>Refund/Exchange</option>
                <option>Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">MESSAGE</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
