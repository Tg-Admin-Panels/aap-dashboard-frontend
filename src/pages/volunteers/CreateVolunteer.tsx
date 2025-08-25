import { useState, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createVolunteer } from "../../features/volunteers/volunteersApi";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "react-select";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../components/ui/calender/CustomDatePicker";

type Option = { value: string; label: string };
type Zone = "" | "Urban" | "Rural";

interface VolunteerForm {
  fullName: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  zone: Zone;
  district: string;
  block: string;
  whyYouWantToJoinUs: string;
  howMuchTimeYouDedicate: string;
  inWhichFieldYouCanContribute: string;
  howCanYouHelpUs: string;
  wardNumber: string;
  boothNumber: string;
  pinCode: string;
  postOffice: string;
  cityName: string;         // Urban only
  streetOrLocality: string; // Urban only
  panchayat: string;        // Rural only
  villageName: string;      // Rural only
  profilePicture: string;   // Cloudinary URL
}

export default function CreateVolunteer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.volunteers);

  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerForm, string>>>({});

  const [formData, setFormData] = useState<VolunteerForm>({
    fullName: "",
    password: "",
    dateOfBirth: new Date().toISOString(),
    gender: "",
    mobileNumber: "",
    zone: "",
    district: "",
    block: "",
    whyYouWantToJoinUs: "",
    howMuchTimeYouDedicate: "",
    inWhichFieldYouCanContribute: "",
    howCanYouHelpUs: "",
    wardNumber: "",
    boothNumber: "",
    pinCode: "",
    postOffice: "",
    cityName: "",
    streetOrLocality: "",
    panchayat: "",
    villageName: "",
    profilePicture: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // React-Select change (with zone-specific resets)
  const handleSelectChange = (name: keyof VolunteerForm, selected: Option | null) => {
    const value = selected ? selected.value : "";

    // When zone changes, clear fields not relevant to the selected zone
    if (name === "zone") {
      const nextZone = value as Zone;
      setFormData(prev => ({
        ...prev,
        zone: nextZone,
        // clear both sets, then re-enter only relevant later
        cityName: nextZone === "Urban" ? prev.cityName : "",
        streetOrLocality: nextZone === "Urban" ? prev.streetOrLocality : "",
        panchayat: nextZone === "Rural" ? prev.panchayat : "",
        villageName: nextZone === "Rural" ? prev.villageName : "",
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUploadSuccess = (url: string) => {
    setFormData(prev => ({ ...prev, profilePicture: url }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof VolunteerForm, string>> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required.";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    if (!formData.zone) newErrors.zone = "Zone is required.";
    if (!formData.district) newErrors.district = "District is required.";
    if (!formData.block) newErrors.block = "Block is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // Optional: simple guard to prevent wrong-zone payloads
    const payload: VolunteerForm = {
      ...formData,
      cityName: formData.zone === "Urban" ? formData.cityName : "",
      streetOrLocality: formData.zone === "Urban" ? formData.streetOrLocality : "",
      panchayat: formData.zone === "Rural" ? formData.panchayat : "",
      villageName: formData.zone === "Rural" ? formData.villageName : "",
    };

    const action = await dispatch(createVolunteer(payload));
    // If your thunk returns {success}, prefer checking that. Otherwise rely on slice status.
    if (!("error" in action) && !error) {
      navigate("/volunteers");
    }
  };

  const genderOptions: Option[] = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const zoneOptions: Option[] = [
    { value: "", label: "Select Zone" },
    { value: "Urban", label: "Urban" },
    { value: "Rural", label: "Rural" },
  ];

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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Volunteer</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <Form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" required>Full Name</Label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} error={!!errors.fullName} hint={errors.fullName} />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="dateOfBirth" required>Date of Birth</Label>
            <CustomDatePicker
              onChange={(date) => {
                setFormData({ ...formData, dateOfBirth: date?.toISOString() || '' })
              }}
              selectedDate={new Date(formData.dateOfBirth)}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <Label htmlFor="gender" required>Gender</Label>
            <Select
              inputId="gender"
              options={genderOptions}
              onChange={(opt: Option | null) => handleSelectChange("gender", opt)}
              value={genderOptions.find(o => o.value === formData.gender)}
              styles={customStyles}
            />
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <Label htmlFor="mobileNumber" required>Mobile Number</Label>
            <Input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={!!errors.mobileNumber} hint={errors.mobileNumber} />
          </div>

          <div>
            <Label htmlFor="zone" required>Zone</Label>
            <Select
              inputId="zone"
              options={zoneOptions}
              onChange={(opt: Option | null) => handleSelectChange("zone", opt)}
              value={zoneOptions.find(o => o.value === formData.zone)}
              styles={customStyles}
            />
            {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
          </div>

          <div>
            <Label htmlFor="district" required>District</Label>
            <Input id="district" name="district" value={formData.district} onChange={handleChange} error={!!errors.district} hint={errors.district} />
          </div>

          <div>
            <Label htmlFor="block" required>Block</Label>
            <Input id="block" name="block" value={formData.block} onChange={handleChange} error={!!errors.block} hint={errors.block} />
          </div>

          <div>
            <Label htmlFor="wardNumber">Ward Number</Label>
            <Input id="wardNumber" name="wardNumber" value={formData.wardNumber} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="boothNumber">Booth Number</Label>
            <Input id="boothNumber" name="boothNumber" value={formData.boothNumber} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="pinCode">Pin Code</Label>
            <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="postOffice">Post Office</Label>
            <Input id="postOffice" name="postOffice" value={formData.postOffice} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="whyYouWantToJoinUs">Why You Want To Join Us</Label>
            <Input id="whyYouWantToJoinUs" name="whyYouWantToJoinUs" value={formData.whyYouWantToJoinUs} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="howMuchTimeYouDedicate">How much time you will dedicate</Label>
            <Input id="howMuchTimeYouDedicate" name="howMuchTimeYouDedicate" value={formData.howMuchTimeYouDedicate} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="inWhichFieldYouCanContribute">In which field you can contribute</Label>
            <Input id="inWhichFieldYouCanContribute" name="inWhichFieldYouCanContribute" value={formData.inWhichFieldYouCanContribute} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="howCanYouHelpUs">How can you help us</Label>
            <Input id="howCanYouHelpUs" name="howCanYouHelpUs" value={formData.howCanYouHelpUs} onChange={handleChange} />
          </div>

          {/* Urban-only fields */}
          {formData.zone === "Urban" && (
            <>
              <div>
                <Label htmlFor="cityName">City Name</Label>
                <Input id="cityName" name="cityName" value={formData.cityName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="streetOrLocality">Street/Locality</Label>
                <Input id="streetOrLocality" name="streetOrLocality" value={formData.streetOrLocality} onChange={handleChange} />
              </div>
            </>
          )}

          {/* Rural-only fields */}
          {formData.zone === "Rural" && (
            <>
              <div>
                <Label htmlFor="panchayat">Panchayat</Label>
                <Input id="panchayat" name="panchayat" value={formData.panchayat} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="villageName">Village Name</Label>
                <Input id="villageName" name="villageName" value={formData.villageName} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <DropzoneComponent
              accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
              onFileUploadSuccess={handleImageUploadSuccess}
              multiple={false}
            />
            {formData.profilePicture && (
              <div className="mt-2">
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
        >
          Create Volunteer
        </button>
      </Form>
    </div>
  );
}
