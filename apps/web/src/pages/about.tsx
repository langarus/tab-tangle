import { createFileRoute } from "@tanstack/react-router";
import aboutUsSvg from "../assets/svg/general/aboutus.svg?url";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <img src={aboutUsSvg} alt="About Tab Tangle" className="w-16 h-16" />
        <h1 className="text-4xl font-bold text-gray-900">About Tab Tangle</h1>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-sm">
        <div>
            <p className="text-gray-800 leading-relaxed text-lg mb-4">
              If you're like me, all over the place with tabs, this helps you manage the mess. 
              That's it. Your data stays on your device.
            </p>
            <p className="text-gray-700">
              Questions?{" "}
              <a
                href="mailto:your-email@example.com"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                your-email@example.com
              </a>
            </p>
        </div>
      </div>
    </div>
  );
}



