import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminUpload from "../pages/AdminUpload";

export default function Toolbar({
  onGenerate,
  onExport,
  semester,
  setSemester,
  season,
  setSeason,
}) {
  const [showUpload, setShowUpload] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const winterSemesters = [1, 3, 5, 7];
  const summerSemesters = [2, 4, 6, 8];

  const availableSemesters =
    season === "winter" ? winterSemesters : summerSemesters;

  useEffect(() => {
    setSemester(availableSemesters[0]);
  }, [season]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 bg-white shadow-md p-4 rounded-xl space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <h1 className="text-xl font-bold">Избор на семестър</h1>

          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="winter">Зимен семестър</option>
            <option value="summer">Летен семестър</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(parseInt(e.target.value))}
            className="border border-gray-300 rounded p-2"
          >
            {availableSemesters.map((sem) => (
              <option key={sem} value={sem}>
                Семестър {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-2 flex flex-wrap justify-center">
          <button
            onClick={onGenerate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Генерирай разписание
          </button>

          <button
            onClick={onExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            Експортиране
          </button>

          {role === "ROLE_ADMIN" && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              Качване на данни
            </button>
          )}

          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Изход
            </button>
          )}
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500"
              onClick={() => setShowUpload(false)}
            >
              ✖
            </button>
            <AdminUpload />
          </div>
        </div>
      )}
    </>
  );
}
