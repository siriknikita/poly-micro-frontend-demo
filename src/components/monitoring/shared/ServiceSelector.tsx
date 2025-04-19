import React from 'react';
import { Service } from '@types';

interface ServiceSelectorProps {
  selectedService: string | null;
  services: Service[];
  onServiceSelect: (service: string) => void;
  className?: string;
  label?: string;
  showAllOption?: boolean;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  services,
  onServiceSelect,
  className = '',
  label = 'Select a service',
  showAllOption = false
}) => {
  const baseClasses = 'rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400';
  
  return (
    <select
      value={selectedService || ''}
      onChange={(e) => onServiceSelect(e.target.value)}
      className={`${baseClasses} ${className}`}
      aria-label={label}
    >
      <option value="">{label}</option>
      {showAllOption && (
        <option value="All">All Services</option>
      )}
      {services.map((service) => (
        <option key={service.name} value={service.name}>
          {service.name}
        </option>
      ))}
    </select>
  );
};
