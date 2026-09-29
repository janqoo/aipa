import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600">
              This is an academic project developed for educational purposes. 
              Privacy policy will be added when the application is ready for production use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;