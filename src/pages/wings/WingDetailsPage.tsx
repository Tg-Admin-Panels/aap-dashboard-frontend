import { useParams } from "react-router-dom";
import { useEffect } from "react";
import WingMemberCard from "./WingMemberCard";
import {
  addMemberToWing,
  changeLeader,
  getWingMembers,
  updateMember,
} from "../../features/wings/wingsApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import {
  setSelectedMember,
  setShowChangeLeaderModal,
  setShowCreateMemberModal,
  setShowUpdateMemberModal,
} from "../../features/wings/wings.slice";
import AddWingMemberCard from "./AddWingMemberCard";
import Modal from "../../components/modal/Modal";
import ChangeWingLeaderCard from "./ChangeWingLeaderCard";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function WingDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedWing,

    loading,
    showCreateMemberModal,
    selectedMember,
    showUpdateMemberModal,
    showChangeLeaderModal,
  } = useSelector((state: RootState) => state.wings);

  useEffect(() => {
    dispatch(getWingMembers(id!));
  }, [id]);



  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Wing Leader Section */}
      <SpinnerOverlay loading={loading} />
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Wing Leader
          </h2>

          <div className="flex gap-3">
            {/* Update Leader (only if leader exists) */}
            {selectedWing?.leader && (
              <button
                onClick={() => {
                  dispatch(setSelectedMember(selectedWing.leader));
                  dispatch(setShowUpdateMemberModal(true));
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
              >
                Update Leader
              </button>
            )}

            {/* Change Leader (always available) */}
            <button
              onClick={() => {
                dispatch(setShowChangeLeaderModal(true));
              }}
              className="bg-white border-blue-600 border-2 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition-colors duration-200"
            >
              Change Leader
            </button>

          </div>
        </div>

        {/* Leader Card (if leader exists) */}
        {selectedWing?.leader ? (
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
        ) : (
          <p className="text-gray-600 dark:text-gray-300 italic">
            No leader assigned to this wing.
          </p>
        )}
      </section>

      {/* Member Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Wing Members
        </h2>
        <button
          onClick={() => dispatch(setShowCreateMemberModal(true))}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
        >
          + Add Member
        </button>
      </div>

      {/* Members Grid */}
      {selectedWing && selectedWing?.members?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

          {selectedWing?.members.map((member) => (
            <WingMemberCard
              _id={member._id}
              key={member._id}
              name={member.name}
              image={member.image}
              post={member.post}
              phone={member.phone}
              onEdit={(id) => {
                dispatch(
                  setSelectedMember(
                    selectedWing.members.find((member) => member._id === id)
                  )
                );
                dispatch(setShowUpdateMemberModal(true));
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No members found in this wing.
        </p>
      )}

      {/* Add Member Modal  */}
      {showCreateMemberModal && (
        <Modal
          onCancel={() => {
            dispatch(setShowCreateMemberModal(false));
          }}
        >
          <AddWingMemberCard
            wing={selectedWing}
            title="Add Member"
            onSubmit={(data) => dispatch(addMemberToWing({ wingId: id, data }))}
          />
        </Modal>
      )}

      {/* Update Member Modal  */}
      {showUpdateMemberModal && (
        <Modal
          onCancel={() => {
            dispatch(setShowUpdateMemberModal(false));
          }}
        >
          <AddWingMemberCard
            wing={selectedWing}
            title="Update Member"
            onSubmit={(data) =>
              dispatch(updateMember({ memberId: selectedMember?._id, data }))
            }
            initialValues={selectedMember}
          />
        </Modal>
      )}

      {showChangeLeaderModal && (
        <Modal
          onCancel={() => {
            dispatch(setShowChangeLeaderModal(false));
          }}
        >
          <ChangeWingLeaderCard
            wing={selectedWing}
            onSubmit={(data) =>
              dispatch(changeLeader({ wingId: id, data }))
            }
          />
        </Modal>
      )}
    </div>
  );
}
