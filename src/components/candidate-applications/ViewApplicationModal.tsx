import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { setSelectedApplication, setShowViewModal } from "../../features/candidate-applications/candidateApplication.slice";
import Modal from "../modal/Modal";

const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 col-span-1 md:col-span-2">{title}</h3>
);

const DetailItem = ({ label, value }: { label: string, value: any }) => (
    <div>
        <p className="font-semibold">{label}</p>
        <p>{value}</p>
    </div>
);

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
                    <SectionTitle title="1. व्यक्तिगत विवरण" />
                    <DetailItem label="Applicant Name" value={selectedApplication.applicantName} />
                    <DetailItem label="Father Name" value={selectedApplication.fatherName} />
                    <DetailItem label="Father Occupation" value={selectedApplication.fatherOccupation} />
                    <DetailItem label="Date of Birth" value={new Date(selectedApplication.dob).toLocaleDateString()} />
                    <DetailItem label="Age" value={selectedApplication.age} />
                    <DetailItem label="Gender" value={selectedApplication.gender} />
                    <DetailItem label="Religion" value={selectedApplication.religion} />
                    <DetailItem label="Marital Status" value={selectedApplication.maritalStatus} />
                    <DetailItem label="State" value={selectedApplication.state.name} />
                    <DetailItem label="District" value={selectedApplication.district.name} />
                    <DetailItem label="Legislative Assembly" value={selectedApplication.legislativeAssembly.name} />
                    <DetailItem label="Address" value={selectedApplication.address} />
                    <DetailItem label="Pincode" value={selectedApplication.pincode} />

                    <SectionTitle title="2. संपर्क विवरण" />
                    <DetailItem label="Mobile" value={selectedApplication.mobile} />
                    <DetailItem label="WhatsApp" value={selectedApplication.whatsapp} />
                    <DetailItem label="Email" value={selectedApplication.email} />
                    <DetailItem label="Facebook Followers" value={selectedApplication.facebookFollowers} />
                    <DetailItem label="Facebook Link" value={<a href={selectedApplication.facebookLink} target="_blank" rel="noreferrer" className="text-blue-500">{selectedApplication.facebookLink}</a>} />
                    <DetailItem label="Instagram Followers" value={selectedApplication.instagramFollowers} />
                    <DetailItem label="Instagram Link" value={<a href={selectedApplication.instagramLink} target="_blank" rel="noreferrer" className="text-blue-500">{selectedApplication.instagramLink}</a>} />

                    <SectionTitle title="3. शैक्षिक एवं आर्थिक विवरण" />
                    <DetailItem label="Education" value={selectedApplication.education} />
                    <DetailItem label="PAN Number" value={selectedApplication.panNumber} />
                    <DetailItem label="Occupation" value={selectedApplication.occupation} />
                    <DetailItem label="Occupation 1" value={selectedApplication.occupation1} />
                    <DetailItem label="Occupation 2" value={selectedApplication.occupation2} />
                    <DetailItem label="Occupation 3" value={selectedApplication.occupation3} />
                    <DetailItem label="ITR Amount" value={selectedApplication.itrAmount} />
                    <DetailItem label="Total Assets" value={selectedApplication.totalAssets} />
                    <DetailItem label="Vehicle Details" value={selectedApplication.vehicleDetails} />

                    <SectionTitle title="4. चुनाव सम्बन्धी विवरण" />
                    <DetailItem label="Past Election" value={selectedApplication.pastElection} />
                    <DetailItem label="Total Booths" value={selectedApplication.totalBooths} />
                    <DetailItem label="Active Booths" value={selectedApplication.activeBooths} />

                    <SectionTitle title="5. टीम विवरण" />
                    {selectedApplication.teamMembers.map((member, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 col-span-2">
                            <DetailItem label={`Team Member ${index + 1} Name`} value={member.name} />
                            <DetailItem label={`Team Member ${index + 1} Mobile`} value={member.mobile} />
                        </div>
                    ))}

                    <SectionTitle title="6. सामाजिक गतिविधियाँ" />
                    <DetailItem label="Social Programs" value={selectedApplication.socialPrograms} />

                    <SectionTitle title="7. आगामी कार्यक्रम" />
                    <DetailItem label="Program Date" value={selectedApplication.programDate ? new Date(selectedApplication.programDate).toLocaleDateString() : "-"} />
                    <DetailItem label="Meeting Date" value={selectedApplication.meetingDate ? new Date(selectedApplication.meetingDate).toLocaleDateString() : "-"} />

                    <SectionTitle title="8. जीवनी" />
                    <DetailItem label="Biodata" value={<a href={selectedApplication.biodataPdf} target="_blank" rel="noreferrer" className="text-blue-500">View PDF</a>} />

                    <SectionTitle title="Meta" />
                    <DetailItem label="Status" value={selectedApplication.status} />
                    <DetailItem label="Notes" value={selectedApplication.notes || "-"} />
                </div>
            </div>
        </Modal>
    );
};

export default ViewApplicationModal;