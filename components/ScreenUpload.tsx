
import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface ScreenUploadProps {
  onImageSelected: (base64: string) => void;
}

export const ScreenUpload: React.FC<ScreenUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFile = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const fileType = file.type || 'unknown type';
      setError(`Unsupported file type: "${fileType}". Please upload a valid image file (e.g., JPEG, PNG).`);
      setPreview(null);
      clearInput(); // Clear the input after error
      return;
    }

    // Clear previous errors
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Pass the full data URI (e.g., "data:image/png;base64,...")
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      // Pass the full Data URI so we preserve the MIME type
      onImageSelected(preview);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Scan Your Crop</h2>
        <p className="text-slate-500">Take a photo or upload an image to detect diseases.</p>
      </div>

      {error && (
        <div className="flex items-start space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl w-full max-w-sm border border-red-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!preview ? (
        <div
          className={`relative w-full aspect-square max-w-sm rounded-3xl border-4 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
            dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center space-y-4 text-slate-400">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Camera size={48} className="text-emerald-500" />
            </div>
            <p className="font-medium">Tap to capture or upload</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => {
                setPreview(null);
                setError(null);
                clearInput();
              }}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-emerald-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>Analyze Image</span>
            <ImageIcon size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
