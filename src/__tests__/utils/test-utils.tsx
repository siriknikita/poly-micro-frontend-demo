import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// Interface for the extended render result
interface CustomRenderResult extends ReturnType<typeof rtlRender> {
  user: ReturnType<typeof userEvent.setup>;
}

// Custom render function that includes the AllProviders wrapper
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): CustomRenderResult {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: AllProviders,
      ...options,
    }),
  };
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the render method with our customized version
export { customRender as render };
