import React from 'react';

interface ZoneSelectorProps {
  zones: string[];
  selectedZone: string;
  onZoneChange: (zone: string) => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  zones,
  selectedZone,
  onZoneChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Zone
      </label>
      <select
        value={selectedZone}
        onChange={(e) => onZoneChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {zones.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>
    </div>
  );
};