import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createState, bulkUploadStates } from "../../features/locations/locationsApi"; // ⬅️ bulk API
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function CreateState() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.locations);

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [file, setFile] = useState<File | null>(null);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Validate single state
  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.name) newErrors.name = "State name is required.";
    if (!formData.code) newErrors.code = "State code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Single submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(createState(formData));
    setFormData({ name: "", code: "" });
  };

  // Bulk upload submit
  const handleBulkUpload = async () => {
    if (!file) return alert("Please select a CSV or XLSX file.");
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    await dispatch(bulkUploadStates(formDataObj));
    setFile(null);
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Create / Bulk Upload States
      </h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Single State Form */}
      <Form onSubmit={handleSubmit} className="space-y-4 mb-6">
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

      {/* Bulk Upload Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bulk Upload</h3>
        <div className="w-full mb-5">
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-brand-500 transition-colors"
          >
            {/* Upload Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-gray-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>

            <span className="text-gray-600">Click to upload CSV or Excel file</span>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleBulkUpload}
          disabled={!file}
          className="mt-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Upload File
        </button>
        {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
      </div>
    </div>
  );
}
