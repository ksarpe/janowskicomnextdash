import { notFound } from "next/navigation";
import Script from "next/script";

export default function SandboxPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const TEST_CLIENT_ID = "29b0bcc8-8347-4c33-89f8-a944d296cf93";

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto pt-20 px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Sandbox website for testing
        </h1>
      </div>

      <Script
        src="/booking-widget.js"
        strategy="lazyOnload"
        data-client-id={TEST_CLIENT_ID}
      />
    </div>
  );
}
