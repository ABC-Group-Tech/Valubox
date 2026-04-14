import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmPayment } from "@/api/payments";
import { Button } from "@/components/ui/button";

type Status = "pending" | "success" | "error";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("pending");

  const paymentKey = searchParams.get("paymentKey") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const amount = Number(searchParams.get("amount") ?? 0);

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      return;
    }

    let active = true;

    confirmPayment({ paymentKey, orderId, amount })
      .then(() => {
        if (!active) return;
        setStatus("success");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        toast.success("결제가 완료되었습니다!");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        toast.error("결제 승인에 실패했습니다.");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      {status === "pending" && (
        <p className="text-muted-foreground">결제 승인 중...</p>
      )}

      {status === "success" && (
        <>
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold">결제 완료</h1>
          <p className="text-muted-foreground">
            {amount.toLocaleString()}원 결제가 완료되었습니다.
          </p>
          <Button onClick={() => navigate("/")}>쇼핑 계속하기</Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold">결제 승인 실패</h1>
          <Button variant="outline" onClick={() => navigate("/cart")}>
            장바구니로 돌아가기
          </Button>
        </>
      )}
    </div>
  );
}
