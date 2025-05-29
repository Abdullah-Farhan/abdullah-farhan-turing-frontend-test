import LogoutButton from "../ui/LogoutButton";
const Navbar = () => {
  return (
    <div className="w-full flex justify-between h-16 bg-white shadow-md items-center px-4 md:px-16">
      <div className="flex space-x-4">
        <img
          src="/logo.png"
          className="h-6 md:h-8"
          alt="company logo"
          aria-label="Company logo"
        />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Navbar;
