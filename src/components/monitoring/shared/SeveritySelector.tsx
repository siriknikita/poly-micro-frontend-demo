import React from 'react';
import { Dropdown, DropdownOption, DropdownSectionProps } from '@/components/shared/Dropdown';
import { SEVERITY_LEVELS } from '@constants';

interface SeveritySelectorProps {
  selectedSeverity: string;
  onSeverityChange: (severity: string) => void;
  className?: string;
  label?: string;
}

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({
  selectedSeverity,
  onSeverityChange,
  className = '',
  label = 'All Severities'
}) => {
  // Transform severity levels to dropdown options
  const severityOptions: DropdownOption[] = SEVERITY_LEVELS.map(severity => ({
    id: severity,
    label: severity
  }));
  
  // Add 'All' option
  const allOption: DropdownOption[] = [
    { id: 'All', label: 'All Severities' }
  ];
  
  // Create sections for the dropdown
  const sections: DropdownSectionProps[] = [
    {
      options: allOption,
      onSelect: onSeverityChange
    },
    {
      options: severityOptions,
      onSelect: onSeverityChange
    }
  ];
  
  return (
    <Dropdown
      buttonLabel={label}
      selectedOption={selectedSeverity}
      sections={sections}
      className={className}
      testId="severity-selector"
    />
  );
};
