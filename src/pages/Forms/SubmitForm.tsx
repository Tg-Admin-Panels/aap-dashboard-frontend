import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchFormDefinition, submitFormData } from '../../features/forms/formsApi';
import DropzoneComponent from '../../components/form/form-elements/DropZone';
import Form from '../../components/form/Form';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

// Custom styles for react-select
const customSelectStyles = {
    control: (baseStyles: any) => ({ ...baseStyles, backgroundColor: 'transparent', borderColor: '#d1d5db', minHeight: '44px', boxShadow: 'none', '&:hover': { borderColor: '#9ca3af' } }),
    // Add other styles if needed
};

const SubmitForm = () => {
    const { formId } = useParams<{ formId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { currentFormDefinition, loading, error } = useSelector((state: RootState) => state.forms);
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (formId) {
            dispatch(fetchFormDefinition(formId));
        }
    }, [formId, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (fieldName: string, selectedOption: any) => {
        setFormData(prev => ({ ...prev, [fieldName]: selectedOption ? selectedOption.value : '' }));
    };

    const handleFileChange = (fieldName: string, url: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formId) return;

        dispatch(submitFormData({ formId, data: formData }))
            .unwrap()
            .then(() => {
                alert('Form submitted successfully!');
                navigate('/forms/view');
            })
            .catch((err) => {
                console.error("Failed to submit form: ", err);
                alert(`Error: ${err}`); // Show error alert
            });
    };

    const isImageUrl = (url: string) => url && url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;

    if (loading && !currentFormDefinition) return <SpinnerOverlay loading={true} />;
    if (error) return <div className="p-6 text-red-500 bg-red-100 rounded-lg">Error: {error}</div>;

    return (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            {currentFormDefinition && (
                <Form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{currentFormDefinition.formName}</h2>
                    {currentFormDefinition.fields.map((field: any) => (
                        <div key={field.name} className="mb-4">
                            <Label htmlFor={field.name}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
                            {(() => {
                                switch (field.type) {
                                    case 'textarea':
                                        return <Input as="textarea" id={field.name} name={field.name} onChange={handleChange} required={field.required} placeholder={`Enter ${field.label}`} rows={4} />;
                                    case 'select':
                                        const options = field.options.map((opt: string) => ({ value: opt, label: opt }));
                                        return <Select id={field.name} name={field.name} options={options} onChange={(option) => handleSelectChange(field.name, option)} required={field.required} styles={customSelectStyles} placeholder={`Select ${field.label}`} />;
                                    case 'file':
                                        return (
                                            <div>
                                                <DropzoneComponent accept={{ '*/*': [] }} multiple={false} onFileUploadSuccess={(url) => handleFileChange(field.name, url)} />
                                                {formData[field.name] && (
                                                    <div className="mt-4">
                                                        <h4 className="font-semibold text-sm text-gray-600">Uploaded File Preview:</h4>
                                                        {isImageUrl(formData[field.name]) ? (
                                                            <img src={formData[field.name]} alt="Preview" className="mt-2 h-32 w-auto rounded shadow-md" />
                                                        ) : (
                                                            <a href={formData[field.name]} target="_blank" rel="noopener noreferrer" className="text-brand-500 underline">View Uploaded File</a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    default:
                                        return <Input id={field.name} name={field.name} type={field.type} onChange={handleChange} required={field.required} placeholder={`Enter ${field.label}`} />;
                                }
                            })()}
                        </div>
                    ))}
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:bg-gray-400">
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </Form>
            )}
        </div>
    );
};

export default SubmitForm;