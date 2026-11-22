import React, { useEffect } from 'react';
import { RecommendationStudio } from '../components/recommendation/RecommendationStudio';

export const RecommendationsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#EDF5F0] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <RecommendationStudio />
      </div>
    </div>
  );
};
