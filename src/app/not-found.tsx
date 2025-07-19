import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#2fceb9] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <Link href="/">
          <Button className="bg-[#2fceb9] hover:bg-[#26a594] text-white">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
