import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllVolunteers,
  updateVolunteerStatus,
} from "../../features/volunteers/volunteersApi";
import { Link } from "react-router";
import FilterSelect from "../../components/inputs/FilterSelect";

export default function VolunteerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { volunteers, loading, error } = useSelector(
    (state: RootState) => state.volunteers
  );

  const [genderFilter, setGenderFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(getAllVolunteers());
  }, [dispatch]);

  // Unique values for filters
  const genders = [...new Set(volunteers.map((v) => v.gender))];
  const zones = [...new Set(volunteers.map((v) => v.zone))];
  const districts = [...new Set(volunteers.map((v) => v.district))];
  const blocks = [...new Set(volunteers.map((v) => v.block))];
  const statuses = ["active", "blocked"];

  // Filtered data
  const filteredVolunteers = volunteers.filter((v) => {
    return (
      (genderFilter === "" || v.gender === genderFilter) &&
      (zoneFilter === "" || v.zone === zoneFilter) &&
      (districtFilter === "" || v.district === districtFilter) &&
      (blockFilter === "" || v.block === blockFilter) &&
      (statusFilter === "" || v.status === statusFilter)
    );
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                ID
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                Name
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                <FilterSelect
                  label="Gender"
                  value={genderFilter}
                  options={genders}
                  onChange={setGenderFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                Mobile
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                Age
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                <FilterSelect
                  label="Zone"
                  value={zoneFilter}
                  options={zones}
                  onChange={setZoneFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                <FilterSelect
                  label="District"
                  value={districtFilter}
                  options={districts}
                  onChange={setDistrictFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                <FilterSelect
                  label="Block"
                  value={blockFilter}
                  options={blocks}
                  onChange={setBlockFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-gray-500 font-medium">
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  options={statuses}
                  onChange={setStatusFilter}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredVolunteers.map((volunteer) => (
              <tr key={volunteer._id}>
                <td className="px-5 py-4 text-sm text-gray-700 hover:underline dark:text-gray-300">
                  <Link to={`/volunteers/${volunteer._id}`}>
                    {volunteer._id}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 hover:underline dark:text-gray-300">
                  <Link to={`/volunteers/${volunteer._id}`}>
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
