import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorMessage = searchParams.get("message") ?? "결제에 실패했습니다.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="text-6xl">❌</div>
      <h1 className="text-2xl font-bold">결제 실패</h1>
      <p className="text-muted-foreground text-center">{errorMessage}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/cart")}>장바구니로 돌아가기</Button>
        <Button onClick={() => navigate("/")}>홈으로</Button>
      </div>
    </div>
  );
}
