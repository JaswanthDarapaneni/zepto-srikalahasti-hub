import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage application settings and configuration</p>
      </>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="map">Map API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="ZeptoClone - Srikalahasti" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteEmail">Contact Email</Label>
                <Input id="siteEmail" type="email" defaultValue="support@zeptoclone.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitePhone">Contact Phone</Label>
                <Input id="sitePhone" type="tel" defaultValue="+91 9876543210" />
              </div>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" placeholder="smtp.gmail.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input id="smtpPort" placeholder="587" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input id="smtpUser" type="email" placeholder="your-email@gmail.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPass">SMTP Password</Label>
                <Input id="smtpPass" type="password" placeholder="••••••••" />
              </div>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razorpayKey">Razorpay API Key</Label>
                <Input id="razorpayKey" placeholder="rzp_test_xxxxxxxxxxxx" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                <Input id="razorpaySecret" type="password" placeholder="••••••••" />
              </div>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Keys
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Maps API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapsKey">Google Maps API Key</Label>
                <Input id="mapsKey" placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
                <p className="text-xs text-muted-foreground">
                  Get your API key from Google Cloud Console
                </p>
              </div>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
