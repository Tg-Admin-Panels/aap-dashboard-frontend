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

    if (loading) return <SpinnerOverlay loading={true} />;
    if (error) return <div className="p-6 text-red-600 bg-red-100 rounded-lg">Error: {error}</div>;
    if (!currentSubmission) return <div className="p-6">No submission data found.</div>;

    return (
        <div className="max-w-5xl mx-auto bg-white border border-gray-800 p-6 min-h-[550px]">
            {/* Header */}
            <div className="text-center border-b border-gray-800 pb-2 mb-4">
                <h2 className="font-bold text-lg uppercase">
                    {currentSubmission.formId.formName}
                </h2>

                <h3 className="font-bold uppercase border-t border-b border-gray-800 mt-2 py-1 text-sm">
                    Submission Details
                </h3>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSubmission.formId.fields.map((field: any) => (
                    <div
                        key={field.name}
                        className="p-3 border border-gray-300 rounded bg-gray-50"
                    >
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            {field.label}
                        </p>
                        <p className="text-sm text-gray-900">
                            {String(currentSubmission.data[field.name] ?? 'N/A')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubmissionDetail;
