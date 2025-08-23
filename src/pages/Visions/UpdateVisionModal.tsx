import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../features/store';
import { updateVision } from '../../features/visions/visionsApi';
import { Vision } from '../../features/visions/visions.slice';

interface UpdateVisionModalProps {
  vision: Vision;
  onClose: () => void;
}

export default function UpdateVisionModal({ vision, onClose }: UpdateVisionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(vision.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateVision({ visionId: vision._id, visionData: { title } }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Update Vision</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
