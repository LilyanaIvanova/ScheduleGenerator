import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle, XCircle } from "lucide-react";

export default function AdminUpload() {
  const [mainFile, setMainFile] = useState(null);
  const [roomsFile, setRoomsFile] = useState(null);
  const [mainFileName, setMainFileName] = useState("");
  const [roomsFileName, setRoomsFileName] = useState("");
  const [message, setMessage] = useState(null);

  const mainRef = useRef(null);
  const roomsRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleMainFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainFile(file);
      setMainFileName(file.name);
    }
  };

  const handleRoomsFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomsFile(file);
      setRoomsFileName(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!mainFile || !roomsFile) {
      setMessage("❗ Моля, качете и двата файла.");
      return;
    }

    try {
      const formData1 = new FormData();
      formData1.append("file", mainFile);
      const res1 = await fetch(
        "http://localhost:8080/api/import/excel-import",
        {
          method: "POST",
          body: formData1,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formData2 = new FormData();
      formData2.append("file", roomsFile);
      const res2 = await fetch(
        "http://localhost:8080/api/import/excel-RoomImport",
        {
          method: "POST",
          body: formData2,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res1.ok && res2.ok) {
        setMessage("✅ Успешно качени и двата файла!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Възникна грешка при качването.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-3xl w-full transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 flex items-center justify-center gap-2">
          <UploadCloud className="w-7 h-7 text-indigo-600" />
          Качване на данни
        </h1>

        <div className="grid gap-6">
          {/* Разписания */}
          <div
            className="border-4 border-dashed border-indigo-300 rounded-xl p-6 text-center bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
            onClick={() => mainRef.current.click()}
          >
            <input
              ref={mainRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleMainFile}
              className="hidden"
            />
            <p className="text-indigo-700 font-medium">
              {mainFileName || "📂 Качете файл с разписания"}
            </p>
          </div>

          {/* Стаи */}
          <div
            className="border-4 border-dashed border-purple-300 rounded-xl p-6 text-center bg-purple-50 hover:bg-purple-100 cursor-pointer"
            onClick={() => roomsRef.current.click()}
          >
            <input
              ref={roomsRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleRoomsFile}
              className="hidden"
            />
            <p className="text-purple-700 font-medium">
              {roomsFileName || "📂 Качете файл със стаи"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md"
        >
          📤 Запиши в базата
        </button>

        {message && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm p-4 rounded-xl font-medium shadow ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.includes("✅") && <CheckCircle className="w-5 h-5" />}
            {message.includes("❌") && <XCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
