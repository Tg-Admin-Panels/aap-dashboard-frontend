import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
} from "../../features/volunteers/volunteersApi";
import { Link, useSearchParams } from "react-router";
import FilterSelect from "../../components/inputs/FilterSelect";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { FaTrash } from "react-icons/fa";

// ✅ Reusable Confirmation Dialog
const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, description, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-80">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90%] max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VolunteerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const { volunteers, loading } = useSelector(
    (state: RootState) => state.volunteers
  );

  // Filters
  const [genderFilter, setGenderFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Confirmation Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    dispatch(getAllVolunteers(search));
  }, [dispatch, searchParams]);

  // Unique filter values
  const genders = [...new Set(volunteers.map((v) => v.gender))];
  const zones = [...new Set(volunteers.map((v) => v.zone))];
  const districts = [...new Set(volunteers.map((v) => v.district))];
  const blocks = [...new Set(volunteers.map((v) => v.block))];
  const statuses = ["active", "blocked"];

  // Filtered Volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    return (
      (genderFilter === "" || v.gender === genderFilter) &&
      (zoneFilter === "" || v.zone === zoneFilter) &&
      (districtFilter === "" || v.district === districtFilter) &&
      (blockFilter === "" || v.block === blockFilter) &&
      (statusFilter === "" || v.status === statusFilter)
    );
  });

  const handleDeleteClick = (id: string) => {
    setSelectedVolunteerId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVolunteerId) {
      dispatch(deleteVolunteer(selectedVolunteerId));
    }
    setIsDialogOpen(false);
    setSelectedVolunteerId(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <SpinnerOverlay loading={loading} />

      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#101f3c" }}>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">Name</th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                <FilterSelect
                  label="Gender"
                  value={genderFilter}
                  options={genders}
                  onChange={setGenderFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Mobile
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Age
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                <FilterSelect
                  label="Zone"
                  value={zoneFilter}
                  options={zones}
                  onChange={setZoneFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                <FilterSelect
                  label="District"
                  value={districtFilter}
                  options={districts}
                  onChange={setDistrictFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                <FilterSelect
                  label="Block"
                  value={blockFilter}
                  options={blocks}
                  onChange={setBlockFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  options={statuses}
                  onChange={setStatusFilter}
                />
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredVolunteers.map((volunteer) => (
              <tr key={volunteer._id}>
                <td className="px-5 py-4 text-sm text-gray-700 hover:underline dark:text-gray-300">
                  <Link to={`/volunteers/${volunteer._id}`}>{volunteer.fullName}</Link>
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
                    className="border p-1 rounded bg-white text-gray-800 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    title="Delete Volunteer"
                    onClick={() => handleDeleteClick(volunteer._id)}
                    className="text-red-600 hover:text-red-800 hover:scale-110 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Delete Volunteer?"
        description="Are you sure you want to delete this volunteer? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
