import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import Modal from '../../components/modal/Modal'; // Assuming this path
import {
    getFeedbackForms,
    deleteFeedbackForm,
} from '../../features/campaigns/campaignApi';
import {
    setShowFeedbackFormModal,
    setSelectedCampaign,
} from '../../features/campaigns/campaign.slice';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import { TrashBinIcon } from '../../icons';

const ViewCampaignFeedbackFormsModal: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        showFeedbackFormModal,
        selectedCampaign,
        feedbackForms,
        loading,
        error,
    } = useSelector((state: RootState) => state.campaigns);

    useEffect(() => {
        if (showFeedbackFormModal && selectedCampaign?._id) {
            dispatch(getFeedbackForms(selectedCampaign._id));
        }
    }, [showFeedbackFormModal, selectedCampaign, dispatch]);

    const handleClose = () => {
        dispatch(setShowFeedbackFormModal(false));
        dispatch(setSelectedCampaign(null)); // Clear selected campaign on close
    };

    const handleDelete = (feedbackFormId: string) => {
        if (selectedCampaign?._id && window.confirm("Are you sure you want to delete this feedback form?")) {
            dispatch(deleteFeedbackForm({ campaignId: selectedCampaign._id, feedbackFormId }))
                .unwrap()
                .then(() => {
                    toast.success("Feedback form deleted successfully!");
                })
                .catch((err) => {
                    toast.error(err || "Failed to delete feedback form.");
                });
        }
    };

    if (!showFeedbackFormModal) return null; // Control visibility by conditional rendering

    return (
        <Modal onCancel={handleClose} title={`Feedback Forms for ${selectedCampaign?.title || ''}`}>
            {loading && <p>Loading feedback forms...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && feedbackForms.length === 0 && <p>No feedback forms found for this campaign.</p>}

            {!loading && feedbackForms.length > 0 && (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableCell isHeader>Name</TableCell>
                                <TableCell isHeader>Mobile</TableCell>
                                <TableCell isHeader>State</TableCell>
                                <TableCell isHeader>District</TableCell>
                                <TableCell isHeader>Vidhansabha</TableCell>
                                <TableCell isHeader>Support</TableCell>
                                <TableCell isHeader>Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feedbackForms.map((form) => (
                                <TableRow key={form._id}>
                                    <TableCell>{form.name}</TableCell>
                                    <TableCell>{form.mobile}</TableCell>
                                    <TableCell>{form.state}</TableCell>
                                    <TableCell>{form.district}</TableCell>
                                    <TableCell>{form.vidhansabha}</TableCell>
                                    <TableCell>{form.support ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleDelete(form._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <TrashBinIcon className="w-5 h-5" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </Modal>
    );
};

export default ViewCampaignFeedbackFormsModal;