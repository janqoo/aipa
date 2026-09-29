import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          About AI Perfume Assistant
        </h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              AI Perfume Assistant is an intelligent fragrance recommendation system built as a graduation project 
              for Istanbul Okan University's Computer Engineering program.
            </p>
            <p className="text-gray-600 mb-4">
              This project demonstrates modern web development practices using React, TypeScript, and AWS serverless 
              architecture, adapted from a successful library recommendation system.
            </p>
            <p className="text-gray-600">
              The system uses AI to help users discover their perfect fragrance based on preferences, mood, and lifestyle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;