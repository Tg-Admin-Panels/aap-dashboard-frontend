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

// react-select custom styles
const customSelectStyles = {
    control: (baseStyles: any) => ({
        ...baseStyles,
        backgroundColor: 'transparent',
        borderColor: '#d1d5db',
        minHeight: '44px',
        boxShadow: 'none',
        '&:hover': { borderColor: '#9ca3af' },
    }),
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (fieldName: string, selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : null;
        setFormData((prev) => {
            const newState = { ...prev, [fieldName]: value };

            // Reset dependent children when parent changes
            const fieldsToReset = new Set<string>();
            let fieldsToCheck = [fieldName];

            while (fieldsToCheck.length > 0) {
                const currentFieldName = fieldsToCheck.shift();
                currentFormDefinition?.fields.forEach((field: any) => {
                    if (field.dependsOn === currentFieldName) {
                        fieldsToReset.add(field.name);
                        fieldsToCheck.push(field.name);
                    }
                });
            }

            fieldsToReset.forEach((name) => {
                newState[name] = null;
            });

            return newState;
        });
    };

    const handleFileChange = (fieldName: string, url: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formId) return;

        dispatch(submitFormData({ formId, data: formData }))
            .unwrap()
            .then(() => {
                alert('Form submitted successfully!');
                navigate(-1);
            })
            .catch((err) => {
                console.error('Failed to submit form: ', err);
                alert(`Error: ${err}`);
            });
    };

    const isImageUrl = (url: string) =>
        url && url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;

    if (loading && !currentFormDefinition) return <SpinnerOverlay loading={true} />;
    if (error) return <div className="p-6 text-red-500 bg-red-100 rounded-lg">Error: {error}</div>;

    return (
        <div className="min-h-[550px] p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            {currentFormDefinition && (
                <Form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold mb-6">{currentFormDefinition.formName}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {currentFormDefinition.fields.map((field: any) => {
                            switch (field.type) {
                                case 'textarea':
                                    return (
                                        <div key={field.name} className="mb-4">
                                            <Label htmlFor={field.name}>
                                                {field.label}
                                                {field.required && <span className="text-red-500">*</span>}
                                            </Label>
                                            <textarea
                                                id={field.name}
                                                name={field.name}
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                rows={4}
                                                required={field.required}
                                                placeholder={`Enter ${field.label}`}
                                                className="w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700"
                                            />
                                        </div>
                                    );

                                case 'select': {
                                    let options: { value: string; label: string }[] = [];
                                    let isDisabled = false;

                                    if (field.dependsOn) {
                                        const parentValue = formData[field.dependsOn];
                                        if (parentValue) {
                                            options = field.options
                                                .filter((opt: any) => opt.parent === parentValue)
                                                .map((opt: any) => ({ value: opt.value, label: opt.value }));
                                        } else {
                                            isDisabled = true;
                                        }
                                    } else {
                                        options = field.options.map((opt: any) => ({
                                            value: opt.value,
                                            label: opt.value,
                                        }));
                                    }

                                    return (
                                        <div key={field.name} className="mb-4">
                                            <Label>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
                                            <Select
                                                id={field.name}
                                                options={options}
                                                value={
                                                    formData[field.name]
                                                        ? options.find((opt) => opt.value === formData[field.name])
                                                        : null
                                                }
                                                onChange={(opt) => handleSelectChange(field.name, opt)}
                                                isDisabled={isDisabled}
                                                styles={customSelectStyles}
                                                placeholder={`Select ${field.label}`}
                                            />
                                        </div>
                                    );
                                }

                                case 'file':
                                    return (
                                        <div key={field.name} className="mb-4">
                                            <Label>{field.label}</Label>
                                            <DropzoneComponent
                                                accept={{ '*/*': [] }}
                                                multiple={false}
                                                onFileUploadSuccess={(url) => handleFileChange(field.name, url)}
                                            />
                                            {formData[field.name] && (
                                                <div className="mt-2">
                                                    {isImageUrl(formData[field.name]) ? (
                                                        <img src={formData[field.name]} alt="preview" className="h-32 rounded shadow" />
                                                    ) : (
                                                        <a href={formData[field.name]} target="_blank" rel="noopener noreferrer" className="text-brand-500 underline">
                                                            View Uploaded File
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );

                                case 'checkbox':
                                    return (
                                        <div key={field.name} className="mb-4 flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={field.name}
                                                checked={!!formData[field.name]}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                                                className="h-4 w-4 border-gray-300 rounded"
                                            />
                                            <label htmlFor={field.name}>{field.label}</label>
                                        </div>
                                    );

                                default:
                                    return (
                                        <div key={field.name} className="mb-4">
                                            <Label>{field.label}</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type}
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                placeholder={`Enter ${field.label}`}
                                                required={field.required}
                                            />
                                        </div>
                                    );
                            }
                        })}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-brand-500 text-white rounded-md disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </Form>
            )}
        </div>
    );
};

export default SubmitForm;
