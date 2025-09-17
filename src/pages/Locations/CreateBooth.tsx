import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../features/store";
import {
  createBooth,
  getAllStates,
  getAllDistricts,
  getAllLegislativeAssemblies,
  bulkUploadBooths,
} from "../../features/locations/locationsApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { downloadCSV } from "../../utils/downloadCSV";

export default function CreateBooth() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, states, districts, legislativeAssemblies, booths } =
    useSelector((state: RootState) => state.locations);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parentId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // Fetch all states on mount
  useEffect(() => {
    dispatch(getAllStates({}));
  }, [dispatch]);

  // Fetch districts when state changes
  useEffect(() => {
    if (selectedState) {
      dispatch(getAllDistricts({ parentId: selectedState }));
      setSelectedDistrict("");
      setFormData({ ...formData, parentId: "" }); // reset assembly
    }
  }, [dispatch, selectedState]);

  // Fetch assemblies when district changes
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(getAllLegislativeAssemblies({ parentId: selectedDistrict }));
      setFormData({ ...formData, parentId: "" }); // reset assembly
    }
  }, [dispatch, selectedDistrict]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedState(selectedOption ? selectedOption.value : "");
  };

  const handleDistrictChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedDistrict(selectedOption ? selectedOption.value : "");
  };

  const handleAssemblyChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData({
      ...formData,
      parentId: selectedOption ? selectedOption.value : "",
    });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.parentId)
      newErrors.parentId = "Parent Legislative Assembly is required.";
    if (!formData.name) newErrors.name = "Booth name is required.";
    if (!formData.code) newErrors.code = "Booth code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(createBooth(formData));
    setFormData({ name: "", code: "", parentId: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) return alert("Please select a file first.");
    if (!formData.parentId)
      return alert("Please select a Legislative Assembly first.");
    setBulkUploadLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await dispatch(bulkUploadBooths({ fd, parentId: formData.parentId }));
      setFile(null);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV(booths, "booths.csv", ["name", "code", "parentId"]);
  };

  const stateOptions = states.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  const districtOptions = districts.map((d) => ({
    value: d._id,
    label: d.name,
  }));

  const assemblyOptions = legislativeAssemblies.map((a) => ({
    value: a._id,
    label: a.name,
  }));

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading || bulkUploadLoading} />
      <h2 className="text-2xl font-semibold mb-6">
        Create / Bulk Upload Booths
      </h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Single Form */}
      <Form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="state">Select State</Label>
          <Select
            id="state"
            options={stateOptions}
            onChange={handleStateChange}
            value={stateOptions.find((o) => o.value === selectedState) || null}
            placeholder="Select State"
            isClearable
          />
        </div>

        <div>
          <Label htmlFor="district">Select District</Label>
          <Select
            id="district"
            options={districtOptions}
            onChange={handleDistrictChange}
            value={districtOptions.find((o) => o.value === selectedDistrict) || null}
            placeholder="Select District"
            isClearable
          />
        </div>

        <div>
          <Label htmlFor="parentId">Parent Legislative Assembly</Label>
          <Select
            id="parentId"
            name="parentId"
            options={assemblyOptions}
            onChange={handleAssemblyChange}
            value={assemblyOptions.find((o) => o.value === formData.parentId) || null}
            placeholder="Select Assembly"
            isClearable
          />
          {errors.parentId && (
            <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="name">Booth Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter booth name"
            error={!!errors.name}
            hint={errors.name}
          />
        </div>

        <div>
          <Label htmlFor="code">Booth Code</Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter booth code"
            error={!!errors.code}
            hint={errors.code}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md"
        >
          Create Booth
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
            {bulkUploadLoading ? "Uploading..." : "Upload File"}
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
