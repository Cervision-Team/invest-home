"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Home } from "lucide-react"; // iconlar

const page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({ name: "", password: "" });
  const [touched, setTouched] = useState({ name: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  // Əgər onsuz da login olunubsa, root səhifəyə yönləndir
  useEffect(() => {
    if (sessionStorage.getItem("sessionLogin") === "true") {
      router.push("/");
    }
  }, []);

  const validateName = (name) => {
    if (!name.trim()) return "Ad daxil edilməlidir";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Şifrə daxil edilməlidir";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error =
        name === "name" ? validateName(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error =
      name === "name" ? validateName(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const passwordError = validatePassword(formData.password);

    setErrors({ name: nameError, password: passwordError });
    setTouched({ name: true, password: true });

    if (!nameError && !passwordError) {
      const allowedUsers = [{ name: "Admin", password: "@invest2511" }];
      const isAuthorized = allowedUsers.some(
        (u) =>
          u.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          u.password === formData.password.trim()
      );

      if (!isAuthorized) {
        setErrors({ name: "", password: "Ad və ya şifrə səhvdir!" });
        return;
      }

      sessionStorage.setItem("sessionLogin", "true");
      router.push("/");
    }
  };

  const getInputClass = (fieldName) =>
    !touched[fieldName]
      ? "border-gray-300"
      : errors[fieldName]
      ? "border-red-500"
      : "border-[#02836F]";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #02836F 0%, #025F52 50%, #01403A 100%)",
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div
            className="px-8 pt-10 pb-6 text-center relative"
            style={{
              background: "linear-gradient(135deg, #02836F 0%, #025F52 100%)",
            }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Home size={40} style={{ color: "#02836F" }} strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">InvestHome.az</h1>
            <p className="text-white opacity-90 text-sm">Xoş gəlmisiniz</p>

            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 48h1440V0s-187.5 48-360 48S720 0 720 0 532.5 48 360 48 0 0 0 0v48z"
                  fill="#FAFAFA"
                />
              </svg>
            </div>
          </div>

          {/* Form */}
          <form className="px-8 py-10" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: "#02836F" }}>
                  Ad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} style={{ color: "#02836F", opacity: 0.6 }} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Adınızı daxil edin"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none text-gray-800 placeholder-gray-400 ${getInputClass("name")}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{errors.name}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: "#02836F" }}>
                  Şifrə
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} style={{ color: "#02836F", opacity: 0.6 }} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Şifrənizi daxil edin"
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none text-gray-800 placeholder-gray-400 ${getInputClass("password")}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #02836F 0%, #025F52 100%)",
                }}
              >
                Daxil ol
              </button>
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white text-sm mt-6 opacity-80">
          © 2025 InvestHome.az. Bütün hüquqlar qorunur.
        </p>
      </div>
    </div>
  );
};

export default page;
