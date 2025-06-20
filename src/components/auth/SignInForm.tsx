import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { EyeCloseIcon, EyeIcon } from '../../icons';
import { AppDispatch, RootState } from '../../features/store';
import { loginUser } from '../../features/auth/authApi';


const validationSchema = Yup.object().shape({
  mobileNumber: Yup.string().required('Mobile number is required'),
  password: Yup.string().required('Password is required'),
});

const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (values: { mobileNumber: string; password: string }) => {
    dispatch(loginUser(values));
  };

  return (
    <div className="flex flex-col flex-1 bg-[var(--aap-bg-color)] text-[var(--aap-text-color)] px-6 py-10 sm:px-8">
      {/* Back to Dashboard */}
      {/* <div className="w-full max-w-md mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[var(--aap-muted-color)] hover:text-[var(--aap-primary-color)] transition-colors"
        >
          ← Back to Home
        </Link>
      </div> */}

      {/* Sign-In Form Content */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-3xl text-[var(--aap-primary-color)]">
            Sign In
          </h1>
          <p className="text-sm text-[var(--aap-muted-color)]">
            Enter your number and password to sign in!
          </p>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>

        <Formik
          initialValues={{ mobileNumber: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-5">
              {/* Mobile Number */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Number
                </label>
                <Field
                  name="mobileNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--aap-primary-color)]"
                  placeholder="Enter your mobile number"
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--aap-primary-color)]"
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-2.5 cursor-pointer text-[var(--aap-muted-color)]"
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 rounded bg-[var(--aap-primary-color)] text-white hover:bg-opacity-90 transition-colors"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Sign Up Link */}
        {/* <div className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[var(--aap-primary-color)] hover:underline">
            Sign Up
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default SignInForm;
