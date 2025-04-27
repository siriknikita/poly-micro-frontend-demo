import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, db } from '@/db/db';
import { useNavigate } from 'react-router-dom';

interface GuidanceContextType {
  isGuidanceVisible: boolean;
  isOnboarding: boolean;
  showGuidance: () => void;
  hideGuidance: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  completeGuidance: () => Promise<void>;
  shouldShowTooltipForStep: (step: number) => boolean;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

interface GuidanceProviderProps {
  children: React.ReactNode;
  currentUser: User | null;
}

export const TOTAL_GUIDANCE_STEPS = 11;

// Define step IDs for each onboarding step
export enum OnboardingStep {
  WELCOME = 0,
  SIDEBAR = 1,
  PROJECT_SELECTION = 2,
  SYSTEM_METRICS = 3,
  MICROSERVICES = 4,
  LOGS = 5,
  AUTOMATED_TESTING = 6,
  EXPAND_ALL_TESTS = 7,
  RUN_ALL_TESTS = 8,
  TEST_ASSISTANT = 9,
  COMPLETION = 10
}

export const GuidanceProvider: React.FC<GuidanceProviderProps> = ({ children, currentUser }) => {
  const navigate = useNavigate();
  const [isGuidanceVisible, setIsGuidanceVisible] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [needsScroll, setNeedsScroll] = useState<boolean>(false);

  // Check if user is in onboarding mode
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (currentUser && currentUser.id) {
        const isFirstTimeUser = currentUser.hasCompletedOnboarding === undefined;
        setIsOnboarding(isFirstTimeUser);
        
        // If user is in first-time onboarding, we'll store this information
        if (isFirstTimeUser) {
          localStorage.setItem('onboardingInProgress', 'true');
        }
      }
    };

    checkOnboardingStatus();
    
    // Clean up onboarding status when component unmounts
    return () => {
      if (!currentUser?.hasCompletedOnboarding) {
        localStorage.removeItem('onboardingInProgress');
      }
    };
  }, [currentUser]);

  const showGuidance = useCallback(() => {
    setCurrentStep(0);
    setIsGuidanceVisible(true);
    setIsOnboarding(true);
    localStorage.setItem('onboardingInProgress', 'true');
  }, []);

  const hideGuidance = useCallback(() => {
    setIsGuidanceVisible(false);
    // Note: We don't set isOnboarding to false here because the user might just be
    // temporarily dismissing the guidance but still in the onboarding process
  }, []);

  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, TOTAL_GUIDANCE_STEPS - 1);
    
    // Handle navigation between pages based on steps
    switch (currentStep) {
      case OnboardingStep.LOGS:
        if (newStep === OnboardingStep.AUTOMATED_TESTING) {
          // Navigate to testing page when moving from logs to automated testing
          navigate('/testing');
          // Set a longer delay to allow the page to load before showing the tooltip
          setTimeout(() => setCurrentStep(newStep), 800);
          return; // Return early to prevent the immediate step change
        }
        break;
        
      case OnboardingStep.MICROSERVICES:
        if (newStep === OnboardingStep.LOGS) {
          // Set flag to scroll to bottom of page before showing logs tooltip
          setNeedsScroll(true);
          setTimeout(() => setCurrentStep(newStep), 500);
          return;
        }
        break;
        
      case OnboardingStep.AUTOMATED_TESTING:
        if (newStep === OnboardingStep.EXPAND_ALL_TESTS) {
          // When moving to the expand all tests step, we want to highlight the expand button
          setCurrentStep(newStep);
          return;
        }
        break;
        
      case OnboardingStep.EXPAND_ALL_TESTS:
        if (newStep === OnboardingStep.RUN_ALL_TESTS) {
          // When moving to the run all tests step, we want to highlight the run all button
          setCurrentStep(newStep);
          return;
        }
        break;
        
      case OnboardingStep.RUN_ALL_TESTS:
        if (newStep === OnboardingStep.TEST_ASSISTANT) {
          // When moving to the test assistant step, we want to highlight the test assistant button
          setCurrentStep(newStep);
          return;
        }
        break;
    }
    
    // If we didn't return early from any of the special cases, update the step
    setCurrentStep(newStep);
  }, [currentStep, navigate]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_GUIDANCE_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const completeGuidance = useCallback(async () => {
    if (currentUser && currentUser.id) {
      try {
        // Update user in database to mark onboarding as completed
        await db.users.update(currentUser.id, { hasCompletedOnboarding: true });
        
        // Update in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.hasCompletedOnboarding = true;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        // Remove onboarding flag
        localStorage.removeItem('onboardingInProgress');
        
        setIsGuidanceVisible(false);
        setIsOnboarding(false);
      } catch (error) {
        console.error('Failed to update onboarding status:', error);
      }
    }
  }, [currentUser]);

  // Handle scrolling for specific steps
  useEffect(() => {
    if (needsScroll && currentStep === OnboardingStep.LOGS) {
      // Scroll to bottom of page to show logs
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
      setNeedsScroll(false);
    }
  }, [needsScroll, currentStep]);

  // Helper function to check if a component should show a tooltip for the current step
  const shouldShowTooltipForStep = useCallback((step: number) => {
    return isGuidanceVisible && currentStep === step;
  }, [isGuidanceVisible, currentStep]);

  return (
    <GuidanceContext.Provider
      value={{
        isGuidanceVisible,
        isOnboarding,
        showGuidance,
        hideGuidance,
        currentStep,
        totalSteps: TOTAL_GUIDANCE_STEPS,
        nextStep,
        prevStep,
        goToStep,
        completeGuidance,
        shouldShowTooltipForStep,
      }}
    >
      {children}
    </GuidanceContext.Provider>
  );
  
};

export const useGuidance = (): GuidanceContextType => {
  const context = useContext(GuidanceContext);
  if (context === undefined) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};
