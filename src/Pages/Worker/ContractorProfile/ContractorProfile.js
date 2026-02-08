import React, { useState } from "react";
import ContractorSidebar from "./ContractorSidebar/ContractorSidebar";
import ContractorMainContent from "./ContractorMainContent/ContractorMainContent";
const ContractorProfile = () => {
  const [activeTab, setActiveTab] = useState("Accounts");

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-[280px]">
          <ContractorSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="flex-1 w-full">
          {activeTab === "Accounts" && <ContractorMainContent />}
          {activeTab === "Bookings" && <div>Bookings Content</div>}
          {activeTab === "Onboarding Process" && <div>Onboarding Content</div>}
          {activeTab === "Setting" && <div>Settings Content</div>}
        </div>
      </div>
    </div>
  );
};

export default ContractorProfile;
