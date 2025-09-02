import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../features/store';
import {
    getFeedbackFormById,
} from '../../features/campaigns/campaignApi';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

const FeedbackDetail: React.FC = () => {
    const { campaignId, feedbackFormId } = useParams<{ campaignId: string; feedbackFormId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        selectedFeedbackForm,
        loading,
        error,
    } = useSelector((state: RootState) => state.campaigns);

    useEffect(() => {
        if (campaignId && feedbackFormId) {
            dispatch(getFeedbackFormById({ campaignId, feedbackFormId }));
        }
    }, [campaignId, feedbackFormId, dispatch]);

    if (loading && !selectedFeedbackForm) return <SpinnerOverlay loading={true} />;
    if (error) return <div className="p-6 text-red-500 bg-red-100 rounded-lg">Error: {error}</div>;
    if (!selectedFeedbackForm) return <div className="p-6">Feedback form not found.</div>;

    return (
        <div>
            <PageBreadcrumb pageTitle="Feedback Form Details" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Details for: {selectedFeedbackForm.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">Name:</p>
                        <p className="text-gray-900 text-lg">{selectedFeedbackForm.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Mobile:</p>
                        <p className="text-gray-900 text-lg">{selectedFeedbackForm.mobile}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">State:</p>
                        <p className="text-gray-900 text-lg">{selectedFeedbackForm.state}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">District:</p>
                        <p className="text-gray-900 text-lg">{selectedFeedbackForm.district}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Vidhansabha:</p>
                        <p className="text-gray-900 text-lg">{selectedFeedbackForm.vidhansabha}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Support:</p>
                        <p className="text-gray-900 text-lg">{selectedFeedbackForm.support ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Submitted On:</p>
                        <p className="text-gray-900 text-lg">{new Date(selectedFeedbackForm.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/campaigns/${campaignId}/feedback-forms`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
                >
                    Back to Feedback List
                </button>
            </div>
        </div>
    );
};

export default FeedbackDetail;
