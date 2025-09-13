import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../features/store';
import axiosInstance from '../../utils/axiosInstance';
import SpinnerOverlay from '../ui/SpinnerOverlay';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
    formId: string;
    formFields?: any[];
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUploadSuccess, formId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processedRows, setProcessedRows] = useState(0);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const eventSourceRef = useRef<EventSource | null>(null);

    const closeSSE = useCallback(() => {
        if (eventSourceRef.current) {
            try { eventSourceRef.current.close(); } catch { }
            eventSourceRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        closeSSE();
        setFile(null);
        setLoading(false);
        setError(null);
        setUploadProgress(0);
        setProcessedRows(0);
        setStatusMessage("");
    }, [closeSSE]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setError(null);
            setUploadProgress(0);
            setProcessedRows(0);
            setStatusMessage("");
        }
    }, []);

    const uploadFileInChunks = async (fileToUpload: File) => {
        setLoading(true);
        setError(null);
        setUploadProgress(0);
        setProcessedRows(0);
        setStatusMessage("");

        let jobId: string | null = null;

        try {
            const formData = new FormData();
            formData.append('file', fileToUpload);

            const uploadResponse = await axiosInstance.post(
                `/api/v1/uploads/${formId}/submissions/upload-chunk`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || fileToUpload.size)
                        );
                        setUploadProgress(percentCompleted);
                        setStatusMessage("Uploading file...");
                    },
                }
            );

            jobId = uploadResponse.data.data.jobId;
            console.log("Upload successful, jobId:", jobId);

            // Start listening to SSE events
            const url = import.meta.env.VITE_NODE_ENV === 'development' ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_NODE_ENV === 'local' ? import.meta.env.VITE_LOCAL_BASE_URL : import.meta.env.VITE_PROD_BASE_URL
            console.log("URL is", url)
            const es = new EventSource(`${url}/api/v1/uploads/${formId}/submissions/events?jobId=${jobId}`);
            eventSourceRef.current = es;

            es.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.jobId !== jobId) return;

                setProcessedRows(data.processedRows || 0);
                if (data.totalRows) {
                    const perc = Math.min(100, Math.max(0, (data.processedRows / data.totalRows) * 100));
                    setUploadProgress(perc);
                }

                switch (data.status) {
                    case "queued":
                        setStatusMessage(data.message || "File queued for processing...");
                        break;
                    case "parsing":
                        setStatusMessage(data.message || "Parsing file...");
                        break;
                    case "validating":
                        setStatusMessage(data.message || "Validating headers...");
                        break;
                    case "inserting":
                        setStatusMessage(data.message || `Inserting rows...`);
                        break;
                    case "indexing":
                        setStatusMessage(data.message || "Building indexes...");
                        break;
                    case "completed":
                        setUploadProgress(100);
                        setStatusMessage(data.message || "Processing completed successfully.");
                        onUploadSuccess();
                        closeSSE();
                        break;
                    case "failed":
                        setError(data.message || "Processing failed.");
                        setStatusMessage("Job failed.");
                        if (data.errorReportUrl) {
                            console.warn("Error report available at:", data.errorReportUrl);
                        }
                        closeSSE();
                        break;
                    default:
                        setStatusMessage(`Status: ${data.status}`);
                        break;
                }
            };

            es.onerror = (err) => {
                console.error("SSE connection error:", err);
                setError("SSE connection error. Progress updates may be unavailable.");
                setStatusMessage("Connection lost.");
                closeSSE();
            };

        } catch (uploadErr: any) {
            setError(uploadErr.response?.data?.message || "File upload failed.");
            setStatusMessage("Upload error.");
            closeSSE();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        await uploadFileInChunks(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    useEffect(() => {
        return () => { reset(); };
    }, [reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-90 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                {/* header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload File</h2>
                    <button
                        onClick={() => { reset(); onClose(); }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* dropzone */}
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}>
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v6" />
                        </svg>
                        {file ? (
                            <p className="mt-2 text-sm text-gray-900 dark:text-gray-200">
                                Selected file: <span className="font-medium">{file.name}</span>
                            </p>
                        ) : (
                            isDragActive ?
                                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">Drop the file here ...</p> :
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Drag & drop a file here, or click to select</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(CSV or XLSX only)</p>
                    </div>
                </div>

                {(uploadProgress > 0 || processedRows > 0 || statusMessage) && (
                    <div className="mt-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-blue-700 dark:text-white">
                                {statusMessage || (uploadProgress < 100 ? "Uploading & Processing..." : "Completed!")}
                            </span>
                            <span className="text-sm font-medium text-blue-700 dark:text-white">
                                {uploadProgress < 100 ? `${Math.floor(uploadProgress)}%` : `100%`}
                                {processedRows > 0 && ` (${processedRows} rows)`}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-4 p-2 bg-red-100 dark:bg-red-900 rounded-md border border-red-300 dark:border-red-700">Error: {error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => { reset(); onClose(); }}
                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition duration-200 ease-in-out"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
                        disabled={!file || loading}
                    >
                        {loading ? `Uploading... ${Math.floor(uploadProgress)}%` : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
