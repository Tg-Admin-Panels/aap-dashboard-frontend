import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllWings } from '../../features/wings/wingsApi';

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


export default function MedicineTable() {
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
                  {wing.members.length}
                </td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                    width="30px"
                    height="30px"
                    viewBox="0 0 32 32"
                    version="1.1"
                  >
                    <title>plus-circle</title>
                    <desc>Created with Sketch Beta.</desc>
                    <defs></defs>
                    <g
                      id="Page-1"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                      sketch:type="MSPage"
                    >
                      <g
                        id="Icon-Set"
                        sketch:type="MSLayerGroup"
                        transform="translate(-464.000000, -1087.000000)"
                        fill="#465FFF"
                      >
                        <path
                          d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z"
                          id="plus-circle"
                          sketch:type="MSShapeGroup"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}