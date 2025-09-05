import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllVisions, deleteVision } from '../../features/visions/visionsApi';
import { Link } from 'react-router-dom';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';
import { Vision } from '../../features/visions/visions.slice';
import UpdateVisionModal from './UpdateVisionModal';
import { PencilIcon, TrashBinIcon } from '../../icons';
import { FaExternalLinkAlt } from 'react-icons/fa';

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
                    <FaExternalLinkAlt className='cursor-pointer' />
                  </Link>
                  <button onClick={() => setSelectedVision(vision)}>
                    <PencilIcon />
                  </button>
                  <button onClick={() => handleDelete(vision._id)}>
                    <TrashBinIcon />
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
