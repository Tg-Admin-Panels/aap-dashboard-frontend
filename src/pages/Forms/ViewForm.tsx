import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllForms, deleteForm } from '../../features/forms/formsApi';
import { RootState, AppDispatch } from '../../features/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { FaTrash } from 'react-icons/fa';
import Modal from '../../components/modal/Modal';
import SpinnerOverlay from '../../components/ui/SpinnerOverlay';

export default function ViewForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { formsList, loading, error } = useSelector((state: RootState) => state.forms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [keepSubmissions, setKeepSubmissions] = useState(false);

  useEffect(() => {
    dispatch(fetchAllForms());
  }, [dispatch]);

  const openDeleteModal = (formId: string) => {
    setSelectedFormId(formId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedFormId(null);
    setIsModalOpen(false);
    setKeepSubmissions(false);
  };

  const handleDelete = () => {
    if (selectedFormId) {
      dispatch(deleteForm({ formId: selectedFormId, keepSubmissions }));
      closeDeleteModal();
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <SpinnerOverlay loading={loading} />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Form Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {formsList.map((form: any) => (
                <TableRow key={form._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {form.formName}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openDeleteModal(form._id)}
                    >
                      <FaTrash className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          title="Confirm Deletion"
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          confirmBtn="Delete"
          cancelBtn="Cancel"
        >
          <div className="p-4">
            <p>Are you sure you want to delete this form?</p>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="keepSubmissions"
                checked={keepSubmissions}
                onChange={(e) => setKeepSubmissions(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="keepSubmissions" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Keep the associated data
              </label>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
