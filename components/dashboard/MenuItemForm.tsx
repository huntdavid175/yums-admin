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
import { Plus, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";
import type { MenuItem } from "@/lib/schemas/firestore";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "@/app/cloudinary-actions";
import { toast } from "react-hot-toast";

function toId(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, "-");
}

// Helper function to extract public ID from Cloudinary URL
function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) return null;

    // Get everything after 'upload' and before the file extension
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = pathAfterUpload.split(".")[0]; // Remove file extension

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from Cloudinary URL:", error);
    return null;
  }
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

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

      // Set image preview if initial item has image
      if (initialItem.image) {
        setImagePreview(initialItem.image);
      }
    }
  }, [initialItem]);

  const resetForm = async (shouldDeleteImage: boolean = true) => {
    // Only delete image from Cloudinary if explicitly requested
    if (
      shouldDeleteImage &&
      formData.image &&
      formData.image.includes("cloudinary.com")
    ) {
      const publicId = extractPublicIdFromCloudinaryUrl(formData.image);

      if (publicId) {
        try {
          await deleteImageFromCloudinary(publicId);
        } catch (error) {
          console.error(
            "Error deleting image from Cloudinary during reset:",
            error
          );
        }
      }
    }

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
    setImageFile(null);
    setImagePreview("");
  };

  // Image upload handlers
  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Validate file size before upload
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      setImageFile(file);
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        // Create FormData for server action
        const formData = new FormData();
        formData.append("file", file);

        // Upload using server action
        const result = await uploadImageToCloudinary(formData);

        if (result.success && result.url) {
          setFormData((prev) => ({ ...prev, image: result.url! }));
          toast.success("Image uploaded successfully!");
          console.log("Image uploaded successfully:", result.url);
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (error) {
        console.error("Failed to upload image:", error);

        // Show specific error messages based on error type
        if (error instanceof Error) {
          if (error.message.includes("Body exceeded")) {
            toast.error(
              "Image file is too large. Please choose a smaller image."
            );
          } else if (error.message.includes("Failed to upload")) {
            toast.error("Failed to upload image. Please try again.");
          } else {
            toast.error(`Upload failed: ${error.message}`);
          }
        } else {
          toast.error("An unexpected error occurred during upload.");
        }

        // Remove the preview and file
        setImageFile(null);
        setImagePreview("");
        setFormData((prev) => ({ ...prev, image: "" }));
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error("Please select a valid image file (JPG, PNG, WebP)");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const removeImage = async () => {
    // If we have a Cloudinary URL, delete it from Cloudinary
    if (formData.image && formData.image.includes("cloudinary.com")) {
      const publicId = extractPublicIdFromCloudinaryUrl(formData.image);

      if (publicId) {
        try {
          const result = await deleteImageFromCloudinary(publicId);
          if (result.success) {
            toast.success("Image removed successfully");
          } else {
            console.warn(
              "Failed to delete image from Cloudinary:",
              result.error
            );
            // Still continue with local removal even if Cloudinary deletion fails
          }
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
          // Continue with local removal even if Cloudinary deletion fails
        }
      }
    }

    // Always remove from local state
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
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

  const handleSubmit = async () => {
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
    await resetForm(false); // Don't delete image after successful submission
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

      {/* Image Upload */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg border-b pb-2">Item Image *</h4>

        {imagePreview ? (
          // Image Preview
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              {imageFile ? `Selected: ${imageFile.name}` : "Image loaded"}
            </p>
          </div>
        ) : (
          // Upload Area
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${errors.image ? "border-red-500" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-gray-100 rounded-full">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Upload Item Image
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop an image here, or click to browse
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Choose Image"}
                </Button>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>
        )}

        {errors.image && (
          <span className="text-xs text-red-600">{errors.image}</span>
        )}

        <p className="text-sm text-gray-500">
          Upload a high-quality image of your menu item. Recommended size:
          800x600px
        </p>
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
          onClick={async () => {
            await resetForm(true); // Delete image when canceling
            onCancel();
          }}
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
