import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      createProduct({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.imageUrl ? [form.imageUrl] : [],
      }),
    onSuccess: () => {
      toast.success("상품이 등록되었습니다.");
      navigate("/");
    },
    onError: () => toast.error("상품 등록에 실패했습니다."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error("필수 항목을 입력해주세요.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-muted-foreground hover:underline mb-6 inline-block">
        ← 목록으로
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>상품 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">상품명 *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="상품명을 입력하세요"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">상품 설명</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="상품 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">가격 (원) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stock">재고 수량 *</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <Button type="submit" className="mt-2" disabled={mutation.isPending}>
              {mutation.isPending ? "등록 중..." : "등록하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
