import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllBoothTeamMembers,
  deleteBoothTeamMember,
} from "../../features/booth-team/boothTeamApi";
import { Link } from "react-router-dom";
import Select from "react-select"; // Import react-select
import SearchBar from "../../components/inputs/SearchBar";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { PlusIcon, TrashBinIcon } from "../../icons";

export default function BoothTeamList() {
  const dispatch = useDispatch<AppDispatch>();

  const { members, loading, currentPage, totalPages, totalMembers } = useSelector(
    (state: RootState) => state.boothTeam
  );

  const [boothNameFilter, setBoothNameFilter] = useState("");
  const [postFilter, setPostFilter] = useState("");
  const [padnaamFilter, setPadnaamFilter] = useState("");
  const [page, setPage] = useState(1);
  const membersPerPage = 10; // You can make this configurable if needed

  useEffect(() => {
    dispatch(getAllBoothTeamMembers({
      boothName: boothNameFilter,
      post: postFilter,
      padnaam: padnaamFilter,
      page: page,
      limit: membersPerPage
    }));
  }, [dispatch, boothNameFilter, postFilter, padnaamFilter, page, membersPerPage]);

  const uniqueBoothNames = Array.from(new Set(members.map((m) => m.boothName)));
  const boothNameOptions = [{ value: "", label: "Select Booth Name" }, ...uniqueBoothNames.map((name) => ({ value: name, label: name }))];

  const uniquePosts = Array.from(new Set(members.map((m) => m.post)));
  const postOptions = [{ value: "", label: "Select Post" }, ...uniquePosts.map((post) => ({ value: post, label: post }))];

  const uniquePadnaams = Array.from(new Set(members.map((m) => m.padnaam)));
  const padnaamOptions = [{ value: "", label: "Select Padnaam" }, ...uniquePadnaams.map((padnaam) => ({ value: padnaam, label: padnaam }))];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteBoothTeamMember(id));
    }
  };

  const customStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: 'transparent',
      borderColor: '#d1d5db', // gray-300
      minHeight: '44px', // h-11
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af', // gray-400
      },
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      color: '#1f2937', // gray-900
    }),
    input: (baseStyles: any) => ({
      ...baseStyles,
      color: '#1f2937', // gray-900
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      color: '#9ca3af', // gray-400
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e0e7ff' : 'white', // blue-500, indigo-100
      color: state.isSelected ? 'white' : '#1f2937', // white, gray-900
      '&:active': {
        backgroundColor: '#2563eb', // blue-600
      },
    }),
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <SpinnerOverlay loading={loading} />

      {/* Filter Section */}
      <div className="flex justify-between gap-4 p-5 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="w-2/3 flex items-center gap-4">
          <div className="w-full">
            <Select
              options={boothNameOptions}
              value={boothNameOptions.find(option => option.value === boothNameFilter)}
              onChange={(selectedOption) => setBoothNameFilter(selectedOption ? selectedOption.value : "")}
              placeholder="Filter by Booth Name"
              isClearable
              styles={customStyles}
            />
          </div>
          <div className="w-full">
            <Select
              options={postOptions}
              value={postOptions.find(option => option.value === postFilter)}
              onChange={(selectedOption) => setPostFilter(selectedOption ? selectedOption.value : "")}
              placeholder="Filter by Post"
              isClearable
              styles={customStyles}
            />
          </div>
          <div className="w-full">
            <Select
              options={padnaamOptions}
              value={padnaamOptions.find(option => option.value === padnaamFilter)}
              onChange={(selectedOption) => setPadnaamFilter(selectedOption ? selectedOption.value : "")}
              placeholder="Filter by Padnaam"
              isClearable
              styles={customStyles}
            />
          </div>
        </div>
        <Link to="/booth-team/add" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
          <PlusIcon className="w-5 h-5" />
          Add Booth Team Member
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#101f3c" }}>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Phone
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Booth Name
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Post
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Padnaam
              </th>
              <th className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {members.map((member) => (
              <tr key={member._id}>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.name}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.phone}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.email}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.boothName}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.post}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {member.padnaam}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashBinIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm sm:text-base">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages} ({totalMembers} members)
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}