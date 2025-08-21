import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../features/store";
import { createLegislativeAssembly, getAllDistricts } from "../../features/locations/locationsApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function CreateLegislativeAssembly() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, districts } = useSelector((state: RootState) => state.locations);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parentId: "",
  });

  useEffect(() => {
    // Fetch all districts (or filter by selected state if you add state selection here)
    dispatch(getAllDistricts("")); // Pass empty string to get all districts for now
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData({ ...formData, parentId: selectedOption ? selectedOption.value : "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(createLegislativeAssembly(formData));
    setFormData({ name: "", code: "", parentId: "" }); // Clear form
  };

  const districtOptions = districts.map((district) => ({
    value: district._id,
    label: district.name,
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Legislative Assembly</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="parentId">Parent District</Label>
          <Select
            id="parentId"
            name="parentId"
            options={districtOptions}
            onChange={handleParentChange}
            value={districtOptions.find(option => option.value === formData.parentId)}
            placeholder="Select District"
            isClearable
            required
            styles={customStyles}
          />
        </div>
        <div>
          <Label htmlFor="name">Assembly Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter assembly name"
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Assembly Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter assembly code (e.g., DGJ)"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
        >
          Create Legislative Assembly
        </button>
      </Form>
    </div>
  );
}
