import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getMemberById, updateMember } from "../../features/members/membersApi";
import { useNavigate, useParams } from "react-router-dom";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import Alert from "../../components/common/Alert";

export default function UpdateMember() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { member, loading, error } = useSelector(
    (state: RootState) => state.members
  );

  const [formState, setFormState] = useState({
    name: "",
    state: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(getMemberById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (member) {
      setFormState({
        name: member.name,
        state: member.state,
        mobileNumber: member.mobileNumber,
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updateMember({ id, memberData: formState })).then(() => {
        navigate("/members");
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Update Member</h2>
      {error && <Alert message={error} type="error" />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            name="name"
            id="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter member's name"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            name="state"
            id="state"
            value={formState.state}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter state"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            name="mobileNumber"
            id="mobileNumber"
            value={formState.mobileNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter mobile number"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Member'}
          </button>
        </div>
      </form>
      <SpinnerOverlay loading={loading} />
    </div>
  );
}