import React, { useState } from "react";

interface Member {
  _id: string;
  name: string;
  phone: string;
  image: string;
  role: string;
  post: string;
}

interface Wings {
  _id: string;
  name: string;
  leader: Member;
  members: Member[];
}

interface AddLeaderCardProps {
  wing: Wings | null;
  existingMembers: Member[];
  onSubmit: (data: {
    name?: string;
    phone?: string;
    image?: string;
    post?: string;
    memberId?: string;
  }) => void;
}

const AddLeaderCard: React.FC<AddLeaderCardProps> = ({
  wing,
  existingMembers,
  onSubmit,
}) => {
  console.log("wing in AddLeader Card",wing);
  const [useExisting, setUseExisting] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "",
    post: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (useExisting && selectedMemberId) {
      onSubmit({ memberId: selectedMemberId });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-[#101828] w-full p-6 rounded-2xl shadow-lg  max-w-md text-white space-y-5">
      <h2 className="text-xl font-semibold">
        Add Leader to Wing:{" "}
        <span className="text-blue-400 font-bold">{wing?.name}</span>
      </h2>

      <div className="space-y-2">
        <label className="text-sm">Choose Existing Member</label>
        <select
          className="px-3 py-2 w-full bg-gray-800 border border-gray-700 rounded-md text-white"
          value={selectedMemberId}
          onChange={(e) => {
            setSelectedMemberId(e.target.value);
            setUseExisting(!!e.target.value);
          }}
        >
          <option value="">-- Select Existing Member --</option>
          {existingMembers.map((member) => (
            <option key={member._id} value={member._id}>
              <img
                src={member?.image}
                alt={member?.name}
                className="w-8 h-8 rounded-full mr-2"
              />              
              {member?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!useExisting}
          onChange={() => {
            setUseExisting((prev) => !prev);
            setSelectedMemberId("");
          }}
          className="accent-blue-500"
        />
        <span>Create New Member Instead</span>
      </div>

      {!useExisting && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      image: reader.result as string, // base64 string
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            {formData.image && (
              <div className="relative mt-4 w-fit">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="max-h-40 rounded-md border border-gray-700"
                />
                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  type="button"
                >
                  ✖
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm">Post</label>
            <input
              type="text"
              name="post"
              value={formData.post}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
        </div>
      )}

      <div>
        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
        >
          Add Leader
        </button>
      </div>
    </div>
  );
};

export default AddLeaderCard;
