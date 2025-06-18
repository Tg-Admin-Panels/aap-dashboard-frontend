// pages/WingDetails.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WingMemberCard from "./WingMemberCard";
import { getWingMembers } from "../../features/wings/wingsApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { WingMember } from "../../features/wings/wings.slice";



export default function WingDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();


  const {selectedWing, error, loading} = useSelector((state: RootState) => state.wings);
    const leader = selectedWing?.leader
    const members = selectedWing?.members
  
  useEffect(() => {
    dispatch(getWingMembers(id!))
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      {selectedWing?.leader && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Wing Leader
          </h2>
          <div className="flex justify-center">
            <WingMemberCard
              name={leader?.name || ""}
              image={leader?.image || ""}
              post={leader?.post || ""}
              phone={leader?.phone || ""}
            />
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Members
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members?.map((member) => (
          <WingMemberCard
            key={member._id}
            name={member.name}
            image={member.image}
            post={member.post}
            phone={member.phone}
          />
        ))}
      </div>
    </div>
  );
}
