import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectProvider } from '@/context/ProjectContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from 'react-toastify';

// Interface for providers props
interface ProvidersProps {
  children: React.ReactNode;
}

// Add any providers that components need to the wrapper
function AllProviders({ children }: ProvidersProps): JSX.Element {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </ProjectProvider>
    </BrowserRouter>
  );
}

export default AllProviders;
