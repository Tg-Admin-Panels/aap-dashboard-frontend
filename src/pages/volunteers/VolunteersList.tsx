import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getAllVolunteers } from "../../features/volunteers/volunteersApi";
import { updateVolunteerStatus } from "../../features/volunteers/volunteersApi";
import { Link } from "react-router";

export default function VolunteerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { volunteers, loading, error } = useSelector(
    (state: RootState) => state.volunteers
  );

  useEffect(() => {
    dispatch(getAllVolunteers());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              {[
                "ID",
                "Name",
                "Gender",
                "Mobile",
                "Age",
                "Zone",
                "District",
                "Block",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 font-medium text-gray-500 text-xs uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {volunteers?.map((volunteer) => (
              <tr key={volunteer._id}>
                <td className="px-5 py-4 text-sm text-gray-700 hover:underline dark:text-gray-300">
                  <Link to={`/volunteers/${volunteer?._id}`}>
                    {volunteer._id}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm hover:underline  text-gray-700 dark:text-gray-300">
                  <Link to={`/volunteers/${volunteer?._id}`}>
                    {volunteer.fullName}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {volunteer.gender}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {volunteer.mobileNumber}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {volunteer.age}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {volunteer.zone}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {volunteer.district}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {volunteer.block}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <select
                    value={volunteer.status || "active"}
                    onChange={(e) =>
                      dispatch(
                        updateVolunteerStatus({
                          id: volunteer._id,
                          status: e.target.value as "active" | "blocked",
                        })
                      )
                    }
                    className="border p-1 rounded bg-white dark:bg-gray-800"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
