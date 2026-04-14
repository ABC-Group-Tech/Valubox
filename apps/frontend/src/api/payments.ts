import apiClient from "./client";

export async function confirmPayment(payload: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<void> {
  await apiClient.post("/api/payments/confirm", payload);
}
