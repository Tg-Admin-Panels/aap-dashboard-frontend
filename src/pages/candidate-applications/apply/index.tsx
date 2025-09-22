import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../features/store";
import { createCandidateApplication } from "../../../features/candidate-applications/candidateApplicationApi";
import Form from "../../../components/form/Form";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "react-select";
import SpinnerOverlay from "../../../components/ui/SpinnerOverlay";
import DropzoneComponent from "../../../components/form/form-elements/DropZone";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import CustomDatePicker from "../../../components/ui/calender/CustomDatePicker";

type Option = { value: string; label: string };

const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 col-span-1 md:col-span-2">{title}</h3>
);

const pastElectionOptions = [
    "लोकसभा", "विधानसभा", "नगर पालिका", "वार्ड पार्षद", "सांसद", "उप मुख्य पार्षद", "मुख्य पार्षद", "ग्राम पंचायत के सदस्य", "ग्राम कचहरी के पंच", "ग्राम पंचायत के मुखिया", "ग्राम कचहरी के सरपंच", "पंचायत समिति के सदस्य", "जिला परिषद्  के सदस्य", "पैक्स", "अन्य", "नहीं"
].map(option => ({ value: option, label: option }));

export default function ApplyForCandidacy() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.candidateApplications);

    const [states, setStates] = useState<Option[]>([]);
    const [districts, setDistricts] = useState<Option[]>([]);
    const [legislativeAssemblies, setLegislativeAssemblies] = useState<Option[]>([]);

    const [formData, setFormData] = useState({
        // 1. व्यक्तिगत विवरण
        applicantName: "",
        fatherName: "",
        fatherOccupation: "",
        dob: "",
        age: 0,
        gender: "",
        religion: "",
        maritalStatus: "",
        state: "",
        district: "",
        legislativeAssembly: "",
        address: "",
        pincode: "",

        // 2. संपर्क विवरण
        mobile: "",
        whatsapp: "",
        email: "",
        facebookFollowers: 0,
        facebookLink: "",
        instagramFollowers: 0,
        instagramLink: "",

        // 3. शैक्षिक एवं आर्थिक विवरण
        education: "",
        panNumber: "",
        occupation: "",
        occupation1: "",
        occupation2: "",
        occupation3: "",
        itrAmount: 0,
        totalAssets: 0,
        vehicleDetails: "",

        // 4. चुनाव सम्बन्धी विवरण
        pastElection: "",
        totalBooths: 0,
        activeBooths: 0,

        // 5. टीम विवरण
        teamMembers: [{ name: "", mobile: "" }],

        // 6. सामाजिक गतिविधियाँ
        socialPrograms: "",

        // 7. आगामी कार्यक्रम
        programDate: "",
        meetingDate: "",

        // 8. जीवनी
        biodataPdf: "",
    });

    const [errorsState, setErrorsState] = useState<Partial<Record<keyof typeof formData, any>>>({});

    // -------- Fetchers ----------
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
        if (!formData.state) { setDistricts([]); return; }
        (async () => {
            try {
                const res = await axiosInstance.get(`/districts?parentId=${formData.state}`);
                setDistricts(res.data.data.map((d: any) => ({ value: d._id, label: d.name })));
            } catch (e) {
                console.error("Error fetching districts:", e);
            }
        })();
    }, [formData.state]);

    useEffect(() => {
        if (!formData.district) { setLegislativeAssemblies([]); return; }
        (async () => {
            try {
                const res = await axiosInstance.get(`/legislative-assemblies?parentId=${formData.district}`);
                setLegislativeAssemblies(res.data.data.map((la: any) => ({ value: la._id, label: la.name })));
            } catch (e) {
                console.error("Error fetching legislative assemblies:", e);
            }
        })();
    }, [formData.district]);

    // -------- Handlers ----------
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "mobile" || name === "whatsapp" || name === "pincode") {
            const numericValue = value.replace(/[^0-9]/g, "");
            if (numericValue.length <= 10 && (name === "mobile" || name === "whatsapp")) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            } else if (numericValue.length <= 6 && name === "pincode") {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const num = value === "" ? "" : Number(value);
        setFormData(prev => ({ ...prev, [name]: (num as any) }));
    };

    const handleSelectChange = (name: keyof typeof formData, option: Option | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: option ? option.value : "",
            ...(name === "state" ? { district: "", legislativeAssembly: "" } : {}),
            ...(name === "district" ? { legislativeAssembly: "" } : {}),
        }));
    };

    const handleDateChange = (name: keyof typeof formData, date: Date | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: date ? date.toISOString() : "",
        }));
    };

    const handleBiodataUploadSuccess = (url: string) => {
        setFormData(prev => ({ ...prev, biodataPdf: url }));
    };

    const handleTeamMemberChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const teamMembers = [...formData.teamMembers];
        teamMembers[index] = { ...teamMembers[index], [name]: value };
        setFormData(prev => ({ ...prev, teamMembers }));
    };

    const addTeamMember = () => {
        setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, { name: "", mobile: "" }] }));
    };

    // -------- Validation ----------
    const validate = () => {
        const errs: Partial<Record<keyof typeof formData, any>> = {};

        if (!formData.applicantName) errs.applicantName = "Applicant name is required";
        if (!formData.fatherName) errs.fatherName = "Father name is required";
        if (!formData.dob) errs.dob = "Date of birth is required";
        if (!formData.gender) errs.gender = "Gender is required";
        if (!formData.state) errs.state = "State is required";
        if (!formData.district) errs.district = "District is required";
        if (!formData.legislativeAssembly) errs.legislativeAssembly = "Legislative Assembly is required";
        if (!formData.address) errs.address = "Address is required";
        if (!formData.biodataPdf) errs.biodataPdf = "Biodata PDF is required";

        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            errs.mobile = "Mobile number must be 10 digits.";
        }

        if (formData.whatsapp && !/^[0-9]{10}$/.test(formData.whatsapp)) {
            errs.whatsapp = "WhatsApp number must be 10 digits.";
        }

        if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
            errs.pincode = "Pincode must be 6 digits.";
        }

        setErrorsState(errs);
        return Object.keys(errs).length === 0;
    };

    // -------- Submit ----------
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const resultAction = await dispatch(createCandidateApplication(formData) as any);
        if (!("error" in resultAction)) {
            navigate("/");
        }
    };

    return (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Apply for Candidacy</h2>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            <Form onSubmit={onSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <SectionTitle title="1. व्यक्तिगत विवरण" />
                    <div>
                        <Label htmlFor="applicantName" required>Applicant Name</Label>
                        <Input id="applicantName" name="applicantName" value={formData.applicantName} onChange={handleTextChange} required />
                        {errorsState.applicantName && <p className="text-red-500 text-xs mt-1">{errorsState.applicantName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="fatherName" required>Father Name</Label>
                        <Input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleTextChange} required />
                        {errorsState.fatherName && <p className="text-red-500 text-xs mt-1">{errorsState.fatherName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="fatherOccupation">Father Occupation</Label>
                        <Input id="fatherOccupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="dob" required>Date of Birth</Label>
                        <CustomDatePicker
                            placeholderText="Select Date of Birth"
                            selectedDate={formData.dob ? new Date(formData.dob) : null}
                            onChange={(date) => handleDateChange("dob", date)}
                        />
                        {errorsState.dob && <p className="text-red-500 text-xs mt-1">{errorsState.dob}</p>}
                    </div>
                    <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" type="number" value={formData.age} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="gender" required>Gender</Label>
                        <Select inputId="gender" placeholder="Select Gender" options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} onChange={opt => handleSelectChange("gender", opt as Option | null)} />
                        {errorsState.gender && <p className="text-red-500 text-xs mt-1">{errorsState.gender}</p>}
                    </div>
                    <div>
                        <Label htmlFor="religion">Religion</Label>
                        <Input id="religion" name="religion" value={formData.religion} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select inputId="maritalStatus" placeholder="Select Marital Status" options={[{ value: "Married", label: "Married" }, { value: "Unmarried", label: "Unmarried" }, { value: "Other", label: "Other" }]} onChange={opt => handleSelectChange("maritalStatus", opt as Option | null)} />
                    </div>
                    <div>
                        <Label htmlFor="state" required>State</Label>
                        <Select inputId="state" placeholder="Select State" options={states} onChange={opt => handleSelectChange("state", opt as Option | null)} />
                        {errorsState.state && <p className="text-red-500 text-xs mt-1">{errorsState.state}</p>}
                    </div>
                    <div>
                        <Label htmlFor="district" required>District</Label>
                        <Select inputId="district" placeholder="Select District" options={districts} onChange={opt => handleSelectChange("district", opt as Option | null)} isDisabled={!formData.state} />
                        {errorsState.district && <p className="text-red-500 text-xs mt-1">{errorsState.district}</p>}
                    </div>
                    <div>
                        <Label htmlFor="legislativeAssembly" required>Legislative Assembly</Label>
                        <Select inputId="legislativeAssembly" placeholder="Select Legislative Assembly" options={legislativeAssemblies} onChange={opt => handleSelectChange("legislativeAssembly", opt as Option | null)} isDisabled={!formData.district} />
                        {errorsState.legislativeAssembly && <p className="text-red-500 text-xs mt-1">{errorsState.legislativeAssembly}</p>}
                    </div>
                    <div>
                        <Label htmlFor="address" required>Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleTextChange} required />
                        {errorsState.address && <p className="text-red-500 text-xs mt-1">{errorsState.address}</p>}
                    </div>
                    <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleTextChange} />
                        {errorsState.pincode && <p className="text-red-500 text-xs mt-1">{errorsState.pincode}</p>}
                    </div>

                    <SectionTitle title="2. संपर्क विवरण" />
                    <div>
                        <Label htmlFor="mobile" required>Mobile</Label>
                        <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleTextChange} required />
                        {errorsState.mobile && <p className="text-red-500 text-xs mt-1">{errorsState.mobile}</p>}
                    </div>
                    <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleTextChange} />
                        {errorsState.whatsapp && <p className="text-red-500 text-xs mt-1">{errorsState.whatsapp}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="facebookFollowers">Facebook Followers</Label>
                        <Input id="facebookFollowers" name="facebookFollowers" type="number" value={formData.facebookFollowers} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="facebookLink">Facebook Link</Label>
                        <Input id="facebookLink" name="facebookLink" value={formData.facebookLink} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                        <Input id="instagramFollowers" name="instagramFollowers" type="number" value={formData.instagramFollowers} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <Label htmlFor="instagramLink">Instagram Link</Label>
                        <Input id="instagramLink" name="instagramLink" value={formData.instagramLink} onChange={handleTextChange} />
                    </div>

                    <SectionTitle title="3. शैक्षिक एवं आर्थिक विवरण" />
                    <div>
                        <Label htmlFor="education">Education</Label>
                        <Input id="education" name="education" value={formData.education} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation1">Occupation 1</Label>
                        <Input id="occupation1" name="occupation1" value={formData.occupation1} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation2">Occupation 2</Label>
                        <Input id="occupation2" name="occupation2" value={formData.occupation2} onChange={handleTextChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation3">Occupation 3</Label>
                        <Input id="occupation3" name="occupation3" value={formData.occupation3} onChange={handleTextChange} />
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
                        <Input id="vehicleDetails" name="vehicleDetails" value={formData.vehicleDetails} onChange={handleTextChange} />
                    </div>

                    <SectionTitle title="4. चुनाव सम्बन्धी विवरण" />
                    <div>
                        <Label htmlFor="pastElection">Past Election</Label>
                        <Select inputId="pastElection" placeholder="Select Past Election" options={pastElectionOptions} onChange={opt => handleSelectChange("pastElection", opt as Option | null)} />
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
                                <Input id={`teamMemberName${index}`} name="name" value={member.name} onChange={e => handleTeamMemberChange(index, e)} />
                            </div>
                            <div>
                                <Label htmlFor={`teamMemberMobile${index}`}>Team Member {index + 1} Mobile</Label>
                                <Input id={`teamMemberMobile${index}`} name="mobile" value={member.mobile} onChange={e => handleTeamMemberChange(index, e)} />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addTeamMember} className="text-sm text-blue-500">+ Add Team Member</button>

                    <SectionTitle title="6. सामाजिक गतिविधियाँ" />
                    <div>
                        <Label htmlFor="socialPrograms">Social Programs</Label>
                        <Input id="socialPrograms" name="socialPrograms" value={formData.socialPrograms} onChange={handleTextChange} />
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
                        {errorsState.biodataPdf && <p className="text-red-500 text-xs mt-1">{errorsState.biodataPdf}</p>}
                        {formData.biodataPdf && (
                            <div className="mt-2">
                                <a href={formData.biodataPdf} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Uploaded PDF</a>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
                    disabled={loading}
                >
                    Submit Application
                </button>
            </Form>
        </div>
    );
}