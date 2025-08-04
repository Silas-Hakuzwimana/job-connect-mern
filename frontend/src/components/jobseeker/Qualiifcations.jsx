import React, { useEffect, useState } from 'react';
import { fetchAllQualifications, saveUserQualifications } from '../../services/qualificationService';
import { Check, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Qualifications({ user, onUpdate }) {
  // eslint-disable-next-line no-unused-vars
  const [allQualifications, setAllQualifications] = useState([]);
  const [userQualifications, setUserQualifications] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('User prop received in Qualifications:', user);
    loadQualifications();
    if (user?.qualifications) {
      const titles = user.qualifications.map(q => (typeof q === 'object' ? q.title : q));
      setUserQualifications(titles);
    } else {
      setUserQualifications([]);
    }

  }, [user]);

  const loadQualifications = async () => {
    try {
      const data = await fetchAllQualifications();
      setAllQualifications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load qualifications.');
    }
  };

  const handleAdd = () => {
    const trimmed = (inputValue || '').trim(); // Ensure inputValue is a string
    if (!trimmed || userQualifications.includes(trimmed)) return;
    setUserQualifications([...userQualifications, trimmed]);
    setInputValue('');
  };

  const handleRemove = (title) => {
    setUserQualifications(userQualifications.filter(q => q !== title));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {

      console.log('Saving qualiifcations: ', userQualifications);
      const updatedUser = await saveUserQualifications(userQualifications);
      onUpdate?.(updatedUser);
      toast.success('Qualifications saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save qualifications.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Qualifications</h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
          placeholder="Enter a qualification"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" /> Add
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
        >
          <Check className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

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
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">No qualifications added yet.</p>
        )}
      </div>
    </div>
  );
}
