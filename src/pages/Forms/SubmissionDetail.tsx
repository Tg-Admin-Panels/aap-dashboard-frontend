
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const fetchSubmissionDetails = async (submissionId: string) => {
    const response = await fetch(`http://localhost:8000/api/v1/forms/submissions/${submissionId}`);
    if (!response.ok) throw new Error('Submission not found');
    return response.json();
};

const SubmissionDetail = () => {
    const { submissionId } = useParams<{ submissionId: string }>();
    const [submission, setSubmission] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!submissionId) return;
        const loadDetails = async () => {
            try {
                const response = await fetchSubmissionDetails(submissionId);
                setSubmission(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadDetails();
    }, [submissionId]);

    const renderValue = (value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-500">N/A</span>;
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'string' && value.startsWith('http')) {
            if (value.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                return <img src={value} alt="preview" className="mt-2 h-48 w-auto rounded shadow-md" />;
            }
            return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">View File</a>;
        }
        return String(value);
    };

    if (isLoading) return <div className="p-8">Loading submission details...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!submission) return <div className="p-8">No submission data found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-2">{submission.formId.formName}</h1>
                <p className="text-gray-500 mb-6 border-b pb-4">Submitted on: {new Date(submission.createdAt).toLocaleString()}</p>
                
                <div className="space-y-4">
                    {submission.formId.fields.map((field: any) => (
                        <div key={field.name} className="p-4 border rounded-md bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-600">{field.label}</h3>
                            <div className="text-lg text-gray-900 mt-1">
                                {renderValue(submission.data[field.name])}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;
