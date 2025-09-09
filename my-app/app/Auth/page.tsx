"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // default role
  const [error, setError] = useState("");
  const router = useRouter();

  // Check session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/Technical"); // redirect if already logged in
    }
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin
        ? "http://localhost:5001/api/auth/signin"
        : "http://localhost:5001/api/auth/signup";

      const body = isLogin
        ? { email, password }
        : { username: email.split("@")[0], email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Authentication failed");
      }

      const data = await res.json();

      // Save token + user details in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("current_user", JSON.stringify(data.user));

      router.push("/"); // redirect after login/signup
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Role selector only for Sign Up */}
          {!isLogin && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="User">User</option>
              <option value="HR">HR</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-[#F9A826] text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
