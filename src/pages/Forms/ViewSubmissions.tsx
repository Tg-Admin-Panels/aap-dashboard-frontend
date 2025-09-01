
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';

// API fetching functions
const fetchAllForms = async () => {
    const response = await fetch('http://localhost:8000/api/v1/forms');
    if (!response.ok) throw new Error('Failed to fetch forms');
    return response.json();
};

const fetchSubmissionsForForm = async (formId: string) => {
    const response = await fetch(`http://localhost:8000/api/v1/forms/${formId}/submissions`);
    if (!response.ok) throw new Error('Failed to fetch submissions');
    return response.json();
};

const ViewSubmissions = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [forms, setForms] = useState<any[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string>(searchParams.get('formId') || '');
    const [formDefinition, setFormDefinition] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadForms = async () => {
            try {
                const response = await fetchAllForms();
                setForms(response.data || []);
            } catch (err: any) {
                setError(err.message);
            }
        };
        loadForms();
    }, []);

    useEffect(() => {
        if (!selectedFormId) {
            setSubmissions([]);
            setFormDefinition(null);
            return;
        }

        const loadSubmissions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchSubmissionsForForm(selectedFormId);
                setFormDefinition(response.data.formDefinition);
                setSubmissions(response.data.submissions || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadSubmissions();
    }, [selectedFormId]);

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

    const formOptions = forms.map(form => ({ value: form._id, label: form.formName }));
    const selectedOption = formOptions.find(option => option.value === selectedFormId);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">View Form Submissions</h1>

            <div className="mb-4">
                <label htmlFor="form-select" className="block text-lg font-medium mb-2">Select a Form:</label>
                <Select
                    id="form-select"
                    options={formOptions}
                    value={selectedOption}
                    onChange={handleFormSelectionChange}
                    isClearable
                    placeholder="-- Select a Form --"
                    className="w-full max-w-xs"
                />
            </div>

            {isLoading && <p>Loading submissions...</p>}
            {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

            {!isLoading && !error && formDefinition && (
                <div>
                    <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                        <h2 className="text-xl font-semibold">Submissions for: {formDefinition.formName}</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={handleCopyLink} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300">
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                            <Link to={`/forms/submit/${selectedFormId}`} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                Open Form
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-200">
                                <tr>
                                    {formDefinition.fields.map((field: any) => (
                                        <th key={field.name} className="py-2 px-4 border-b text-left">{field.label}</th>
                                    ))}
                                    <th className="py-2 px-4 border-b text-left">Submission Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length > 0 ? (
                                    submissions.map(submission => (
                                        <tr key={submission._id} className="hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/submissions/${submission._id}`)}>
                                            {formDefinition.fields.map((field: any) => (
                                                <td key={`${submission._id}-${field.name}`} className="py-2 px-4 border-b">{renderTableCell(submission.data[field.name])}</td>
                                            ))}
                                            <td className="py-2 px-4 border-b">{new Date(submission.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={formDefinition.fields.length + 1} className="text-center py-4">No submissions yet.</td>
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
