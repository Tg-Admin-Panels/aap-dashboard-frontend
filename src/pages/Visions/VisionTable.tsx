import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllVisions, deleteVision } from '../../features/visions/visionsApi';
import { Link } from 'react-router-dom';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';
import { Vision } from '../../features/visions/visions.slice';
import UpdateVisionModal from './UpdateVisionModal';

export default function VisionTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { visions, loading, error } = useSelector((state: RootState) => state.visions);
  const [selectedVision, setSelectedVision] = useState<Vision | null>(null);

  useEffect(() => {
    dispatch(getAllVisions());
  }, [dispatch]);

  const handleDelete = (visionId: string) => {
    if (window.confirm('Are you sure you want to delete this vision?')) {
      dispatch(deleteVision(visionId));
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <SpinnerOverlay loading={loading} />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#101f3c" }}>
              {["Title", "Points", "Actions"].map((header) => (
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
            {visions?.map((vision: Vision) => (
              <tr key={vision._id}>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {vision.title}
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {vision.points?.length}
                </td>
                <td className="px-5 py-4 text-start flex items-center gap-2">
                  <Link to={`/visions/${vision._id}/details`}>
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
                      <path d="M1 2H6V4H3V13H12V10H14V15H1V2Z" fill="#465FFF" />
                    </svg>
                  </Link>
                  <button onClick={() => setSelectedVision(vision)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M11 2H9V4H7V6H5V8H3V10H2V14H3V16H5V18H7V20H9V22H11V20H13V18H15V16H17V14H18V10H17V8H15V6H13V4H11V2Z"
                        fill="#465FFF"
                      />
                      <path
                        d="M11 4H13V6H15V8H17V10H18V14H17V16H15V18H13V20H11V22H9V20H7V18H5V16H3V14H2V10H3V8H5V6H7V4H9V2H11V4Z"
                        fill="#465FFF"
                      />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(vision._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M10 2H14V4H10V2Z"
                        fill="#FF4646"
                      />
                      <path
                        d="M4 6H20V8H4V6Z"
                        fill="#FF4646"
                      />
                      <path
                        d="M6 10H8V20H6V10Z"
                        fill="#FF4646"
                      />
                      <path
                        d="M10 10H14V20H10V10Z"
                        fill="#FF4646"
                      />
                      <path
                        d="M16 10H18V20H16V10Z"
                        fill="#FF4646"
                      />
                      <path
                        d="M4 22H20V24H4V22Z"
                        fill="#FF4646"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedVision && (
        <UpdateVisionModal
          vision={selectedVision}
          onClose={() => setSelectedVision(null)}
        />
      )}
    </div>
  );
}
