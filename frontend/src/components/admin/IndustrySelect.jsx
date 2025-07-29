import React from 'react';
import { industryOptions } from "../../utils/industryOptions";

export default function IndustrySelect({ value, onChange }) {
  return (
    <div className="w-full">
      <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
        Industry <span className="text-red-500">*</span>
      </label>
      <select
        id="industry"
        name="industry"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        required
      >
        <option value="">Select an industry</option>
        {industryOptions.map((industry, index) => (
          <option key={index} value={industry}>
            {industry}
          </option>
        ))}
      </select>
    </div>
  );
}
