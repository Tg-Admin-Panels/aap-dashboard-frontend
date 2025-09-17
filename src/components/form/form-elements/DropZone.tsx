import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from 'axios';

// Props definition
interface DropzoneProps {
  accept: Record<string, string[]>;
  onDrop?: (files: File[]) => void;
  multiple?: boolean; // default is true
  onFileUploadSuccess?: (url: string) => void; // New prop to pass the uploaded URL
}


const DropzoneComponent: React.FC<DropzoneProps> = ({ accept, onDrop, multiple, onFileUploadSuccess }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showSuccessPopup) {
      timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000); // Dismiss after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (onDrop) {
      onDrop(acceptedFiles);
    }

    if (acceptedFiles.length === 0) {
      setError('Please select a file first.');
      return;
    }

    const selectedFile = acceptedFiles[0]; // Assuming single file upload for simplicity

    try {
      // 1. Get signed signature from backend
      const url = import.meta.env.VITE_NODE_ENV === 'development' ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_NODE_ENV === 'local' ? import.meta.env.VITE_LOCAL_BASE_URL : import.meta.env.VITE_PROD_BASE_URL
      console.log("URL is", url)
      const signatureResponse = await axios.post(`${url}/api/cloudinary/signature`, {
        folder: 'app_bihar_uploads', // You can customize the folder name
      });

      console.log(signatureResponse.data.data)
      const { signature, timestamp, cloudname, api_key } = signatureResponse.data.data;

      // 2. Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', 'app_bihar_uploads');

      // 3. Upload to Cloudinary directly
      const cloudinaryUploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      const imageUrl = cloudinaryUploadResponse.data.secure_url;
      setUploadedImageUrl(imageUrl);
      setUploadProgress(100);
      setError(null);
      setShowSuccessPopup(true); // Show success pop-up

      if (onFileUploadSuccess) {
        onFileUploadSuccess(imageUrl);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image.');
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    multiple: multiple ?? true, // allow overriding with a default of true
  });

  return (
    <>
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }`}
          id="demo-upload"
        >
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className="text-center mb-5 block w-full text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your files here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </form>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginTop: '10px' }}>
          <p>Uploading: {uploadProgress}%</p>
          <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '5px', height: '20px' }}>
            <div style={{
              width: `${uploadProgress}%`,
              backgroundColor: '#4CAF50',
              height: '100%',
              borderRadius: '5px',
              textAlign: 'center',
              color: 'white',
              lineHeight: '20px'
            }}></div>
          </div>
        </div>
      )}


      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-white/4 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-85">
          <div className="relative p-8 border w-96 shadow-lg rounded-md bg-white text-center">
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowSuccessPopup(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Upload Successful!</h3>
            <p className="text-sm text-gray-500 mt-2">Your file has been uploaded successfully.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DropzoneComponent;