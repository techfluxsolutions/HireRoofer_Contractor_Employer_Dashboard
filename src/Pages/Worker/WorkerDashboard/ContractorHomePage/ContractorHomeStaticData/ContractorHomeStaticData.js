import React from "react";
import "./ContractorHomeStaticData.css";

const ContractorHomeStaticData = () => {
  const cards = [
    {
      title: "Active Hires",
      value: "6 / 10",
      image: "/assets/Employer/EmployerHomePage/EmployerStatic1.png",
    },
    {
      title: "New Matches",
      value: "12",
      image: "/assets/Employer/EmployerHomePage/EmployerStatic2.png",
    },
    {
      title: "New Messages",
      value: "07",
      image: "/assets/Employer/EmployerHomePage/EmployerStatic3.png",
    },
    // {
    //   title: "Search Roofers",
    //   value: "",
    //   image: "/assets/Employer/EmployerHomePage/EmployerStatic4.png",
    // },
  ];

  return (
    <div className="container mt-5">
      <div className="row g-3">
        {cards.map((card, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <div className="EmployerHomeStatic-card">
              
              <div className="EmployerHomeStatic-icon">
                <img
                  src={card.image}
                  alt={card.title}
                  className="EmployerHomeStatic-img"
                />
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

export default ContractorHomeStaticData;
