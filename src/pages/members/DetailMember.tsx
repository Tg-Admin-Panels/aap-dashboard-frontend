import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getMemberById } from "../../features/members/membersApi";
import { useParams } from "react-router-dom";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function DetailMember() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { member, loading, error } = useSelector(
    (state: RootState) => state.members
  );

  useEffect(() => {
    if (id) {
      dispatch(getMemberById(id));
    }
  }, [dispatch, id]);

  if (loading) return <SpinnerOverlay loading={loading} />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!member) return <p>Member not found.</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Member Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{member.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">State</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{member.state}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{member.mobileNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Joined By</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{member.joinedBy}</p>
          </div>
          {member.joinedBy === "volunteer" && member.volunteerId && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Volunteer</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {member.volunteerId ? member.volunteerId.fullName : undefined}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
