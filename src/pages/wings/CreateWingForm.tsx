import React, { useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { addLeaderToWing, createWing } from "../../features/wings/wingsApi";
import { toast } from "react-toastify";
import {
  setErrorToNull,
  setSelectedWingToNull,
  setShowCreateLeaderModal,
} from "../../features/wings/wings.slice";
import AddWingMemberCard from "./AddWingMemberCard";
import Modal from "../../components/modal/Modal";

const initialValues = {
  name: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Wing name is required"),
});

const CreateWing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, wings, selectedWing, showCreateLeaderModal } =
    useSelector((state: RootState) => state.wings);

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    await dispatch(createWing(values));
    resetForm();
  };

  useEffect(() => {
    return () => {
      dispatch(setErrorToNull());
    };
  }, [error]);

  return (
    <div className="min-h-screen flex items-start justify-center py-16 px-4 dark:bg-gray-900">
      <div
        className="w-full max-w-xl border-2 rounded-xl shadow-lg p-8 bg-white dark:bg-gray-800"
        style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <h1 className="text-2xl font-bold text-center text-[#0c1b32] dark:text-white mb-6">
          Create a New Wing
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(initialValues).map((key) => (
                  <div key={key}>
                    <label className="block font-medium text-gray-800 dark:text-gray-200 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    <Field
                      name={key}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder={`Enter ${key}`}
                    />
                    <ErrorMessage
                      name={key}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                >
                  {isSubmitting || loading ? "Submitting..." : "Create Wing"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {showCreateLeaderModal && (
        <Modal onCancel={() => dispatch(setShowCreateLeaderModal(false))}>
          <AddWingMemberCard
            wing={selectedWing}
            memberType="leader"
            onSubmit={(data) =>
              dispatch(addLeaderToWing({ wingId: selectedWing?._id, data }))
            }
          />
        </Modal>
      )}
    </div>
  );
};

export default CreateWing;
