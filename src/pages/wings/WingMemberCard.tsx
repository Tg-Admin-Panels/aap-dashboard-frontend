
interface WingMemberCardProps {
  name: string;
  image: string;
  post: string;
  phone: string;
}

const WingMemberCard: React.FC<WingMemberCardProps> = ({
  name,
  image,
  post,
  phone,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 w-[200px]">
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
