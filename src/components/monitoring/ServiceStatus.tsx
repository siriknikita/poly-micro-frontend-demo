import React, { memo } from 'react';
import { Server } from 'lucide-react';
import { Service } from '@types';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { StatusBadge, getStatusVariant } from './shared';

interface ServiceStatusProps {
  services: Service[];
}

export const ServiceStatus: React.FC<ServiceStatusProps> = memo(({ services }) => {
  return (
    <BoxedWrapper>
      <SectionHeader
        title="Services Status"
        HeaderIcon={Server}
        headerClassName="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100"
        iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <div key={index} className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{service.name}</h4>
            <div className="space-y-2 mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Port: {service.port}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Version: {service.version}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uptime: {service.uptime}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <StatusBadge status={service.status} variant={getStatusVariant(service.status)} />
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Health: <StatusBadge status={service.health} variant={getStatusVariant(service.health)} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </BoxedWrapper>
  );
});
