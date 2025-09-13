import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { createFormDefinition } from '../../features/forms/formsApi';
import { getAllStates, getAllDistricts, getAllLegislativeAssemblies_ } from '../../features/locations/locationsApi';
import Form from '../../components/form/Form';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';
import { FaPlus, FaTrash } from 'react-icons/fa';

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
    const [locationDD, setLocationDD] = useState({
        state: false,
        district: false,
        legislativeAssembly: false,
        booth: false,
        fixedState: null,
        fixedDistrict: null,
        fixedLegislativeAssembly: null,
    });

    const [allStates, setAllStates] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);
    const [allLegislativeAssemblies, setAllLegislativeAssemblies] = useState([]);

    useEffect(() => {
        dispatch(getAllStates()).then(action => {
            if (action.payload) {
                setAllStates(action.payload.map((s: any) => ({ value: s._id, label: s.name })));
            }
        });
        dispatch(getAllDistricts()).then(action => {
            if (action.payload) {
                setAllDistricts(action.payload.map((d: any) => ({ value: d._id, label: d.name })));
            }
        });
        dispatch(getAllLegislativeAssemblies_()).then(action => {
            if (action.payload) {
                setAllLegislativeAssemblies(action.payload.map((l: any) => ({ value: l._id, label: l.name })));
            }
        });
    }, [dispatch]);

    const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const values = [...fields];
        const target = e.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        values[index][e.target.name] = value;
        if (e.target.name === 'label') values[index].name = toCamelCase(e.target.value);
        setFields(values);
    };

    const handleFieldTypeChange = (index: number, option: any) => {
        const values = [...fields];
        values[index].type = option.value;
        if (option.value !== 'select') {
            values[index].options = [];
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalLocationDD = { ...locationDD };
        if (finalLocationDD.state) finalLocationDD.fixedState = null;
        if (finalLocationDD.district) finalLocationDD.fixedDistrict = null;
        if (finalLocationDD.legislativeAssembly) finalLocationDD.fixedLegislativeAssembly = null;

        const formattedFields = fields.map(f => ({
            ...f,
            options: f.type === 'select'
                ? f.options.filter(opt => opt.value.trim() !== '')
                : []
        }));

        dispatch(createFormDefinition({ formName, fields: formattedFields, locationDD: finalLocationDD }))
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
        <div className="bg-gray-100 min-h-screen">
            <SpinnerOverlay loading={loading} />
            <Form onSubmit={handleSubmit} className="flex gap-8 p-8">
                {/* Left Column (Sticky) */}
                <div className="w-1/3 sticky top-8 h-fit">
                    <div className="p-6 bg-white rounded-lg shadow space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Form Settings</h2>
                            <Label htmlFor="formName">Form Name</Label>
                            <Input type="text" id="formName" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">Location Dropdowns</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-md bg-gray-50">
                                    <label className="flex items-center gap-2 font-medium">
                                        <input type="checkbox" checked={locationDD.state} onChange={e => setLocationDD({...locationDD, state: e.target.checked})} className="h-5 w-5" />
                                        State
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-md bg-gray-50">
                                    <label className="flex items-center gap-2 font-medium">
                                        <input type="checkbox" checked={locationDD.district} onChange={e => setLocationDD({...locationDD, district: e.target.checked})} className="h-5 w-5" />
                                        District
                                    </label>
                                    {locationDD.district && !locationDD.state && (
                                        <div className="flex-1">
                                            <Select
                                                options={allStates}
                                                placeholder="Select a fixed State"
                                                onChange={opt => setLocationDD({...locationDD, fixedState: opt.value})}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-md bg-gray-50">
                                    <label className="flex items-center gap-2 font-medium">
                                        <input type="checkbox" checked={locationDD.legislativeAssembly} onChange={e => setLocationDD({...locationDD, legislativeAssembly: e.target.checked})} className="h-5 w-5" />
                                        Legislative Assembly
                                    </label>
                                    {locationDD.legislativeAssembly && !locationDD.district && (
                                        <div className="flex-1">
                                            <Select
                                                options={allDistricts}
                                                placeholder="Select a fixed District"
                                                onChange={opt => setLocationDD({...locationDD, fixedDistrict: opt.value})}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-md bg-gray-50">
                                    <label className="flex items-center gap-2 font-medium">
                                        <input type="checkbox" checked={locationDD.booth} onChange={e => setLocationDD({...locationDD, booth: e.target.checked})} className="h-5 w-5" />
                                        Booth
                                    </label>
                                    {locationDD.booth && !locationDD.legislativeAssembly && (
                                        <div className="flex-1">
                                            <Select
                                                options={allLegislativeAssemblies}
                                                placeholder="Select a fixed Legislative Assembly"
                                                onChange={opt => setLocationDD({...locationDD, fixedLegislativeAssembly: opt.value})}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-brand-500 text-white font-bold rounded-md disabled:bg-gray-400 hover:bg-brand-600 transition-colors">
                            {loading ? 'Saving...' : 'Save Form'}
                        </button>
                        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
                    </div>
                </div>

                {/* Right Column (Scrollable) */}
                <div className="w-2/3 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Dynamic Fields</h2>
                        <button type="button" onClick={handleAddField} className="px-4 py-2 bg-gray-800 text-white rounded-md font-semibold flex items-center gap-2 hover:bg-gray-700">
                            <FaPlus />
                            Add Field
                        </button>
                    </div>

                    {fields.map((field, index) => {
                        const parentField = fields.find(f => f.name === field.dependsOn);
                        return (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md space-y-4">
                                <div className="flex justify-between items-center border-b pb-3">
                                    <h3 className="text-lg font-semibold text-gray-700">Field #{index + 1}</h3>
                                    <button type="button" onClick={() => handleRemoveField(index)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Label</Label>
                                        <Input type="text" name="label" value={field.label} onChange={(e) => handleFieldChange(index, e)} required />
                                    </div>
                                    <div>
                                        <Label>Type</Label>
                                        <Select options={fieldTypeOptions} value={fieldTypeOptions.find(opt => opt.value === field.type)} onChange={(o) => handleFieldTypeChange(index, o)} styles={customSelectStyles} />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" name="required" checked={field.required} onChange={(e) => handleRequiredChange(index, e)} className="h-5 w-5" />
                                    <label className="ml-2 font-medium">Required</label>
                                </div>

                                {field.type === 'select' && (
                                    <div className="space-y-4 pt-4 border-t">
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

                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-600">Dropdown Options</h4>
                                            {field.dependsOn && parentField ? (
                                                (parentField.options.map(p => p.value)).map(parentOpt => (
                                                    <div key={parentOpt} className="p-3 border rounded-md bg-gray-50">
                                                        <p className="font-semibold text-sm mb-2">Options for: <span className="text-blue-500">{parentOpt}</span></p>
                                                        {field.options.filter(o => o.parent === parentOpt).map((opt, optIdx) => (
                                                            <div key={optIdx} className="flex gap-2 mb-2 items-center">
                                                                <Input type="text" value={opt.value} onChange={(e) => handleDependentOptionChange(index, parentOpt, optIdx, e)} />
                                                                <button type="button" onClick={() => handleRemoveDependentOption(index, parentOpt, optIdx)} className="text-red-500 text-sm p-2 rounded-full hover:bg-red-100">
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button type="button" onClick={() => handleAddDependentOption(index, parentOpt)} className="text-sm text-blue-600 font-semibold hover:underline">+ Add Option</button>
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    {field.options.map((opt, optIdx) => (
                                                        <div key={optIdx} className="flex gap-2 items-center">
                                                            <Input type="text" value={opt.value} onChange={(e) => handleOptionChange(index, optIdx, e)} />
                                                            <button type="button" onClick={() => handleRemoveOption(index, optIdx)} className="text-red-500 text-sm p-2 rounded-full hover:bg-red-100">
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => handleAddOption(index)} className="text-sm text-blue-600 font-semibold hover:underline">+ Add Option</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Form>
        </div>
    );
};

export default CreateForm;
