
import React from 'react';

const Background = () => {
  return (
    <div className="w-full h-64 md:h-96 relative mb-8">
      {/* Background with image */}
      <div 
        className="absolute inset-0 bg-[#171923] flex items-center justify-center"
      >
        {/* Using a high-quality firearm image */}
        <img 
          src="/firearms/gun1.jpg" 
          alt="Firearms and ammunition" 
          className="w-full h-full object-cover object-center"
          style={{ display: 'block', opacity: 0.8 }} // Force display as block element with slight transparency
          onError={(e) => {
            console.error('Image failed to load');
            e.currentTarget.src = '/firearms/default-firearm.jpg';
          }}
        />
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-8 py-6 rounded-lg bg-black/30 backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">AmmoAlley</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            The all-in-one platform for firearms enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Background;
