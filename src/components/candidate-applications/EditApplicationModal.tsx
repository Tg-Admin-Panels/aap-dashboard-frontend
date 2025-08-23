
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { updateCandidateApplication } from "../../features/candidate-applications/candidateApplicationApi";
import { setShowUpdateModal } from "../../features/candidate-applications/candidateApplication.slice";
import Modal from "../modal/Modal";
import Input from "../form/input/InputField";

const EditApplicationModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedApplication, showUpdateModal } = useSelector((state: RootState) => state.candidateApplications);
    const [formData, setFormData] = useState(selectedApplication);

    useEffect(() => {
        setFormData(selectedApplication);
    }, [selectedApplication]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleConfirm = () => {
        if (formData) {
            dispatch(updateCandidateApplication({ id: formData._id, applicationData: formData }));
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
                <Input label="Applicant Name" name="applicantName" value={formData.applicantName} onChange={handleInputChange} />
                <Input label="Mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} />
                <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} />
                <Input type="number" label="Har Ghar Jhanda Count" name="harGharJhandaCount" value={formData.harGharJhandaCount} onChange={handleInputChange} />
                <Input type="number" label="Jan Aakrosh Meetings Count" name="janAakroshMeetingsCount" value={formData.janAakroshMeetingsCount} onChange={handleInputChange} />
                <Input type="number" label="Community Meetings Count" name="communityMeetingsCount" value={formData.communityMeetingsCount} onChange={handleInputChange} />
                <Input type="number" label="Facebook Followers" name="facebookFollowers" value={formData.facebookFollowers} onChange={handleInputChange} />
                <Input label="Facebook Page Link" name="facebookPageLink" value={formData.facebookPageLink} onChange={handleInputChange} />
                <Input type="number" label="Instagram Followers" name="instagramFollowers" value={formData.instagramFollowers} onChange={handleInputChange} />
                <Input label="Instagram Link" name="instagramLink" value={formData.instagramLink} onChange={handleInputChange} />
            </div>
        </Modal>
    );
};

export default EditApplicationModal;
