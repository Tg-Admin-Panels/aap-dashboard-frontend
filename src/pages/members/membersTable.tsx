import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllMembers,
  getMembersByVolunteer,
} from "../../features/members/membersApi";
import FilterSelect from "../../components/inputs/FilterSelect";


export default function MemberTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading, error } = useSelector(
    (state: RootState) => state.members
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [stateFilter, setStateFilter] = useState("");
  const [joinedByFilter, setJoinedByFilter] = useState("");
  const [volunteerFilter, setVolunteerFilter] = useState("");

  useEffect(() => {
    if (user?.role === "volunteer")
      dispatch(getMembersByVolunteer(user.volunteer!));
    if (user?.role === "admin") dispatch(getAllMembers());
  }, [dispatch]);

  const uniqueStates = [...new Set(members.map((m) => m.state))];
  const uniqueJoinedBy = [...new Set(members.map((m) => m.joinedBy))];
  const uniqueVolunteers = [
    ...new Set(
      members
        .filter((m) => m.volunteerId)
        .map(
          (m) => `${m.volunteerId?.fullName} (${m.volunteerId?.mobileNumber})`
        )
    ),
  ];

  const filteredMembers = members.filter((member) => {
    return (
      (stateFilter === "" || member.state === stateFilter) &&
      (joinedByFilter === "" || member.joinedBy === joinedByFilter) &&
      (volunteerFilter === "" ||
        (member.volunteerId &&
          `${member.volunteerId.fullName} (${member.volunteerId.mobileNumber})` ===
            volunteerFilter))
    );
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-100 dark:bg-gray-800">
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">
                Name
              </th>

              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">
                <FilterSelect
                  label="State"
                  value={stateFilter}
                  options={uniqueStates}
                  onChange={setStateFilter}
                />
              </th>

              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">
                Mobile
              </th>

              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">
                <FilterSelect
                  label="Joined By"
                  value={joinedByFilter}
                  options={uniqueJoinedBy}
                  onChange={setJoinedByFilter}
                />
              </th>

              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">
                <FilterSelect
                  label="Volunteer"
                  value={volunteerFilter}
                  options={uniqueVolunteers.map((vol) => vol)}
                  onChange={setVolunteerFilter}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredMembers.map((member) => (
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
