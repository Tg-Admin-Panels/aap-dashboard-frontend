import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { useNavigate } from "react-router-dom";
import { getAllStates, updateState, deleteState } from "../../features/locations/locationsApi";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

interface LocationItem {
  _id: string;
  name: string;
  code: string;
}

export default function StateList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { states, loading, error } = useSelector((state: RootState) => state.locations);
  const [page, setPage] = useState(1);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<LocationItem | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "" });

  useEffect(() => {
    dispatch(getAllStates({ page: 1 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    dispatch(getAllStates({ page: newPage }));
  };

  const handleEditClick = (state: LocationItem) => {
    setSelectedState(state);
    setFormData({ name: state.name, code: state.code });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (state: LocationItem) => {
    setSelectedState(state);
    setDeleteModalOpen(true);
  };

  const handleRowClick = (state: LocationItem) => {
    navigate(`/locations/states/${state._id}/districts`);
  };

  const handleUpdate = async () => {
    if (selectedState) {
      await dispatch(updateState({ id: selectedState._id, data: formData }));
      setEditModalOpen(false);
      setSelectedState(null);
    }
  };

  const handleDelete = async () => {
    if (selectedState) {
      await dispatch(deleteState(selectedState._id));
      setDeleteModalOpen(false);
      setSelectedState(null);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading && states.items.length === 0} />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        States
      </h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Name</TableCell>
            <TableCell isHeader>Code</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {states.items.map((state) => (
            <TableRow key={state._id}>
              <TableCell><span className="hover:underline hover:cursor-pointer" onClick={() => handleRowClick(state)} >{state.name}</span></TableCell>
              <TableCell>{state.code}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEditClick(state); }} className="p-1 text-blue-500 hover:text-blue-700">
                    <PencilIcon />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(state); }} className="p-1 text-red-500 hover:text-red-700">
                    <TrashBinIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {states.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={handleLoadMore} 
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      <Modal className="max-w-3xl" isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Edit State</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">State Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="code">State Code</Label>
              <Input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal className="max-w-3xl" isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete {selectedState?.name}?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}