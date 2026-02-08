

import AvailabilityToggle from "./AvailabilityToggle/AvailabilityToggle";
import LocationInfo from "./LocationInfo/LocationInfo";
import NavMenu from "./NavMenu/NavMenu";
import SwitchRole from "./SwitchRole/SwitchRole";



const ContractorSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside
            className="
        bg-white rounded-xl p-4 shadow-sm space-y-4
        w-full
        lg:fixed lg:top-[90px] lg:left-4
        lg:h-[calc(95vh-4rem)]
        lg:w-[280px]
      "
        >
            <AvailabilityToggle />
            <LocationInfo />
            <NavMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            <SwitchRole />
        </aside>
    );
};

export default ContractorSidebar;
