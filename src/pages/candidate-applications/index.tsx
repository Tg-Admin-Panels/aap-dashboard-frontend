import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
    CandidateApplication,
    setSelectedApplication,
    setShowStatusModal,
    setShowViewModal,
    setShowUpdateModal,
} from "../../features/candidate-applications/candidateApplication.slice";
import { getAllCandidateApplications } from "../../features/candidate-applications/candidateApplicationApi";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { ArrowUpIcon, PencilIcon } from "../../icons";
import { FaEye, FaSearch } from "react-icons/fa";
import Button from "../../components/ui/button/Button";
import ChangeStatusModal from "../../components/candidate-applications/ChangeStatusModal";
import ViewApplicationModal from "../../components/candidate-applications/ViewApplicationModal";
import EditApplicationModal from "../../components/candidate-applications/EditApplicationModal";
import { useNavigate } from "react-router";


const StatusBadge = ({ status }: { status: CandidateApplication["status"] }) => {
    const cfg: Record<string, string> = {
        pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
        approved: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
        rejected: "bg-rose-100 text-rose-800 ring-1 ring-rose-300",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cfg[status] ?? "bg-gray-100 text-gray-800 ring-1 ring-gray-300"}`}>
            {status?.[0]?.toUpperCase() + status?.slice(1)}
        </span>
    );
};

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
        <h3 className="text-lg font-semibold">No applications yet</h3>
        <p className="text-gray-500 mt-1">When candidates apply, their details will appear here.</p>
    </div>
);

const CandidateApplications = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { applications, loading } = useSelector((s: RootState) => s.candidateApplications);
    const navigate = useNavigate();

    const [q, setQ] = useState("");

    useEffect(() => {
        dispatch(getAllCandidateApplications());
    }, [dispatch]);

    const handleStatusClick = (application: CandidateApplication) => {
        dispatch(setSelectedApplication(application));
        dispatch(setShowStatusModal(true));
    };

    const handleViewClick = (application: CandidateApplication) => {
        dispatch(setSelectedApplication(application));
        dispatch(setShowViewModal(true));
    };

    const handleEditClick = (application: CandidateApplication) => {
        dispatch(setSelectedApplication(application));
        dispatch(setShowUpdateModal(true));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return applications;
        return applications.filter((a) =>
            [a.applicantName, a.mobile, a?.district?.name, a?.legislativeAssembly?.name]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(term))
        );
    }, [applications, q]);

    return (
        <div>
            <PageBreadcrumb pageTitle="Candidate Applications" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Card header */}
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Applications</h2>
                        <p className="text-sm text-gray-500">Track, review and update candidate status.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">


                        <Button
                            className="inline-flex whitespace-nowrap items-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition"
                            onClick={() => navigate("/candidate-applications/apply")}
                        >
                            Apply for Candidacy
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 sticky top-0  z-10">
                            <TableRow>
                                <TableCell isHeader className="min-w-[200px]">Applicant</TableCell>
                                <TableCell isHeader className="min-w-[120px]">Mobile</TableCell>
                                <TableCell isHeader className="min-w-[160px]">District</TableCell>
                                <TableCell isHeader className="min-w-[200px]">Legislative Assembly</TableCell>
                                <TableCell isHeader className="min-w-[120px]">Status</TableCell>
                                <TableCell isHeader className="min-w-[220px]">Actions</TableCell>
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
                                    <TableCell colSpan={6}>
                                        <EmptyState />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                filtered.map((a) => (
                                    <TableRow key={a._id} className="hover:bg-gray-50/60 text-center">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{a.applicantName}</span>
                                                <span className="text-xs text-gray-500">ID: {a._id.slice(-8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-700">{a.mobile}</TableCell>
                                        <TableCell className="text-gray-700">{a?.district?.name ?? "-"}</TableCell>
                                        <TableCell className="text-gray-700">{a?.legislativeAssembly?.name ?? "-"}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={a.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                    onClick={() => handleViewClick(a)}
                                                >
                                                    <FaEye className="w-4 h-4" /> View
                                                </button>
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                    onClick={() => handleEditClick(a)}
                                                >
                                                    <PencilIcon className="w-4 h-4" /> Edit
                                                </button>
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-700"
                                                    onClick={() => handleStatusClick(a)}
                                                >
                                                    Change Status
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <ChangeStatusModal />
            <ViewApplicationModal />
            <EditApplicationModal />
        </div>
    );
};

export default CandidateApplications;
