import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchSubmissionsForForm, deleteSubmission } from '../../features/forms/formsApi';
import FileUploadModal from '../../components/modal/FileUploadModal';

const DEFAULT_LIMIT = 100;

const ViewSubmissions: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { formId } = useParams();

    const { currentFormDefinition, error } = useSelector((state: RootState) => state.forms);

    const [submissions, setSubmissions] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!formId) return;
        const fetchInitial = async () => {
            setIsLoading(true);
            const result = await dispatch(fetchSubmissionsForForm({ formId, page: 1, limit: DEFAULT_LIMIT }));
            if (fetchSubmissionsForForm.fulfilled.match(result)) {
                const { submissions: newData, pagination } = result.payload;
                setSubmissions(newData);
                setHasMore(pagination.hasNextPage);
                setPage(1);
            }
            setIsLoading(false);
        };

        setSubmissions([]);
        setPage(1);
        setHasMore(true);
        fetchInitial();
    }, [formId, dispatch]);

    const handleLoadMore = async () => {
        if (!formId || !hasMore || isLoading) return;
        setIsLoading(true);
        const nextPage = page + 1;
        const result = await dispatch(fetchSubmissionsForForm({ formId, page: nextPage, limit: DEFAULT_LIMIT }));
        if (fetchSubmissionsForForm.fulfilled.match(result)) {
            const { submissions: newData, pagination } = result.payload;
            setSubmissions(prev => [...prev, ...newData]);
            setHasMore(pagination.hasNextPage);
            setPage(nextPage);
        }
        setIsLoading(false);
    };

    const handleDelete = async (submissionId: string) => {
        if (!window.confirm('Delete this submission?')) return;
        await dispatch(deleteSubmission(submissionId));
        const result = await dispatch(fetchSubmissionsForForm({ formId: formId!, page: 1, limit: DEFAULT_LIMIT }));
        if (fetchSubmissionsForForm.fulfilled.match(result)) {
            const { submissions: newData, pagination } = result.payload;
            setSubmissions(newData);
            setHasMore(pagination.hasNextPage);
            setPage(1);
        }
    };

    const handleCopyLink = () => {
        if (!formId) return;
        const link = `${window.location.origin}/forms/submit/${formId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleUploadFile = () => setIsUploadModalOpen(true);

    const handleUploadSuccess = async () => {
        setTimeout(() => {
            setIsUploadModalOpen(false);

        }, 5000);
        if (!formId) return;
        setIsLoading(true);
        const result = await dispatch(fetchSubmissionsForForm({ formId, page: 1, limit: DEFAULT_LIMIT }));
        if (fetchSubmissionsForForm.fulfilled.match(result)) {
            const { submissions: newData, pagination } = result.payload;
            setSubmissions(newData);
            setHasMore(pagination.hasNextPage);
            setPage(1);
        }
        setIsLoading(false);
    };

    const handleDownloadData = () => {
        if (!currentFormDefinition) return;

        const locationFields = [];
        if (currentFormDefinition.locationDD) {
            if (currentFormDefinition.locationDD.state) {
                locationFields.push({ name: 'state', label: 'State' });
            }
            if (currentFormDefinition.locationDD.district) {
                locationFields.push({ name: 'district', label: 'District' });
            }
            if (currentFormDefinition.locationDD.legislativeAssembly) {
                locationFields.push({ name: 'legislativeAssembly', label: 'Legislative Assembly' });
            }
            if (currentFormDefinition.locationDD.booth) {
                locationFields.push({ name: 'booth', label: 'Booth' });
            }
        }

        const allFields = [...locationFields, ...(currentFormDefinition.fields || [])];

        const headers = allFields.map((f) => f.label);
        const rows = [
            headers,
            ...submissions.map(item =>
                allFields.map((f) => {
                    const value = item.data?.[f.name];
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'object') return JSON.stringify(value);
                    return String(value);
                })
            )
        ];
        const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
        const BOM = '\uFEFF';
        const blob = new Blob([BOM, csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFormDefinition.formName || 'data'}-submissions.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderTableCell = (item: any) => {
        if (item === null || item === undefined) return 'N/A';
        if (typeof item === 'boolean') return item ? 'Yes' : 'No';
        if (typeof item === 'object') return JSON.stringify(item);
        if (typeof item === 'string' && item.startsWith('http')) {
            if (item.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return <img src={item} className="w-16 h-16 rounded object-cover" alt="preview" />;
            }
            return <a href={item} className="text-blue-500 underline" target="_blank" rel="noreferrer">View</a>;
        }
        return String(item);
    };

    const locationFields = [];
    if (currentFormDefinition?.locationDD) {
        if (currentFormDefinition.locationDD.state) {
            locationFields.push({ name: 'state', label: 'State' });
        }
        if (currentFormDefinition.locationDD.district) {
            locationFields.push({ name: 'district', label: 'District' });
        }
        if (currentFormDefinition.locationDD.legislativeAssembly) {
            locationFields.push({ name: 'legislativeAssembly', label: 'Legislative Assembly' });
        }
        if (currentFormDefinition.locationDD.booth) {
            locationFields.push({ name: 'booth', label: 'Booth' });
        }
    }
    const allFields = [...locationFields, ...(currentFormDefinition?.fields || [])];

    return (
        <div className="p-8 rounded-lg shadow-xl bg-white dark:bg-gray-900 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">
                View Form Submissions
            </h2>

            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            {currentFormDefinition && formId && (
                <div>
                    <div className="flex flex-wrap items-center justify-end my-4 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <button onClick={handleCopyLink} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300">
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <Link to={`/forms/submit/${formId}`} className="px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600">
                            Open Form
                        </Link>
                        <button onClick={handleUploadFile} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                            Upload File
                        </button>
                        <button onClick={handleDownloadData} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
                            Download Data
                        </button>
                    </div>

                    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                        <table className="min-w-[600px] w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                                <tr>
                                    {allFields.map((field: any) => (
                                        <th key={field.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {field.label}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submission Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {submissions.length > 0 ? (
                                    submissions.map((submission) => (
                                        <tr key={submission._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            {allFields.map((field: any) => (
                                                <td key={field.name} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 cursor-pointer" onClick={() => navigate(`/submissions/${submission._id}`)}>
                                                    {renderTableCell(submission.data[field.name])}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 cursor-pointer" onClick={() => navigate(`/submissions/${submission._id}`)}>
                                                {new Date(submission.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button onClick={() => handleDelete(submission._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={allFields.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No submissions yet for this form.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="text-center py-4">
                            {isLoading ? (
                                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                            ) : hasMore ? (
                                <button onClick={handleLoadMore} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Load more</button>
                            ) : (
                                submissions.length > 0 && <p className="text-gray-500 dark:text-gray-400">No more submissions to load.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <FileUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
                formId={formId!}
                formFields={currentFormDefinition?.fields || []}
            />
        </div>
    );
};

export default ViewSubmissions;
