import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { createFormDefinition } from '../../features/forms/formsApi';
import Form from '../../components/form/Form';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

// Helper function
const toCamelCase = (str: string) => {
    return str.toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
        .replace(/^./, (s) => s.toLowerCase());
};

// Options for react-select
const fieldTypeOptions = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "checkbox", label: "checkbox" },
    { value: "password", label: "Password" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "file", label: "File Upload" },
];

// Custom styles for react-select
const customSelectStyles = {
    control: (baseStyles: any) => ({ ...baseStyles, zIndex: '99', backgroundColor: 'transparent', borderColor: '#d1d5db', minHeight: '44px', boxShadow: 'none', '&:hover': { borderColor: '#9ca3af' } }),
    // Add other styles from your project if needed
};

const CreateForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.forms);

    const [formName, setFormName] = useState('');
    const [fields, setFields] = useState([{ name: '', label: '', type: 'text', required: false, options: [''], dependsOn: '' }]);

    const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        const { name, value } = event.target;
        values[index][name] = value;
        if (name === 'label') {
            values[index].name = toCamelCase(value);
        }
        setFields(values);
    };

    const handleFieldTypeChange = (index: number, selectedOption: any) => {
        const values = [...fields];
        values[index].type = selectedOption.value;
        setFields(values);
    };

    const handleDependsOnChange = (index: number, selectedOption: any) => {
        const values = [...fields];
        values[index].dependsOn = selectedOption ? selectedOption.value : '';
        // Reset options when dependency changes
        values[index].options = selectedOption ? {} : [''];
        setFields(values);
    };

    const handleRequiredChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        values[index].required = event.target.checked;
        setFields(values);
    };

    const handleAddField = () => setFields([...fields, { name: '', label: '', type: 'text', required: false, options: [''], dependsOn: '' }]);
    const handleRemoveField = (index: number) => {
        const values = [...fields];
        values.splice(index, 1);
        setFields(values);
    };

    const handleOptionChange = (fieldIndex: number, optionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        const field = values[fieldIndex];
        if (Array.isArray(field.options)) {
            field.options[optionIndex] = event.target.value;
        }
        setFields(values);
    };

    const handleAddOption = (fieldIndex: number) => {
        const values = [...fields];
        const field = values[fieldIndex];
        if (Array.isArray(field.options)) {
            field.options.push('');
        }
        setFields(values);
    };

    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
        const values = [...fields];
        const field = values[fieldIndex];
        if (Array.isArray(field.options)) {
            field.options.splice(optionIndex, 1);
        }
        setFields(values);
    };

    const handleDependentOptionChange = (fieldIndex: number, parentValue: string, optionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        const field = values[fieldIndex];
        if (typeof field.options === 'object' && !Array.isArray(field.options)) {
            if (!field.options[parentValue]) {
                field.options[parentValue] = [];
            }
            field.options[parentValue][optionIndex] = event.target.value;
        }
        setFields(values);
    };

    const handleAddDependentOption = (fieldIndex: number, parentValue: string) => {
        const values = [...fields];
        const field = values[fieldIndex];
        if (typeof field.options === 'object' && !Array.isArray(field.options)) {
            if (!field.options[parentValue]) {
                field.options[parentValue] = [];
            }
            field.options[parentValue].push('');
        }
        setFields(values);
    };

    const handleRemoveDependentOption = (fieldIndex: number, parentValue: string, optionIndex: number) => {
        const values = [...fields];
        const field = values[fieldIndex];
        if (typeof field.options === 'object' && !Array.isArray(field.options)) {
            field.options[parentValue].splice(optionIndex, 1);
        }
        setFields(values);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formattedFields = fields.map(field => {
            const { ...remaningFieldData } = field
            if (field.type !== 'select') {
                return { ...remaningFieldData, options: undefined, dependsOn: undefined };
            }
            if (field.dependsOn) {
                // Dependent dropdown: filter empty options from each array
                const newOptions = {};
                for (const key in field.options) {
                    if (Array.isArray(field.options[key])) {
                        newOptions[key] = field.options[key].filter(opt => opt.trim() !== '');
                    }
                }
                return { ...remaningFieldData, options: newOptions };
            } else {
                // Regular dropdown: filter empty options
                return { ...remaningFieldData, options: (field.options as string[]).filter(opt => opt.trim() !== ''), dependsOn: undefined };
            }
        });

        dispatch(createFormDefinition({ formName, fields: formattedFields }))
            .unwrap()
            .then(() => {
                alert('Form created successfully!');
                navigate(-1);
            })
            .catch((err) => {
                console.error("Failed to create form: ", err);
            });
    };

    const parentFieldOptions = fields
        .filter((f, i) => f.type === 'select' && f.name)
        .map(f => ({ value: f.name, label: f.label || f.name }));

    return (
        <div className="min-h-[550px]  p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Dynamic Form</h2>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            <Form onSubmit={handleSubmit}>
                <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700">
                    <Label htmlFor="formName">Form Name</Label>
                    <Input type="text" id="formName" name="formName" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Enter the name of the form" required />
                </div>

                {fields.map((field, index) => {
                    const parentField = fields.find(f => f.name === field.dependsOn);
                    return (
                        <div key={index} className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Field #{index + 1}</h3>
                                <button type="button" onClick={() => handleRemoveField(index)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`field-label-${index}`}>Label</Label>
                                    <Input type="text" id={`field-label-${index}`} name="label" value={field.label} onChange={e => handleFieldChange(index, e)} placeholder="e.g., First Name" required />
                                </div>
                                <div>
                                    <Label htmlFor={`field-type-${index}`}>Type</Label>
                                    <Select id={`field-type-${index}`} options={fieldTypeOptions} value={fieldTypeOptions.find(option => option.value === field.type)} onChange={(option) => handleFieldTypeChange(index, option)} styles={customSelectStyles} />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id={`field-required-${index}`} name="required" checked={field.required} onChange={e => handleRequiredChange(index, e)} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                                <label htmlFor={`field-required-${index}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Required</label>
                            </div>

                            {field.type === 'select' && (
                                <>
                                    <div>
                                        <Label htmlFor={`depends-on-${index}`}>Depends On (Parent Field)</Label>
                                        <Select
                                            id={`depends-on-${index}`}
                                            options={parentFieldOptions.filter(opt => opt.value !== field.name)} // Prevent self-dependency
                                            value={parentFieldOptions.find(opt => opt.value === field.dependsOn)}
                                            onChange={(option) => handleDependsOnChange(index, option)}
                                            isClearable
                                            placeholder="Select a parent field..."
                                            styles={customSelectStyles}
                                        />
                                    </div>

                                    <div className="space-y-2 p-3 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Dropdown Options</h4>
                                        {field.dependsOn && parentField ? (
                                            (parentField.options as string[]).map(parentOpt => (
                                                <div key={parentOpt} className="p-2 border rounded">
                                                    <p className="font-semibold text-sm mb-2">Options for: <span className='font-bold text-blue-500'>{parentOpt}</span></p>
                                                    {(field.options[parentOpt] || ['']).map((option, optIdx) => (
                                                        <div key={optIdx} className="flex items-center gap-2 mb-2">
                                                            <Input type="text" value={option} onChange={e => handleDependentOptionChange(index, parentOpt, optIdx, e)} className="block w-full" placeholder={`Option ${optIdx + 1}`} />
                                                            <button type="button" onClick={() => handleRemoveDependentOption(index, parentOpt, optIdx)} className="text-red-500 text-sm hover:text-red-700">Remove</button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => handleAddDependentOption(index, parentOpt)} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add Option</button>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                {(field.options as string[]).map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center gap-2">
                                                        <Input type="text" value={option} onChange={e => handleOptionChange(index, optionIndex, e)} className="block w-full" placeholder={`Option ${optionIndex + 1}`} />
                                                        <button type="button" onClick={() => handleRemoveOption(index, optionIndex)} className="text-red-500 text-sm hover:text-red-700">Remove</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => handleAddOption(index)} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add Option</button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}

                <div className="flex justify-between items-center mt-6">
                    <button type="button" onClick={handleAddField} className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
                        Add Another Field
                    </button>
                    <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Form'}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default CreateForm;