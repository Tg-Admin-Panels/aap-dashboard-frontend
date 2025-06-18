import { FaPen } from "react-icons/fa";

interface WingMemberCardProps {
  _id: string;
  name: string;
  image: string;
  post: string;
  phone: string;
  onEdit?: (id: string) => void;
}

const WingMemberCard: React.FC<WingMemberCardProps> = ({
  _id,
  name,
  image,
  post,
  phone,
  onEdit,
}) => {
  return (
    <div
      className="relative group bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 w-[200px] transition-all duration-300"
    >
      {/* Edit Icon - background blue with hover effect */}
      <button
        onClick={() => onEdit?.(_id)}
        title="Edit Member"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                   bg-blue-600 hover:bg-blue-700 text-white 
                   p-2 rounded-full transition duration-300 ease-in-out z-10"
      >
        <FaPen className="text-sm" />
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
    </div>
  );
};

export default WingMemberCard;
