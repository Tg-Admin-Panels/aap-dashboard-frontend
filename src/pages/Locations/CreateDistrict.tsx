import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../features/store";
import { createDistrict, getAllStates, bulkUploadDistricts } from "../../features/locations/locationsApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { downloadCSV } from "../../utils/downloadCSV";

export default function CreateDistrict() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, states, districts } = useSelector((state: RootState) => state.locations);

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [formData, setFormData] = useState({ name: "", code: "", parentId: "" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(getAllStates({}));
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
    setFormData({ name: "", code: "", parentId: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const fd = new FormData();
    fd.append("file", file);
    await dispatch(bulkUploadDistricts({ fd, parentId: formData.parentId }));
    setFile(null);
  };

  const handleDownloadCSV = () => {
    downloadCSV(districts, "districts.csv", ["name", "code", "parentId"]);
  };

  const stateOptions = states.map((state) => ({ value: state._id, label: state.name }));

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Create / Bulk Upload Districts
      </h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Single Create Form */}
      <Form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="parentId">Parent State</Label>
          <Select
            id="parentId"
            name="parentId"
            options={stateOptions}
            onChange={handleParentChange}
            value={stateOptions.find((o) => o.value === formData.parentId)}
            placeholder="Select State"
            isClearable
          />
          {errors.parentId && <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>}
        </div>
        <div>
          <Label htmlFor="name">District Name</Label>
          <Input
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
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter district code"
            error={!!errors.code}
            hint={errors.code}
          />
        </div>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md">
          Create District
        </button>
      </Form>

      {/* Bulk Upload Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Bulk Upload</h3>
        <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleBulkUpload}
            disabled={!file}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md disabled:opacity-50"
          >
            Upload File
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
          >
            Download CSV
          </button>
        </div>
        {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
      </div>
    </div>
  );
}
