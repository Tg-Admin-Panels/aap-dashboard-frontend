import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../features/store";
import { createDistrict, getAllStates } from "../../features/locations/locationsApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function CreateDistrict() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, states } = useSelector((state: RootState) => state.locations);

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parentId: "",
  });

  useEffect(() => {
    dispatch(getAllStates());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData({ ...formData, parentId: selectedOption ? selectedOption.value : "" });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.parentId) newErrors.parentId = "Parent State is required.";
    if (!formData.name) newErrors.name = "District name is required.";
    if (!formData.code) newErrors.code = "District code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    await dispatch(createDistrict(formData));
    setFormData({ name: "", code: "", parentId: "" }); // Clear form
  };

  const stateOptions = states.map((state) => ({
    value: state._id,
    label: state.name,
  }));

  const customStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: 'transparent',
      borderColor: '#d1d5db', // gray-300
      minHeight: '44px', // h-11
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af', // gray-400
      },
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      color: '#1f2937', // gray-900
    }),
    input: (baseStyles: any) => ({
      ...baseStyles,
      color: '#1f2937', // gray-900
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      color: '#9ca3af', // gray-400
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e0e7ff' : 'white', // blue-500, indigo-100
      color: state.isSelected ? 'white' : '#1f2937', // white, gray-900
      '&:active': {
        backgroundColor: '#2563eb', // blue-600
      },
    }),
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New District</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="parentId">Parent State</Label>
          <Select
            id="parentId"
            name="parentId"
            options={stateOptions}
            onChange={handleParentChange}
            value={stateOptions.find(option => option.value === formData.parentId)}
            placeholder="Select State"
            isClearable
            required
            styles={customStyles}
          />
          {errors.parentId && <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>}
        </div>
        <div>
          <Label htmlFor="name">District Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter district name"
            error={!!errors.name}
            hint={errors.name}
          />
        </div>
        <div>
          <Label htmlFor="code">District Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter district code (e.g., PTN)"
            error={!!errors.code}
            hint={errors.code}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
        >
          Create District
        </button>
      </Form>
    </div>
  );
}
