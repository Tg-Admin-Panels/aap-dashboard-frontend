import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="AAP Bihar|Login"
        description="Admin Panel Login"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
