import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "@/api/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  if (isLoading) return <div className="flex justify-center py-20">불러오는 중...</div>;
  if (isError) return <div className="flex justify-center py-20 text-destructive">오류가 발생했습니다.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Valubox</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/new">
            <Button variant="outline">상품 등록</Button>
          </Link>
          <Link to="/cart">
            <Button>장바구니</Button>
          </Link>
        </div>
      </div>

      {data?.data.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">등록된 상품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-0">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-muted rounded-t-lg flex items-center justify-center text-muted-foreground text-sm">
                      이미지 없음
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-1 p-3">
                  <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                  <p className="font-bold text-base">{product.price.toLocaleString()}원</p>
                  {product.stock === 0 && <Badge variant="destructive">품절</Badge>}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
