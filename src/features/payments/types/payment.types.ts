export interface CheckoutInput {
  courseId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  success: boolean;
  redirectUrl: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}
