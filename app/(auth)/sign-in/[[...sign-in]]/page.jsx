import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      {/* Wrapper forces horizontal centering */}
      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg p-4 sm:p-6 bg-card rounded-xl shadow-lg flex justify-center">
        {/* SignIn component now centers inside the wrapper */}
        <SignIn />
      </div>
    </div>
  );
}
