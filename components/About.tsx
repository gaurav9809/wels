
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 reveal">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800" 
              className="relative rounded-3xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              alt="Brand Story"
            />
          </div>
        </div>
        <div className="flex-1 reveal">
          <h2 className="text-4xl md:text-5xl font-black heading-font mb-6">
            WE ARE <span className="text-blue-500">VELOCITY</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Founded in 2024, Velocity was born from a simple mission: to revolutionize how people move. We believe that footwear should be an extension of your personality, merging high-tech engineering with unparalleled style.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <i className="fas fa-check text-[10px] text-white"></i>
              </div>
              <p className="font-semibold">Eco-Friendly Manufacturing</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <i className="fas fa-check text-[10px] text-white"></i>
              </div>
              <p className="font-semibold">Lightweight Carbon-Fiber Soles</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <i className="fas fa-check text-[10px] text-white"></i>
              </div>
              <p className="font-semibold">Adaptive Fit Technology</p>
            </div>
          </div>
          <button className="mt-10 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all">
            DISCOVER OUR MISSION
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
