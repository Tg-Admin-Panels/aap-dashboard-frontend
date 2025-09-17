import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../features/store";
import {
  createLegislativeAssembly,
  getAllDistricts,
  bulkUploadLegislativeAssemblies,
  getAllStates,
} from "../../features/locations/locationsApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { downloadCSV } from "../../utils/downloadCSV";

export default function CreateLegislativeAssembly() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, states, districts, legislativeAssemblies } = useSelector(
    (state: RootState) => state.locations
  );
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false)
  const [selectedState, setSelectedState] = useState('')

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parentId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(getAllStates({}));
  }, [dispatch]);

  useEffect(() => {
    console.log("Selected state changed:", selectedState);
    dispatch(getAllDistricts({ parentId: selectedState }));
  }, [dispatch, selectedState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData({
      ...formData,
      parentId: selectedOption ? selectedOption.value : "",
    });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.parentId) newErrors.parentId = "Parent District is required.";
    if (!formData.name) newErrors.name = "Assembly name is required.";
    if (!formData.code) newErrors.code = "Assembly code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(createLegislativeAssembly(formData));
    setFormData({ name: "", code: "", parentId: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) return alert("Please select a file first.");
    if (!formData.parentId) return alert("Please select a parent district.");
    setBulkUploadLoading(true)
    const fd = new FormData();
    fd.append("file", file);
    await dispatch(bulkUploadLegislativeAssemblies({ fd, parentId: formData.parentId }));
    setFile(null);
    setBulkUploadLoading(false)
  };

  const handleDownloadCSV = () => {
    downloadCSV(
      legislativeAssemblies,
      "legislative_assemblies.csv",
      ["name", "code",]
    );
  };

  const districtOptions = districts.map((district) => ({
    value: district._id,
    label: district.name,
  }));
  const stateOptions = states.map((state) => ({
    value: state._id,
    label: state.name,
  }));

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading || bulkUploadLoading} />
      <h2 className="text-2xl font-semibold mb-6">
        Create / Bulk Upload Legislative Assemblies
      </h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <div>
        <Label htmlFor="parentId">Select State</Label>
        <Select

          options={stateOptions}
          onChange={(option) => {
            console.log(option);
            setSelectedState(option ? option.value : '')
            setFormData({ ...formData, parentId: '' })
          }}

          placeholder="Select State"
          isClearable
        />

      </div>
      {/* Single Form */}
      <Form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="parentId">Parent District</Label>
          <Select
            id="parentId"
            name="parentId"
            options={districtOptions}
            onChange={handleParentChange}
            value={districtOptions.find((o) => o.value === formData.parentId)}
            placeholder="Select District"
            isClearable
          />
          {errors.parentId && (
            <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>
          )}
        </div>
        <div>
          <Label htmlFor="name">Assembly Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter assembly name"
            error={!!errors.name}
            hint={errors.name}
          />
        </div>
        <div>
          <Label htmlFor="code">Assembly Code</Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter assembly code (e.g., DGJ)"
            error={!!errors.code}
            hint={errors.code}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md"
        >
          Create Assembly
        </button>
      </Form>

      {/* Bulk Upload Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Bulk Upload</h3>
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

        <div className="mt-2 flex gap-2">
          <button
            onClick={handleBulkUpload}
            disabled={!file || bulkUploadLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md disabled:opacity-50"
          >
            {bulkUploadLoading ? "Uploading..." : "Upload File"}
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
