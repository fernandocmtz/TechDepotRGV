import React, { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import {
  api_get_active_user_order_items,
  api_post_return,
} from "@/services/api";
import { FetchOrderItems } from "@/services/types";

const OrderedItems: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [items, setItems] = useState<FetchOrderItems[]>([]);

  const fetchItems = useCallback(async () => {
    try {
      const orderItems = await api_get_active_user_order_items(accessToken);
      setItems(orderItems);
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
    <div className="space-y-6 w-full mt-8">
      <h2 className="text-xl font-semibold">My Ordered Items</h2>

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
            </div>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => returnItem(item.order_item_id)}
              >
                Return
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderedItems;
