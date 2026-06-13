import apiClient from '../../../lib/axios';
import type { CheckoutInput, CheckoutResponse, VerifyPaymentResponse } from '../types/payment.types';

export const createStripeCheckout = async (data: CheckoutInput): Promise<CheckoutResponse> => {
  const response = await apiClient.post<CheckoutResponse>('/payments/checkout/stripe', data);
  return response.data;
};

export const createKhaltiCheckout = async (data: CheckoutInput): Promise<CheckoutResponse> => {
  const response = await apiClient.post<CheckoutResponse>('/payments/checkout/khalti', data);
  return response.data;
};

export const createEsewaCheckout = async (data: CheckoutInput): Promise<CheckoutResponse> => {
  const response = await apiClient.post<CheckoutResponse>('/payments/checkout/esewa', data);
  return response.data;
};

export const verifyStripePayment = async (sessionId: string): Promise<VerifyPaymentResponse> => {
  const response = await apiClient.get<VerifyPaymentResponse>(`/payments/verify/stripe?sessionId=${sessionId}`);
  return response.data;
};

export const verifyKhaltiPayment = async (pidx: string): Promise<VerifyPaymentResponse> => {
  const response = await apiClient.get<VerifyPaymentResponse>(`/payments/verify/khalti?pidx=${pidx}`);
  return response.data;
};

export const verifyEsewaPayment = async (transactionId: string): Promise<VerifyPaymentResponse> => {
  const response = await apiClient.get<VerifyPaymentResponse>(`/payments/verify/esewa?transactionId=${transactionId}`);
  return response.data;
};
