import { getStatusVariant, variantClasses } from '@/components/monitoring/shared/statusUtils';

describe('statusUtils', () => {
  describe('variantClasses', () => {

    it('should define classes for all badge variants', () => {
      /**
       * Steps:
       * 1. Check for initial state
       * 2. Check for all badge variants
       */
      expect(variantClasses).toHaveProperty('success');
      expect(variantClasses).toHaveProperty('warning');
      expect(variantClasses).toHaveProperty('error');
      expect(variantClasses).toHaveProperty('info');
    });

    it('should have the correct format for class strings', () => {
      /**
       * Steps:
       * 1. Check for initial state
       * 2. Check for correct format
       */
      Object.values(variantClasses).forEach(classString => {
        expect(classString).toMatch(/bg-[a-z]+-\d+/); // Check for background classes
        expect(classString).toMatch(/text-[a-z]+-\d+/); // Check for text classes
        expect(classString).toMatch(/dark:/); // Check for dark mode classes
      });
    });
  });

  describe('getStatusVariant', () => {
    it('should return "success" for successful statuses', () => {
      /**
       * Steps:
       * 1. Check for initial state
       * 2. Check for successful statuses
       */
      const successStatuses = ['running', 'healthy', 'active', 'online'];
      
      successStatuses.forEach(status => {
        expect(getStatusVariant(status)).toBe('success');
        // Test case insensitivity
        expect(getStatusVariant(status.toUpperCase())).toBe('success');
      });
    });

    it('should return "warning" for warning statuses', () => {
      /**
       * Steps:
       * 1. Check for initial state
       * 2. Check for warning statuses
       */
      const warningStatuses = ['warning', 'degraded', 'unstable'];
      
      warningStatuses.forEach(status => {
        expect(getStatusVariant(status)).toBe('warning');
        // Test case insensitivity
        expect(getStatusVariant(status.toUpperCase())).toBe('warning');
      });
    });

    it('should return "error" for error statuses', () => {
      /**
       * Steps:
       * 1. Check for initial state
       * 2. Check for error statuses
       */
      const errorStatuses = ['error', 'critical', 'down', 'offline', 'failed'];
      
      errorStatuses.forEach(status => {
        expect(getStatusVariant(status)).toBe('error');
        // Test case insensitivity
        expect(getStatusVariant(status.toUpperCase())).toBe('error');
      });
    });

    it('should return "info" as the default for unknown statuses', () => {
      /**
       * Steps:
       * 1. Check for initial state
       * 2. Check for unknown statuses
       */
      const unknownStatuses = ['unknown', 'pending', 'some-random-status', ''];
      
      unknownStatuses.forEach(status => {
        expect(getStatusVariant(status)).toBe('info');
      });
    });
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the getStatusVariant function <br> - Check for initial state <br> - Check for successful statuses | should return "success" for successful statuses | + |
 * | 2 | Web Browser | - Render the getStatusVariant function <br> - Check for initial state <br> - Check for successful statuses | should return "warning" for warning statuses | + |
 * | 3 | Web Browser | - Render the getStatusVariant function <br> - Check for initial state <br> - Check for successful statuses | should return "error" for error statuses | + |
 * | 4 | Web Browser | - Render the getStatusVariant function <br> - Check for initial state <br> - Check for successful statuses | should return "info" as the default for unknown statuses | + |
 */