import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { addComment, getComments, deleteComment } from "../../features/campaigns/campaignApi";
import Modal from "../modal/Modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { setShowCommentsModal } from "../../features/campaigns/campaign.slice";

const ViewCampaignCommentsModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, } = useSelector((state: RootState) => state.auth);
    const { selectedCampaign, comments, showCommentsModal } = useSelector((state: RootState) => state.campaigns);
    const [newCommentText, setNewCommentText] = useState("");

    useEffect(() => {
        if (showCommentsModal && selectedCampaign) {
            dispatch(getComments(selectedCampaign._id));
        }
    }, [showCommentsModal, selectedCampaign, dispatch]);

    const handleAddComment = async () => {
        if (selectedCampaign && newCommentText.trim() !== "") {
            await dispatch(addComment({ campaignId: selectedCampaign._id, text: newCommentText }));
            setNewCommentText("");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (selectedCampaign) {
            await dispatch(deleteComment({ campaignId: selectedCampaign._id, commentId }));
        }
    };

    if (!showCommentsModal || !selectedCampaign) return null;

    return (
        <Modal
            title={`Comments for ${selectedCampaign.title}`}
            onCancel={() => dispatch(setShowCommentsModal(false))}
            cancelBtn={"Close"}
        >
            <div className="p-6 space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md bg-gray-50">
                    {comments.length === 0 ? (
                        <p className="text-gray-500">No comments yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="border-b pb-2 last:border-b-0">
                                <p className="text-gray-700 text-sm">{comment.text}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                    {user?.role === "admin" && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-2">
                    <Input
                        id="newComment"
                        name="newComment"
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleAddComment} disabled={!newCommentText.trim()}>
                        Add
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewCampaignCommentsModal;
