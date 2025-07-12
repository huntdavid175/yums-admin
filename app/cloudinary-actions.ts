"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary on the server
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Convert File to Buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "menu-items",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [
              { width: 800, height: 600, crop: "fill" },
              { quality: "auto" },
            ],
            public_id: `menu-item-${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    return {
      success: true,
      url: (result as any).secure_url,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Body exceeded")) {
        return { success: false, error: "File size exceeds server limit" };
      } else if (error.message.includes("cloudinary")) {
        return { success: false, error: "Cloudinary upload failed" };
      }
    }

    return {
      success: false,
      error: "Failed to upload image. Please try again.",
    };
  }
}

export async function deleteImageFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return { success: true };
    } else {
      return { success: false, error: "Failed to delete image" };
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return {
      success: false,
      error: "Failed to delete image",
    };
  }
}

export async function updateImageInCloudinary(
  publicId: string,
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // First delete the old image
    const deleteResult = await deleteImageFromCloudinary(publicId);
    if (!deleteResult.success) {
      console.warn("Failed to delete old image:", deleteResult.error);
    }

    // Then upload the new image
    return await uploadImageToCloudinary(formData);
  } catch (error) {
    console.error("Error updating image in Cloudinary:", error);
    return {
      success: false,
      error: "Failed to update image",
    };
  }
}

export async function getImageInfoFromCloudinary(
  publicId: string
): Promise<{ success: boolean; info?: any; error?: string }> {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      info: result,
    };
  } catch (error) {
    console.error("Error getting image info from Cloudinary:", error);
    return {
      success: false,
      error: "Failed to get image info",
    };
  }
}

export async function generateImageUrl(
  publicId: string,
  transformations: any[] = []
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const url = cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error generating Cloudinary URL:", error);
    return {
      success: false,
      error: "Failed to generate image URL",
    };
  }
}
