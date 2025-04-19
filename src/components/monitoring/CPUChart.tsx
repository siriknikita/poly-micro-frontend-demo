import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend, ResponsiveContainer } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Activity } from 'lucide-react';
import { CPUData, Service } from '@types';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { ServiceSelector } from './shared';

const CustomTooltip = memo(({ active, payload, label }: Partial<TooltipProps<ValueType, NameType>>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
        <p className="label">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
});

interface CPUChartProps {
  data: CPUData[] | null;
  selectedService: string | null;
  services: Service[];
  onServiceSelect: (service: string) => void;
}

export const CPUChart: React.FC<CPUChartProps> = memo(({ 
  data, 
  selectedService, 
  services,
  onServiceSelect 
}) => {
  return (
    <BoxedWrapper className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          title="System Metrics"
          HeaderIcon={Activity}
          headerClassName="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100"
          iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
        />
        <ServiceSelector
          selectedService={selectedService}
          services={services}
          onServiceSelect={onServiceSelect}
        />
      </div>
      
      {!selectedService ? (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Please select a microservice to view its metrics
        </div>
      ) : !data ? (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No metrics available for this service
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="time" 
                className="text-gray-900 dark:text-gray-400"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                className="text-gray-900 dark:text-gray-400"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="load" stroke="#4f46e5" name="CPU Load %" />
              <Line type="monotone" dataKey="memory" stroke="#059669" name="Memory Usage %" />
              <Line type="monotone" dataKey="threads" stroke="#db2777" name="Active Threads" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </BoxedWrapper>
  );
});
