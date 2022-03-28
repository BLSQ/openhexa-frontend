import { CustomApolloClient } from "libs/apollo";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <Link href="/dashboard">
          <a className="relative h-8 flex-shrink-0 flex items-center">
            <img
              className="h-full block lg:hidden"
              src="/images/logo.svg"
              alt="OpenHexa logo"
            />
            <img
              className="h-full hidden lg:block"
              src="/images/logo_with_text_white.svg"
              alt="OpenHexa logo"
            />
          </a>
        </Link>
        <Navbar />
        {/* User Menu */}
      </div>
    </div>
  );
};

Header.prefetch = async (client: CustomApolloClient) => {};

export default Header;
