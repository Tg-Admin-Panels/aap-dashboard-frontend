import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { createVision } from '../../features/visions/visionsApi';
import Label from '../../components/form/Label';
import DropzoneComponent from '../../components/form/form-elements/DropZone';

const initialValues = {
  title: '',
  image: '',
  points: [''],
  icon: '',
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  image: Yup.string(),
  points: Yup.array().of(Yup.string().required('Point is required')),
  icon: Yup.string(),
});

const CreateVisionForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.visions);

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    await dispatch(createVision(values));
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-16 px-4 dark:bg-gray-900">
      <div
        className="w-full max-w-4xl border-2 rounded-xl shadow-lg p-8 bg-white dark:bg-gray-800"
        style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
      >
        <h1 className="text-3xl font-bold text-center text-[#0c1b32] dark:text-white mb-8">
          Create a New Vision
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="p-4">
                    <Label htmlFor="title" required>
                      Title
                    </Label>
                    <Field
                      name="title"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Powering Progress"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="p-4">
                    <Label htmlFor="image">Image</Label>
                    <DropzoneComponent
                      accept={{ 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] }}
                      onFileUploadSuccess={(url) => setFieldValue("image", url)}
                      multiple={false}
                    />
                    {values.image && (
                      <div className="mt-2">
                        <img src={values.image} alt="Vision" className="w-full h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="p-4">
                    <Label required>Points</Label>
                    <FieldArray name="points">
                      {({ push, remove }) => (
                        <div>
                          {values.points.map((_, index) => (
                            <div key={index} className="w-full mb-2">
                              <div className="flex items-center gap-2">
                                <Field
                                  name={`points[${index}]`}
                                  placeholder="Point description"
                                  className="w-full p-2 border rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="bg-red-500 text-white p-2 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                              <ErrorMessage
                                name={`points[${index}]`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => push('')}
                            className="bg-blue-500 text-white p-2 rounded mt-2"
                          >                            Add Point
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="p-4">
                    <Label htmlFor="icon">Icon</Label>
                    <DropzoneComponent
                      accept={{ 'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.svg'] }}
                      onFileUploadSuccess={(url) => setFieldValue("icon", url)}
                      multiple={false}
                    />
                    {values.icon && (
                      <div className="mt-2">
                        <img src={values.icon} alt="Icon" className="w-full h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition text-lg"
                >
                  {isSubmitting || loading ? "Submitting..." : "Create Vision"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateVisionForm;
