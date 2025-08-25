import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createState } from "../../features/locations/locationsApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function CreateState() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.locations);

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.name) newErrors.name = "State name is required.";
    if (!formData.code) newErrors.code = "State code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    await dispatch(createState(formData));
    setFormData({ name: "", code: "" }); // Clear form
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New State</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">State Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter state name"
            error={!!errors.name}
            hint={errors.name}
          />
        </div>
        <div>
          <Label htmlFor="code">State Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter state code (e.g., BR)"
            error={!!errors.code}
            hint={errors.code}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
        >
          Create State
        </button>
      </Form>
    </div>
  );
}
