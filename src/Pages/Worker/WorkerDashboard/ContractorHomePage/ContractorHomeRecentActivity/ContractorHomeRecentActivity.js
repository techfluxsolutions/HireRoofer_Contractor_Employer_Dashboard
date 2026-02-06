import React from "react";
import "./ContractorHomeRecentActivity.css";
import { FaCheck, FaEnvelope, FaUser } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

const activities = [
  {
    id: 1,
    title: "Boost Your Profile and Find More Jobs",
    time: "1 hour ago",
    icon: <FaCheck />,
  },
  {
    id: 2,
    title: "Boost Your Profile and Find More Jobs",
    time: "3 hour ago",
    icon: <FaEnvelope />,
  },
  {
    id: 3,
    title: "Boost Your Profile and Find More Jobs",
    time: "Yesterday",
    icon: <FaUser />,
  },
];

const ContractorHomeRecentActivity = () => {
  return (
    <div className="contractorRecent-container">
      <h2 className="contractorRecent-title">Recent Activity</h2>

      <div className="contractorRecent-list">
        {activities.map((item) => (
          <div key={item.id} className="contractorRecent-card">
            <div className="contractorRecent-left">
              <div className="contractorRecent-icon">{item.icon}</div>

              <div>
                <p className="contractorRecent-text">{item.title}</p>
                <span className="contractorRecent-time">{item.time}</span>
              </div>
            </div>

            <IoChevronForward className="contractorRecent-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorHomeRecentActivity;
