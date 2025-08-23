
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { setSelectedApplication, setShowViewModal } from "../../features/candidate-applications/candidateApplication.slice";
import Modal from "../modal/Modal";

const ViewApplicationModal = () => {
    const dispatch = useDispatch();
    const { selectedApplication, showViewModal } = useSelector((state: RootState) => state.candidateApplications);

    const handleClose = () => {
        dispatch(setShowViewModal(false));
        dispatch(setSelectedApplication(null));
    };

    if (!showViewModal || !selectedApplication) return null;

    return (
        <Modal title="Application Details" onCancel={handleClose}>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Applicant Name</p>
                        <p>{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Mobile</p>
                        <p>{selectedApplication.mobile}</p>
                    </div>
                    <div>
                        <p className="font-semibold">District</p>
                        <p>{selectedApplication.district.name}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Legislative Assembly</p>
                        <p>{selectedApplication.legislativeAssembly.name}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold">Address</p>
                        <p>{selectedApplication.address}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Har Ghar Jhanda Count</p>
                        <p>{selectedApplication.harGharJhandaCount}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Jan Aakrosh Meetings Count</p>
                        <p>{selectedApplication.janAakroshMeetingsCount}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Community Meetings Count</p>
                        <p>{selectedApplication.communityMeetingsCount}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Facebook Followers</p>
                        <p>{selectedApplication.facebookFollowers}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold">Facebook Page</p>
                        <a href={selectedApplication.facebookPageLink} target="_blank" rel="noreferrer" className="text-blue-500">{selectedApplication.facebookPageLink}</a>
                    </div>
                    <div>
                        <p className="font-semibold">Instagram Followers</p>
                        <p>{selectedApplication.instagramFollowers}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold">Instagram Page</p>
                        <a href={selectedApplication.instagramLink} target="_blank" rel="noreferrer" className="text-blue-500">{selectedApplication.instagramLink}</a>
                    </div>
                    <div>
                        <p className="font-semibold">Status</p>
                        <p>{selectedApplication.status}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold">Notes</p>
                        <p>{selectedApplication.notes || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Biodata</p>
                        <a href={selectedApplication.biodataPdfUrl} target="_blank" rel="noreferrer" className="text-blue-500">View PDF</a>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewApplicationModal;
