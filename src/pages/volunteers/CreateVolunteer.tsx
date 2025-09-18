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
import { ruralData, urbanData } from "../../data/location";

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

  const handleSelectChange = (name: keyof VolunteerForm, selected: Option | null) => {
    const value = selected ? selected.value : "";
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleZoneChange = (opt: Option | null) => {
    const nextZone = (opt ? opt.value : "") as Zone;
    setFormData(prev => ({
      ...prev,
      zone: nextZone,
      district: "",
      block: "",
      panchayat: "",
      cityName: "",
    }));
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

    const payload: VolunteerForm = {
      ...formData,
      cityName: formData.zone === "Urban" ? formData.cityName : "",
      streetOrLocality: formData.zone === "Urban" ? formData.streetOrLocality : "",
      panchayat: formData.zone === "Rural" ? formData.panchayat : "",
      villageName: formData.zone === "Rural" ? formData.villageName : "",
    };

    const action = await dispatch(createVolunteer(payload));
    if (!("error" in action) && !error) {
      setFormData(
        {
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
        }
      )
      navigate("/volunteers");
    }
  };

  const genderOptions: Option[] = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const zoneOptions: Option[] = [
    { value: "Urban", label: "Urban" },
    { value: "Rural", label: "Rural" },
  ];

  // dependent options
  const districtOptions = Object.keys(formData.zone === "Rural" ? ruralData.blocks : urbanData.blocks)
    .map(d => ({ value: d, label: d }));

  const blockOptions =
    formData.zone === "Rural"
      ? (ruralData.blocks[formData.district] || []).map(b => ({ value: b, label: b }))
      : (urbanData.blocks[formData.district] || []).map(b => ({ value: b, label: b }));

  const lastLevelOptions =
    formData.zone === "Rural"
      ? (ruralData.panchayats[formData.block] || []).map(p => ({ value: p, label: p }))
      : (urbanData.areas[formData.block] || []).map(a => ({ value: a, label: a }));

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Volunteer</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <Form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Fields */}
          <div>
            <Label required>Full Name</Label>
            <Input name="fullName" value={formData.fullName} onChange={handleChange} error={!!errors.fullName} hint={errors.fullName} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <Label required>Date of Birth</Label>
            <CustomDatePicker
              onChange={(date) => {
                setFormData({ ...formData, dateOfBirth: date?.toISOString() || '' })
              }}
              selectedDate={new Date(formData.dateOfBirth)}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <Label required>Gender</Label>
            <Select options={genderOptions} onChange={(opt) => handleSelectChange("gender", opt)} value={genderOptions.find(o => o.value === formData.gender)} />
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div>
            <Label required>Mobile Number</Label>
            <Input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={!!errors.mobileNumber} hint={errors.mobileNumber} />
          </div>
          <div>
            <Label required>Zone</Label>
            <Select options={zoneOptions} onChange={handleZoneChange} value={zoneOptions.find(o => o.value === formData.zone)} />
            {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
          </div>

          {/* Dependent Dropdowns */}
          {formData.zone && (
            <>
              <div>
                <Label required>District</Label>
                <Select
                  options={districtOptions}
                  value={districtOptions.find(o => o.value === formData.district) || null}
                  onChange={(opt) => setFormData(prev => ({ ...prev, district: opt?.value || "", block: "", panchayat: "", cityName: "" }))}
                />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              <div>
                <Label required>Block</Label>
                <Select
                  options={blockOptions}
                  value={blockOptions.find(o => o.value === formData.block) || null}
                  onChange={(opt) => setFormData(prev => ({ ...prev, block: opt?.value || "", panchayat: "", cityName: "" }))}
                />
                {errors.block && <p className="text-red-500 text-xs mt-1">{errors.block}</p>}
              </div>

              {formData.zone === "Rural" ? (
                <div>
                  <Label>Panchayat</Label>
                  <Select
                    options={lastLevelOptions}
                    value={lastLevelOptions.find(o => o.value === formData.panchayat) || null}
                    onChange={(opt) => setFormData(prev => ({ ...prev, panchayat: opt?.value || "" }))}
                  />
                </div>
              ) : (
                <div>
                  <Label>Area</Label>
                  <Select
                    options={lastLevelOptions}
                    value={lastLevelOptions.find(o => o.value === formData.cityName) || null}
                    onChange={(opt) => setFormData(prev => ({ ...prev, cityName: opt?.value || "" }))}
                  />
                </div>
              )}
            </>
          )}

          {/* Extra Info */}
          <div>
            <Label>Ward Number</Label>
            <Input name="wardNumber" value={formData.wardNumber} onChange={handleChange} />
          </div>
          <div>
            <Label>Booth Number</Label>
            <Input name="boothNumber" value={formData.boothNumber} onChange={handleChange} />
          </div>
          <div>
            <Label>Pin Code</Label>
            <Input name="pinCode" value={formData.pinCode} onChange={handleChange} />
          </div>
          <div>
            <Label>Post Office</Label>
            <Input name="postOffice" value={formData.postOffice} onChange={handleChange} />
          </div>
        </div>

        {/* Upload */}
        <div className="md:col-span-2">
          <Label>Profile Picture</Label>
          <DropzoneComponent
            accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
            onFileUploadSuccess={handleImageUploadSuccess}
            multiple={false}
          />
          {formData.profilePicture && (
            <div className="mt-2">
              <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
            </div>
          )}
        </div>

        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md">
          Create Volunteer
        </button>
      </Form>
    </div>
  );
}
