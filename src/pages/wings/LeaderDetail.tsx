import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaPhone } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getWingLeader } from "../../features/wings/wingsApi";

export const LeaderDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { wingId, } = useParams<{ wingId: string; id: string }>();

    const { leaderDetail, loading, error } = useSelector((state: RootState) => state.wingMembers);
    console.log(leaderDetail)
    useEffect(() => {
        if (wingId) {
            dispatch(getWingLeader(wingId as string));
        }
    }, [dispatch, wingId,]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-500">
                Loading leader details...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-[70vh] text-red-600 font-medium">
                {error}
            </div>
        );

    if (!leaderDetail)
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-400">
                No leader found.
            </div>
        );

    const { name, role, post, image, phone, fbLink, instafbLink, xLink } = leaderDetail;

    return (
        <section className="max-w-5xl mx-auto px-6 py-12">
            <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-10 p-8">
                {/* Profile Image */}
                <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-blue-600 flex-shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                    <p className="text-blue-600 font-medium capitalize">
                        {role === "leader" ? "Wing Leader" : "Member"}
                    </p>
                    {post && <p className="text-gray-700">Post: {post}</p>}

                    {/* Phone */}
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 mt-4">
                        <FaPhone className="text-blue-600" />
                        <a href={`tel:${phone}`} className="hover:underline">
                            {phone}
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center md:justify-start gap-5 mt-6">
                        {fbLink && (
                            <a
                                href={fbLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:scale-110 transition"
                            >
                                <FaFacebookF size={20} />
                            </a>
                        )}
                        {instafbLink && (
                            <a
                                href={instafbLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-500 hover:scale-110 transition"
                            >
                                <FaInstagram size={20} />
                            </a>
                        )}
                        {xLink && (
                            <a
                                href={xLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:scale-110 transition"
                            >
                                <FaXTwitter size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeaderDetail;
