import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

interface Vision {
  _id: string;
  title: string;
  points: string[];
}

interface AddVisionPointCardProps {
  vision: Vision | null;
  title: string | null;
  onSubmit: (point: string) => void;
}

const AddVisionPointCard: React.FC<AddVisionPointCardProps> = ({ vision, title, onSubmit }) => {
  const { loading } = useSelector((state: RootState) => state.visions);

  const formik = useFormik({
    initialValues: {
      point: "",
    },
    validationSchema: Yup.object({
      point: Yup.string().required("Point is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values.point);
      formik.resetForm();
    },
  });

  return (
    <div className="bg-white dark:bg-[#101828] w-full p-6 rounded-2xl  dark:text-white space-y-5">
      <h2 className="text-xl font-semibold">
        {title}
        <span className="text-blue-400 font-bold">{vision?.title}</span>
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Point</label>
          <input
            type="text"
            name="point"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.point}
            className="w-full px-3 py-2 dark:bg-gray-800 border border-gray-700 rounded-md dark:text-white"
          />
          {formik.touched.point && formik.errors.point && (
            <p className="text-red-400 text-sm">{formik.errors.point}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition disabled:opacity-50"
            disabled={!formik.isValid || formik.isSubmitting || loading}
          >
            {loading ? "Adding..." : "Add Point"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVisionPointCard;
