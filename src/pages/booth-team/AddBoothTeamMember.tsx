import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createBoothTeamMember } from "../../features/booth-team/boothTeamApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "react-select"; // Import react-select
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

export default function AddBoothTeamMember() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.boothTeam);
  const { states, districts, legislativeAssemblies, booths } = useSelector(
    (state: RootState) => state.locations
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    boothId: "", // New field for booth ID
    boothName: "", // To store the name of the selected booth
    post: "",
    padnaam: "",
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLegislativeAssembly, setSelectedLegislativeAssembly] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

  // Fetch states on component mount
  useEffect(() => {
    dispatch(getAllStates());
  }, [dispatch]);

  // Fetch districts when state changes
  useEffect(() => {
    if (selectedState) {
      dispatch(getAllDistricts(selectedState));
    } else {
      dispatch(clearDistricts());
    }
  }, [dispatch, selectedState]);

  // Fetch legislative assemblies when district changes
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(getAllLegislativeAssemblies(selectedDistrict));
    } else {
      dispatch(clearLegislativeAssemblies());
    }
  }, [dispatch, selectedDistrict]);

  // Fetch booths when legislative assembly changes
  useEffect(() => {
    if (selectedLegislativeAssembly) {
      dispatch(getAllBooths(selectedLegislativeAssembly));
    } else {
      dispatch(clearBooths());
    }
  }, [dispatch, selectedLegislativeAssembly]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData({ ...formData, post: selectedOption ? selectedOption.value : "", padnaam: "" });
  };

  const handlePadnaamChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData({ ...formData, padnaam: selectedOption ? selectedOption.value : "" });
  };

  const handleStateChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedState(selectedOption ? selectedOption.value : null);
    setSelectedDistrict(null);
    setSelectedLegislativeAssembly(null);
    setSelectedBooth(null);
    setFormData({ ...formData, boothId: "", boothName: "" });
  };

  const handleDistrictChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedDistrict(selectedOption ? selectedOption.value : null);
    setSelectedLegislativeAssembly(null);
    setSelectedBooth(null);
    setFormData({ ...formData, boothId: "", boothName: "" });
  };

  const handleLegislativeAssemblyChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedLegislativeAssembly(selectedOption ? selectedOption.value : null);
    setSelectedBooth(null);
    setFormData({ ...formData, boothId: "", boothName: "" });
  };

  const handleBoothChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedBooth(selectedOption ? selectedOption.value : null);
    setFormData({ ...formData, boothId: selectedOption ? selectedOption.value : "", boothName: selectedOption ? selectedOption.label : "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure boothName is set from the selected booth's label before dispatching
    const finalFormData = { ...formData };
    if (selectedBooth) {
      const booth = booths.find(b => b._id === selectedBooth);
      if (booth) {
        finalFormData.boothName = booth.name;
      }
    }

    await dispatch(createBoothTeamMember(finalFormData));
    if (!error) {
      navigate("/booth-team");
    }
  };

  const postOptions = [
    { value: "", label: "Select Post" },
    { value: "Prabhari", label: "Prabhari" },
    { value: "Adhyaksh", label: "Adhyaksh" },
  ];

  const generatePadnaamOptions = () => {
    if (formData.post === "Prabhari") {
      return Array.from({ length: 10 }, (_, i) => ({ value: `Prabhari-${String(i + 1).padStart(2, '0')}`, label: `Prabhari-${String(i + 1).padStart(2, '0')}` }));
    } else if (formData.post === "Adhyaksh") {
      return Array.from({ length: 10 }, (_, i) => ({ value: `Adhyaksh-${String(i + 1).padStart(2, '0')}`, label: `Adhyaksh-${String(i + 1).padStart(2, '0')}` }));
    }
    return [];
  };

  const padnaamOptions = [{ value: "", label: "Select Padnaam" }, ...generatePadnaamOptions()];

  const stateOptions = states.map((state) => ({
    value: state._id,
    label: state.name,
  }));

  const districtOptions = districts.map((district) => ({
    value: district._id,
    label: district.name,
  }));

  const legislativeAssemblyOptions = legislativeAssemblies.map((assembly) => ({
    value: assembly._id,
    label: assembly.name,
  }));

  const boothOptions = booths.map((booth) => ({
    value: booth._id,
    label: booth.name,
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Add New Booth Team Member</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
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
          {/* Dependent Dropdowns for Location */}
          <div>
            <Label htmlFor="state-select">State</Label>
            <Select
              id="state-select"
              options={stateOptions}
              onChange={handleStateChange}
              value={stateOptions.find(option => option.value === selectedState)}
              placeholder="Select State"
              isClearable
              styles={customStyles}
            />
          </div>
          <div>
            <Label htmlFor="district-select">District</Label>
            <Select
              id="district-select"
              options={districtOptions}
              onChange={handleDistrictChange}
              value={districtOptions.find(option => option.value === selectedDistrict)}
              placeholder="Select District"
              isClearable
              isDisabled={!selectedState}
              styles={customStyles}
            />
          </div>
          <div>
            <Label htmlFor="legislative-assembly-select">Legislative Assembly</Label>
            <Select
              id="legislative-assembly-select"
              options={legislativeAssemblyOptions}
              onChange={handleLegislativeAssemblyChange}
              value={legislativeAssemblyOptions.find(option => option.value === selectedLegislativeAssembly)}
              placeholder="Select Legislative Assembly"
              isClearable
              isDisabled={!selectedDistrict}
              styles={customStyles}
            />
          </div>
          <div>
            <Label htmlFor="booth-select">Booth</Label>
            <Select
              id="booth-select"
              options={boothOptions}
              onChange={handleBoothChange}
              value={boothOptions.find(option => option.value === selectedBooth)}
              placeholder="Select Booth"
              isClearable
              isDisabled={!selectedLegislativeAssembly}
              styles={customStyles}
            />
          </div>
          {/* End Dependent Dropdowns */}

          <div>
            <Label htmlFor="post">Post</Label>
            <Select
              id="post"
              name="post"
              options={postOptions}
              onChange={handlePostChange}
              value={postOptions.find(option => option.value === formData.post)}
              placeholder="Select post"
              isClearable
              isSearchable
              required
              styles={customStyles}
            />
          </div>
          {formData.post && (
            <div>
              <Label htmlFor="padnaam">Padnaam</Label>
              <Select
                id="padnaam"
                name="padnaam"
                options={padnaamOptions}
                onChange={handlePadnaamChange}
                value={padnaamOptions.find(option => option.value === formData.padnaam)}
                placeholder="Select Padnaam"
                isClearable
                isSearchable
                required
                styles={customStyles}
              />
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
