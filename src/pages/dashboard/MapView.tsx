import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import shops from "@/data/shops.json";
import { MapPin } from "lucide-react";

const MapView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Map View</h2>
        <p className="text-muted-foreground">View shops and delivery locations on map</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shops in Srikalahasti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] w-full overflow-hidden rounded-lg">
            <p className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              Map integration requires Google Maps API key or Leaflet.js setup.
              <br />
              Configure API key in Settings → Map API
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {shops.map((shop) => (
              <div key={shop.id} className="flex items-start gap-3 rounded-lg border p-3">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{shop.name}</p>
                  <p className="text-sm text-muted-foreground">{shop.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {shop.lat}, {shop.lng}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapView;
