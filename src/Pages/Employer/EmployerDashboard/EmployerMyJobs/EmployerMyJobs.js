import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetMyJobsAPI } from "../../../../utils/APIs/Employer/EmployerMyJobApis";
import Loader from "../../../../Loader/Loader";

const EmployerMyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs(page);
  }, [page]);


  const fetchJobs = async (pageNo = page) => {
    try {
      setLoading(true);
      const res = await GetMyJobsAPI(pageNo, 10);

      setJobs(res?.data?.data?.jobs || []);
      setTotalPages(res?.data?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
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

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No jobs found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          All Jobs
        </h2>
        <button
          onClick={() => navigate("/employer-dashboard/jobs/add-job")}
          className="bg-[#537EF1] text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
        >
          + Add Job
        </button>
      </div>

      {/* Desktop Header (UNCHANGED) */}
      <div className="hidden md:grid grid-cols-6 gap-4 text-xs text-gray-400 font-medium px-4 mb-3">
        <div>Job Name</div>
        <div>Work Type</div>
        <div>Location</div>
        <div>Budget</div>
        <div>Completed on</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="border border-gray-100 rounded-lg shadow-sm"
          >
            {/* ================= DESKTOP ROW (UNCHANGED) ================= */}
            <div className="hidden md:grid grid-cols-6 gap-4 items-center px-4 py-3 bg-white">
              <div className="text-sm text-gray-600">{job.jobName}</div>
              <div className="text-sm font-semibold text-gray-800">
                {job.workType}
              </div>
              <div className="text-sm text-gray-600">{job.location}</div>
              <div className="text-sm text-gray-600">${job.budget}</div>
              <div className="text-sm text-gray-500">
                {formatDate(job.createdAt)}
              </div>
              <div className="flex justify-center gap-4">
                <Eye
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    navigate(`/employer-dashboard/jobs/view/${job._id}`)
                  }
                />
                <Pencil
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    navigate(`/employer-dashboard/jobs/edit/${job._id}`)
                  }
                />
                <Trash2
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-red-500"
                />
              </div>
            </div>

            {/* ================= MOBILE CARD (IMPROVED) ================= */}
            <div className="md:hidden p-4 space-y-3 bg-white rounded-lg">
              <div>
                <p className="text-xs text-gray-400">Job Name</p>
                <p className="font-semibold text-gray-800">
                  {job.jobName}
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-xs text-gray-400">Work Type</p>
                  <p className="text-gray-700">{job.workType}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="text-gray-700">${job.budget}</p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-gray-700">{job.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-gray-500">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-6 pt-2 border-t border-gray-100">
                <Eye
                  size={18}
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    navigate(`/employer-dashboard/jobs/view/${job._id}`)
                  }
                />
                <Pencil
                  size={18}
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    navigate(`/employer-dashboard/jobs/edit/${job._id}`)
                  }
                />
                <Trash2
                  size={18}
                  className="text-gray-400 hover:text-red-500"
                />
              </div>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`px-4 py-2 rounded-md border text-sm
        ${page === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className={`px-4 py-2 rounded-md border text-sm
        ${page === totalPages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  Next
                </button>
              </div>
            )}

          </div>


        ))}
      </div>
    </div>
  );
};

export default EmployerMyJobs;
