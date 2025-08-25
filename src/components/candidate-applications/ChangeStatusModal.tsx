
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { updateCandidateApplicationStatus } from "../../features/candidate-applications/candidateApplicationApi";
import { setShowStatusModal } from "../../features/candidate-applications/candidateApplication.slice";
import Modal from "../modal/Modal";

const ChangeStatusModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedApplication, showStatusModal } = useSelector((state: RootState) => state.candidateApplications);
    const [status, setStatus] = useState(selectedApplication?.status || "pending");
    const [notes, setNotes] = useState(selectedApplication?.notes || "");

    useEffect(() => {
        if (selectedApplication) {
            setStatus(selectedApplication.status);
            setNotes(selectedApplication.notes || "");
        }
    }, [selectedApplication]);

    const handleConfirm = () => {
        if (selectedApplication) {
            dispatch(updateCandidateApplicationStatus({ id: selectedApplication._id, status, notes }));
        }
    };

    if (!showStatusModal) return null;

    return (
        <Modal
            title="Change Application Status"
            onCancel={() => dispatch(setShowStatusModal(false))}
            onConfirm={handleConfirm}
            cancelBtn="Cancel"
            confirmBtn="Update"
        >
            <div className="p-3 space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as "pending" | "approved" | "rejected")}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
                        rows={4}
                    ></textarea>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeStatusModal;
