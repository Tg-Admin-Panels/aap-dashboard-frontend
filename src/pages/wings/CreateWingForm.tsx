import { useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldArray,
} from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { addLeaderToWing, createWing } from "../../features/wings/wingsApi";
import {
  setErrorToNull,
  setShowCreateLeaderModal,
} from "../../features/wings/wings.slice";
import AddWingMemberCard from "./AddWingMemberCard";
import Modal from "../../components/modal/Modal";
import DropzoneComponent from "../../components/form/form-elements/DropZone"; // Import DropzoneComponent

const initialValues = {
  name: "",
  hero: {
    title: "",
    highlight: "",
    subtitle: "",
    description: "",
    bullets: [{ text: "", icon: "" }],
    image: {
      url: "",
      alt: "",
      caption: "",
      glow: {
        enabled: false,
        color: "#d1fa1d",
      },
      aspectRatio: "",
    },
    ctas: {
      primary: {
        label: "",
        href: "",
        variant: "primary",
      },
      secondary: {
        label: "",
        href: "",
        variant: "secondary",
      },
    },
  },
  ourLeadersSection: {
    title: "OUR LEADERS",
    subtitle:
      "Meet the dynamic young leaders who are driving innovation, embracing technology, and championing sustainable development for a better tomorrow.",
  },
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Wing name is required"),
  hero: Yup.object().shape({
    title: Yup.string().required("Hero title is required"),
    highlight: Yup.string(),
    subtitle: Yup.string(),
    description: Yup.string(),
    bullets: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().required("Bullet text is required"),
        icon: Yup.string(),
      })
    ),
    image: Yup.object().shape({
      url: Yup.string(), // Removed .required("Image URL is required")
      alt: Yup.string(),
      caption: Yup.string(),
      glow: Yup.object().shape({
        enabled: Yup.boolean(),
        color: Yup.string(),
      }),
      aspectRatio: Yup.string(),
    }),
    ctas: Yup.object().shape({
      primary: Yup.object().shape({
        label: Yup.string().required("Primary CTA label is required"),
        href: Yup.string().required("Primary CTA link is required"),
        variant: Yup.string(),
      }),
      secondary: Yup.object().shape({
        label: Yup.string(),
        href: Yup.string(),
        variant: Yup.string(),
      }),
    }),
  }),
  ourLeadersSection: Yup.object().shape({
    title: Yup.string().required("Section title is required"),
    subtitle: Yup.string(),
  }),
});

const CreateWing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, selectedWing, showCreateLeaderModal } = useSelector(
    (state: RootState) => state.wings
  );

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
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-start justify-center py-16 px-4 dark:bg-gray-900">
      <div
        className="w-full max-w-4xl border-2 rounded-xl shadow-lg p-8 bg-white dark:bg-gray-800"
        style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <h1 className="text-3xl font-bold text-center text-[#0c1b32] dark:text-white mb-8">
          Create a New Wing
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Wing Identity */}
                <div className="md:col-span-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Wing Identity
                    </h2>
                  </div>
                  <div className="p-4">
                    <label
                      htmlFor="name"
                      className="block font-medium text-gray-800 dark:text-gray-200 mb-1"
                    >
                      Wing Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="name"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Main Wing"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="md:col-span-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Hero Section
                    </h2>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field name="hero.title" placeholder="Title" className="w-full p-2 border rounded" />
                    <Field name="hero.highlight" placeholder="Highlight" className="w-full p-2 border rounded" />
                    <Field name="hero.subtitle" placeholder="Subtitle" className="w-full p-2 border rounded" />
                    <Field
                      name="hero.description"
                      placeholder="Description"
                      as="textarea"
                      className="w-full p-2 border rounded md:col-span-2"
                    />
                  </div>
                </div>

                {/* Hero Bullets */}
                <div className="md:col-span-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Bullets</h3>
                  </div>
                  <div className="p-4">
                    <FieldArray name="hero.bullets">
                      {({ push, remove }) => (
                        <div>
                          {values.hero.bullets.map((_, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <Field
                                name={`hero.bullets[${index}].text`}
                                placeholder="Bullet text"
                                className="w-full p-2 border rounded"
                              />
                              <Field
                                name={`hero.bullets[${index}].icon`}
                                placeholder="Icon key"
                                className="p-2 border rounded"
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="bg-red-500 text-white p-2 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => push({ text: "", icon: "" })}
                            className="bg-blue-500 text-white p-2 rounded mt-2"
                          >
                            Add Bullet
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="md:col-span-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Image</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Replace Field with DropzoneComponent */}
                    <div className="md:col-span-2">
                      <DropzoneComponent
                        accept={{ 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] }}
                        onFileUploadSuccess={(url) => setFieldValue("hero.image.url", url)}
                        multiple={false}
                      />
                      {values.hero.image.url && (
                        <div className="mt-2">
                          <img src={values.hero.image.url} alt="Hero" className="w-full h-32 object-cover rounded" />
                        </div>
                      )}
                    </div>
                    <Field name="hero.image.alt" placeholder="Alt text" className="w-full p-2 border rounded" />
                    <Field name="hero.image.caption" placeholder="Caption" className="w-full p-2 border rounded" />
                    <Field
                      name="hero.image.aspectRatio"
                      placeholder="Aspect Ratio (e.g., 16:9)"
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex items-center gap-2">
                      <Field type="checkbox" name="hero.image.glow.enabled" />
                      <label htmlFor="hero.image.glow.enabled" className="text-gray-800 dark:text-gray-200">Glow</label>
                      <Field name="hero.image.glow.color" type="color" />
                    </div>
                  </div>
                </div>

                {/* Hero CTAs */}
                <div className="md:col-span-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">CTAs</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Primary</h4>
                      <Field
                        name="hero.ctas.primary.label"
                        placeholder="Label"
                        className="w-full p-2 border rounded mt-1"
                      />
                      <Field name="hero.ctas.primary.href" placeholder="URL" className="w-full p-2 border rounded mt-1" />
                      <Field
                        name="hero.ctas.primary.variant"
                        as="select"
                        className="w-full p-2 border rounded mt-1"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="link">Link</option>
                      </Field>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Secondary</h4>
                      <Field
                        name="hero.ctas.secondary.label"
                        placeholder="Label"
                        className="w-full p-2 border rounded mt-1"
                      />
                      <Field
                        name="hero.ctas.secondary.href"
                        placeholder="URL"
                        className="w-full p-2 border rounded mt-1"
                      />
                      <Field
                        name="hero.ctas.secondary.variant"
                        as="select"
                        className="w-full p-2 border rounded mt-1"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="link">Link</option>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Our Leaders Section */}
                <div className="md:col-span-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Our Leaders Section
                    </h2>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      name="ourLeadersSection.title"
                      placeholder="Section Title"
                      className="w-full p-2 border rounded"
                    />
                    <Field
                      name="ourLeadersSection.subtitle"
                      placeholder="Section Subtitle"
                      as="textarea"
                      className="w-full p-2 border rounded md:col-span-2"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition text-lg"
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
            title="Add Wing Leader"
            wing={selectedWing}
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