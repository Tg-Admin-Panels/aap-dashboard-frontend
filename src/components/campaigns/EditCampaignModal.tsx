import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { updateCampaign } from "../../features/campaigns/campaignApi";
import Modal from "../modal/Modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import DropzoneComponent from "../form/form-elements/DropZone";
import { setShowEditModal } from "../../features/campaigns/campaign.slice";

const EditCampaignModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, showEditModal, selectedCampaign } = useSelector((state: RootState) => state.campaigns);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        bannerImage: "",
    });

    useEffect(() => {
        if (selectedCampaign) {
            setFormData({
                title: selectedCampaign.title,
                description: selectedCampaign.description,
                bannerImage: selectedCampaign.bannerImage || "",
            });
        }
    }, [selectedCampaign]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBannerImageUploadSuccess = (url: string) => {
        setFormData({ ...formData, bannerImage: url });
    };

    const handleSubmit = async () => {
        if (selectedCampaign) {
            const campaignData = {
                ...formData,
            };
            await dispatch(updateCampaign({ id: selectedCampaign._id, campaignData }));
            dispatch(setShowEditModal(false));
        }
    };

    if (!showEditModal || !selectedCampaign) return null;

    return (
        <Modal
            title="Edit Campaign"
            onCancel={() => dispatch(setShowEditModal(false))}
            onConfirm={handleSubmit}
            cancelBtn={"Cancel"}
            confirmBtn={"Update"}
        >
            <div className="p-6 space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
                    ></textarea>
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="bannerImage">Banner Image</Label>
                    <DropzoneComponent
                        accept={{ 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] }}
                        onFileUploadSuccess={handleBannerImageUploadSuccess}
                        multiple={false}
                    />
                    {formData.bannerImage && (
                        <div className="mt-2">
                            <img src={formData.bannerImage} alt="Banner" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EditCampaignModal;
