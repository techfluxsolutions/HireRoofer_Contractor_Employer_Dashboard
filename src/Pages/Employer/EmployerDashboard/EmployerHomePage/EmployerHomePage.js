// import React, { useEffect, useState } from "react";
// import { MapPin, Clock, Wrench, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   GetBoostedAvailableWorkersAPI,
//   GetEmployerInfoAPI,
//   GetEmployerJobsAPI,
// } from "../../../../utils/APIs/Employer/EmployerHomeApis";
// import Loader from "../../../../Loader/Loader";
// import { RatingStars } from "./Ratings";

// export default function EmployerHomePage() {
//   const navigate = useNavigate();

//   // const [profile, setProfile] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [roofers, setRoofers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const PREVIEW_JOBS = 6;
//   const PREVIEW_ROOFERS = 6;

//   const normalizeArray = (value) => (Array.isArray(value) ? value : []);

//   useEffect(() => {
//     const fetchEmployerDashboard = async () => {
//       try {
//         const [profileRes, jobsRes, workersRes] = await Promise.all([
//           GetEmployerInfoAPI(),
//           GetEmployerJobsAPI(),
//           GetBoostedAvailableWorkersAPI(),
//         ]);

//         // setProfile(profileRes?.data?.data?.companyProfile);

//         setJobs(
//           normalizeArray(
//             jobsRes.data?.data?.jobs ||
//               jobsRes.data?.data ||
//               jobsRes.data?.jobs
//           )
//         );

//         setRoofers(
//           normalizeArray(
//             workersRes.data?.data?.workers ||
//               workersRes.data?.data ||
//               workersRes.data?.workers
//           )
//         );
//       } catch (err) {
//         console.error("Dashboard API error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployerDashboard();
//   }, []);

//   if (loading) return <Loader />;

//   const visibleJobs = jobs.slice(0, PREVIEW_JOBS);
//   const visibleRoofers = roofers.slice(0, PREVIEW_ROOFERS);

//   return (
//     <div className="p-10 min-h-screen">
//       {/* Header */}
//       {/* <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
//             {profile?.companyLogo ? (
//               <img
//                 src={profile.companyLogo}
//                 alt="Company Logo"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-sm font-semibold text-gray-500">
//                 {profile?.companyName?.[0]}
//               </span>
//             )}
//           </div>

//           <div>
//             <h1 className="text-xl font-semibold">Welcome Back</h1>
//             <p className="text-gray-500 text-sm">{profile?.companyName}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 text-sm text-gray-500">
//           <MapPin size={14} />
//           <span>{profile?.officeLocation}</span>
//         </div>
//       </div> */}

//       {/* Active Jobs */}
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="font-semibold">Active Jobs</h2>

//         <div className="flex items-center gap-4">
//           <button 
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
//            onClick={() => navigate("/employer-dashboard/jobs/add-job")}
//           >

//             <Plus size={16} /> Add Job
//           </button>
//           <button
//             onClick={() => navigate("/employer-dashboard/jobs")}
//             className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
//           >
//             View all Jobs <span aria-hidden>→</span>
//           </button>

          
//         </div>
//       </div>

//       {jobs.length === 0 ? (
//         <div className="bg-white border rounded-xl p-6 text-center text-gray-500 mb-8">
//           <p className="font-medium text-gray-700">
//             To view jobs, please add your first job
//           </p>
//           <button 
//           className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
//           onClick={() => navigate("/employer-dashboard/jobs/add-job")}
//           >
//             <Plus size={16} /> Add Job
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//           {visibleJobs.map((job) => (
//             <div
//               key={job._id}
//               className="bg-white rounded-xl p-4 shadow-sm border flex flex-col"
//             >
//               {/* <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3">
//                 <Wrench className="text-white" size={20} />
//               </div>

//               <h3 className="font-medium text-sm mb-2 truncate">
//                 {job.jobName}
//               </h3> */}

//               <div className="flex items-center gap-3 mb-3">
//             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
//               <Wrench className="text-white" size={18} />
//             </div>

//             <h3 className="font-medium text-sm text-gray-900 truncate">
//               {job.jobName}
//             </h3>
//           </div>


//               <div className="text-xs text-gray-500 space-y-1">
//                 <div className="flex items-center gap-1">
//                   <Clock size={12} />
//                   <span>{job.totalWorkingDays} Days</span>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <MapPin size={12} />
//                   <span className="truncate">{job.location}</span>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <Wrench size={12} />
//                   <span>{job.workType}</span>
//                 </div>
//               </div>

//               {job.description && (
//                 <p className="text-xs text-gray-400 mt-2 line-clamp-2">
//                   {job.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Available Roofers */}
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="font-semibold">Available Roofers</h2>

//         <button
//           onClick={() => navigate("/employer-dashboard/view-roofer")}
//           className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
//         >
//           View all Roofers <span aria-hidden>→</span>
//         </button>
//       </div>

//       {roofers.length === 0 ? (
//         <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
//           <p className="font-medium text-gray-700">
//             Currently no roofers found
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {visibleRoofers.map((worker) => (
//             <div
//               key={worker._id}
//               className="bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4"
//             >
//               <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
//                 {worker.firstName?.[0]}
//                 {worker.lastName?.[0]}
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold text-sm text-gray-900 text-start">
//                   {worker.fullName}
//                 </h3>

//                 <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-1">
//                   <span className="flex items-center gap-1">
//                     <MapPin size={12} />
//                     {worker.city}
//                   </span>

//                   <span className="flex items-center gap-1">
//                     <Wrench size={12} />
//                     {worker.skills?.slice(0, 3).join(", ")}
//                     {worker.skills?.length > 3 && (
//                       <span className="ml-1">
//                         +{worker.skills.length - 3} more
//                       </span>
//                     )}
//                   </span>
//                 </div>

//                 <RatingStars
//                   rating={worker.averageRating}
//                   totalRatings={worker.totalRatings}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





import React from 'react'
import EmployerHomeStaticData from './EmployerHomeStaticData/EmployerHomeStaticData'
import EmployerHomeActiveJobs from './EmployerHomeActiveJobs/EmployerHomeActiveJobs'
import EmployerHomeAvailableContractors from './EmployerHomeAvailableContractors/EmployerHomeAvailableContractors'
import EmployerCompleteYourProfile from './EmployerCompleteYourProfile/EmployerCompleteYourProfile'

const EmployerHomePage = () => {
  return (
    <div className='container mt-5'>
      <div className='row'>
         
      <div className='col-12 col-md-8'>
     <EmployerHomeStaticData/>
     <EmployerHomeActiveJobs/>
     <EmployerHomeAvailableContractors/>
     </div>

      <div className='col-12 col-md-4'>
        <EmployerCompleteYourProfile/>
      </div>
     </div>
    </div>
  )
}

export default EmployerHomePage