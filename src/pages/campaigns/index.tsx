import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
    setSelectedCampaign,
    setShowCreateModal,
    setShowEditModal,
    setShowCommentsModal,
} from "../../features/campaigns/campaign.slice";
import { Campaign, getAllCampaigns } from "../../features/campaigns/campaignApi";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { ArrowUpIcon, PencilIcon } from "../../icons";
import { FaEye, } from "react-icons/fa";
import Button from "../../components/ui/button/Button";
import CreateCampaignModal from "../../components/campaigns/CreateCampaignModal";
import EditCampaignModal from "../../components/campaigns/EditCampaignModal";
import ViewCampaignCommentsModal from "../../components/campaigns/ViewCampaignCommentsModal";


const SkeletonRow = () => (
    <TableRow>
        <TableCell colSpan={6}>
            <div className="animate-pulse flex items-center gap-4 py-3">
                <div className="h-4 w-40 rounded bg-gray-200/70" />
                <div className="h-4 w-24 rounded bg-gray-200/70" />
                <div className="h-4 w-28 rounded bg-gray-200/70" />
                <div className="h-4 w-36 rounded bg-gray-200/70" />
                <div className="h-6 w-16 rounded-full bg-gray-200/70" />
            </div>
        </TableCell>
    </TableRow>
);

const EmptyState = () => (
    <div className="text-center py-16">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 grid place-items-center text-primary">
            <ArrowUpIcon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold">No campaigns yet</h3>
        <p className="text-gray-500 mt-1">When campaigns are created, their details will appear here.</p>
    </div>
);

const Campaigns = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { campaigns, loading } = useSelector((s: RootState) => s.campaigns);


    const [q,] = useState("");

    useEffect(() => {
        dispatch(getAllCampaigns());
    }, [dispatch]);

    const handleEditClick = (campaign: Campaign) => {
        dispatch(setSelectedCampaign(campaign));
        dispatch(setShowEditModal(true));
    };

    const handleViewCommentsClick = (campaign: Campaign) => {
        dispatch(setSelectedCampaign(campaign));
        dispatch(setShowCommentsModal(true));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return campaigns;
        return campaigns.filter((c) =>
            [c.title, c.description]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(term))
        );
    }, [campaigns, q]);

    return (
        <div>
            <PageBreadcrumb pageTitle="Campaigns" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Card header */}
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Campaigns</h2>
                        <p className="text-sm text-gray-500">Manage your political campaigns.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button
                            className="inline-flex whitespace-nowrap items-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition"
                            onClick={() => dispatch(setShowCreateModal(true))}
                        >
                            Create Campaign
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 sticky top-0  z-10">
                            <TableRow>
                                <TableCell isHeader className="min-w-[200px]">Title</TableCell>
                                <TableCell isHeader className="min-w-[220px] text-center">Actions</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading && (
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            )}

                            {!loading && filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <EmptyState />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                filtered.map((campaign) => (
                                    <TableRow key={campaign._id} className="hover:bg-gray-50/60 text-center">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{campaign.title}</span>
                                                <span className="text-xs text-gray-500">ID: {campaign._id.slice(-8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                    onClick={() => handleViewCommentsClick(campaign)}
                                                >
                                                    <FaEye className="w-4 h-4" /> Comments
                                                </button>
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                    onClick={() => handleEditClick(campaign)}
                                                >
                                                    <PencilIcon className="w-4 h-4" /> Edit
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* Modals will be rendered here */}
            <CreateCampaignModal />
            <EditCampaignModal />
            <ViewCampaignCommentsModal />
        </div>
    );
};

export default Campaigns;
