import { useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { createCampaign } from "../../features/campaigns/campaignApi";
import Modal from "../modal/Modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DropzoneComponent from "../form/form-elements/DropZone";
import { setShowCreateModal } from "../../features/campaigns/campaign.slice";

const CreateCampaignModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { showCreateModal } = useSelector((state: RootState) => state.campaigns);

    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

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

    const validate = () => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        if (!formData.title) newErrors.title = "Title is required.";
        if (!formData.description) newErrors.description = "Description is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

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
                    <Label htmlFor="title" required>Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} error={!!errors.title} hint={errors.title} />
                </div>
                <div>
                    <Label htmlFor="description" required>Description</Label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
