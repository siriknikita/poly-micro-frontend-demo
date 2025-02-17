import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { CPUData, Service } from '../../types/monitoring';
import { BoxedWrapper } from '../shared/BoxedWrapper';

const tooltipFormatter = (value: number) => value.toFixed(2);

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
        <p className="label">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

interface CPUChartProps {
  data: CPUData[] | null;
  selectedService: string | null;
  services: Service[];
  onServiceSelect: (service: string) => void;
}

export const CPUChart: React.FC<CPUChartProps> = ({ 
  data, 
  selectedService, 
  services,
  onServiceSelect 
}) => {
  return (
    <BoxedWrapper className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
          <Activity className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          System Metrics
        </h3>
        <select
          value={selectedService || ''}
          onChange={(e) => onServiceSelect(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.name} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
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
              <Line type="monotone" dataKey="load" stroke="#4f46e5" name="CPU Load %" formatter={tooltipFormatter} />
              <Line type="monotone" dataKey="memory" stroke="#059669" name="Memory Usage %" formatter={tooltipFormatter} />
              <Line type="monotone" dataKey="threads" stroke="#db2777" name="Active Threads" formatter={tooltipFormatter} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </BoxedWrapper>
  );
};
