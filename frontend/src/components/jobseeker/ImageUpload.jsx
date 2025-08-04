export default function ImageUpload({ imageUrl, onImageUpload, uploading }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageUpload(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
      {imageUrl && <img src={imageUrl} alt="Profile" className="w-24 h-24 rounded-full mb-2" />}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-600"
      />
    </div>
  );
}
