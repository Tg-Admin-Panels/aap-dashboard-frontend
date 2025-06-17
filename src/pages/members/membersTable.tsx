// src/components/member/MemberTable.tsx
import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getAllMembers, getMembersByVolunteer } from "../../features/members/membersApi";

export default function MemberTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading, error } = useSelector(
    (state: RootState) => state.members
  );
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if(user?.role === "volunteer") dispatch(getMembersByVolunteer(user.volunteer!));
    if(user?.role === "admin") dispatch(getAllMembers());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-100 dark:bg-gray-800">
              {["Name", "State", "Mobile", "Joined By", "Volunteer"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-5 py-3 font-medium text-gray-500 text-xs uppercase"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {members.map((member) => (
              <tr key={member._id}>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.name}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.state}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.mobileNumber}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {member.joinedBy}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.joinedBy === "volunteer"
                    ? member.volunteerId
                      ? `${member.volunteerId.fullName} (${member.volunteerId.mobileNumber})`
                      : "Not Assigned"
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
