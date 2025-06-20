import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

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
  title: string | null;
  initialValues?: {
    name: string;
    phone: string;
    image: string;
    post: string;
  } | null;
  onSubmit: (data: {
    name: string;
    phone: string;
    image: string;
    post: string;
  }) => void;
}

const AddWingMemberCard: React.FC<AddLeaderCardProps> = ({ wing, title, onSubmit, initialValues }) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const { loading } = useSelector((state: RootState) => state.wings);

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      phone: "",
      image: "",
      post: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
      image: Yup.mixed().required("Image is required"),
      post: Yup.string().required("Post is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      formik.setFieldValue("image", file); 
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  

  return (
    <div className="bg-white dark:bg-[#101828] w-full p-6 rounded-2xl  max-w-md dark:text-white space-y-5">
      <h2 className="text-xl font-semibold">
        {title}
        <span className="text-blue-400 font-bold">{wing?.name}</span>
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full px-3 py-2 dark:bg-gray-800 border border-gray-700 rounded-md dark:text-white"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-400 text-sm">{formik.errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm">Phone</label>
          <input
            type="text"
            name="phone"
            maxLength={10}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="w-full px-3 py-2 dark:bg-gray-800 border border-gray-700 rounded-md dark:text-white"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-400 text-sm">{formik.errors.phone}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 text-sm">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 dark:bg-gray-800 border border-gray-700 rounded-md dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-red-400 text-sm">{formik.errors.image}</p>
          )}
          {(imagePreview || initialValues?.image) && (
            <div className="relative mt-4 w-fit">
              <img
                src={imagePreview || initialValues?.image || ""}
                alt="Preview"
                className="max-h-40 rounded-md border border-gray-700"
              />
              <button
                type="button"
                onClick={() => {
                  formik.setFieldValue("image", "");
                  setImagePreview("");
                }}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        {/* Post */}
        <div>
          <label className="block mb-1 text-sm">Post</label>
          <input
            type="text"
            name="post"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.post}
            className="w-full px-3 py-2 dark:bg-gray-800 border border-gray-700 rounded-md dark:text-white"
          />
          {formik.touched.post && formik.errors.post && (
            <p className="text-red-400 text-sm">{formik.errors.post}</p>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition disabled:opacity-50"
            // disabled={!formik.isValid || formik.isSubmitting}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWingMemberCard;
