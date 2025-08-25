import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { CloseIcon } from "../../icons";
import { Wings } from "../../features/wings/wings.slice";

interface AddLeaderCardProps {
  wing: Wings | null;
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
    memberId?: string;
  }) => void;
}

const ChangeWingLeaderCard: React.FC<AddLeaderCardProps> = ({
  wing,
  onSubmit,
  initialValues,
}) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      phone: "",
      image: "",
      post: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().when([], {
        is: () => !selectedMemberId,
        then: (schema) => schema.required("Name is required"),
      }),
      phone: Yup.string().when([], {
        is: () => !selectedMemberId,
        then: (schema) =>
          schema
            .matches(/^\d{10}$/, "Phone must be 10 digits")
            .required("Phone is required"),
      }),
      image: Yup.string().when([], {
        is: () => !selectedMemberId,
        then: (schema) => schema.required("Image is required"),
      }),
      post: Yup.string().when([], {
        is: () => !selectedMemberId,
        then: (schema) => schema.required("Post is required"),
      }),
    }),
    onSubmit: (values) => {
      if (selectedMemberId) {
        onSubmit({ ...values, memberId: selectedMemberId });
      } else {
        onSubmit(values);
      }
    },
  });

  useEffect(() => {
    const selectedMember = wing?.members.find(
      (member) => member._id === selectedMemberId
    );
    if (selectedMember) {
      formik.setValues({
        name: selectedMember.name,
        phone: selectedMember.phone,
        image: selectedMember.image,
        post: selectedMember.post,
      });
      setImagePreview(selectedMember.image);
    } else {
      formik.resetForm();
      setImagePreview("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMemberId, wing]);

  const handleImageUploadSuccess = (url: string) => {
    formik.setFieldValue("image", url);
    setImagePreview(url);
  };

  const existingMembers = wing?.members || [];

  return (
    <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-sm border border-gray-200 text-gray-900 space-y-5">
      <h2 className="text-xl font-semibold">
        Change Leader of Wing:{" "}
        <span className="text-blue-600 font-bold">{wing?.name}</span>
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
        {/* Select existing member */}
        {existingMembers.length > 0 && (
          <div className="w-full">
            <label className="w-full block mb-1 text-sm text-gray-700">
              Select Existing Member
            </label>
            <select
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMemberId}
              onChange={(e) => {
                setSelectedMemberId(e.target.value);
                formik.resetForm();
                setImagePreview("");
              }}
            >
              <option value="">-- Select Member --</option>
              {existingMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Conditionally show form or simple submit */}
        {!selectedMemberId ? (
          <>
            {/* Name */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                maxLength={10}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.phone}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">Upload Image</label>
              <DropzoneComponent
                accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
                onFileUploadSuccess={handleImageUploadSuccess}
                multiple={false}
              />
              {(imagePreview || formik.values.image) && (
                <div className="relative mt-4 w-fit">
                  <img
                    src={imagePreview || formik.values.image || ""}
                    alt="Preview"
                    className="max-h-40 rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      formik.setFieldValue("image", "");
                      setImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                    aria-label="Remove image"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.image}</p>
              )}
            </div>

            {/* Post */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">Post</label>
              <input
                type="text"
                name="post"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.post}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.post && formik.errors.post && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.post}</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            You have selected an existing member.
          </p>
        )}

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition disabled:opacity-50"
          >
            {selectedMemberId ? `Assign Selected Member as leader` : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeWingLeaderCard;
