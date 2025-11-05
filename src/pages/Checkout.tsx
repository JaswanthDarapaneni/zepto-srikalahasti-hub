import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [address, setAddress] = useState(user?.address || "");

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    // Simulate order placement
    const orderId = `order_${Date.now()}`;
    
    toast({
      title: "Order Placed Successfully! 🎉",
      description: `Your order #${orderId} has been placed`,
    });

    clearCart();
    navigate(`/order-tracking/${orderId}`);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <Link to="/cart">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Razorpay (UPI/Card/Wallet)</p>
                        <p className="text-sm text-muted-foreground">
                          Pay securely using Razorpay
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">₹{finalTotal}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
