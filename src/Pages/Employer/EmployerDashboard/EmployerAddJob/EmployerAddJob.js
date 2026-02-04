import React, { useEffect, useState } from "react";
import MapCityPicker from "./MapCityPicker";

import SkillToolSelector from "./SkillToolSelector";
// import { GetSkillsAPI, GetToolsAPI } from "../../../../utils/APIs/ContractorStepperApis";
import { AddEmployerJobAPI, GetSkillsForEmployerAPI, GetToolsForEmployerAPI } from "../../../../utils/APIs/Employer/EmployerMyJobApis";
import { useModal } from "../../../../Context/ModalContext/ModalContext";
import Loader from "../../../../Loader/Loader";
import { useLocation, useNavigate } from "react-router-dom";

const EmployerAddJob = () => {
    const [jobImage, setJobImage] = useState(null);
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [toolsRequired, setToolsRequired] = useState([]);
    const [jobName, setJobName] = useState("");
    const [description, setDescription] = useState("");

    const [skillsList, setSkillsList] = useState([]);
    const [toolsList, setToolsList] = useState([]);

    const [time, setTime] = useState({
        startTime: "08:00",
        endTime: "16:00",
    });

    const [skillsRequired, setSkillsRequired] = useState([]);
    const [budget, setBudget] = useState("");

    const [workType, setWorkType] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [totalWorkingDays, setTotalWorkingDays] = useState(""); // duration
    // const [jobImageFile, setJobImageFile] = useState(null);
     const [loading, setLoading] = useState(false);
     const { showSuccess, showError } = useModal();
    const navigate=useNavigate()
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // setJobImageFile(file); // real file
            setJobImage(URL.createObjectURL(file)); // preview only
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            const skillsRes = await GetSkillsForEmployerAPI();
            const toolsRes = await GetToolsForEmployerAPI();

            setSkillsList(skillsRes?.data?.data?.items || []);
            setToolsList(toolsRes?.data?.data?.items || []);
        };

        fetchData();
    }, []);

    const resetForm = () => {
  setJobName("");
  setDescription("");
  setWorkType("");
  setBudget("");
  setStartDate("");
  setEndDate("");
  setTotalWorkingDays("");
  setLocation("");
  setPostalCode("");

  setTime({
    startTime: "08:00",
    endTime: "16:00",
  });

  setSkillsRequired([]);
  setToolsRequired([]);

  setLat(null);
  setLng(null);
  setShowMap(false);

  setJobImage(null);
//   setJobImageFile(null);
};


    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append("jobName", jobName);
            formData.append("description", description);
            formData.append("workType", workType);
            formData.append("location", location);
            formData.append("postalCode", postalCode);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("totalWorkingDays", totalWorkingDays);
            formData.append("budget", budget);

            formData.append("time[startTime]", time.startTime);
            formData.append("time[endTime]", time.endTime);

            skillsRequired.forEach((skill) =>
                formData.append("skillsRequired[]", skill._id)
            );

            if (jobImage) {
                formData.append("jobImage", jobImage);
            }
            setLoading(true)
            const res = await AddEmployerJobAPI(formData);
            if(res?.data?.success){
                showSuccess(res?.data?.message);
                resetForm();
                navigate("/employer-dashboard/jobs")
            }
            else{
                 showError(res?.data?.message)
            }
            console.log("Job created:", res);

        } catch (err) {
            setLoading(false)
            console.error(err);
        }
        finally{
            (setLoading(false))
        }
    };


if(loading){
    return <Loader/>
}

    return (
        <div className="min-h-screen flex justify-center items-start py-10">
            <div className="w-full max-w-[65rem] bg-white rounded-xl  p-6">
                <h2 className="text-xl font-semibold mb-6">Add Job</h2>

                {/* Job Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">Job Name</label>
                    <input
                        type="text"
                        value={jobName}
                        onChange={(e) => setJobName(e.target.value)}
                        placeholder="Enter Job Name"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />


                </div>



                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">
                        Work Type
                    </label>
                    <input
                        type="text"
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        placeholder="e.g. Roofing, Flooring"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>


                {/* Job Image */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">Job Image</label>
                    <div className="relative border border-dashed rounded-lg h-28 flex items-center justify-center cursor-pointer overflow-hidden">
                        {jobImage ? (
                            <img
                                src={jobImage}
                                alt="Job"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">
                                Upload Job Image
                            </span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Give Description"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />

                </div>

                {/* Date */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-start">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-start">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>



                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-start">
                            Start Time
                        </label>
                        <input
                            type="time"
                            value={time.startTime}
                            onChange={(e) =>
                                setTime({ ...time, startTime: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-start">
                            End Time
                        </label>
                        <input
                            type="time"
                            value={time.endTime}
                            onChange={(e) =>
                                setTime({ ...time, endTime: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>





                {/* Duration */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">
                        Duration (Total Working Days)
                    </label>
                    <input
                        type="number"
                        value={totalWorkingDays}
                        onChange={(e) => setTotalWorkingDays(e.target.value)}
                        placeholder="Enter number of days"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>


                {/* Skills */}
                <SkillToolSelector
                    label="Skills"
                    items={skillsList}
                    selectedItems={skillsRequired}
                    setSelectedItems={setSkillsRequired}
                    placeholder="Add skill"
                />


                {/* Tools */}
                <SkillToolSelector
                    label="Tools"
                    items={toolsList}
                    selectedItems={toolsRequired}
                    setSelectedItems={setToolsRequired}
                    placeholder="Add tool"
                />


                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">
                        Budget
                    </label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Enter Budget"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
               


                {/* Location */}
                {/* Location */}

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-start">
                        Location
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        {/* Map Icon */}
                        <span
                            onClick={() => setShowMap((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#537EF1]"
                            title="Pick from map"
                        >
                            📍
                        </span>
                    </div>
                </div>

                 <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-start">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        value={postalCode}
                        // onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Enter Postal Code"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                {showMap && (
                    <div className="mb-6">
                        <div className="text-xs text-gray-500 mb-2">
                            Click on the map to select job location
                        </div>

                        <MapCityPicker
                            onSelect={({ city, lat, lng, postalCode }) => {
                                setLocation(city);
                                setLat(lat);
                                setLng(lng);
                                setPostalCode(postalCode || "");
                                setShowMap(false);
                            }}
                        />

                    </div>
                )}



                {/* Add Job Button */}
                <div className="flex gap-4">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/employer-dashboard/jobs")}
                        className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Back
                    </button>

                    {/* Add Job Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-1/2 bg-[#537EF1] text-white py-3 rounded-lg font-medium hover:bg-[#3F66E0] transition"
                    >
                        Add Job
                    </button>

                </div>

            </div>
        </div>
    );
};

export default EmployerAddJob;
