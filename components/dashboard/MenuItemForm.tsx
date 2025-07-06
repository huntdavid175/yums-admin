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
import type { MenuItem } from "@/lib/schemas/firestore";

function toId(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, "-");
}

interface MenuItemFormProps {
  categories: string[];
  initialItem?: MenuItem | null;
  onSubmit: (
    formData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  ) => void;
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
    image: "",
    sizes: [{ name: "", price: "" }],
    extras: [{ name: "", price: "" }],
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (initialItem) {
      setFormData({
        name: initialItem.name,
        category: initialItem.category,
        price: initialItem.price.toString(),
        description: initialItem.description,
        comesWith: initialItem.comesWith || "",
        available: initialItem.available,
        image: initialItem.image || "",
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
      image: "",
      sizes: [{ name: "", price: "" }],
      extras: [{ name: "", price: "" }],
    });
    setErrors({ name: "", category: "", price: "", image: "" });
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

  const validate = () => {
    const newErrors = { name: "", category: "", price: "", image: "" };
    let valid = true;
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
      valid = false;
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = "Valid price is required";
      valid = false;
    }
    if (!formData.image.trim()) {
      newErrors.image = "Image is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // Prepare data for submission
    const submitData: Omit<MenuItem, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number.parseFloat(formData.price) || 0,
      description: formData.description.trim(),
      comesWith: formData.comesWith.trim() || undefined,
      available: formData.available,
      image: formData.image.trim(),
      sizes: formData.sizes
        .filter((s) => s.name.trim() !== "")
        .map((s) => ({
          id: toId(s.name),
          name: s.name.trim(),
          price: Number.parseFloat(s.price) || 0,
        })),
      extras: formData.extras
        .filter((e) => e.name.trim() !== "")
        .map((e) => ({
          id: toId(e.name),
          name: e.name.trim(),
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
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <span className="text-xs text-red-600">{errors.name}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
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
            {errors.category && (
              <span className="text-xs text-red-600">{errors.category}</span>
            )}
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
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <span className="text-xs text-red-600">{errors.price}</span>
          )}
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

      {/* Image */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">Image</h4>
        </div>
        <div className="space-y-3">
          <Input
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            placeholder="Image URL or upload path"
            className={errors.image ? "border-red-500" : ""}
          />
          {errors.image && (
            <span className="text-xs text-red-600">{errors.image}</span>
          )}
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
