import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  getCategories,
  getProducts,
  addProduct,
} from "@/services/productService";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "@/hooks/use-toast";
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
import { useProducts } from "@/hooks/useProducts";
import {
  api_delete_product,
  api_post_product,
  api_put_product,
} from "@/services/api";
import { useAuth } from "@/context/auth/useAuth";

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  });

  const { accessToken } = useAuth();

  const { categories } = useCategories();
  const { products, refresh: fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      const productData = {
        ...formData,
        category_id: Number(formData.category_id),
      };

      if (editingProduct) {
        await api_put_product(
          accessToken,
          editingProduct.product_id,
          productData
        );
      } else {
        await api_post_product(accessToken, productData);
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

  return (
    <Layout>
      <div className="w-full flex flex-col items-center space-y-2 mb-4">
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
                <Button variant="secondary" onClick={() => openModal(product)}>
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
    </Layout>
  );
};

export default Admin;
