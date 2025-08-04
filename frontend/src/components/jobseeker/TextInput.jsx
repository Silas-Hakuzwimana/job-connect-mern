import { twMerge } from "tailwind-merge";

export default function TextInput({ label, icon: Icon, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 text-gray-400" size={16} />}
        <input
          {...props}
          className={twMerge(
            "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
            error && "border-red-500"
          )}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
