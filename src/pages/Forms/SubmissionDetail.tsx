import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchSubmissionDetails } from '../../features/forms/formsApi';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

const SubmissionDetail = () => {
    const { submissionId } = useParams<{ submissionId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentSubmission, loading, error } = useSelector((state: RootState) => state.forms);

    useEffect(() => {
        if (submissionId) {
            dispatch(fetchSubmissionDetails(submissionId));
        }
    }, [submissionId, dispatch]);

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

    if (loading) return <SpinnerOverlay loading={true} />;
    if (error) return <div className="p-8 text-red-600 bg-red-100 rounded-lg">Error: {error}</div>;
    if (!currentSubmission) return <div className="p-8">No submission data found.</div>;

    return (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{currentSubmission.formId.formName}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    Submitted on: {new Date(currentSubmission.createdAt).toLocaleString()}
                </p>
                
                <div className="space-y-4">
                    {currentSubmission.formId.fields.map((field: any) => (
                        <div key={field.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{field.label}</h3>
                            <div className="text-lg text-gray-900 dark:text-white mt-1">
                                {renderValue(currentSubmission.data[field.name])}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;