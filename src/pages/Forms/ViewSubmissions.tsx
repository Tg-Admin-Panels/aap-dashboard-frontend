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
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">View Form Submissions</h2>

            <div className="mb-4">
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
                    <div className="flex flex-wrap items-center justify-between my-4 gap-2">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Submissions for: {currentFormDefinition.formName}</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handleCopyLink} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300">
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                            <Link to={`/forms/submit/${selectedFormId}`} className="px-3 py-1 bg-brand-500 text-white rounded text-sm hover:bg-brand-600">
                                Open Form
                            </Link>
                            <button onClick={handleUploadFile} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                Upload File
                            </button>
                            <button onClick={handleDownloadData} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                                Download Data
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    {currentFormDefinition.fields.map((field: any) => (
                                        <th key={field.name} className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">{field.label}</th>
                                    ))}
                                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Submission Date</th>
                                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 dark:text-gray-300">
                                {submissions.length > 0 ? (
                                    submissions.map(submission => (
                                        <tr key={submission._id}>
                                            {currentFormDefinition.fields.map((field: any) => (
                                                <td key={`${submission._id}-${field.name}`} className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 cursor-pointer" onClick={() => navigate(`/submissions/${submission._id}`)}>{renderTableCell(submission.data[field.name])}</td>
                                            ))}
                                            <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 cursor-pointer" onClick={() => navigate(`/submissions/${submission._id}`)}>{new Date(submission.createdAt).toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                                                <button onClick={() => handleDelete(submission._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={currentFormDefinition.fields.length + 2} className="text-center py-8 text-gray-500">
                                            No submissions yet for this form.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
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
