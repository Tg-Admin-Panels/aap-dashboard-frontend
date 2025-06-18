import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllWings } from '../../features/wings/wingsApi';
import { Link } from 'react-router';

interface Member {
  _id: string;
  name: string;
  phone: string;
  image: string;
  role:string;
  post: string;
}

interface Wings {
  _id: string
  name: string;
  leader: Member;
  members: Member[];
}


export default function WingTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { wings, loading, error } = useSelector((state: RootState) => state.wings);
  console.log("Wings in WingList", wings)
  useEffect(() => {
    dispatch(getAllWings());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              {["Wing ID", "Name", "Leader", "Members"].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase"
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
                  {wing._id}
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {wing.name}
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {wing.leader?.name}
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  {wing.members?.length}
                </td>
                <td className="px-5 py-4 p-8 text-start text-gray-700 dark:text-gray-300 cursor-pointer">
                  <Link to={`/wings/${wing._id}/details`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}