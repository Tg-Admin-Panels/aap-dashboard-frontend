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

type Option = { value: string; label: string };

export default function ApplyForCandidacy() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.candidateApplications);

    const [states, setStates] = useState<Option[]>([]);
    const [districts, setDistricts] = useState<Option[]>([]);
    const [legislativeAssemblies, setLegislativeAssemblies] = useState<Option[]>([]);

    const [formData, setFormData] = useState({
        applicantName: "",
        state: "",
        district: "",
        legislativeAssembly: "",
        mobile: "",
        address: "",
        harGharJhandaCount: 0,
        janAakroshMeetingsCount: 0,
        communityMeetingsCount: 0,
        facebookFollowers: 0,
        facebookPageLink: "",
        instagramFollowers: 0,
        instagramLink: "",
        biodataPdfUrl: "",
    });

    const [errorsState, setErrorsState] = useState<Partial<Record<keyof typeof formData, string>>>({});

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
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleBiodataUploadSuccess = (url: string) => {
        // ✅ No reset — we only set the field in the same state
        setFormData(prev => ({ ...prev, biodataPdfUrl: url }));
    };

    // -------- Validation (simple/normal) ----------
    const validate = () => {
        const errs: Partial<Record<keyof typeof formData, string>> = {};

        if (!formData.applicantName || formData.applicantName.trim().length < 2) {
            errs.applicantName = "Applicant name is required (min 2 characters)";
        }
        if (!formData.state) errs.state = "State is required";
        if (!formData.district) errs.district = "District is required";
        if (!formData.legislativeAssembly) errs.legislativeAssembly = "Legislative Assembly is required";

        if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = "Enter a valid 10-digit mobile number";

        if (!formData.address) errs.address = "Address is required";

        const nonNegatives: Array<keyof typeof formData> = [
            "harGharJhandaCount",
            "janAakroshMeetingsCount",
            "communityMeetingsCount",
            "facebookFollowers",
            "instagramFollowers",
        ];
        nonNegatives.forEach((key) => {
            const val = formData[key] as unknown as number;
            if (val === null || val === undefined || Number.isNaN(val)) {
                errs[key] = "This field is required";
            } else if (val < 0) {
                errs[key] = "Value cannot be negative";
            }
        });

        const isValidUrl = (url: string) => {
            try { new URL(url); return true; } catch { return false; }
        };

        if (!formData.facebookPageLink || !isValidUrl(formData.facebookPageLink)) {
            errs.facebookPageLink = "Valid Facebook page link is required";
        }
        if (!formData.instagramLink || !isValidUrl(formData.instagramLink)) {
            errs.instagramLink = "Valid Instagram link is required";
        }
        if (!formData.biodataPdfUrl) {
            errs.biodataPdfUrl = "Biodata PDF is required";
        }

        setErrorsState(errs);
        return Object.keys(errs).length === 0;
    };

    // -------- Submit ----------
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            // ensure numbers are numbers
            harGharJhandaCount: Number(formData.harGharJhandaCount),
            janAakroshMeetingsCount: Number(formData.janAakroshMeetingsCount),
            communityMeetingsCount: Number(formData.communityMeetingsCount),
            facebookFollowers: Number(formData.facebookFollowers),
            instagramFollowers: Number(formData.instagramFollowers),
        };

        const resultAction = await dispatch(createCandidateApplication(payload) as any);

        // If your thunk sets error in slice, rely on it; else check resultAction.meta/rejected
        if (!error && !("error" in resultAction)) {
            navigate("/");
        }
    };

    return (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
            <SpinnerOverlay loading={loading} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Apply for Candidacy</h2>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            <Form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="applicantName">Applicant Name</Label>
                        <Input
                            id="applicantName"
                            name="applicantName"
                            value={formData.applicantName}
                            onChange={handleTextChange}
                            error={!!errorsState.applicantName}
                            hint={errorsState.applicantName}
                        />
                    </div>

                    <div>
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleTextChange}
                            error={!!errorsState.mobile}
                            hint={errorsState.mobile}
                        />
                    </div>

                    <div>
                        <Label htmlFor="state">State</Label>
                        <Select
                            inputId="state"
                            options={states}
                            onChange={(opt) => handleSelectChange("state", opt as Option | null)}
                            value={states.find(o => o.value === formData.state) || null}
                            placeholder="Select State"
                        />
                        {errorsState.state && <p className="text-red-500 text-xs mt-1">{errorsState.state}</p>}
                    </div>

                    <div>
                        <Label htmlFor="district">District</Label>
                        <Select
                            inputId="district"
                            options={districts}
                            onChange={(opt) => handleSelectChange("district", opt as Option | null)}
                            value={districts.find(o => o.value === formData.district) || null}
                            placeholder="Select District"
                            isDisabled={!formData.state}
                        />
                        {errorsState.district && <p className="text-red-500 text-xs mt-1">{errorsState.district}</p>}
                    </div>

                    <div>
                        <Label htmlFor="legislativeAssembly">Legislative Assembly</Label>
                        <Select
                            inputId="legislativeAssembly"
                            options={legislativeAssemblies}
                            onChange={(opt) => handleSelectChange("legislativeAssembly", opt as Option | null)}
                            value={legislativeAssemblies.find(o => o.value === formData.legislativeAssembly) || null}
                            placeholder="Select Legislative Assembly"
                            isDisabled={!formData.district}
                        />
                        {errorsState.legislativeAssembly && <p className="text-red-500 text-xs mt-1">{errorsState.legislativeAssembly}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleTextChange}
                            error={!!errorsState.address}
                            hint={errorsState.address}
                        />
                    </div>

                    <div>
                        <Label htmlFor="harGharJhandaCount">Har Ghar Jhanda Count</Label>
                        <Input
                            type="number"
                            id="harGharJhandaCount"
                            name="harGharJhandaCount"
                            value={formData.harGharJhandaCount}
                            onChange={handleNumberChange}
                            error={!!errorsState.harGharJhandaCount}
                            hint={errorsState.harGharJhandaCount}
                        />
                    </div>

                    <div>
                        <Label htmlFor="janAakroshMeetingsCount">Jan Aakrosh Meetings Count</Label>
                        <Input
                            type="number"
                            id="janAakroshMeetingsCount"
                            name="janAakroshMeetingsCount"
                            value={formData.janAakroshMeetingsCount}
                            onChange={handleNumberChange}
                            error={!!errorsState.janAakroshMeetingsCount}
                            hint={errorsState.janAakroshMeetingsCount}
                        />
                    </div>

                    <div>
                        <Label htmlFor="communityMeetingsCount">Community Meetings Count</Label>
                        <Input
                            type="number"
                            id="communityMeetingsCount"
                            name="communityMeetingsCount"
                            value={formData.communityMeetingsCount}
                            onChange={handleNumberChange}
                            error={!!errorsState.communityMeetingsCount}
                            hint={errorsState.communityMeetingsCount}
                        />
                    </div>

                    <div>
                        <Label htmlFor="facebookFollowers">Facebook Followers</Label>
                        <Input
                            type="number"
                            id="facebookFollowers"
                            name="facebookFollowers"
                            value={formData.facebookFollowers}
                            onChange={handleNumberChange}
                            error={!!errorsState.facebookFollowers}
                            hint={errorsState.facebookFollowers}
                        />
                    </div>

                    <div>
                        <Label htmlFor="facebookPageLink">Facebook Page Link</Label>
                        <Input
                            id="facebookPageLink"
                            name="facebookPageLink"
                            value={formData.facebookPageLink}
                            onChange={handleTextChange}
                            error={!!errorsState.facebookPageLink}
                            hint={errorsState.facebookPageLink}
                        />
                    </div>

                    <div>
                        <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                        <Input
                            type="number"
                            id="instagramFollowers"
                            name="instagramFollowers"
                            value={formData.instagramFollowers}
                            onChange={handleNumberChange}
                            error={!!errorsState.instagramFollowers}
                            hint={errorsState.instagramFollowers}
                        />
                    </div>

                    <div>
                        <Label htmlFor="instagramLink">Instagram Link</Label>
                        <Input
                            id="instagramLink"
                            name="instagramLink"
                            value={formData.instagramLink}
                            onChange={handleTextChange}
                            error={!!errorsState.instagramLink}
                            hint={errorsState.instagramLink}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="biodataPdfUrl">Biodata (PDF)</Label>
                        <DropzoneComponent
                            accept={{ "application/pdf": [".pdf"] }}
                            onFileUploadSuccess={handleBiodataUploadSuccess}
                            multiple={false}
                        />
                        {errorsState.biodataPdfUrl && (
                            <p className="text-red-500 text-xs mt-1">{errorsState.biodataPdfUrl}</p>
                        )}
                        {formData.biodataPdfUrl && (
                            <div className="mt-2">
                                <a
                                    href={formData.biodataPdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View Uploaded PDF
                                </a>
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
