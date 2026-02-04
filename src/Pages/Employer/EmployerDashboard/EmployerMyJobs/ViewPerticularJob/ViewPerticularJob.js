import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { GetSingleEmployerJobAPI } from "../../../../../utils/APIs/Employer/EmployerMyJobApis";
import Loader from "../../../../../Loader/Loader";

const ViewPerticularJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJob();
    }, []);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const res = await GetSingleEmployerJobAPI(id);
            setJob(res?.data?.data);
        } catch (error) {
            console.error("Failed to fetch job", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const formatTime = (time) => {
        if (!time || typeof time !== "object") return "-";
        return `${time.startTime} to ${time.endTime}`;
    };

    if (loading) return <Loader />;

    if (!job) {
        return (
            <div className="text-center py-10 text-gray-500">
                Job not found
            </div>
        );
    }

    return (
        <div className="bg-[#F5F7FB] min-h-screen px-6 py-6">
            <div className="max-w-7xl mx-auto">
                {/* ================= SECTION HEADERS ================= */}
                {/* ===== DESKTOP HEADERS ONLY ===== */}
                <div className="hidden lg:grid grid-cols-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 col-span-2 pl-6">
                        Roofing Job
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-700 pl-5">
                        Applicants
                    </h2>
                </div>


                {/* ================= CONTENT GRID ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ================= LEFT : JOB DETAILS ================= */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                        <div className="divide-y divide-gray-100">
                            <Detail label="Company Name" value={job.companyName} />
                            <Detail label="Work Type" value={job.workType} />
                            <Detail label="Location" value={job.location} />
                            <Detail label="Postal Code" value={job.postalCode} />
                            <Detail label="Start Date" value={formatDate(job.startDate)} />
                            <Detail label="End Date" value={formatDate(job.endDate)} />
                            <Detail
                                label="Total Working Days"
                                value={`${job.totalWorkingDays} Days`}
                            />
                            <Detail label="Time" value={formatTime(job.time)} />
                            <Detail
                                label="Skills Required"
                                value={job.skillsRequired?.join(", ")}
                                multiline
                            />
                            <Detail label="Description" value={job.description} multiline />
                            <Detail label="Budget" value={`$${job.budget}`} />
                        </div>

                        <button className="mt-6 w-full bg-[#537EF1] hover:bg-[#466ce0] transition text-white py-3 rounded-lg font-medium">
                            Assign Roofer
                        </button>
                    </div>

                    {/* ================= RIGHT : APPLICANTS ================= */}
                    <div className="space-y-4">
                        {job.applicants?.length ? (
                            job.applicants.map((applicant) => (
                                <div
                                    key={applicant._id}
                                    className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex justify-between items-center"
                                >
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-800">
                                            <span className="text-gray-500">Name :</span>{" "}
                                            <span className="font-medium">
                                                {applicant.name}
                                            </span>
                                        </p>

                                        <p className="text-xs">
                                            <span className="text-gray-500">Status :</span>{" "}
                                            <span className="text-[#537EF1] font-medium">
                                                {applicant.status || "Pending"}
                                            </span>
                                        </p>

                                        <div className="flex gap-4 text-xs">
                                            <button className="text-[#537EF1] font-medium hover:underline">
                                                Approve
                                            </button>
                                            <button className="text-gray-600 font-medium hover:underline">
                                                Assign
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-9 w-9 flex items-center justify-center rounded-md bg-[#537EF1]/10">
                                        <MessageSquare
                                            size={18}
                                            className="text-[#537EF1]"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl p-5 text-sm text-gray-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                                No applicants yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ================= DETAIL ROW ================= */
const Detail = ({ label, value, multiline }) => (
    <div className="flex gap-4 py-3 text-sm">
        <span className="w-44 text-gray-400 shrink-0">
            {label}
        </span>
        <span className="text-gray-400">:</span>
        <span
            className={`text-gray-700 leading-relaxed ${multiline ? "max-w-[65%]" : ""
                }`}
        >
            {value || "-"}
        </span>
    </div>
);

export default ViewPerticularJob;
