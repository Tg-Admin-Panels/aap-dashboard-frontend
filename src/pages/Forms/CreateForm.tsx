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

// Option type
interface Option {
    parent?: string;
    value: string;
}

// Helper function
const toCamelCase = (str: string): string => {
    const hasHindi = /[\u0900-\u097F]/.test(str);
    if (hasHindi) return str.replace(/[^०-९\u0900-\u097F]+/g, '');
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => (chr ? chr.toUpperCase() : ''))
        .replace(/^./, (s) => s.toLowerCase());
};

// Field type options
const fieldTypeOptions = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "checkbox", label: "Checkbox" },
    { value: "password", label: "Password" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "file", label: "File Upload" },
];

// react-select custom styles
const customSelectStyles = {
    control: (base: any) => ({
        ...base,

        backgroundColor: 'white',
        borderColor: '#d1d5db',
        minHeight: '44px',
        boxShadow: 'none',
        '&:hover': { borderColor: '#9ca3af' }
    }),
};

const CreateForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.forms);

    const [formName, setFormName] = useState('');
    const [fields, setFields] = useState([
        { name: '', label: '', type: 'text', required: false, options: [] as Option[], dependsOn: '' }
    ]);

    // Handle field changes
    const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        const { name, value } = e.target;
        values[index][name] = value;
        if (name === 'label') values[index].name = toCamelCase(value);
        setFields(values);
    };

    const handleFieldTypeChange = (index: number, option: any) => {
        const values = [...fields];
        values[index].type = option.value;
        if (option.value !== 'select') values[index].options = [];
        setFields(values);
    };

    const handleDependsOnChange = (index: number, option: any) => {
        const values = [...fields];
        values[index].dependsOn = option ? option.value : '';
        values[index].options = [];
        setFields(values);
    };

    const handleRequiredChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        values[index].required = e.target.checked;
        setFields(values);
    };

    const handleAddField = () =>
        setFields([...fields, { name: '', label: '', type: 'text', required: false, options: [], dependsOn: '' }]);

    const handleRemoveField = (index: number) => {
        const values = [...fields];
        values.splice(index, 1);
        setFields(values);
    };

    // 🔹 Normal option handling
    const handleOptionChange = (fieldIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        values[fieldIndex].options[optionIndex].value = e.target.value;
        setFields(values);
    };

    const handleAddOption = (fieldIndex: number) => {
        const values = [...fields];
        values[fieldIndex].options.push({ value: '' });
        setFields(values);
    };

    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
        const values = [...fields];
        values[fieldIndex].options.splice(optionIndex, 1);
        setFields(values);
    };

    // 🔹 Dependent option handling
    const handleDependentOptionChange = (
        fieldIndex: number,
        parentValue: string,
        optionIndex: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const values = [...fields];
        const option = values[fieldIndex].options.filter(opt => opt.parent === parentValue)[optionIndex];
        option.value = e.target.value;
        setFields(values);
    };

    const handleAddDependentOption = (fieldIndex: number, parentValue: string) => {
        const values = [...fields];
        values[fieldIndex].options.push({ parent: parentValue, value: '' });
        setFields(values);
    };

    const handleRemoveDependentOption = (fieldIndex: number, parentValue: string, optionIndex: number) => {
        const values = [...fields];
        const filtered = values[fieldIndex].options.filter(opt => opt.parent === parentValue);
        const target = filtered[optionIndex];
        values[fieldIndex].options = values[fieldIndex].options.filter(opt => opt !== target);
        setFields(values);
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedFields = fields.map(f => ({
            ...f,
            options: f.type === 'select'
                ? f.options.filter(opt => opt.value.trim() !== '')
                : []
        }));

        dispatch(createFormDefinition({ formName, fields: formattedFields }))
            .unwrap()
            .then(() => {
                alert('Form created successfully!');
                navigate(-1);
            })
            .catch(err => console.error("Failed to create form:", err));
    };

    const parentFieldOptions = fields
        .filter(f => f.type === 'select' && f.name)
        .map(f => ({ value: f.name, label: f.label || f.name }));

    return (
        <div className="min-h-[550px] p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Dynamic Form</h2>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            <Form onSubmit={handleSubmit}>
                {/* Form Name */}
                <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700">
                    <Label htmlFor="formName">Form Name</Label>
                    <Input type="text" id="formName" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                </div>

                {/* Dynamic Fields */}
                {fields.map((field, index) => {
                    const parentField = fields.find(f => f.name === field.dependsOn);
                    return (
                        <div key={index} className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Field #{index + 1}</h3>
                                <button type="button" onClick={() => handleRemoveField(index)} className="text-red-500 font-semibold">Remove</button>
                            </div>

                            {/* Label + Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Label</Label>
                                    <Input type="text" name="label" value={field.label} onChange={(e) => handleFieldChange(index, e)} required />
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <Select options={fieldTypeOptions} value={fieldTypeOptions.find(opt => opt.value === field.type)} onChange={(o) => handleFieldTypeChange(index, o)} styles={customSelectStyles} />
                                </div>
                            </div>

                            {/* Required checkbox */}
                            <div className="flex items-center">
                                <input type="checkbox" checked={field.required} onChange={(e) => handleRequiredChange(index, e)} />
                                <label className="ml-2 text-sm">Required</label>
                            </div>

                            {/* Dropdown Options */}
                            {field.type === 'select' && (
                                <>
                                    {/* Depends On */}
                                    <div>
                                        <Label>Depends On</Label>
                                        <Select
                                            options={parentFieldOptions.filter(opt => opt.value !== field.name)}
                                            value={parentFieldOptions.find(opt => opt.value === field.dependsOn)}
                                            onChange={(o) => handleDependsOnChange(index, o)}
                                            isClearable
                                            placeholder="Select parent field..."
                                            styles={customSelectStyles}
                                        />
                                    </div>

                                    <div className="space-y-2 p-3 border-t">
                                        <h4 className="font-medium">Dropdown Options</h4>
                                        {field.dependsOn && parentField ? (
                                            // Dependent options
                                            (parentField.options.map(p => p.value)).map(parentOpt => (
                                                <div key={parentOpt} className="p-2 border rounded">
                                                    <p className="font-semibold text-sm mb-2">Options for: <span className="text-blue-500">{parentOpt}</span></p>
                                                    {field.options.filter(o => o.parent === parentOpt).map((opt, optIdx) => (
                                                        <div key={optIdx} className="flex gap-2 mb-2">
                                                            <Input type="text" value={opt.value} onChange={(e) => handleDependentOptionChange(index, parentOpt, optIdx, e)} />
                                                            <button type="button" onClick={() => handleRemoveDependentOption(index, parentOpt, optIdx)} className="text-red-500 text-sm">Remove</button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => handleAddDependentOption(index, parentOpt)} className="text-sm text-blue-600">+ Add Option</button>
                                                </div>
                                            ))
                                        ) : (
                                            // Normal options
                                            <>
                                                {field.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex gap-2">
                                                        <Input type="text" value={opt.value} onChange={(e) => handleOptionChange(index, optIdx, e)} />
                                                        <button type="button" onClick={() => handleRemoveOption(index, optIdx)} className="text-red-500 text-sm">Remove</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => handleAddOption(index)} className="text-sm text-blue-600">+ Add Option</button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Actions */}
                <div className="flex justify-between mt-6">
                    <button type="button" onClick={handleAddField} className="px-4 py-2 bg-gray-600 text-white rounded-md">Add Field</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-brand-500 text-white rounded-md disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Form'}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default CreateForm;
