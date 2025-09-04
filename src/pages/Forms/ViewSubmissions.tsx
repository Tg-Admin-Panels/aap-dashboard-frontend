import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchAllForms, fetchSubmissionsForForm, deleteSubmission } from '../../features/forms/formsApi';
import FileUploadModal from '../../components/modal/FileUploadModal';

const DEFAULT_LIMIT = 100; // fixed page size

const ViewSubmissions: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const { formsList, submissions, pagination, currentFormDefinition, loading, error } =
        useSelector((state: RootState) => state.forms);

    const [selectedFormId, setSelectedFormId] = useState<string>(searchParams.get('formId') || '');
    const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

    const handleFormSelectionChange = (selectedOption: any) => {
        const formId = selectedOption ? selectedOption.value : '';
        setSelectedFormId(formId);
        // reset pagination + list
        setAllSubmissions([]);
        setPage(1);
        setHasMore(true);

        if (formId) setSearchParams({ formId });
        else setSearchParams({});
    };

    // Load all forms (once)
    useEffect(() => {
        dispatch(fetchAllForms());
    }, [dispatch]);

    // When selected form changes, reset list + URL (already handled above) & fetch first page
    useEffect(() => {
        const fetchFirst = async () => {
            if (!selectedFormId) return;
            setIsLoadingMore(true);
            try {
                const resultAction = await dispatch(
                    fetchSubmissionsForForm({ formId: selectedFormId, page: 1, limit: DEFAULT_LIMIT })
                );
                if (fetchSubmissionsForForm.fulfilled.match(resultAction)) {
                    const { submissions: newSubs, pagination } = resultAction.payload;
                    setAllSubmissions(newSubs);
                    setHasMore(pagination.hasNextPage);
                    setPage(1);
                }
            } finally {
                setIsLoadingMore(false);
            }
        };
        // reset list when form changes
        setAllSubmissions([]);
        setPage(1);
        setHasMore(true);
        fetchFirst();
    }, [selectedFormId, dispatch]);

    // Load more handler (fetch next page)
    const handleLoadMore = async () => {
        if (!selectedFormId || !hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const resultAction = await dispatch(
                fetchSubmissionsForForm({ formId: selectedFormId, page: nextPage, limit: DEFAULT_LIMIT })
            );
            if (fetchSubmissionsForForm.fulfilled.match(resultAction)) {
                const { submissions: newSubs, pagination } = resultAction.payload;
                setAllSubmissions(prev => [...prev, ...newSubs]);
                setHasMore(pagination.hasNextPage);
                setPage(nextPage);
            }
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        // reload from page 1 after upload
        (async () => {
            if (!selectedFormId) return;
            setAllSubmissions([]);
            setPage(1);
            setHasMore(true);
            setIsLoadingMore(true);
            try {
                const resultAction = await dispatch(
                    fetchSubmissionsForForm({ formId: selectedFormId, page: 1, limit: DEFAULT_LIMIT })
                );
                if (fetchSubmissionsForForm.fulfilled.match(resultAction)) {
                    const { submissions: newSubs, pagination } = resultAction.payload;
                    setAllSubmissions(newSubs);
                    setHasMore(pagination.hasNextPage);
                }
            } finally {
                setIsLoadingMore(false);
            }
        })();
    };

    const handleDelete = async (submissionId: string) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;

        await dispatch(deleteSubmission(submissionId));
        // reload from page 1 after delete
        if (!selectedFormId) return;
        setAllSubmissions([]);
        setPage(1);
        setHasMore(true);
        setIsLoadingMore(true);
        try {
            const resultAction = await dispatch(
                fetchSubmissionsForForm({ formId: selectedFormId, page: 1, limit: DEFAULT_LIMIT })
            );
            if (fetchSubmissionsForForm.fulfilled.match(resultAction)) {
                const { submissions: newSubs, pagination } = resultAction.payload;
                setAllSubmissions(newSubs);
                setHasMore(pagination.hasNextPage);
            }
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleCopyLink = () => {
        if (!selectedFormId) return;
        const link = `${window.location.origin}/forms/submit/${selectedFormId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleUploadFile = () => setIsUploadModalOpen(true);

    const handleDownloadData = () => {
        if (!currentFormDefinition) return;

        const fields = currentFormDefinition.fields;
        const headers = fields.map((field: any) => field.label);

        const convertToCSV = (data: any[]) => {
            const rows = [
                headers,
                ...data.map(item =>
                    fields.map((field: any) => {
                        const value = item.data[field.name]; // ensure correct key mapping
                        if (value === null || value === undefined) return '';
                        if (typeof value === 'object') return JSON.stringify(value);
                        return String(value);
                    })
                ),
            ];

            return rows
                .map(row =>
                    row
                        .map(v => String(v).replace(/"/g, '""'))
                        .map(v => `"${v}"`)
                        .join(',')
                )
                .join('\r\n');
        };

        const csvContent =
            allSubmissions.length > 0
                ? convertToCSV(allSubmissions)
                : headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',');

        const BOM = '\uFEFF'; // for Hindi/Unicode in Excel
        const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;

        const fileName =
            allSubmissions.length > 0
                ? `${currentFormDefinition.formName}-submissions.csv`
                : `${currentFormDefinition.formName}-sample.csv`;

        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const renderTableCell = (item: any) => {
        if (item === null || item === undefined) return 'N/A';
        if (typeof item === 'boolean') return item ? 'Yes' : 'No';
        if (typeof item === 'object') return JSON.stringify(item);

        if (typeof item === 'string' && item.startsWith('http')) {
            if (item.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                return <img src={item} alt="preview" className="h-16 w-16 object-cover rounded" />;
            }
            return (
                <a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View File
                </a>
            );
        }

        return String(item);
    };

    const formOptions = formsList.map(form => ({ value: form._id, label: form.formName }));
    const selectedOption = formOptions.find(option => option.value === selectedFormId) || null;

    return (
        <div className="p-8 rounded-lg shadow-xl bg-white dark:bg-gray-900 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">
                View Form Submissions
            </h2>

            <div className="space-y-4">
                <label
                    htmlFor="form-select"
                    className="block text-lg font-medium mb-2 text-gray-800 dark:text-gray-200"
                >
                    Select a Form:
                </label>
                <Select
                    id="form-select"
                    options={formOptions}
                    value={selectedOption}
                    onChange={handleFormSelectionChange}
                    isClearable
                    placeholder="-- Select a Form --"
                    className="w-full max-w-sm z-30"
                />
            </div>

            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            {currentFormDefinition && selectedFormId && (
                <div>
                    <div className="flex flex-wrap items-center justify-end my-4 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
                        <button
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition duration-200 ease-in-out"
                        >
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <Link
                            to={`/forms/submit/${selectedFormId}`}
                            className="px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 transition duration-200 ease-in-out"
                        >
                            Open Form
                        </Link>
                        <button
                            onClick={handleUploadFile}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition duration-200 ease-in-out"
                        >
                            Upload File
                        </button>
                        <button
                            onClick={handleDownloadData}
                            className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition duration-200 ease-in-out"
                        >
                            Download Data
                        </button>
                    </div>

                    {/* TABLE AREA (scroll only inside this) */}
                    <div
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg shadow-md"
                        style={{ overflowX: 'auto' }}
                    >
                        <table className="min-w-[600px] w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                                <tr>
                                    {currentFormDefinition.fields.map((field: any) => (
                                        <th
                                            key={field.name}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            {field.label}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Submission Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {allSubmissions.length > 0 ? (
                                    allSubmissions.map((submission) => (
                                        <tr
                                            key={submission._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                                        >
                                            {currentFormDefinition.fields.map((field: any) => (
                                                <td
                                                    key={`${submission._id}-${field.name}`}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 cursor-pointer"
                                                    onClick={() => navigate(`/submissions/${submission._id}`)}
                                                >
                                                    {renderTableCell(submission.data[field.name])}
                                                </td>
                                            ))}
                                            <td
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 cursor-pointer"
                                                onClick={() => navigate(`/submissions/${submission._id}`)}
                                            >
                                                {new Date(submission.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(submission._id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={currentFormDefinition.fields.length + 2}
                                            className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                                        >
                                            No submissions yet for this form.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* LOAD MORE (no infinite scroll) */}
                        <div className="text-center py-4">
                            {isLoadingMore ? (
                                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                            ) : hasMore ? (
                                <button
                                    onClick={handleLoadMore}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                                >
                                    Load more
                                </button>
                            ) : (
                                allSubmissions.length > 0 && (
                                    <p className="text-gray-500 dark:text-gray-400">No more submissions to load.</p>
                                )
                            )}
                        </div>
                    </div>


                </div>
            )}

            <FileUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
                formId={selectedFormId}
                formFields={currentFormDefinition?.fields || []}
            />
        </div>
    );
};

export default ViewSubmissions;
