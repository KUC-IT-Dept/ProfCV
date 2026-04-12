import React from 'react';
interface FileFieldProps {
  label: string;
  name: string;
  selectedFile: File | null;
  onFileSelect: (name: string, file: File) => void;
}

const FileField: React.FC<FileFieldProps> = ({ label, name, selectedFile, onFileSelect }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[13px] font-medium text-gray-700 capitalize">
        {label}
      </label>
      <div className="relative h-[38px]"> {/* Fixed height to match standard inputs */}
        <input
          type="file"
          id={name}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileSelect(name, e.target.files[0]);
              e.target.value = ''; // Reset input to allow re-uploading same file
            }
          }}
        />
        <label
          htmlFor={name}
          className="flex items-center justify-between px-3 h-full border border-[#D1D5DB] rounded-[4px] bg-white cursor-pointer hover:border-blue-400 transition-all"
        >
          <span className="text-gray-400 text-sm truncate">
            {selectedFile ? selectedFile.name : "Choose file..."}
          </span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </label>
      </div>
    </div>
  );
};

export default FileField;