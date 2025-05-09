import React, { useCallback, useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import {
  api_post_product,
  api_put_product,
  api_delete_product,
  api_get_all_users,
  api_patch_user_role,
  api_get_inventories,
} from "@/services/api";
import axios from "axios";
import { useAuth } from "@/context/auth/useAuth";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "users" | "inventory"
  >("products");
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  });

  const [inventory, setInventory] = useState([]);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [inventoryForm, setInventoryForm] = useState({
    sku: "",
    product_id: "",
  });

  const { accessToken } = useAuth();
  const { categories } = useCategories();
  const { products, refresh: fetchProducts } = useProducts();
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const users = await api_get_all_users(accessToken);
      setUsers(users);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    }
  }, [accessToken]);

  const fetchInventories = useCallback(async () => {
    try {
      const inventory = await api_get_inventories();
      setInventory(inventory);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    }
  }, []);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }

    if (activeTab === "users") {
      fetchUsers();
    }

    if (activeTab === "inventory") {
      fetchInventories();
    }
  }, [activeTab, fetchUsers, fetchProducts, fetchInventories]);

  const toggleAdmin = async (userId, role) => {
    try {
      const res = await api_patch_user_role(accessToken, userId, role);
      toast({ title: "Updated", description: "User role changed" });
      fetchUsers();
    } catch (err) {
      const { error: errMessage } = await err.json();
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update role. ${errMessage}`,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  const handleProductDelete = async (productId) => {
    await api_delete_product(accessToken, productId);
    fetchProducts();
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        ...product,
        price: String(product.price),
        category_id: String(product.category_id),
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category_id: "",
      });
    }
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.image_url ||
      !formData.category_id
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
      };

      if (editingProduct) {
        await api_put_product(accessToken, editingProduct.product_id, payload);
      } else {
        await api_post_product(accessToken, payload);
      }

      toast({ title: "Success", description: "Product saved" });
      setOpen(false);
      fetchProducts();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product",
      });
    }
  };

  const fetchInventory = async () => {
    /* GET /api/admin/inventory */
  };
  const openInventoryModal = (item = null) => {
    /* set form + open dialog */
  };
  const handleInventorySubmit = async (e) => {
    /* POST or PUT inventory */
  };

  return (
    <Layout>
      {/* Tab Switcher */}
      <div className="flex gap-4 mb-4">
        <Button
          variant={activeTab === "products" ? "default" : "outline"}
          onClick={() => setActiveTab("products")}
        >
          Products
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("users")}
        >
          Users
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </Button>
      </div>

      {/* Product Management Tab */}
      {activeTab === "products" && (
        <>
          <div className="flex flex-col items-center space-y-2 mb-4">
            <h1 className="text-xl font-semibold">Product Management</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openModal()}>Add Product</Button>
              </DialogTrigger>
              <DialogContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.category_id}
                            value={String(cat.category_id)}
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Save Product</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full flex justify-center">
            <div className="max-w-2xl max-h-[500px] overflow-y-auto space-y-4 w-full">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => openModal(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleProductDelete(product.product_id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="flex flex-col items-center space-y-2 mb-4 wid">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="w-full flex justify-center">
            <div className="max-w-2xl max-h-[500px] overflow-y-auto space-y-4 w-full">
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                  {user.role !== "guest" && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        toggleAdmin(
                          user.user_id,
                          user.role === "admin" ? "user" : "admin"
                        )
                      }
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="flex flex-col items-center space-y-2 mb-4">
          <h2 className="text-xl font-semibold">Inventory Management</h2>

          <Dialog open={inventoryOpen} onOpenChange={setInventoryOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openInventoryModal()}>
                Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form className="space-y-4" onSubmit={handleInventorySubmit}>
                <div>
                  <Label>SKU</Label>
                  <Input
                    name="sku"
                    value={inventoryForm.sku}
                    onChange={(e) =>
                      setInventoryForm((prev) => ({
                        ...prev,
                        sku: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Product</Label>
                  <Select
                    value={inventoryForm.product_id}
                    onValueChange={(value) =>
                      setInventoryForm((prev) => ({
                        ...prev,
                        product_id: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem
                          key={p.product_id}
                          value={String(p.product_id)}
                        >
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Save Inventory</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="w-full flex justify-center">
            <div className="max-w-2xl max-h-[500px] overflow-y-auto space-y-4 w-full">
              {inventory.map((item) => (
                <div
                  key={item.inventory_id}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{item.sku}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.Product?.name || "Unknown Product"}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => openInventoryModal(item)}
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Admin;
