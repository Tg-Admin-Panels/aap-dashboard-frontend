import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchAllForms, fetchSubmissionsForForm, deleteSubmission } from '../../features/forms/formsApi';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';
import FileUploadModal from '../../components/modal/FileUploadModal';

const ViewSubmissions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const { formsList, submissions, pagination, currentFormDefinition, loading, error } = useSelector((state: RootState) => state.forms);

    const [selectedFormId, setSelectedFormId] = useState<string>(searchParams.get('formId') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
    const [copied, setCopied] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAllForms());
    }, [dispatch]);

    useEffect(() => {
        if (selectedFormId) {
            dispatch(fetchSubmissionsForForm({ formId: selectedFormId, page: currentPage }));
        }
    }, [selectedFormId, currentPage, dispatch]);

    const handleFormSelectionChange = (selectedOption: any) => {
        const formId = selectedOption ? selectedOption.value : '';
        setSelectedFormId(formId);
        setCurrentPage(1);
        if (formId) {
            setSearchParams({ formId: formId, page: '1' });
        } else {
            setSearchParams({});
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setSearchParams({ formId: selectedFormId, page: newPage.toString() });
    };

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        dispatch(fetchSubmissionsForForm({ formId: selectedFormId, page: currentPage }));
    };

    const handleDelete = (submissionId: string) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            dispatch(deleteSubmission(submissionId));
        }
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/forms/submit/${selectedFormId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleUploadFile = () => {
        setIsUploadModalOpen(true);
    };

    const handleDownloadData = () => {
        if (!currentFormDefinition) return;

        const fields = currentFormDefinition.fields;
        const headers = fields.map((field: any) => field.label);

        const convertToCSV = (data: any[]) => {
            const array = [headers, ...data.map(item => {
                return fields.map((field: any) => {
                    const value = item.data[field.name];
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'object') return JSON.stringify(value);
                    return String(value);
                });
            })];
            return array.map(row =>
                row.map(String).map(v => v.replace(/"/g, '""')).map(v => `"${v}"`).join(',')
            ).join('\r\n');
        };

        const csvContent = submissions.length > 0
            ? convertToCSV(submissions)
            : headers.map(h => `"${h}"`).join(',');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const fileName = submissions.length > 0
            ? `${currentFormDefinition.formName}-submissions.csv`
            : `${currentFormDefinition.formName}-sample.csv`;
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTableCell = (item: any) => {
        if (item === null || item === undefined) return 'N/A';
        if (typeof item === 'boolean') return item ? 'Yes' : 'No';
        if (typeof item === 'object') return JSON.stringify(item);

        if (typeof item === 'string' && item.startsWith('http')) {
            if (item.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                return <img src={item} alt="preview" className="h-16 w-16 object-cover rounded" />;
            }
            return <a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a>;
        }

        return String(item);
    };

    const formOptions = formsList.map(form => ({ value: form._id, label: form.formName }));
    const selectedOption = formOptions.find(option => option.value === selectedFormId);

    return (
        <div className="p-8 rounded-lg shadow-xl bg-white dark:bg-gray-900 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">View Form Submissions</h2>

            <div className="space-y-4">
                <label htmlFor="form-select" className="block text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Select a Form:</label>
                <Select
                    id="form-select"
                    options={formOptions}
                    value={selectedOption}
                    onChange={handleFormSelectionChange}
                    isClearable
                    placeholder="-- Select a Form --"
                    className="w-full max-w-sm"
                />
            </div>

            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            {currentFormDefinition && selectedFormId && (
                <div>
                    <div className="flex flex-wrap items-center justify-end my-4 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
                        <button onClick={handleCopyLink} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <Link to={`/forms/submit/${selectedFormId}`} className="px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 transition duration-200 ease-in-out">
                            Open Form
                        </Link>
                        <button onClick={handleUploadFile} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition duration-200 ease-in-out">
                            Upload File
                        </button>
                        <button onClick={handleDownloadData} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition duration-200 ease-in-out">
                            Download Data
                        </button>
                    </div>
                    {/* SCROLLABLE TABLE */}
                    <div className="relative -mx-2 sm:mx-0">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
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
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
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
                        </div>
                    </div>


                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200 ease-in-out"
                            >
                                Previous
                            </button>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200 ease-in-out"
                            >
                                Next
                            </button>
                        </div>
                    )}
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
