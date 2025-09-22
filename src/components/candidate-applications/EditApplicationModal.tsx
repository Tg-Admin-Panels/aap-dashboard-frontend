import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { updateCandidateApplication } from "../../features/candidate-applications/candidateApplicationApi";
import { setShowUpdateModal } from "../../features/candidate-applications/candidateApplication.slice";
import Modal from "../modal/Modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "react-select";
import CustomDatePicker from "../ui/calender/CustomDatePicker";
import DropzoneComponent from "../form/form-elements/DropZone";
import axiosInstance from "../../utils/axiosInstance";

type Option = { value: string; label: string };

const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 col-span-1 md:col-span-2">{title}</h3>
);

const pastElectionOptions = [
    "लोकसभा", "विधानसभा", "नगर पालिका", "वार्ड पार्षद", "सांसद", "उप मुख्य पार्षद", "मुख्य पार्षद", "ग्राम पंचायत के सदस्य", "ग्राम कचहरी के पंच", "ग्राम पंचायत के मुखिया", "ग्राम कचहरी के सरपंच", "पंचायत समिति के सदस्य", "जिला परिषद्  के सदस्य", "पैक्स", "अन्य", "नहीं"
].map(option => ({ value: option, label: option }));

const EditApplicationModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedApplication, showUpdateModal } = useSelector(
        (state: RootState) => state.candidateApplications
    );
    const [formData, setFormData] = useState(selectedApplication);
    const [states, setStates] = useState<Option[]>([]);
    const [districts, setDistricts] = useState<Option[]>([]);
    const [legislativeAssemblies, setLegislativeAssemblies] = useState<Option[]>([]);

    useEffect(() => {
        setFormData(selectedApplication);
    }, [selectedApplication]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get("/states");
                setStates(res.data.data.map((s: any) => ({ value: s._id, label: s.name })));
            } catch (e) {
                console.error("Error fetching states:", e);
            }
        })();
    }, []);

    useEffect(() => {
        if (!formData?.state) { setDistricts([]); return; }
        (async () => {
            try {
                const res = await axiosInstance.get(`/districts?parentId=${formData.state._id}`);
                setDistricts(res.data.data.map((d: any) => ({ value: d._id, label: d.name })));
            } catch (e) {
                console.error("Error fetching districts:", e);
            }
        })();
    }, [formData?.state]);

    useEffect(() => {
        if (!formData?.district) { setLegislativeAssemblies([]); return; }
        (async () => {
            try {
                const res = await axiosInstance.get(`/legislative-assemblies?parentId=${formData.district._id}`);
                setLegislativeAssemblies(res.data.data.map((la: any) => ({ value: la._id, label: la.name })));
            } catch (e) {
                console.error("Error fetching legislative assemblies:", e);
            }
        })();
    }, [formData?.district]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
        }
    };

    const handleSelectChange = (name: string, option: Option | null) => {
        if (formData) {
            setFormData({ ...formData, [name]: option ? option.value : "" });
        }
    };

    const handleDateChange = (name: string, date: Date | null) => {
        if (formData) {
            setFormData({ ...formData, [name]: date ? date.toISOString() : "" });
        }
    };

    const handleBiodataUploadSuccess = (url: string) => {
        if (formData) {
            setFormData({ ...formData, biodataPdf: url });
        }
    };

    const handleConfirm = () => {
        if (formData) {
            dispatch(
                updateCandidateApplication({ id: formData._id, applicationData: formData })
            );
        }
    };

    if (!showUpdateModal || !formData) return null;

    return (
        <Modal
            title="Edit Application"
            onCancel={() => dispatch(setShowUpdateModal(false))}
            onConfirm={handleConfirm}
            cancelBtn="Cancel"
            confirmBtn="Save Changes"
        >
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <SectionTitle title="1. व्यक्तिगत विवरण" />
                    <div>
                        <Label htmlFor="applicantName" required>Applicant Name</Label>
                        <Input id="applicantName" name="applicantName" value={formData.applicantName} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Label htmlFor="fatherName" required>Father Name</Label>
                        <Input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Label htmlFor="fatherOccupation">Father Occupation</Label>
                        <Input id="fatherOccupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="dob" required>Date of Birth</Label>
                        <CustomDatePicker
                            placeholderText="Select Date of Birth"
                            selectedDate={formData.dob ? new Date(formData.dob) : null}
                            onChange={(date) => handleDateChange("dob", date)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" type="number" value={formData.age} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="gender" required>Gender</Label>
                        <Select inputId="gender" placeholder="Select Gender" options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} onChange={opt => handleSelectChange("gender", opt as Option | null)} value={{value: formData.gender, label: formData.gender}} />
                    </div>
                    <div>
                        <Label htmlFor="religion">Religion</Label>
                        <Input id="religion" name="religion" value={formData.religion} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select inputId="maritalStatus" placeholder="Select Marital Status" options={[{ value: "Married", label: "Married" }, { value: "Unmarried", label: "Unmarried" }, { value: "Other", label: "Other" }]} onChange={opt => handleSelectChange("maritalStatus", opt as Option | null)} value={{value: formData.maritalStatus, label: formData.maritalStatus}} />
                    </div>
                    <div>
                        <Label htmlFor="state" required>State</Label>
                        <Select inputId="state" placeholder="Select State" options={states} onChange={opt => handleSelectChange("state", opt as Option | null)} value={{value: formData.state._id, label: formData.state.name}} />
                    </div>
                    <div>
                        <Label htmlFor="district" required>District</Label>
                        <Select inputId="district" placeholder="Select District" options={districts} onChange={opt => handleSelectChange("district", opt as Option | null)} isDisabled={!formData.state} value={{value: formData.district._id, label: formData.district.name}} />
                    </div>
                    <div>
                        <Label htmlFor="legislativeAssembly" required>Legislative Assembly</Label>
                        <Select inputId="legislativeAssembly" placeholder="Select Legislative Assembly" options={legislativeAssemblies} onChange={opt => handleSelectChange("legislativeAssembly", opt as Option | null)} isDisabled={!formData.district} value={{value: formData.legislativeAssembly._id, label: formData.legislativeAssembly.name}} />
                    </div>
                    <div>
                        <Label htmlFor="address" required>Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
                    </div>

                    <SectionTitle title="2. संपर्क विवरण" />
                    <div>
                        <Label htmlFor="mobile" required>Mobile</Label>
                        <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="facebookFollowers">Facebook Followers</Label>
                        <Input id="facebookFollowers" name="facebookFollowers" type="number" value={formData.facebookFollowers} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="facebookLink">Facebook Link</Label>
                        <Input id="facebookLink" name="facebookLink" value={formData.facebookLink} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                        <Input id="instagramFollowers" name="instagramFollowers" type="number" value={formData.instagramFollowers} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="instagramLink">Instagram Link</Label>
                        <Input id="instagramLink" name="instagramLink" value={formData.instagramLink} onChange={handleInputChange} />
                    </div>

                    <SectionTitle title="3. शैक्षिक एवं आर्थिक विवरण" />
                    <div>
                        <Label htmlFor="education">Education</Label>
                        <Input id="education" name="education" value={formData.education} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation1">Occupation 1</Label>
                        <Input id="occupation1" name="occupation1" value={formData.occupation1} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation2">Occupation 2</Label>
                        <Input id="occupation2" name="occupation2" value={formData.occupation2} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation3">Occupation 3</Label>
                        <Input id="occupation3" name="occupation3" value={formData.occupation3} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="itrAmount">ITR Amount</Label>
                        <Input id="itrAmount" name="itrAmount" type="number" value={formData.itrAmount} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="totalAssets">Total Assets</Label>
                        <Input id="totalAssets" name="totalAssets" type="number" value={formData.totalAssets} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="vehicleDetails">Vehicle Details</Label>
                        <Input id="vehicleDetails" name="vehicleDetails" value={formData.vehicleDetails} onChange={handleInputChange} />
                    </div>

                    <SectionTitle title="4. चुनाव सम्बन्धी विवरण" />
                    <div>
                        <Label htmlFor="pastElection">Past Election</Label>
                        <Select inputId="pastElection" placeholder="Select Past Election" options={pastElectionOptions} onChange={opt => handleSelectChange("pastElection", opt as Option | null)} value={{value: formData.pastElection, label: formData.pastElection}} />
                    </div>
                    <div>
                        <Label htmlFor="totalBooths">Total Booths</Label>
                        <Input id="totalBooths" name="totalBooths" type="number" value={formData.totalBooths} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="activeBooths">Active Booths</Label>
                        <Input id="activeBooths" name="activeBooths" type="number" value={formData.activeBooths} onChange={handleNumberChange} />
                    </div>

                    <SectionTitle title="5. टीम विवरण" />
                    {formData.teamMembers.map((member, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                            <div>
                                <Label htmlFor={`teamMemberName${index}`}>Team Member {index + 1} Name</Label>
                                <Input id={`teamMemberName${index}`} name="name" value={member.name} onChange={e => handleInputChange(e)} />
                            </div>
                            <div>
                                <Label htmlFor={`teamMemberMobile${index}`}>Team Member {index + 1} Mobile</Label>
                                <Input id={`teamMemberMobile${index}`} name="mobile" value={member.mobile} onChange={e => handleInputChange(e)} />
                            </div>
                        </div>
                    ))}

                    <SectionTitle title="6. सामाजिक गतिविधियाँ" />
                    <div>
                        <Label htmlFor="socialPrograms">Social Programs</Label>
                        <Input id="socialPrograms" name="socialPrograms" value={formData.socialPrograms} onChange={handleInputChange} />
                    </div>

                    <SectionTitle title="7. आगामी कार्यक्रम" />
                    <div>
                        <Label htmlFor="programDate">Program Date</Label>
                        <CustomDatePicker
                            placeholderText="Select Date"
                            selectedDate={formData.programDate ? new Date(formData.programDate) : null}
                            onChange={(date) => handleDateChange("programDate", date)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="meetingDate">Meeting Date</Label>
                        <CustomDatePicker
                            placeholderText="Select Date "
                            selectedDate={formData.meetingDate ? new Date(formData.meetingDate) : null}
                            onChange={(date) => handleDateChange("meetingDate", date)}
                        />
                    </div>

                    <SectionTitle title="8. जीवनी" />
                    <div className="col-span-1 md:col-span-2">
                        <Label htmlFor="biodataPdf" required>Biodata (PDF)</Label>
                        <DropzoneComponent
                            accept={{ "application/pdf": [".pdf"] }}
                            onFileUploadSuccess={handleBiodataUploadSuccess}
                            multiple={false}
                        />
                        {formData.biodataPdf && (
                            <div className="mt-2">
                                <a href={formData.biodataPdf} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Uploaded PDF</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditApplicationModal;
