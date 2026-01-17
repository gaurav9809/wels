
import React, { useState } from 'react';

const reviews = [
  { name: 'Alex Thompson', role: 'Pro Marathoner', text: 'Velocity shoes changed the game for my training. The energy return is unmatched.', stars: 5 },
  { name: 'Sarah Jenkins', role: 'Sneakerhead', text: 'The cleanest design in my collection. I get compliments every time I wear my V-PROs.', stars: 5 },
  { name: 'Marcus Chen', role: 'Daily Commuter', text: 'Finally a shoe that combines serious comfort with actual durability. 10/10 recommended.', stars: 4 },
];

const Reviews: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center reveal">
        <i className="fas fa-quote-left text-6xl text-blue-600/20 mb-8"></i>
        <div className="relative h-64 md:h-48">
          {reviews.map((r, i) => (
            <div 
              key={i} 
              className={`absolute inset-0 transition-all duration-700 transform ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
              <p className="text-2xl md:text-3xl font-medium max-w-3xl mx-auto italic mb-8">
                "{r.text}"
              </p>
              <h4 className="text-xl font-bold">{r.name}</h4>
              <p className="text-blue-500 uppercase tracking-widest text-sm">{r.role}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          {reviews.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === active ? 'bg-blue-600 w-10' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
