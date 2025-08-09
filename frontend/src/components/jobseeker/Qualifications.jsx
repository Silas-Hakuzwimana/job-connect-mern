import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchAllQualifications,
  fetchUserQualifications,
  saveUserQualifications,
} from "../../services/qualificationService";
import { createNotification } from "../../services/notificationService";
import { Check, Trash2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function Qualifications({ onUpdate }) {
  const { user, refreshUser } = useContext(AuthContext);
  const [allQualifications, setAllQualifications] = useState([]);
  const [userQualifications, setUserQualifications] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all qualifications and the user's qualifications
  useEffect(() => {
    if (!user) return;

    const loadQualifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const [all, userQuals] = await Promise.all([
          fetchAllQualifications(),
          fetchUserQualifications(),
        ]);

        setAllQualifications(all || []);

        const titles = (userQuals || []).map((q) =>
          typeof q === "object" ? q.title : q
        );
        setUserQualifications(titles);
      } catch (err) {
        console.error("Error loading qualifications:", err);
        setError("Failed to load qualifications.");
      } finally {
        setLoading(false);
      }
    };

    loadQualifications();
  }, [user]);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (userQualifications.includes(trimmed)) {
      toast.info("Qualification already added.");
      return;
    }

    setUserQualifications((prev) => [...prev, trimmed]);
    setInputValue("");
  };

  const handleRemove = (title) => {
    setUserQualifications((prev) => prev.filter((q) => q !== title));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    try {
      const updatedUser = await saveUserQualifications(userQualifications);
      toast.success("Qualifications saved successfully!");
      onUpdate?.(updatedUser);

      try {
        await refreshUser(); 
      } catch (refreshErr) {
        console.warn("refreshUser failed, ignoring for now", refreshErr);
        // Do not clear user or redirect here!
      }

      await createNotification(
        user.id,
        "Your qualifications were saved successfully."
      );
    } catch (err) {
      console.error("Failed to save qualifications:", err);
      setError("Failed to save qualifications.");
      toast.error("Failed to save qualifications.");

      try {
        await createNotification(
          user.id,
          "Failed to save your qualifications. Please try again."
        );
      } catch (notifyErr) {
        console.error("Failed to create notification", notifyErr);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="text-red-500">User not logged in.</div>;
  }

  if (loading) {
    return <div className="text-gray-500">Loading qualifications...</div>;
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Qualifications</h2>

      {/* Input & Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
          placeholder="Enter a qualification"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          list="qualifications-list"
        />
        <datalist id="qualifications-list">
          {allQualifications.map((q) => (
            <option key={q._id} value={q.title} />
          ))}
        </datalist>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          type="button"
        >
          <PlusCircle className="w-4 h-4" />
          Add
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isSaving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          type="button"
        >
          <Check className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      {/* Display user qualifications */}
      <div className="flex flex-wrap gap-2">
        {userQualifications.length > 0 ? (
          userQualifications.map((title, index) => (
            <span
              key={index}
              className="flex items-center bg-gray-200 text-sm text-gray-800 px-3 py-1 rounded-full"
            >
              {title}
              <button
                onClick={() => handleRemove(title)}
                className="ml-2 text-red-600 hover:text-red-800"
                aria-label={`Remove qualification ${title}`}
                type="button"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">No qualifications added yet.</p>
        )}
      </div>

      {/* Display all qualifications */}
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-2">
          All Available Qualifications:
        </h3>
        <ul className="list-disc list-inside max-h-40 overflow-y-auto text-gray-700 text-sm">
          {allQualifications.length > 0 ? (
            allQualifications.map((q) => (
              <li key={q._id}>{q.title}</li>
            ))
          ) : (
            <li className="text-gray-400">No qualifications found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
