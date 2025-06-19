// src/pages/VolunteerDetailsPage.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getMembersByVolunteer } from "../../features/members/membersApi";
import { useParams } from "react-router-dom";
import { getVolunteerById } from "../../features/volunteers/volunteersApi";


export default function VolunteerDetailsPage() {
  const { volunteerId } = useParams<{ volunteerId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { members, loading, error } = useSelector(
    (state: RootState) => state.volunteerMembers
  );
  const { selectedVolunteer: volunteer } = useSelector(
    (state: RootState) => state.volunteers
  );

  useEffect(() => {
    if (volunteerId) {
      dispatch(getVolunteerById(volunteerId));
      dispatch(getMembersByVolunteer({ volunteerId, search: "" }));
    }
  }, [dispatch, volunteerId]);

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Volunteer Info */}
      {volunteer && (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Volunteer Details
          </h2>
          <div className="w-full flex flex-col justify-center items-center gap-6">
            <img
              src={volunteer.profilePicture}
              alt={volunteer.fullName}
              className="w-36 h-36 rounded-full object-cover  border"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4 text-[17px] text-gray-800 dark:text-gray-200 w-full">
              <p>
                {/* <FaUser className="inline mr-2" />  */}
                <strong>Name:</strong>{" "}
                {volunteer.fullName}
              </p>
              <p>
                {/* <FaPhone className="inline mr-2" />  */}
                <strong>Mobile:</strong>{" "}
                {volunteer.mobileNumber}
              </p>
              <p>
                {/* <FaVenusMars className="inline mr-2" />  */}
                <strong>Gender:</strong>{" "}
                {volunteer.gender}
              </p>
              <p>
                {/* <FaBirthdayCake className="inline mr-2" />  */}
                <strong>Age:</strong>{" "}
                {volunteer.age}
              </p>
              <p>
                {/* <FaMapMarkerAlt className="inline mr-2" />{" "} */}
                <strong>Zone:</strong> {volunteer.zone}
              </p>
              <p>
                {/* <FaBuilding className="inline mr-2" />{" "} */}
                <strong>District:</strong> {volunteer.district}
              </p>
              <p>
                {/* <FaBuilding className="inline mr-2" />  */}
                <strong>Block:</strong>{" "}
                {volunteer.block}
              </p>
              <p>
                {/* <FaHashtag className="inline mr-2" />  */}
                <strong>Ward No:</strong>{" "}
                {volunteer.wardNumber}
              </p>
              <p>
                {/* <FaHashtag className="inline mr-2" />  */}
                <strong>Booth No:</strong>{" "}
                {volunteer.boothNumber}
              </p>
              <p>
                {/* <FaCheck className="inline mr-2" />  */}
                <strong>Status:</strong>{" "}
                {volunteer.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="p-6 rounded-lg border border-gray-200 shadow bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Members Joined by This Volunteer
        </h2>

        {members.length === 0 ? (
          <p className="text-gray-500">No members found for this volunteer.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse text-[16px]">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300">
                  {["Name", "State", "Mobile", "Joined By"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member) => (
                  <tr key={member._id}>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                      {member.name}
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                      {member.state}
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                      {member.mobileNumber}
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200 capitalize">
                      {member.joinedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
