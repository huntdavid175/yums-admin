import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface MenuItem {
  id?: number;
  name: string;
  category: string;
  price: number;
  description: string;
  comesWith: string;
  available: boolean;
  images: string[];
  sizes: { name: string; price: number }[];
  extras: { name: string; price: number }[];
}

interface MenuItemFormProps {
  categories: string[];
  initialItem?: MenuItem | null;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function MenuItemForm({
  categories,
  initialItem,
  onSubmit,
  onCancel,
  isEdit = false,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    comesWith: "",
    available: true,
    images: [""],
    sizes: [{ name: "", price: "" }],
    extras: [{ name: "", price: "" }],
  });

  useEffect(() => {
    if (initialItem) {
      setFormData({
        name: initialItem.name,
        category: initialItem.category,
        price: initialItem.price.toString(),
        description: initialItem.description,
        comesWith: initialItem.comesWith,
        available: initialItem.available,
        images: initialItem.images.length > 0 ? initialItem.images : [""],
        sizes:
          initialItem.sizes.length > 0
            ? initialItem.sizes.map((s) => ({
                name: s.name,
                price: s.price.toString(),
              }))
            : [{ name: "", price: "" }],
        extras:
          initialItem.extras.length > 0
            ? initialItem.extras.map((e) => ({
                name: e.name,
                price: e.price.toString(),
              }))
            : [{ name: "", price: "" }],
      });
    }
  }, [initialItem]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      comesWith: "",
      available: true,
      images: [""],
      sizes: [{ name: "", price: "" }],
      extras: [{ name: "", price: "" }],
    });
  };

  // Dynamic array helpers
  const addSize = () =>
    setFormData((p) => ({
      ...p,
      sizes: [...p.sizes, { name: "", price: "" }],
    }));
  const removeSize = (i: number) =>
    setFormData((p) => ({ ...p, sizes: p.sizes.filter((_, k) => k !== i) }));
  const updateSize = (i: number, f: "name" | "price", v: string) =>
    setFormData((p) => ({
      ...p,
      sizes: p.sizes.map((s, k) => (k === i ? { ...s, [f]: v } : s)),
    }));

  const addExtra = () =>
    setFormData((p) => ({
      ...p,
      extras: [...p.extras, { name: "", price: "" }],
    }));
  const removeExtra = (i: number) =>
    setFormData((p) => ({ ...p, extras: p.extras.filter((_, k) => k !== i) }));
  const updateExtra = (i: number, f: "name" | "price", v: string) =>
    setFormData((p) => ({
      ...p,
      extras: p.extras.map((e, k) => (k === i ? { ...e, [f]: v } : e)),
    }));

  const addImage = () =>
    setFormData((p) => ({ ...p, images: [...p.images, ""] }));
  const removeImage = (i: number) =>
    setFormData((p) => ({ ...p, images: p.images.filter((_, k) => k !== i) }));
  const updateImage = (i: number, v: string) =>
    setFormData((p) => ({
      ...p,
      images: p.images.map((img, k) => (k === i ? v : img)),
    }));

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.category || !formData.price) {
      alert("Please fill in all required fields (Name, Category, Price)");
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      price: Number.parseFloat(formData.price) || 0,
      sizes: formData.sizes.map((s) => ({
        ...s,
        price: Number.parseFloat(s.price) || 0,
      })),
      extras: formData.extras.map((e) => ({
        ...e,
        price: Number.parseFloat(e.price) || 0,
      })),
    };

    onSubmit(submitData);
    resetForm();
  };

  return (
    <div className="grid gap-6 py-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg border-b pb-2">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Classic Burger"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Base Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed description of the item"
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="comesWith">Comes With</Label>
          <Textarea
            id="comesWith"
            value={formData.comesWith}
            onChange={(e) =>
              setFormData({ ...formData, comesWith: e.target.value })
            }
            placeholder="e.g., French Fries, Pickle, Coleslaw"
            rows={2}
          />
          <p className="text-sm text-gray-500">
            List items that are included with this dish
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">Images</h4>
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-3">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="Image URL or upload path"
                className="flex-1"
              />
              {formData.images.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">
            Size Options
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addSize}>
            <Plus className="h-4 w-4 mr-1" />
            Add Size
          </Button>
        </div>
        <div className="space-y-3">
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={size.name}
                onChange={(e) => updateSize(index, "name", e.target.value)}
                placeholder="Size name (e.g., Small, Large)"
                className="flex-1"
              />
              <Input
                type="number"
                step="0.01"
                value={size.price}
                onChange={(e) => updateSize(index, "price", e.target.value)}
                placeholder="Additional price"
                className="w-32"
              />
              {formData.sizes.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSize(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          First size is typically the base size (additional price = 0)
        </p>
      </div>

      {/* Extras */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">
            Extra Options
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addExtra}>
            <Plus className="h-4 w-4 mr-1" />
            Add Extra
          </Button>
        </div>
        <div className="space-y-3">
          {formData.extras.map((extra, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={extra.name}
                onChange={(e) => updateExtra(index, "name", e.target.value)}
                placeholder="Extra name (e.g., Extra Cheese)"
                className="flex-1"
              />
              <Input
                type="number"
                step="0.01"
                value={extra.price}
                onChange={(e) => updateExtra(index, "price", e.target.value)}
                placeholder="Extra price"
                className="w-32"
              />
              {formData.extras.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeExtra(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg border-b pb-2">Availability</h4>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="available"
            checked={formData.available}
            onChange={(e) =>
              setFormData({ ...formData, available: e.target.checked })
            }
            className="rounded"
          />
          <Label htmlFor="available">Item is available for ordering</Label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Button
          variant="outline"
          className="w-full sm:w-auto bg-transparent"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          {isEdit ? "Update Menu Item" : "Add Menu Item"}
        </Button>
      </div>
    </div>
  );
}
