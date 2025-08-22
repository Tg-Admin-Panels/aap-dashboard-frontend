import { useState } from "react";
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

export default function CreateVolunteer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.volunteers);

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    mobileNumber: "",
    zone: "",
    district: "",
    block: "",
    religion: "",
    wardNumber: "",
    boothNumber: "",
    pinCode: "",
    postOffice: "",
    cityName: "",
    streetOrLocality: "",
    panchayat: "",
    villageName: "",
    profilePicture: "", // This will store the Cloudinary URL
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, selectedOption: { value: string; label: string } | null) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : "" });
  };

  const handleImageUploadSuccess = (url: string) => {
    setFormData({ ...formData, profilePicture: url });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(createVolunteer(formData));
    if (!error) {
      navigate("/volunteers");
    }
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const zoneOptions = [
    { value: "", label: "Select Zone" },
    { value: "Urban", label: "Urban" },
    { value: "Rural", label: "Rural" },
  ];

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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Volunteer</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              name="gender"
              options={genderOptions}
              onChange={(option) => handleSelectChange("gender", option)}
              value={genderOptions.find(option => option.value === formData.gender)}
              required
              styles={customStyles}
            />
          </div>
          <div>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="zone">Zone</Label>
            <Select
              id="zone"
              name="zone"
              options={zoneOptions}
              onChange={(option) => handleSelectChange("zone", option)}
              value={zoneOptions.find(option => option.value === formData.zone)}
              required
              styles={customStyles}
            />
          </div>
          <div>
            <Label htmlFor="district">District</Label>
            <Input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="block">Block</Label>
            <Input type="text" id="block" name="block" value={formData.block} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input type="text" id="religion" name="religion" value={formData.religion} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="wardNumber">Ward Number</Label>
            <Input type="text" id="wardNumber" name="wardNumber" value={formData.wardNumber} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="boothNumber">Booth Number</Label>
            <Input type="text" id="boothNumber" name="boothNumber" value={formData.boothNumber} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="pinCode">Pin Code</Label>
            <Input type="text" id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="postOffice">Post Office</Label>
            <Input type="text" id="postOffice" name="postOffice" value={formData.postOffice} onChange={handleChange} />
          </div>
          {formData.zone === "Urban" && (
            <>
              <div>
                <Label htmlFor="cityName">City Name</Label>
                <Input type="text" id="cityName" name="cityName" value={formData.cityName} onChange={handleChange} required={formData.zone === "Urban"} />
              </div>
              <div>
                <Label htmlFor="streetOrLocality">Street/Locality</Label>
                <Input type="text" id="streetOrLocality" name="streetOrLocality" value={formData.streetOrLocality} onChange={handleChange} />
              </div>
            </>
          )}
          {formData.zone === "Rural" && (
            <>
              <div>
                <Label htmlFor="panchayat">Panchayat</Label>
                <Input type="text" id="panchayat" name="panchayat" value={formData.panchayat} onChange={handleChange} required={formData.zone === "Rural"} />
              </div>
              <div>
                <Label htmlFor="villageName">Village Name</Label>
                <Input type="text" id="villageName" name="villageName" value={formData.villageName} onChange={handleChange} required={formData.zone === "Rural"} />
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <DropzoneComponent
              accept={{ 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] }}
              onFileUploadSuccess={handleImageUploadSuccess}
              multiple={false}
            />
            {formData.profilePicture && (
              <div className="mt-2">
                <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
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
