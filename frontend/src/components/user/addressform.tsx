import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  api_get_active_user_addresses,
  api_post_active_user_address,
  api_put_active_user_address_by_id,
} from "@/services/api";
import { FetchedAddress } from "@/services/types";

const AddressForm: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [addresses, setAddresses] = useState<FetchedAddress[]>([]);
  const [form, setForm] = useState<
    Omit<FetchedAddress, "address_id" | "createdAt" | "user_id" | "updatedAt">
  >({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const fetchAddress = useCallback(async () => {
    try {
      const addresses = await api_get_active_user_addresses(accessToken);
      setAddresses(addresses);
    } catch (err) {
      toast.error("Error loading addresses.");
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        try {
          await api_put_active_user_address_by_id(editId, form, accessToken);
          toast.success("Address updated.");
        } catch (err) {
          toast.error("Error updating address.");
        }
      } else {
        try {
          await api_post_active_user_address(form, accessToken);
          toast.success("Address added");
        } catch (err) {
          toast.error("Error adding address.");
        }
      }

      fetchAddress();

      setForm({
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "United States",
      });
      setEditId(null);
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleEdit = (address: FetchedAddress) => {
    setEditId(address.address_id);
    setForm({
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state || "",
      zip_code: address.zip_code || "",
      country: address.country,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-xl font-semibold">🏠 Saved Addresses</h3>

      {addresses.length === 0 ? (
        <p className="text-muted-foreground">No saved addresses.</p>
      ) : (
        <ul className="space-y-2">
          {addresses.map((a) => (
            <li
              key={a.address_id}
              className="border p-3 rounded flex justify-between items-start"
            >
              <div>
                <strong>{a.address_line_1}</strong>
                {a.address_line_2 && `, ${a.address_line_2}`}
                <br />
                {a.city}, {a.state} {a.zip_code}
                <br />
                {a.country}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(a)}
                >
                  Edit
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded shadow-md"
      >
        <h4 className="font-medium">
          {editId ? "Edit Address" : "Add New Address"}
        </h4>

        <div>
          <Label>Address Line 1</Label>
          <Input
            value={form.address_line_1}
            onChange={(e) => handleChange("address_line_1", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Address Line 2</Label>
          <Input
            value={form.address_line_2}
            onChange={(e) => handleChange("address_line_2", e.target.value)}
          />
        </div>

        <div>
          <Label>City</Label>
          <Input
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>State</Label>
          <Input
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </div>

        <div>
          <Label>ZIP Code</Label>
          <Input
            value={form.zip_code}
            onChange={(e) => handleChange("zip_code", e.target.value)}
          />
        </div>

        <div>
          <Label>Country</Label>
          <Input
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            required
            disabled
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">{editId ? "Update" : "Add Address"}</Button>
          {editId && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
