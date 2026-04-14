import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { fetchCart, updateCartItem, removeCartItem } from "@/api/cart";
import { createOrder } from "@/api/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("수량 변경에 실패했습니다."),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("상품 삭제에 실패했습니다."),
  });

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    try {
      const order = await createOrder(cart.id);
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: cart.sessionId });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: order.totalAmount },
        orderId: order.id,
        orderName: cart.items.length === 1
          ? cart.items[0].product.name
          : `${cart.items[0].product.name} 외 ${cart.items.length - 1}건`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      toast.error("결제 요청에 실패했습니다.");
    }
  };

  const totalAmount = cart?.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) ?? 0;

  if (isLoading) return <div className="flex justify-center py-20">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-sm text-muted-foreground hover:underline">← 쇼핑 계속하기</Link>
        <h1 className="text-2xl font-bold">장바구니</h1>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">장바구니가 비어있습니다.</p>
          <Link to="/"><Button variant="outline">쇼핑하러 가기</Button></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {item.product.images[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    이미지 없음
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">{item.product.price.toLocaleString()}원</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 rounded border flex items-center justify-center hover:bg-muted text-sm"
                    onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                    disabled={item.quantity <= 1 || updateMutation.isPending}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    className="w-7 h-7 rounded border flex items-center justify-center hover:bg-muted text-sm"
                    onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    disabled={updateMutation.isPending}
                  >
                    +
                  </button>
                </div>

                <p className="font-bold w-24 text-right">
                  {(item.product.price * item.quantity).toLocaleString()}원
                </p>

                <button
                  className="text-muted-foreground hover:text-destructive text-sm ml-2"
                  onClick={() => removeMutation.mutate(item.id)}
                  disabled={removeMutation.isPending}
                >
                  삭제
                </button>
              </CardContent>
            </Card>
          ))}

          <div className="border-t pt-4 flex items-center justify-between">
            <p className="text-lg font-medium">총 결제금액</p>
            <p className="text-2xl font-bold">{totalAmount.toLocaleString()}원</p>
          </div>

          <Button size="lg" className="w-full" onClick={handleCheckout}>
            결제하기
          </Button>
        </div>
      )}
    </div>
  );
}
