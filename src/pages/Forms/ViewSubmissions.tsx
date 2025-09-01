import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchAllForms, fetchSubmissionsForForm } from '../../features/forms/formsApi';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

const ViewSubmissions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const { formsList, submissions, currentFormDefinition, loading, error } = useSelector((state: RootState) => state.forms);

    const [selectedFormId, setSelectedFormId] = useState<string>(searchParams.get('formId') || '');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        dispatch(fetchAllForms());
    }, [dispatch]);

    useEffect(() => {
        if (selectedFormId) {
            dispatch(fetchSubmissionsForForm(selectedFormId));
        }
    }, [selectedFormId, dispatch]);

    const handleFormSelectionChange = (selectedOption: any) => {
        const formId = selectedOption ? selectedOption.value : '';
        setSelectedFormId(formId);
        if (formId) {
            setSearchParams({ formId: formId });
        } else {
            setSearchParams({});
        }
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/forms/submit/${selectedFormId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
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
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 dark:text-gray-300">
                                {submissions.length > 0 ? (
                                    submissions.map(submission => (
                                        <tr key={submission._id} className="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => navigate(`/submissions/${submission._id}`)}>
                                            {currentFormDefinition.fields.map((field: any) => (
                                                <td key={`${submission._id}-${field.name}`} className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{renderTableCell(submission.data[field.name])}</td>
                                            ))}
                                            <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{new Date(submission.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={currentFormDefinition.fields.length + 1} className="text-center py-8 text-gray-500">
                                            No submissions yet for this form.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSubmissions;