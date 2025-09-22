import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { useParams } from "react-router-dom";
import { getAllBooths, updateBooth, deleteBooth } from "../../features/locations/locationsApi";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";
import useGoBack from "../../hooks/useGoBack";

interface LocationItem {
  _id: string;
  name: string;
  code: string;
}

export default function BoothList() {
  const dispatch = useDispatch<AppDispatch>();
  const { assemblyId } = useParams<{ assemblyId: string }>();
  const goBack = useGoBack();
  const { booths, loading, error } = useSelector((state: RootState) => state.locations);
  const [page, setPage] = useState(1);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<LocationItem | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "" });

  useEffect(() => {
    if (assemblyId) {
      dispatch(getAllBooths({ parentId: assemblyId, page: 1 }));
    }
  }, [dispatch, assemblyId]);

  const handleLoadMore = () => {
    if (assemblyId) {
      const newPage = page + 1;
      setPage(newPage);
      dispatch(getAllBooths({ parentId: assemblyId, page: newPage }));
    }
  };

  const handleEditClick = (booth: LocationItem) => {
    setSelectedBooth(booth);
    setFormData({ name: booth.name, code: booth.code });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (booth: LocationItem) => {
    setSelectedBooth(booth);
    setDeleteModalOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedBooth) {
      await dispatch(updateBooth({ id: selectedBooth._id, data: formData }));
      setEditModalOpen(false);
      setSelectedBooth(null);
    }
  };

  const handleDelete = async () => {
    if (selectedBooth) {
      await dispatch(deleteBooth(selectedBooth._id));
      setDeleteModalOpen(false);
      setSelectedBooth(null);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
      <SpinnerOverlay loading={loading && booths.items.length === 0} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Booths
        </h2>
        <button onClick={goBack} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
          Back to Assemblies
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-left pl-3" isHeader>Name</TableCell>
            <TableCell isHeader>Code</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {booths.items.map((booth) => (
            <TableRow key={booth._id}>
              <TableCell className="pl-3">{booth.name}</TableCell>
              <TableCell className="text-center">{booth.code}</TableCell>
              <TableCell>
                <div className="flex space-x-2 justify-center items-center">
                  <button onClick={(e) => { e.stopPropagation(); handleEditClick(booth); }} className="p-1 text-blue-500 hover:text-blue-700">
                    <PencilIcon />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(booth); }} className="p-1 text-red-500 hover:text-red-700">
                    <TrashBinIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {booths.hasNextPage && (
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
          <h2 className="text-lg font-semibold mb-4">Edit Booth</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Booth Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="code">Booth Code</Label>
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
          <p>Are you sure you want to delete {selectedBooth?.name}?</p>
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