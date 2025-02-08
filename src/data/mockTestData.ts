import { TestItem } from '../types/testing';

export const mockTestData: TestItem[] = [
  {
    id: 'ms-1',
    name: 'User Service',
    type: 'microservice',
    children: [
      {
        id: 'fn-1',
        name: 'authenticateUser',
        type: 'function',
        children: [
          {
            id: 'test-1',
            name: 'should authenticate valid credentials',
            type: 'test-case'
          },
          {
            id: 'test-2',
            name: 'should reject invalid password',
            type: 'test-case'
          }
        ]
      },
      {
        id: 'fn-2',
        name: 'updateUserProfile',
        type: 'function',
        children: [
          {
            id: 'test-3',
            name: 'should update user details',
            type: 'test-case'
          }
        ]
      }
    ]
  },
  {
    id: 'ms-2',
    name: 'Payment Service',
    type: 'microservice',
    children: [
      {
        id: 'fn-3',
        name: 'processPayment',
        type: 'function',
        children: [
          {
            id: 'test-4',
            name: 'should process valid payment',
            type: 'test-case'
          },
          {
            id: 'test-5',
            name: 'should handle declined transactions',
            type: 'test-case'
          }
        ]
      }
    ]
  },
  {
    id: 'ms-3',
    name: 'Notification Service',
    type: 'microservice',
    children: [
      {
        id: 'fn-4',
        name: 'sendEmail',
        type: 'function',
        children: [
          {
            id: 'test-6',
            name: 'should send email successfully',
            type: 'test-case'
          }
        ]
      },
      {
        id: 'fn-5',
        name: 'sendPushNotification',
        type: 'function',
        children: [
          {
            id: 'test-7',
            name: 'should send push notification',
            type: 'test-case'
          }
        ]
      }
    ]
  }
];