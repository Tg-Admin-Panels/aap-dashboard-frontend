import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchSubmissionDetails } from '../../features/forms/formsApi';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

const isUrl = (val: any) => typeof val === 'string' && /^https?:\/\//i.test(val);
const isImageUrl = (url: string) =>
    /\.(avif|bmp|gif|jpe?g|jpg|png|tiff?|webp|svg)(\?.*)?$/i.test(url);
const isPdfUrl = (url: string) =>
    /\.pdf(\?.*)?$/i.test(url) || /application\/pdf/i.test(url);

const renderFile = (url: string) => {
    if (isImageUrl(url)) {
        return (
            <div className="flex flex-col gap-2">
                <img
                    src={url}
                    alt="preview"
                    className="mt-2 h-48 w-auto rounded shadow-md border"
                    loading="lazy"
                />
                <div className="flex gap-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                        View
                    </a>
                    <a
                        href={url}
                        download
                        className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                    >
                        Download
                    </a>
                </div>
            </div>
        );
    }

    if (isPdfUrl(url)) {
        return (
            <div className="flex flex-col gap-2">
                <object
                    data={url}
                    type="application/pdf"
                    className="w-full h-64 border rounded"
                >
                    <p className="p-2 text-sm">PDF preview not supported. Use the links below.</p>
                </object>
                <div className="flex gap-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                        View
                    </a>
                    <a
                        href={url}
                        download
                        className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                    >
                        Download
                    </a>
                </div>
            </div>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
        >
            Open File
        </a>
    );
};

const renderValue = (value: any) => {
    if (value === null || value === undefined) {
        return <span className="text-gray-500">N/A</span>;
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-gray-500">N/A</span>;
        return (
            <div className="flex flex-col gap-3">
                {value.map((v, idx) =>
                    isUrl(v) ? <div key={idx}>{renderFile(v)}</div> : <div key={idx}>{String(v)}</div>
                )}
            </div>
        );
    }

    if (typeof value === 'object') {
        if (value?.url && isUrl(value.url)) {
            return renderFile(value.url);
        }
        return <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>;
    }

    if (typeof value === 'string' && isUrl(value)) {
        return renderFile(value);
    }

    return String(value);
};

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
    if (error) return <div className="p-8 text-red-600 bg-red-100 rounded-lg">Error: {error}</div>;
    if (!currentSubmission) return <div className="p-8">No submission data found.</div>;

    return (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    {currentSubmission.formId.formName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    Submitted on: {new Date(currentSubmission.createdAt).toLocaleString()}
                </p>

                <div className="space-y-4">
                    {currentSubmission.formId.fields.map((field: any) => (
                        <div
                            key={field.name}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800"
                        >
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                {field.label}
                            </h3>
                            <div className="mt-2">{renderValue(currentSubmission.data[field.name])}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;
