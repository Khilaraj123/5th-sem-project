import apiClient from '../../../lib/axios';
import type { SendEmailInput, SendPushInput, SendInAppInput } from '../types/notification.types';

export const sendEmailNotification = async (input: SendEmailInput): Promise<{ message: string }> => {
  const { email, subject, message } = input;
  const response = await apiClient.post<{ message: string }>(
    `/notifications/email?email=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}`,
    JSON.stringify(message),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const sendPushNotification = async (input: SendPushInput): Promise<{ message: string }> => {
  const { userId, title, message } = input;
  const response = await apiClient.post<{ message: string }>(
    `/notifications/push?userId=${userId}&title=${encodeURIComponent(title)}`,
    JSON.stringify(message),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const sendInAppNotification = async (input: SendInAppInput): Promise<{ message: string }> => {
  const { userId, title, message } = input;
  const response = await apiClient.post<{ message: string }>(
    `/notifications/in-app?userId=${userId}&title=${encodeURIComponent(title)}`,
    JSON.stringify(message),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
