import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchProductById, deleteProduct } from "@/api/products";
import { addToCart } from "@/api/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(product!.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("장바구니에 담겼습니다.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(msg ?? "장바구니 추가에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("상품이 삭제되었습니다.");
      navigate("/");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(msg ?? "상품 삭제에 실패했습니다.");
    },
  });

  if (isLoading) return <div className="flex justify-center py-20">불러오는 중...</div>;
  if (isError || !product) return <div className="flex justify-center py-20 text-destructive">상품을 찾을 수 없습니다.</div>;

  const isSoldOut = product.stock === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          ← 목록으로
        </Link>
        <Button
          variant="destructive"
          size="sm"
          disabled={deleteMutation.isPending}
          onClick={() => {
            if (confirm("상품을 삭제하시겠습니까?")) deleteMutation.mutate();
          }}
        >
          상품 삭제
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              이미지 없음
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {isSoldOut && <Badge variant="destructive" className="mt-2">품절</Badge>}
          </div>

          <p className="text-3xl font-bold">{product.price.toLocaleString()}원</p>

          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          )}

          <p className="text-sm text-muted-foreground">재고: {product.stock}개</p>

          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded border flex items-center justify-center hover:bg-muted"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isSoldOut}
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              className="w-8 h-8 rounded border flex items-center justify-center hover:bg-muted"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={isSoldOut}
            >
              +
            </button>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              className="flex-1"
              variant="outline"
              disabled={isSoldOut || addToCartMutation.isPending}
              onClick={() => addToCartMutation.mutate()}
            >
              장바구니 담기
            </Button>
            <Button
              className="flex-1"
              disabled={isSoldOut || addToCartMutation.isPending}
              onClick={async () => {
                await addToCartMutation.mutateAsync();
                navigate("/cart");
              }}
            >
              바로 구매
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
