import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmPayment } from "@/api/payments";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirmed = useRef(false);

  const paymentKey = searchParams.get("paymentKey") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const amount = Number(searchParams.get("amount") ?? 0);

  const mutation = useMutation({
    mutationFn: () => confirmPayment({ paymentKey, orderId, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("결제가 완료되었습니다!");
    },
    onError: () => toast.error("결제 승인에 실패했습니다."),
  });

  useEffect(() => {
    if (confirmed.current || !paymentKey || !orderId || !amount) return;
    confirmed.current = true;
    mutation.mutate();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      {mutation.isPending && <p className="text-muted-foreground">결제 승인 중...</p>}

      {mutation.isSuccess && (
        <>
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold">결제 완료</h1>
          <p className="text-muted-foreground">{amount.toLocaleString()}원 결제가 완료되었습니다.</p>
          <Button onClick={() => navigate("/")}>쇼핑 계속하기</Button>
        </>
      )}

      {mutation.isError && (
        <>
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold">결제 승인 실패</h1>
          <Button variant="outline" onClick={() => navigate("/cart")}>장바구니로 돌아가기</Button>
        </>
      )}
    </div>
  );
}
