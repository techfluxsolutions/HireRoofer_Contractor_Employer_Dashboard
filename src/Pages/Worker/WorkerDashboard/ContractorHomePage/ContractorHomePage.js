import React from 'react'
import ContractorHomeBoostProfile from './ContractorHomeBoostProfile/ContractorHomeBoostProfile'
import ContractorHomeStaticData from './ContractorHomeStaticData/ContractorHomeStaticData'
import ContractorHomeProjectPage from './ContractorHomeProjectPage/ContractorHomeProjectPage'
import ContractorCompleteYourProfile from './ContractorCompleteYourProfile/ContractorCompleteYourProfile'
import ContractorHomeRecentActivity from './ContractorHomeRecentActivity/ContractorHomeRecentActivity'

const ContractorHomePage = () => {
  return (
    <div>
        <ContractorHomeBoostProfile/>

    <div className='container '>
      <div className='row'>
         
      <div className='EmployerHomePageMainclass col-12 col-md-8'>
     <ContractorHomeStaticData/>
     <ContractorHomeProjectPage/>
    
     </div>

     <div className='col-12 col-md-4 d-flex flex-column align-items-center'>
        <ContractorCompleteYourProfile/>
        <ContractorHomeRecentActivity/>
      </div>
     </div>
    </div>
    </div>
  )
}

export default ContractorHomePage