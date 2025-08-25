import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getVisionDetails, addPointToVision, removePointFromVision } from "../../features/visions/visionsApi";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import Modal from "../../components/modal/Modal";
import { setShowAddPointModal } from "../../features/visions/visions.slice";
import AddVisionPointCard from "./AddVisionPointCard";

export default function VisionDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedVision, loading, showAddPointModal } = useSelector(
    (state: RootState) => state.visions
  );

  useEffect(() => {
    dispatch(getVisionDetails(id!));
  }, [id, dispatch]);

  const handleAddPoint = (point: string) => {
    dispatch(addPointToVision({ visionId: id!, point }));
  };

  const handleRemovePoint = (point: string) => {
    dispatch(removePointFromVision({ visionId: id!, point }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SpinnerOverlay loading={loading} />
      {selectedVision && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {selectedVision.title}
            </h2>
            <button
              onClick={() => dispatch(setShowAddPointModal(true))}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
            >
              + Add Point
            </button>
          </div>

          {selectedVision.image && (
            <img
              src={selectedVision.image}
              alt={selectedVision.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Points</h3>
            <ul className="list-disc list-inside space-y-2">
              {selectedVision.points?.map((point, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300 flex justify-between items-center">
                  <span>{point}</span>
                  <button
                    onClick={() => handleRemovePoint(point)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {showAddPointModal && (
        <Modal
          onCancel={() => {
            dispatch(setShowAddPointModal(false));
          }}
        >
          <AddVisionPointCard
            vision={selectedVision}
            title="Add Point"
            onSubmit={handleAddPoint}
          />
        </Modal>
      )}
    </div>
  );
}
