import React, { useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { faker } from "@faker-js/faker";
import { createWing, getAllWingMembers } from "../../features/wings/wingsApi";
import { toast } from "react-toastify";
import { setErrorToNull, setSelectedWingToNull } from "../../features/wings/wings.slice";
import AddLeaderCard from "./AddLeaderCard";
import Modal from "../../components/modal/Modal";

// const FORM_ENUM = ['tablet', 'capsule', 'syrup', 'injection', 'ointment'];
// const STRENGTH_ENUM = ['100 mg', '250 mg', '500 mg', '1 g', '2 g'];
// const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];
const STATUS_ENUM = ["active", "deactive"];

const initialValues = {
  name: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Wing name is required"),
});

const CreateWing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, wings, selectedWing } = useSelector(
    (state: RootState) => state.wings
  );

  const { members } = useSelector((state: RootState) => state.wingMembers);
  const [showAddLeaderModal, setShowAddLeaderModal] = React.useState(false);

  console.log("wings", wings);
  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    await dispatch(createWing(values));
    resetForm();
  };

  useEffect(() => {
    dispatch(getAllWingMembers());
  }, []);


  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    return () => {
      dispatch(setErrorToNull());
    };
  }, [error])

  useEffect(() => {
    if (selectedWing) {
      toast.success("Wing created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setShowAddLeaderModal(true);
    }

    // return () => {
    //   dispatch(setSelectedWingToNull());
    // };
  }, [selectedWing]);

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl dark:text-gray-300 font-bold mb-6">
          Create a new Wing
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          className="w-full flex justify-center"
        >
          {({ isSubmitting }) => (
            <Form className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(initialValues).map((key) => (
                  <div key={key} className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    {key === "manufactureDate" || key === "expiryDate" ? (
                      <Field
                        type="date"
                        name={key}
                        className="w-full p-2 border rounded"
                      />
                    ) : key === "prescriptionRequired" ? (
                      <label className="flex items-center cursor-pointer">
                        <Field name={key}>
                          {({ field }: FieldProps) => (
                            <div className="relative">
                              <input
                                {...field}
                                type="checkbox"
                                className="hidden"
                                id={key}
                              />
                              <span className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300">
                                <span
                                  className={`${
                                    field.value
                                      ? "translate-x-6"
                                      : "translate-x-0"
                                  } bg-white w-4 h-4 rounded-full shadow-md transform duration-300`}
                                />
                              </span>
                            </div>
                          )}
                        </Field>
                      </label>
                    ) : key === "status" ? (
                      <Field
                        as="select"
                        name={key}
                        className="w-full p-2 border rounded"
                      >
                        {STATUS_ENUM.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Field>
                    ) : (
                      <Field
                        name={key}
                        className="w-full p-2 border dark:text-gray-300 rounded"
                      />
                    )}
                    <ErrorMessage
                      name={key}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >
                {isSubmitting || loading ? "Submitting..." : "Create Wing"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {showAddLeaderModal && (
        <Modal
            onCancel={() => { setShowAddLeaderModal(false)  }}
            onConfirm={ () => { setShowAddLeaderModal(false) }}

        >
          <AddLeaderCard
            wing={selectedWing}
            existingMembers={members}
            onSubmit={(data) => console.log("Submitted Data:", data)}
          />
        </Modal> 
      )}
    </div>
  );
};

export default CreateWing;
