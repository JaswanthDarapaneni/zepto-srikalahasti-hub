import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Home, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const OrderTracking = () => {
  const { orderId } = useParams();

  // Mock order status (in real app, fetch from backend)
  const orderStatus = "placed";
  const estimatedTime = "10-15 min";

  const statusSteps = [
    { id: "placed", label: "Order Placed", icon: CheckCircle, active: true },
    { id: "packed", label: "Packed", icon: Package, active: false },
    { id: "out_for_delivery", label: "Out for Delivery", icon: Truck, active: false },
    { id: "delivered", label: "Delivered", icon: Home, active: false },
  ];

  const getActiveIndex = () => {
    return statusSteps.findIndex((step) => step.id === orderStatus);
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Tracking</CardTitle>
                <Badge variant="outline">#{orderId}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Status Message */}
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <Clock className="mx-auto mb-3 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Your order is on the way!</h3>
                <p className="text-muted-foreground">
                  Estimated delivery time: <span className="font-semibold">{estimatedTime}</span>
                </p>
              </div>

              {/* Order Status Steps */}
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= activeIndex;
                  const isCurrent = index === activeIndex;

                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`h-12 w-0.5 ${
                              isCompleted ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <h4
                          className={`font-semibold ${
                            isCurrent ? "text-primary" : isCompleted ? "" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <p className="text-sm text-muted-foreground">In progress...</p>
                        )}
                        {isCompleted && !isCurrent && (
                          <p className="text-sm text-success">✓ Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Details */}
              <div className="space-y-3 rounded-lg border border-border p-4">
                <h4 className="font-semibold">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-medium">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      Paid
                    </Badge>
                  </div>
                </div>
              </div>

              <Link to="/" className="block">
                <Button className="w-full" variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
