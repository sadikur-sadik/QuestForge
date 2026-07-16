export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing in environment variables. Please check your .env file.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to upload image to ImgBB (Status: ${response.status}).`);
  }

  const result = await response.json();
  if (result.success && result.data && result.data.url) {
    return result.data.url;
  } else {
    throw new Error(result?.error?.message || "Invalid response structure from ImgBB API.");
  }
}
