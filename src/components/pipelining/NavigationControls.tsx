import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Service } from '@/types';

interface NavigationControlsProps {
  onNavigate: (direction: 'up' | 'down') => void;
  currentService: Service;
  services: Service[];
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNavigate,
  currentService,
  services
}) => {
  const currentIndex = services.findIndex(s => s.name === currentService.name);

  return (
    <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
      <button
        onClick={() => onNavigate('up')}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        title={`Previous: ${services[(currentIndex - 1 + services.length) % services.length].name}`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <button
        onClick={() => onNavigate('down')}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        title={`Next: ${services[(currentIndex + 1) % services.length].name}`}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
};
