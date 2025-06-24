import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    let responseText;
    try {
      responseText = await res.text();
    } catch (err) {
      console.error("Грешка при четене на отговора:", err);
      setMessage("❌ Грешка при обработка на отговора от сървъра.");
      return;
    }

    if (res.ok) {
      setMessage("✅ " + responseText);
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage("❌ " + responseText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Регистрация
        </h2>

        {message && (
          <div
            className={`text-sm text-center p-3 rounded mb-4 ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Потребителско име"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Парола"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Регистрирай се
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Вече имате акаунт?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Вход
          </span>
        </p>
      </div>
    </div>
  );
}
