import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { updateCandidateApplication } from "../../features/candidate-applications/candidateApplicationApi";
import { setShowUpdateModal } from "../../features/candidate-applications/candidateApplication.slice";
import Modal from "../modal/Modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";

const EditApplicationModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedApplication, showUpdateModal } = useSelector(
        (state: RootState) => state.candidateApplications
    );
    const [formData, setFormData] = useState(selectedApplication);

    useEffect(() => {
        setFormData(selectedApplication);
    }, [selectedApplication]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
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
                <div>
                    <Label htmlFor="applicantName">Applicant Name</Label>
                    <Input
                        id="applicantName"
                        name="applicantName"
                        value={formData.applicantName ?? ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                        id="mobile"
                        name="mobile"
                        value={formData.mobile ?? ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        name="address"
                        value={formData.address ?? ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="harGharJhandaCount">Har Ghar Jhanda Count</Label>
                    <Input
                        type="number"
                        id="harGharJhandaCount"
                        name="harGharJhandaCount"
                        value={String(formData.harGharJhandaCount ?? "")}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="janAakroshMeetingsCount">Jan Aakrosh Meetings Count</Label>
                    <Input
                        type="number"
                        id="janAakroshMeetingsCount"
                        name="janAakroshMeetingsCount"
                        value={String(formData.janAakroshMeetingsCount ?? "")}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="communityMeetingsCount">Community Meetings Count</Label>
                    <Input
                        type="number"
                        id="communityMeetingsCount"
                        name="communityMeetingsCount"
                        value={String(formData.communityMeetingsCount ?? "")}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="facebookFollowers">Facebook Followers</Label>
                    <Input
                        type="number"
                        id="facebookFollowers"
                        name="facebookFollowers"
                        value={String(formData.facebookFollowers ?? "")}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="facebookPageLink">Facebook Page Link</Label>
                    <Input
                        id="facebookPageLink"
                        name="facebookPageLink"
                        value={formData.facebookPageLink ?? ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                    <Input
                        type="number"
                        id="instagramFollowers"
                        name="instagramFollowers"
                        value={String(formData.instagramFollowers ?? "")}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="instagramLink">Instagram Link</Label>
                    <Input
                        id="instagramLink"
                        name="instagramLink"
                        value={formData.instagramLink ?? ""}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditApplicationModal;
