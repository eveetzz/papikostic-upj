import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../store/authStore";
import googleLogo from "../assets/google.svg";
import upjLogo from "../assets/upj.png";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/Index");
    } catch (error) {
      setError("Login gagal, periksa kembali email dan password anda");
    }
  };

  const handleLoginWithGoogle = async () => {
    e.preventDefault();
    setError("");
    try {
      await googleLogin();
      navigate("/Index");
    } catch (error) {
      setError("Login gagal, silahkan coba lagi");
    }
  };

  const tooglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="min-h-screen bg-[#1A5A9A] flex flex-col">
        {/* CONTENT */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
            {/* TITLE */}
            <div className="flex flex-1 items-center justify-center px-4">
              <img src={upjLogo} alt="" />
            </div>
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-black text-center">
              Login
            </h1> */}
            <p className="text-sm sm:text-base text-black text-center mt-5">
              Masuk ke Akun untuk memulai tes
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            {/* FORM */}
            <div className="mt-6 flex flex-col gap-4">
              {/* EMAIL */}
              <form
                onSubmit={handleLogin}
                action="#"
                method="POST"
                className="space-y-6"
              >
                {/* EMAIL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-sm">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 border border-gray-500 rounded-lg text-sm focus:ring-2 focus:ring-[#1A5A9A] outline-none"
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-sm">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"} // Update tipe input secara dinamis
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 border border-gray-500 rounded-lg text-sm focus:ring-2 focus:ring-[#1A5A9A] outline-none"
                      placeholder="Masukkan password"
                    />
                    <button
                      type="button"
                      onClick={tooglePassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="w-full h-11 bg-[#1A5A9A] text-white rounded-lg font-semibold mt-2"
                >
                  Log In
                </button>

                {/* OR */}
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="text-gray-400 text-xs">or</span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                {/* SOCIAL LOGIN */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleLoginWithGoogle}
                    className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <img src={googleLogo} className="w-5 h-5" alt="Google" />
                    Google
                  </button>
                </div>
              </form>
            </div>

            {/* SIGN UP */}
            <p className="text-gray-500 text-sm mt-4 text-center">
              Tidak memiliki akun?{" "}
              <span
                className="underline cursor-pointer"
                href="#"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </main>
      </div>
    </>
  );
};
