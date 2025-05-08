import React, { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import {
  api_get_active_user_order_items,
  api_post_return,
} from "@/services/api";
import {
  FetchNonReturnedOrderItems,
  FetchReturnedItems,
} from "@/services/types";

const OrderedItems: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [items, setItems] = useState<FetchNonReturnedOrderItems[]>([]);
  const [returnedItems, setReturnedItems] = useState<FetchReturnedItems[]>([]);

  const fetchItems = useCallback(async () => {
    try {
      const { orderedItems, returnedItems } =
        await api_get_active_user_order_items(accessToken);
      setItems(orderedItems);
      setReturnedItems(returnedItems);
    } catch {
      toast.error("Failed to load ordered items");
    }
  }, [accessToken]);

  const returnItem = async (order_item_id: number) => {
    try {
      await api_post_return(accessToken, {
        order_item_id,
        reason: "",
      });
      toast.success("Item returned successfully");
      fetchItems();
    } catch {
      toast.error("Failed to return item");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="space-y-10 w-full mt-8">
      {/* Ordered Items */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">My Ordered Items</h2>
        <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground">No items found.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.order_item_id}
                className="border p-4 rounded-lg shadow-sm w-full flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Label className="w-32">Order - Item ID</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {item.order_id} - {item.order_item_id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Product</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {item.product_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Price</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      ${item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Ordered On</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {new Date(item.ordered_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Status</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {item.order_status.charAt(0).toUpperCase() +
                        item.order_status.slice(1)}{" "}
                      /{" "}
                      {item.shipment_status.charAt(0).toUpperCase() +
                        item.shipment_status.slice(1)}
                    </p>
                  </div>
                </div>

                {item.shipment_status === "delivered" && (
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => returnItem(item.order_item_id)}
                    >
                      Return
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Returned Items */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Returned Items</h2>
        <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
          {returnedItems.length === 0 ? (
            <p className="text-muted-foreground">No returned items.</p>
          ) : (
            returnedItems.map((item) => (
              <div
                key={item.order_item_id}
                className="border p-4 rounded-lg shadow-sm w-full flex flex-col space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Label className="w-32">Order - Item ID</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {item.order_id} - {item.order_item_id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Product</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {item.product_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Price</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      ${item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Ordered On</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {new Date(item.ordered_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-32">Status</Label>
                    <p className="border px-3 py-1.5 rounded bg-muted text-sm">
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}{" "}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderedItems;
