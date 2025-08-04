import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile, getProfile, uploadProfileImage } from "../../services/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Phone, Lock, MapPin, FileText, ImageIcon } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfile();
        const data = response?.data || {};
        setValue("name", data.name || "");
        setValue("email", data.email || "");
        setValue("phone", data.phone || "");
        setValue("location", data.location || "");
        setValue("bio", data.bio || "");
        setImageUrl(data.profilePic || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile data");
      }
    }
    fetchProfile();
  }, [setValue]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadProfileImage(file);
      setImageUrl(res.data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        profilePic: imageUrl,
      };

      if (data.password?.trim()) {
        payload.password = data.password;
      }

      await updateProfile(payload);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <User size={16} /> Full Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            disabled={loading}
            className={`w-full border px-3 py-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            disabled={loading}
            className={`w-full border px-3 py-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <Phone size={16} /> Phone
          </label>
          <input
            type="tel"
            {...register("phone")}
            disabled={loading}
            className="w-full border px-3 py-2 rounded border-gray-300"
          />
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <MapPin size={16} /> Location
          </label>
          <input
            type="text"
            {...register("location")}
            disabled={loading}
            className="w-full border px-3 py-2 rounded border-gray-300"
          />
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <FileText size={16} /> Bio
          </label>
          <textarea
            rows={4}
            {...register("bio")}
            disabled={loading}
            className="w-full border px-3 py-2 rounded border-gray-300"
          />
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <Lock size={16} /> Change Password (optional)
          </label>
          <input
            type="password"
            {...register("password")}
            disabled={loading}
            className="w-full border px-3 py-2 rounded border-gray-300"
          />
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center gap-2">
            <ImageIcon size={16} /> Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || loading}
            className="w-full border px-3 py-2 rounded border-gray-300"
          />
          {uploading ? (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="h-24 w-24 mt-3 rounded-full object-cover"
            />
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
