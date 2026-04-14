import { Routes, Route } from "react-router-dom";
import ProductListPage from "@/pages/products/ProductListPage";
import ProductDetailPage from "@/pages/products/ProductDetailPage";
import ProductRegisterPage from "@/pages/products/ProductRegisterPage";
import CartPage from "@/pages/cart/CartPage";
import PaymentSuccessPage from "@/pages/payment/PaymentSuccessPage";
import PaymentFailPage from "@/pages/payment/PaymentFailPage";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/admin/products/new" element={<ProductRegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
      </Routes>
    </div>
  );
}
