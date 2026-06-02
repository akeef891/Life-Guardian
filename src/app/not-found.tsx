import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted">This page could not be found.</p>
      <Link
        href={ROUTES.home}
        className="mt-8 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
