import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../features/store';
import { uploadSubmissionsFromCSV } from '../../features/forms/formsApi';
import SpinnerOverlay from '../ui/SpinnerOverlay';
import Papa from 'papaparse';

interface CSVUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
    formId: string;
    formFields: any[];
}

const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ isOpen, onClose, onUploadSuccess, formId, formFields }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setError(null);
            setParsedData([]);
            parseCSV(selectedFile);
        }
    }, [formFields]);

    const parseCSV = (csvFile: File) => {
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const csvHeaders = results.meta.fields.map(h => h.toLowerCase().trim()).sort();
                const expectedHeaders = formFields.map(f => f.label.toLowerCase().trim()).sort();

                if (JSON.stringify(csvHeaders) !== JSON.stringify(expectedHeaders)) {
                    setError(`CSV headers do not match the expected headers. Expected: [${expectedHeaders.join(', ')}], but got: [${csvHeaders.join(', ')}]`);
                    return;
                }

                const fieldMap = formFields.reduce((acc, field) => {
                    acc[field.label.toLowerCase().trim()] = field.name;
                    return acc;
                }, {} as { [key: string]: string });

                const mappedData = results.data.map((row: any) => {
                    const submissionData: { [key: string]: any } = {};
                    for (const key in row) {
                        const trimmedKey = key.toLowerCase().trim();
                        if (fieldMap[trimmedKey]) {
                            submissionData[fieldMap[trimmedKey]] = row[key];
                        }
                    }
                    return { data: submissionData };
                });

                const validSubmissions = mappedData.filter(sub => Object.keys(sub.data).length > 0);

                if (validSubmissions.length === 0) {
                    setError("No data found in CSV.");
                } else {
                    setParsedData(validSubmissions);
                }
            },
            error: (err: any) => {
                setError(`CSV parsing error: ${err.message}`);
            }
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } });

    const handleSubmit = async () => {
        if (parsedData.length === 0) {
            setError("No data to submit. Please check the CSV file.");
            return;
        }
        setLoading(true);
        try {
            await dispatch(uploadSubmissionsFromCSV({ formId, submissions: parsedData })).unwrap();
            onUploadSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to upload submissions.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <SpinnerOverlay loading={loading} />
                <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
                
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    {file ? (
                        <p>{file.name}</p>
                    ) : (
                        isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop a CSV file here, or click to select one</p>
                    )}
                </div>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {parsedData.length > 0 && (
                    <div className="mt-4">
                        <p>{parsedData.length} rows ready to be submitted.</p>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={parsedData.length === 0}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default CSVUploadModal;
