// src/pages/VolunteerDetailsPage.tsx
import { useEffect, useMemo } from "react";
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

  // ✅ Calculate Age Dynamically from DOB
  const calculatedAge = useMemo(() => {
    if (!volunteer?.dateOfBirth) return null;
    const dob = new Date(volunteer.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }, [volunteer?.dateOfBirth]);

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Volunteer Info */}
      {volunteer && (
        <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Volunteer Details
          </h2>

          <div className="w-full flex flex-col justify-center items-center gap-6">
            {volunteer.profilePicture && (
              <img
                src={volunteer.profilePicture}
                alt={volunteer.fullName}
                className="w-36 h-36 rounded-full object-cover border"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 text-[17px] text-gray-800 dark:text-gray-200 w-full">
              <p><strong>Name:</strong> {volunteer.fullName}</p>
              <p><strong>Mobile:</strong> {volunteer.mobileNumber}</p>
              <p><strong>Gender:</strong> {volunteer.gender}</p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(volunteer.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>Age:</strong>{" "}
                {calculatedAge !== null ? `${calculatedAge} years` : "N/A"}
              </p>
              <p><strong>Zone:</strong> {volunteer.zone}</p>
              <p><strong>District:</strong> {volunteer.district}</p>
              <p><strong>Block:</strong> {volunteer.block}</p>

              {/* Rural-specific */}
              {volunteer.zone === "Rural" && (
                <>
                  <p><strong>Panchayat:</strong> {volunteer.panchayat}</p>
                  <p><strong>Village:</strong> {volunteer.villageName}</p>
                </>
              )}

              {/* Urban-specific */}
              {volunteer.zone === "Urban" && (
                <>
                  <p><strong>City:</strong> {volunteer.cityName}</p>
                  <p><strong>Street/Locality:</strong> {volunteer.streetOrLocality}</p>
                </>
              )}

              <p><strong>Ward No:</strong> {volunteer.wardNumber}</p>
              <p><strong>Booth No:</strong> {volunteer.boothNumber}</p>
              <p><strong>Pin Code:</strong> {volunteer.pinCode}</p>
              <p><strong>Post Office:</strong> {volunteer.postOffice}</p>
              <p><strong>Status:</strong> {volunteer.status}</p>

              {/* Hindi dropdown fields */}
              <p><strong>आप हमें क्यों जॉइन करना चाहते हैं?:</strong> {volunteer.whyYouWantToJoinUs}</p>
              <p><strong>आप कितना समय समर्पित कर सकते हैं?:</strong> {volunteer.howMuchTimeYouDedicate}</p>
              <p><strong>आप किस क्षेत्र में योगदान दे सकते हैं?:</strong> {volunteer.inWhichFieldYouCanContribute}</p>
              <p><strong>आप हमारी किस प्रकार मदद कर सकते हैं?:</strong> {volunteer.howCanYouHelpUs}</p>
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
