import React from "react";
import { Users, UserPlus, MessageSquare, Search } from "lucide-react";
import "./EmployerHomeStaticData.css";

const EmployerHomeStaticData = () => {
  const cards = [
    { title: "Active Hires", value: "6 / 10", icon: <Users size={22} /> },
    { title: "New Matches", value: "12", icon: <UserPlus size={22} /> },
    { title: "New Messages", value: "07", icon: <MessageSquare size={22} /> },
    { title: "Search Roofers", value: "", icon: <Search size={22} /> },
  ];

  return (
    <div className="container mt-3">
      <div className="row g-3">
        {cards.map((card, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-3">
            <div className="EmployerHomeStatic-card">
              
              <div className="EmployerHomeStatic-icon">
                {card.icon}
              </div>

              <div className="EmployerHomeStatic-text">
                <div className="EmployerHomeStatic-title">
                  {card.title}
                </div>

                {card.value && (
                  <div className="EmployerHomeStatic-value">
                    {card.value}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerHomeStaticData;
