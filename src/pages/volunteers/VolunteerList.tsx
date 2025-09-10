import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllVolunteers } from '../../features/volunteers/volunteerSlice'; // Assuming this path and selector name

const VolunteerList: React.FC = () => {
  const volunteers = useSelector(selectAllVolunteers);

  // Filter out any "empty" or undefined volunteer entries
  const filteredVolunteers = volunteers.filter(volunteer => volunteer);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Volunteer List</h1>
      {filteredVolunteers.length === 0 ? (
        <p>No volunteers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Status</th>
                {/* Add more headers based on your volunteer data structure */}
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer: any) => ( // Using 'any' for now, will refine with actual type
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{volunteer.id}</td>
                  <td className="py-2 px-4 border-b">{volunteer.name}</td>
                  <td className="py-2 px-4 border-b">{volunteer.email}</td>
                  <td className="py-2 px-4 border-b">{volunteer.phone}</td>
                  <td className="py-2 px-4 border-b">{volunteer.status}</td>
                  {/* Add more cells based on your volunteer data structure */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;
