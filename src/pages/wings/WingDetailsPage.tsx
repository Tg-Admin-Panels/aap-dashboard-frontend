import { useParams } from "react-router-dom";
import { useEffect } from "react";
import WingMemberCard from "./WingMemberCard";
import { getWingMembers } from "../../features/wings/wingsApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";

export default function WingDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedWing, error, loading } = useSelector(
    (state: RootState) => state.wings
  );

  useEffect(() => {
    dispatch(getWingMembers(id!));
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-600 dark:text-gray-300">
        Loading...
      </p>
    );
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Wing Leader Section */}
      {selectedWing?.leader && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
            Wing Leader
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <img
              src={selectedWing.leader.image}
              alt={selectedWing.leader.name}
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
            />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {selectedWing.leader.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {selectedWing.leader.post}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedWing.leader.phone}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Member Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Wing Members
        </h2>
        <button
          onClick={() => console.log("Open Add Member Modal")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
        >
          + Add Member
        </button>
      </div>

      {/* Members Grid */}
      {selectedWing?.members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {selectedWing?.members.map((member) => (
            <WingMemberCard
              key={member._id}
              name={member.name}
              image={member.image}
              post={member.post}
              phone={member.phone}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No members found in this wing.
        </p>
      )}
    </div>
  );
}
