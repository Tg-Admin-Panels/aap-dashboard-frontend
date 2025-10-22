import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllBoothTeamMembers,
  deleteBoothTeamMember,
} from "../../features/booth-team/boothTeamApi";
import {
  getAllStates,
  getAllDistricts,
  getAllLegislativeAssemblies,
  getAllBooths,
} from "../../features/locations/locationsApi";
import {
  clearDistricts,
  clearLegislativeAssemblies,
  clearBooths,
} from "../../features/locations/locations.slice";
import { Link } from "react-router-dom";
import Select from "react-select";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { TrashBinIcon } from "../../icons";

export default function BoothTeamList() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading, currentPage, totalPages, totalMembers } = useSelector(
    (state: RootState) => state.boothTeam
  );
  const { states, districts, legislativeAssemblies, booths } = useSelector(
    (state: RootState) => state.locations
  );

  // Filters now store both value & label
  const [selectedState, setSelectedState] = useState<{ value: string; label: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ value: string; label: string } | null>(null);
  const [selectedLegislativeAssembly, setSelectedLegislativeAssembly] =
    useState<{ value: string; label: string } | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<{ value: string; label: string } | null>(null);

  const [postFilter, setPostFilter] = useState("");
  const [padnaamFilter, setPadnaamFilter] = useState("");
  const [page, setPage] = useState(1);
  const membersPerPage = 10;

  // Fetch states on mount
  useEffect(() => {
    dispatch(getAllStates({}));
  }, [dispatch]);

  // Dependent dropdowns
  useEffect(() => {
    if (selectedState) {
      dispatch(getAllDistricts({ parentId: selectedState.value }));
    } else {
      dispatch(clearDistricts());
    }
  }, [dispatch, selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(getAllLegislativeAssemblies({ parentId: selectedDistrict.value }));
    } else {
      dispatch(clearLegislativeAssemblies());
    }
  }, [dispatch, selectedDistrict]);

  useEffect(() => {
    if (selectedLegislativeAssembly) {
      dispatch(getAllBooths({ parentId: selectedLegislativeAssembly.value }));
    } else {
      dispatch(clearBooths());
    }
  }, [dispatch, selectedLegislativeAssembly]);

  // Fetch booth team members whenever filters change
  useEffect(() => {
    dispatch(
      getAllBoothTeamMembers({
        // ✅ Send labels (names) to API, not IDs
        state: selectedState?.label,
        district: selectedDistrict?.label,
        legislativeAssembly: selectedLegislativeAssembly?.label,
        boothName: selectedBooth?.label,
        post: postFilter,
        padnaam: padnaamFilter,
        page,
        limit: membersPerPage,
      })
    );
  }, [
    dispatch,
    selectedState,
    selectedDistrict,
    selectedLegislativeAssembly,
    selectedBooth,
    postFilter,
    padnaamFilter,
    page,
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteBoothTeamMember(id));
    }
  };

  // Select styles
  const customStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: "transparent",
      borderColor: "#d1d5db",
      minHeight: "44px",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      color: "#1f2937",
    }),
    input: (baseStyles: any) => ({
      ...baseStyles,
      color: "#1f2937",
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      color: "#9ca3af",
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#e0e7ff"
          : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:active": { backgroundColor: "#2563eb" },
    }),
  };

  // Options
  const stateOptions = states.items.map((s) => ({ value: s._id, label: s.name }));
  const districtOptions = districts.items.map((d) => ({ value: d._id, label: d.name }));
  const assemblyOptions = legislativeAssemblies.items.map((a) => ({
    value: a._id,
    label: a.name,
  }));
  const boothOptions = booths.items.map((b) => ({ value: b._id, label: b.name }));

  const postOptions = [
    { value: "", label: "Select Post" },
    { value: "Prabhari", label: "Prabhari" },
    { value: "Adhyaksh", label: "Adhyaksh" },
  ];

  const padnaamOptions = Array.from(new Set(members.map((m) => m.padnaam))).map((p) => ({
    value: p,
    label: p,
  }));

  return (
    <div className="flex gap-6 bg-gray-100 min-h-screen p-6">
      <SpinnerOverlay loading={loading} />

      {/* LEFT SIDEBAR */}
      <div className="w-1/5 bg-white rounded-lg shadow p-4 h-fit sticky top-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Filters</h2>

        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <Select
            options={stateOptions}
            value={selectedState}
            onChange={(opt) => setSelectedState(opt)}
            placeholder="Select State"
            styles={customStyles}
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={(opt) => setSelectedDistrict(opt)}
            placeholder="Select District"
            styles={customStyles}
            isClearable
            isDisabled={!selectedState}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Legislative Assembly</label>
          <Select
            options={assemblyOptions}
            value={selectedLegislativeAssembly}
            onChange={(opt) => setSelectedLegislativeAssembly(opt)}
            placeholder="Select Assembly"
            styles={customStyles}
            isClearable
            isDisabled={!selectedDistrict}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Booth</label>
          <Select
            options={boothOptions}
            value={selectedBooth}
            onChange={(opt) => setSelectedBooth(opt)}
            placeholder="Select Booth"
            styles={customStyles}
            isClearable
            isDisabled={!selectedLegislativeAssembly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Post</label>
          <Select
            options={postOptions}
            value={postOptions.find((o) => o.value === postFilter)}
            onChange={(opt) => setPostFilter(opt ? opt.value : "")}
            placeholder="Select Post"
            styles={customStyles}
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Padnaam</label>
          <Select
            options={padnaamOptions}
            value={padnaamOptions.find((o) => o.value === padnaamFilter)}
            onChange={(opt) => setPadnaamFilter(opt ? opt.value : "")}
            placeholder="Select Padnaam"
            styles={customStyles}
            isClearable
          />
        </div>
      </div>

      {/* RIGHT SIDE: Table */}
      <div className="w-4/5 bg-white rounded-lg shadow p-6 flex flex-col">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Booth Team Members
          </h2>
          <Link
            to="/booth-team/add"
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
          >
            + Add Booth Team Member
          </Link>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#101f3c" }}>
                {[
                  "Name",
                  "Phone",
                  "Email",
                  "State",
                  "District",
                  "Assembly",
                  "Booth",
                  "Post",
                  "Padnaam",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs uppercase text-white font-semibold tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member._id}>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.phone}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.state}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.district}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {member.legislativeAssembly}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {member.boothName}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.post}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{member.padnaam}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">
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
      </div>
    </div>
  );
}
