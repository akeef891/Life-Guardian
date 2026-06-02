import { ROUTES } from "@/lib/constants/routes";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <SignUp fallbackRedirectUrl={ROUTES.dashboard} signInUrl={ROUTES.signIn} />
    </main>
  );
}
