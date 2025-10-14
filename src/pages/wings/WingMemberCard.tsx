import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../features/store";
import { deleteWingMember } from "../../features/wings/wingsApi";

// ✅ Props Interface
interface WingMemberCardProps {
  _id: string;
  name: string;
  image: string;
  post: string;
  phone: string;
  onEdit?: (id: string) => void;
}

// ✅ Reusable Confirmation Dialog Component
const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, description, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-80">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90%] max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {description}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Card Component
const WingMemberCard: React.FC<WingMemberCardProps> = ({
  _id,
  name,
  image,
  post,
  phone,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteWingMember(_id));
    setIsConfirmOpen(false);
  };

  return (
    <div className="relative group bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 w-[200px] transition-all duration-300">
      {/* Edit Button */}
      <button
        onClick={() => onEdit?.(_id)}
        title="Edit Member"
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 
                   bg-blue-600 hover:bg-blue-700 text-white 
                   p-2 rounded-full transition duration-300 ease-in-out z-10"
      >
        <FaPen className="text-sm" />
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        title="Delete Member"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                   bg-red-600 hover:bg-red-700 text-white 
                   p-2 rounded-full transition duration-300 ease-in-out z-10"
      >
        <FaTrash className="text-sm" />
      </button>

      {/* Member Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-md"
      />

      {/* Member Info */}
      <h3 className="text-lg font-semibold mt-2 text-center text-gray-800 dark:text-white">
        {name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
        {post}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {phone}
      </p>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Wing Member?"
        description="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default WingMemberCard;
