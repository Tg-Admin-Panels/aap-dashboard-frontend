import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createBoothTeamMember } from "../../features/booth-team/boothTeamApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "react-select";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { useNavigate } from "react-router-dom";
import {
  getAllStates,
  getAllDistricts,
  getAllLegislativeAssemblies,
  getAllBooths,
} from "../../features/locations/locationsApi";
import {
  clearDistricts,
  clearLegislativeAssemblies,
  clearBooths,
} from "../../features/locations/locations.slice";

type Option = { value: string; label: string };

type FormData = {
  name: string;
  phone: string;
  email: string;
  boothId: string;
  boothName: string;
  post: string;
  padnaam: string;
};

type ErrorState = Partial<
  Record<
    keyof FormData | "state" | "district" | "legislativeAssembly",
    string
  >
>;

export default function AddBoothTeamMember() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error: apiError } = useSelector(
    (state: RootState) => state.boothTeam
  );
  const { states, districts, legislativeAssemblies, booths } = useSelector(
    (state: RootState) => state.locations
  );

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    boothId: "",
    boothName: "",
    post: "",
    padnaam: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLegislativeAssembly, setSelectedLegislativeAssembly] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

  // Fetch states on mount
  useEffect(() => {
    dispatch(getAllStates());
  }, [dispatch]);

  // Dependent fetches
  useEffect(() => {
    if (selectedState) {
      dispatch(getAllDistricts(selectedState));
    } else {
      dispatch(clearDistricts());
    }
  }, [dispatch, selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(getAllLegislativeAssemblies(selectedDistrict));
    } else {
      dispatch(clearLegislativeAssemblies());
    }
  }, [dispatch, selectedDistrict]);

  useEffect(() => {
    if (selectedLegislativeAssembly) {
      dispatch(getAllBooths(selectedLegislativeAssembly));
    } else {
      dispatch(clearBooths());
    }
  }, [dispatch, selectedLegislativeAssembly]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePostChange = (opt: Option | null) => {
    setFormData(prev => ({ ...prev, post: opt ? opt.value : "", padnaam: "" }));
  };

  const handlePadnaamChange = (opt: Option | null) => {
    setFormData(prev => ({ ...prev, padnaam: opt ? opt.value : "" }));
  };

  const handleStateChange = (opt: Option | null) => {
    setSelectedState(opt ? opt.value : null);
    setSelectedDistrict(null);
    setSelectedLegislativeAssembly(null);
    setSelectedBooth(null);
    setFormData(prev => ({ ...prev, boothId: "", boothName: "" }));
  };

  const handleDistrictChange = (opt: Option | null) => {
    setSelectedDistrict(opt ? opt.value : null);
    setSelectedLegislativeAssembly(null);
    setSelectedBooth(null);
    setFormData(prev => ({ ...prev, boothId: "", boothName: "" }));
  };

  const handleLegislativeAssemblyChange = (opt: Option | null) => {
    setSelectedLegislativeAssembly(opt ? opt.value : null);
    setSelectedBooth(null);
    setFormData(prev => ({ ...prev, boothId: "", boothName: "" }));
  };

  const handleBoothChange = (opt: Option | null) => {
    setSelectedBooth(opt ? opt.value : null);
    setFormData(prev => ({
      ...prev,
      boothId: opt ? opt.value : "",
      boothName: opt ? opt.label : "",
    }));
  };

  const validate = () => {
    const newErrors: ErrorState = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Please enter a valid 10-digit phone number.";
    if (!selectedState) newErrors.state = "State is required.";
    if (!selectedDistrict) newErrors.district = "District is required.";
    if (!selectedLegislativeAssembly) newErrors.legislativeAssembly = "Legislative Assembly is required.";
    if (!formData.boothId) newErrors.boothId = "Booth is required.";
    if (!formData.post) newErrors.post = "Post is required.";
    if (!formData.padnaam) newErrors.padnaam = "Padnaam is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // Ensure boothName consistency
    const finalFormData: FormData = { ...formData };
    if (selectedBooth) {
      const booth = booths.find(b => b._id === selectedBooth);
      if (booth) {
        finalFormData.boothName = booth.name;
      }
    }

    try {
      await dispatch(createBoothTeamMember(finalFormData)).unwrap();
      navigate("/booth-team");
    } catch (err) {
      // Slice will already set apiError; optionally surface a local toast here.
      console.error(err);
    }
  };

  const postOptions: Option[] = [
    { value: "", label: "Select Post" },
    { value: "Prabhari", label: "Prabhari" },
    { value: "Adhyaksh", label: "Adhyaksh" },
  ];

  const generatePadnaamOptions = (): Option[] => {
    if (formData.post === "Prabhari") {
      return Array.from({ length: 10 }, (_, i) => {
        const v = `Prabhari-${String(i + 1).padStart(2, "0")}`;
        return { value: v, label: v };
      });
    }
    if (formData.post === "Adhyaksh") {
      return Array.from({ length: 10 }, (_, i) => {
        const v = `Adhyaksh-${String(i + 1).padStart(2, "0")}`;
        return { value: v, label: v };
      });
    }
    return [];
  };

  const padnaamOptions: Option[] = [{ value: "", label: "Select Padnaam" }, ...generatePadnaamOptions()];

  const stateOptions: Option[] = states.map(s => ({ value: s._id, label: s.name }));
  const districtOptions: Option[] = districts.map(d => ({ value: d._id, label: d.name }));
  const legislativeAssemblyOptions: Option[] = legislativeAssemblies.map(a => ({ value: a._id, label: a.name }));
  const boothOptions: Option[] = booths.map(b => ({ value: b._id, label: b.name }));

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: "#d1d5db",
      minHeight: "44px",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    singleValue: (base: any) => ({ ...base, color: "#1f2937" }),
    input: (base: any) => ({ ...base, color: "#1f2937" }),
    placeholder: (base: any) => ({ ...base, color: "#9ca3af" }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e0e7ff" : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:active": { backgroundColor: "#2563eb" },
    }),
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Add New Booth Team Member
      </h2>
      {apiError && <p className="text-red-500 mb-4">Error: {apiError}</p>}

      <Form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" required>Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              error={!!errors.name}
              hint={errors.name}
            />
          </div>

          <div>
            <Label htmlFor="phone" required>Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              error={!!errors.phone}
              hint={errors.phone}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
            />
          </div>

          {/* Locations */}
          <div>
            <Label htmlFor="state-select" required>State</Label>
            <Select
              inputId="state-select"
              options={stateOptions}
              onChange={handleStateChange}
              value={stateOptions.find(o => o.value === selectedState) || null}
              placeholder="Select State"
              isClearable
              styles={customStyles}
            />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          <div>
            <Label htmlFor="district-select" required>District</Label>
            <Select
              inputId="district-select"
              options={districtOptions}
              onChange={handleDistrictChange}
              value={districtOptions.find(o => o.value === selectedDistrict) || null}
              placeholder="Select District"
              isClearable
              isDisabled={!selectedState}
              styles={customStyles}
            />
            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
          </div>

          <div>
            <Label htmlFor="legislative-assembly-select" required>Legislative Assembly</Label>
            <Select
              inputId="legislative-assembly-select"
              options={legislativeAssemblyOptions}
              onChange={handleLegislativeAssemblyChange}
              value={legislativeAssemblyOptions.find(o => o.value === selectedLegislativeAssembly) || null}
              placeholder="Select Legislative Assembly"
              isClearable
              isDisabled={!selectedDistrict}
              styles={customStyles}
            />
            {errors.legislativeAssembly && (
              <p className="text-red-500 text-xs mt-1">{errors.legislativeAssembly}</p>
            )}
          </div>

          <div>
            <Label htmlFor="booth-select" required>Booth</Label>
            <Select
              inputId="booth-select"
              options={boothOptions}
              onChange={handleBoothChange}
              value={boothOptions.find(o => o.value === selectedBooth) || null}
              placeholder="Select Booth"
              isClearable
              isDisabled={!selectedLegislativeAssembly}
              styles={customStyles}
            />
            {errors.boothId && <p className="text-red-500 text-xs mt-1">{errors.boothId}</p>}
          </div>

          <div>
            <Label htmlFor="post" required>Post</Label>
            <Select
              inputId="post"
              name="post"
              options={postOptions}
              onChange={handlePostChange}
              value={postOptions.find(o => o.value === formData.post) || null}
              placeholder="Select Post"
              isClearable
              isSearchable
              styles={customStyles}
            />
            {errors.post && <p className="text-red-500 text-xs mt-1">{errors.post}</p>}
          </div>

          {formData.post && (
            <div>
              <Label htmlFor="padnaam" required>Padnaam</Label>
              <Select
                inputId="padnaam"
                name="padnaam"
                options={padnaamOptions}
                onChange={handlePadnaamChange}
                value={padnaamOptions.find(o => o.value === formData.padnaam) || null}
                placeholder="Select Padnaam"
                isClearable
                isSearchable
                styles={customStyles}
              />
              {errors.padnaam && <p className="text-red-500 text-xs mt-1">{errors.padnaam}</p>}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
        >
          Add Member
        </button>
      </Form>
    </div>
  );
}
