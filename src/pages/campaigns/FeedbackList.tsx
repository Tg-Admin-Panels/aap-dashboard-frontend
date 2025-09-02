import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../features/store';
import {
    getCampaignById,
    getFeedbackForms,
    deleteFeedbackForm,
} from '../../features/campaigns/campaignApi';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import { TrashBinIcon } from '../../icons';
import { toast } from 'react-toastify';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

const FeedbackList: React.FC = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        selectedCampaign,
        feedbackForms,
        loading,
        error,
    } = useSelector((state: RootState) => state.campaigns);

    useEffect(() => {
        if (campaignId) {
            dispatch(getCampaignById(campaignId));
            dispatch(getFeedbackForms(campaignId));
        }
    }, [campaignId, dispatch]);

    const handleDelete = (feedbackFormId: string) => {
        if (campaignId && window.confirm("Are you sure you want to delete this feedback form?")) {
            dispatch(deleteFeedbackForm({ campaignId, feedbackFormId }))
                .unwrap()
                .then(() => {
                    toast.success("Feedback form deleted successfully!");
                })
                .catch((err) => {
                    toast.error(err || "Failed to delete feedback form.");
                });
        }
    };

    if (loading && !selectedCampaign) return <SpinnerOverlay loading={true} />;
    if (error) return <div className="p-6 text-red-500 bg-red-100 rounded-lg">Error: {error}</div>;
    if (!selectedCampaign) return <div className="p-6">Campaign not found.</div>;

    return (
        <div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Feedback Forms</h2>

                {loading && feedbackForms.length === 0 && <p>Loading feedback forms...</p>}
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
                                    <TableRow key={form._id} className="hover:bg-gray-50/60 cursor-pointer text-center " >
                                        <TableCell> <div className='w-full hover:underline' onClick={() => navigate(`/campaigns/${campaignId}/feedback-forms/${form._id}`)}>
                                            {form.name} </div> </TableCell>
                                        <TableCell>{form.mobile}</TableCell>
                                        <TableCell>{form.state}</TableCell>
                                        <TableCell>{form.district}</TableCell>
                                        <TableCell>{form.vidhansabha}</TableCell>
                                        <TableCell>{form.support ? 'Yes' : 'No'}</TableCell>
                                        <TableCell> {/* Prevent row click from triggering */}
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
            </div>
        </div>
    );
};

export default FeedbackList;
