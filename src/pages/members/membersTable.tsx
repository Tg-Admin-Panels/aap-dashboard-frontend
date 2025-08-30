import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllMembers,
  getMembersByVolunteer,
  deleteMember,
} from "../../features/members/membersApi";
import { resetMembers } from "../../features/members/members.slice";
import FilterSelect from "../../components/inputs/FilterSelect";
import SearchBar from "../../components/inputs/SearchBar";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import Alert from "../../components/common/Alert";

export default function MemberTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading, error } = useSelector(
    (state: RootState) => state.members
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [stateFilter, setStateFilter] = useState("");
  const [joinedByFilter, setJoinedByFilter] = useState("");

  useEffect(() => {
    if (user?.role === "volunteer" && user.volunteer) {
      dispatch(getMembersByVolunteer({ volunteerId: user.volunteer, search: "" }));
    } else if (user?.role === "admin") {
      dispatch(getAllMembers());
    }

    return () => {
      dispatch(resetMembers());
    };
  }, [dispatch, user]);

  const uniqueStates = [...new Set(members.map((m) => m.state))];
  const uniqueJoinedBy = [...new Set(members.map((m) => m.joinedBy))];

  const filteredMembers = members.filter((member) => {
    return (
      (stateFilter === "" || member.state === stateFilter) &&
      (joinedByFilter === "" || member.joinedBy === joinedByFilter)
    );
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteMember(id));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <SpinnerOverlay loading={loading} />
      <div className="flex justify-between items-center p-4">
        <SearchBar
          onSearch={(query) => {
            if (user?.role === "admin") dispatch(getAllMembers(query));
            else if (user?.role === "volunteer" && user.volunteer)
              dispatch(getMembersByVolunteer({ volunteerId: user.volunteer, search: query }));
          }}
        />
        {(user?.role === "admin" || user?.role === "volunteer") && (
          <Link to="/members/create">
            <button className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Add Member
            </button>
          </Link>
        )}
      </div>

      {error && <Alert message={error} type="error" />}

      {!loading && !error && filteredMembers.length === 0 && (
        <div className="text-center p-4">
          <p>No members found.</p>
        </div>
      )}

      {!error && filteredMembers.length > 0 && (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead style={{ backgroundColor: "#101f3c" }}>
              <tr>
                <th className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider">
                  <FilterSelect label="State" value={stateFilter} options={uniqueStates} onChange={setStateFilter} />
                </th>
                <th className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider">Mobile</th>
                <th className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider">
                  <FilterSelect label="Joined By" value={joinedByFilter} options={uniqueJoinedBy} onChange={setJoinedByFilter} />
                </th>
                <th className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider">Volunteer ID</th>
                <th className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredMembers.map((member) => (
                <tr key={member._id}>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{member.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{member.state}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{member.mobileNumber}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">{member.joinedBy}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {member.volunteerId ? member.volunteerId.fullName : "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-4">
                      <Link to={`/members/update/${member._id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                      <button onClick={() => handleDelete(member._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      <Link to={`/members/detail/${member._id}`} className="text-green-600 hover:text-green-900">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
