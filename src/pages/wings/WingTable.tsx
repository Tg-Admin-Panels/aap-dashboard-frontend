import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { deleteWing, getAllWings } from "../../features/wings/wingsApi";
import { Link } from "react-router-dom";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import { Wings } from "../../features/wings/wings.slice";
import { TrashBinIcon } from "../../icons";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-80">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WingTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { wings, loading, error } = useSelector((state: RootState) => state.wings);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWingId, setSelectedWingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllWings());
  }, [dispatch]);

  const handleDeleteClick = (wingId: string) => {
    setSelectedWingId(wingId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedWingId) {
      dispatch(deleteWing(selectedWingId));
    }
    setIsDialogOpen(false);
    setSelectedWingId(null);
  };

  if (error) return <p className="text-red-600 text-center py-4">Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <SpinnerOverlay loading={loading} />

      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#101f3c" }}>
              {["Name", "Leader", "Members", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {wings?.map((wing: Wings) => (
              <tr key={wing._id}>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {wing.name}
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <Link
                    to={`/wing/leader/${wing._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {wing.leader ? wing.leader.name : "NA"}
                  </Link>
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {wing.members?.length}
                </td>
                <td className="px-5 py-4 flex justify-center items-center gap-2 text-start">
                  <Link to={`/wings/${wing._id}/details`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M10 0L9 1L11.2929 3.29289L6.2929 8.29289L7.70711 9.70711L12.7071 4.7071L15 7L16 6V0H10Z"
                        fill="#465FFF"
                      />
                      <path
                        d="M1 2H6V4H3V13H12V10H14V15H1V2Z"
                        fill="#465FFF"
                      />
                    </svg>
                  </Link>
                  <TrashBinIcon
                    className="text-red-500 cursor-pointer hover:scale-110 transition"
                    onClick={() => handleDeleteClick(wing._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Delete Wing?"
        description="Are you sure you want to delete this wing? All associated members will be deleted with this wing."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
