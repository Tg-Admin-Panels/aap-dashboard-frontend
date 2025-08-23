import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createCampaign } from "../../features/campaigns/campaignApi";
import Modal from "../modal/Modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import DropzoneComponent from "../form/form-elements/DropZone";
import { setShowCreateModal } from "../../features/campaigns/campaign.slice";

const CreateCampaignModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, showCreateModal } = useSelector((state: RootState) => state.campaigns);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        bannerImage: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBannerImageUploadSuccess = (url: string) => {
        setFormData({ ...formData, bannerImage: url });
    };

    const handleSubmit = async () => {
        const campaignData = {
            ...formData,
        };
        await dispatch(createCampaign(campaignData));
        dispatch(setShowCreateModal(false));
    };

    if (!showCreateModal) return null;

    return (
        <Modal
            title="Create New Campaign"
            onCancel={() => dispatch(setShowCreateModal(false))}
            onConfirm={handleSubmit}
            cancelBtn={"Cancel"}
            confirmBtn={"Create"}
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

export default CreateCampaignModal;
