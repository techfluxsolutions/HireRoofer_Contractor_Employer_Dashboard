const NavMenu = ({ activeTab, setActiveTab }) => {
  const items = ["Accounts", "Bookings", "Onboarding Process", "Setting"];

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          onClick={() => setActiveTab(item)}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition
            ${
              activeTab === item
                ? "bg-blue-600 text-white"
                : "border text-gray-700 hover:bg-gray-100"
            }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
