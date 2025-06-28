import React from "react";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mb-2 text-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
        Coming Soon
      </h1>
      <p className="text-gray-600 text-lg">
        We're working hard to bring you this feature. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
