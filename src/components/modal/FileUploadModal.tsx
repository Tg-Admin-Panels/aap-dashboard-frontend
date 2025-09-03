import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../features/store';
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance
import SpinnerOverlay from '../ui/SpinnerOverlay';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
    formId: string;
    formFields: any[]; // This is no longer needed for the modal itself, but kept for simplicity
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUploadSuccess, formId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setError(null);
            setUploadProgress(0);
        }
    }, []);

    const uploadFileInChunks = async (fileToUpload: File) => {
        setLoading(true);
        const chunkSize = 1024 * 1024; // 1MB chunks
        const totalChunks = Math.ceil(fileToUpload.size / chunkSize);
        let chunkIndex = 0;
        console.log(fileToUpload.size)

        for (let i = 0; i < fileToUpload.size; i += chunkSize) {
            const chunk = fileToUpload.slice(i, i + chunkSize);
            const reader = new FileReader();

            const chunkPromise = new Promise<void>((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        const base64Chunk = (e.target?.result as string).split(',')[1];
                        const isLastChunk = (chunkIndex + 1) === totalChunks;

                        await axiosInstance.post(`/api/v1/forms/${formId}/submissions/upload-chunk`, {
                            chunk: base64Chunk,
                            isLastChunk: isLastChunk.toString(),
                            originalname: fileToUpload.name,
                        });

                        chunkIndex++;
                        setUploadProgress(Math.round((chunkIndex / totalChunks) * 100));
                        resolve();
                    } catch (err: any) {
                        setError(err.response?.data?.message || "Chunk upload failed.");
                        reject(err);
                    }
                };
                reader.readAsDataURL(chunk);
            });
            await chunkPromise;
        }

        setLoading(false);
        onUploadSuccess();
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        await uploadFileInChunks(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                {/* <SpinnerOverlay loading={loading && uploadProgress < 100} /> */}
                <h2 className="text-xl font-semibold mb-4">Upload File</h2>

                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    {file ? (
                        <p>{file.name}</p>
                    ) : (
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop a file here, or click to select one</p>
                    )}
                </div>

                {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}

                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={!file || loading}>
                        {loading ? `Uploading... ${uploadProgress}%` : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
