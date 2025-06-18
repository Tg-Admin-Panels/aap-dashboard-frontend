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
    <div className="relative bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 w-[200px]">
      {/* Edit Button Top Right */}
      <button
        onClick={() => onEdit?.(_id)}
        title="Edit Member"
        className="rounded-full p-2 bg-[#00000045] hover:bg-[#00000080] absolute top-2 right-2 text-blue-600 hover:text-blue-800 text-sm"
      >
        <FaPen className="text-gray-300"/>
      </button>

      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-md"
      />
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
