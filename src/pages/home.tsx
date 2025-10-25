import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast, Toaster } from "react-hot-toast";
import { LogIn, UserPlus, ClipboardCopy } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Username required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const loginSchema = z.object({
  username: z.string().min(3, "Username required"),
  password: z.string().min(6, "Minimum 6 characters"),
});

// ✅ Single type — optional username
type AuthForm = {
  username: string;
  email?: string;
  password: string;
};

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Dynamic resolver based on tab
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthForm>({
    resolver: zodResolver(tab === "login" ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: AuthForm) => {
    try {
      if (tab === "login") {
        // LOGIN FLOW
        const res = await fetch(
          "https://emailservice-5iny.onrender.com/auth/token/login/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        const result = await res.json();

        if (!res.ok) {
          // Friendly error handling for login
          const msg =
            result?.non_field_errors?.[0] ||
            result?.detail ||
            "Invalid email or password. Please try again.";
          throw new Error(msg);
        }

        // Save token
        const token = result.auth_token;
        setIsLoggedIn(true);
        setToken(token);
        localStorage.setItem("token", token);

        toast.success("Login successful! Token saved.");
        reset();
      } else {
        // REGISTER FLOW
        const res = await fetch(
          "https://emailservice-5iny.onrender.com/auth/users/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        const result = await res.json();

        if (!res.ok) {
          // Handle DRF/Djoser field errors in a user-friendly way
          const messages: string[] = [];
          for (const key in result) {
            if (Array.isArray(result[key])) {
              messages.push(
                `${key.charAt(0).toUpperCase() + key.slice(1)}: ${result[
                  key
                ].join(", ")}`
              );
            } else {
              messages.push(`${key}: ${result[key]}`);
            }
          }
          throw new Error(messages.join("\n"));
        }

        // Registration successful message (no token yet)
        toast.success("Registration successful! Now log in to get your token.");
        reset();
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-white via-blue-50 to-white text-gray-900"
      }`}
    >
      <Toaster position="top-center" />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* About Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative">
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
            Email Service API
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed mb-8">
            A simple and secure API for developers to receive form submissions
            from their websites directly via email. Fast, reliable, and easy to
            integrate.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() =>
                document
                  .getElementById("auth")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-900 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("documentation")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 border-2 border-blue-800 text-blue-800 rounded-xl font-semibold hover:bg-blue-800 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              View Docs
            </button>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section
        id="auth"
        className="min-h-screen flex flex-col justify-center items-center px-6 py-20"
      >
        <div
          className={`w-full max-w-md rounded-2xl p-8 ${
            darkMode
              ? "bg-gray-800/90 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
            {isLoggedIn ? "Your API Token" : "Get Started"}
          </h2>

          {!isLoggedIn ? (
            <>
              <p
                className={`text-center mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Login or Register to get your API token and start sending
                emails.
              </p>

              <button
                onClick={() => setShowAuth((p) => !p)}
                className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-900 hover:to-blue-700 transition-all duration-300"
              >
                Get Token
              </button>

              {showAuth && (
                <div className="space-y-6 mt-6 transition-all duration-500">
                  {/* Tabs */}
                  <div
                    className={`flex p-1 rounded-xl ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <button
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        tab === "login"
                          ? "bg-blue-700 text-white"
                          : darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setTab("login")}
                    >
                      <LogIn className="inline-block mr-2" size={18} /> Login
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        tab === "register"
                          ? "bg-blue-700 text-white"
                          : darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setTab("register")}
                    >
                      <UserPlus className="inline-block mr-2" size={18} />{" "}
                      Register
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {tab === "register" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold">
                          Email
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="Enter your Email"
                          className="w-full rounded-xl px-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/50"
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm font-medium">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Username
                      </label>
                      <input
                        type="text"
                        {...register("username")}
                        placeholder="Enter your Username"
                        className="w-full rounded-xl px-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/50"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm font-medium">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Password
                      </label>
                      <input
                        type="password"
                        {...register("password")}
                        placeholder="Enter password"
                        className="w-full rounded-xl px-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/50"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm font-medium">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300"
                    >
                      {tab === "login" ? "Login" : "Register"}
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6 text-center">
              <div
                className={`p-4 rounded-xl border-2 ${
                  darkMode
                    ? "bg-gray-700/50 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <p className="text-sm font-mono break-all text-left">{token}</p>
              </div>
              <button
                onClick={() => handleCopy(token)}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ClipboardCopy size={18} /> Copy Token
              </button>
              <p className="text-sm text-gray-500">
                Use this token in your Authorization header.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="documentation"
        className={`min-h-screen flex flex-col justify-center px-6 py-20 max-w-6xl mx-auto bg-gradient-to-b ${
          darkMode
            ? "from-gray-900 via-blue-950 to-gray-900 text-gray-100"
            : "from-white to-blue-50 text-gray-800"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-600 mb-4">
            API Documentation
          </h2>
          <p className="text-xl text-gray-500">
            Follow these steps to integrate and use the Email Service API.
          </p>
        </div>

        <div className="space-y-16">
          {/* STEP 1: Register or Login */}
          <div
            className={`p-8 rounded-2xl border transition-all duration-500 ${
              darkMode
                ? "bg-gray-900/60 border-gray-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-blue-600">
                Register or Login
              </h3>
            </div>
            <p className="text-lg mb-6 text-gray-500">
              Create an account or log in to get your unique API token. This
              token will be used to authorize your requests.
            </p>

            <div className="relative">
              <pre
                className={`p-6 rounded-xl text-sm font-mono overflow-x-auto ${
                  darkMode ? "bg-gray-950" : "bg-gray-100"
                }`}
              >
                {`POST https://emailservice-5iny.onrender.com/auth/users/
Content-Type: application/json

{
  "username": "developer123",
  "email": "dev@example.com",
  "password": "yourpassword"
}`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `POST https://emailservice-5iny.onrender.com/auth/users/
Content-Type: application/json

{
  "username": "developer123",
  "email": "dev@example.com",
  "password": "yourpassword"
}`
                  );
                  toast.success("Copied!");
                }}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                <ClipboardCopy size={16} /> Copy
              </button>
            </div>
          </div>

          {/* STEP 2: Get Token */}
          <div
            className={`p-8 rounded-2xl border transition-all duration-500 ${
              darkMode
                ? "bg-gray-900/60 border-gray-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-blue-600">
                Get Your Token
              </h3>
            </div>
            <p className="text-lg mb-6 text-gray-500">
              After logging in, you’ll receive an authentication token. Use it
              in your{" "}
              <code className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
                Authorization
              </code>{" "}
              header when sending requests.
            </p>

            <div className="relative">
              <pre
                className={`p-6 rounded-xl text-sm font-mono overflow-x-auto ${
                  darkMode ? "bg-gray-950" : "bg-gray-100"
                }`}
              >
                {`POST https://emailservice-5iny.onrender.com/auth/token/login/
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "yourpassword"
}

→ Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `POST https://emailservice-5iny.onrender.com/auth/token/login/
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "yourpassword"
}

→ Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}`
                  );
                  toast.success("Copied!");
                }}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                <ClipboardCopy size={16} /> Copy
              </button>
            </div>
          </div>

          {/* STEP 3: Send Email */}
          <div
            className={`p-8 rounded-2xl border transition-all duration-500 ${
              darkMode
                ? "bg-gray-900/60 border-gray-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-blue-600">
                Send Email Request
              </h3>
            </div>
            <p className="text-lg mb-6 text-gray-500">
              Use your token to send an email through your backend. Make a{" "}
              <code className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
                POST
              </code>{" "}
              request to:
              <br />
              <span className="font-semibold text-blue-600">
                https://emailservice-5iny.onrender.com/api/send-email/
              </span>
            </p>

            <div className="relative">
              <pre
                className={`p-6 rounded-xl text-sm font-mono overflow-x-auto ${
                  darkMode ? "bg-gray-950" : "bg-gray-100"
                }`}
              >
                {`fetch("https://emailservice-5iny.onrender.com/api/send-email/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
  },
  body: JSON.stringify({
    subject: "Website Contact Form",
    body: "A new visitor has sent a message from your site.",
    email: "visitor@example.com"
  })
})
  .then(res => res.json())
  .then(data => console.log("Email sent successfully:", data))
  .catch(err => console.error("Error sending email:", err));`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `fetch("https://emailservice-5iny.onrender.com/api/send-email/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
  },
  body: JSON.stringify({
    subject: "Website Contact Form",
    body: "A new visitor has sent a message from your site.",
    email: "visitor@example.com"
  })
})
  .then(res => res.json())
  .then(data => console.log("Email sent successfully:", data))
  .catch(err => console.error("Error sending email:", err));`
                  );
                  toast.success("Copied!");
                }}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                <ClipboardCopy size={16} /> Copy
              </button>
            </div>
          </div>

          {/* STEP 4: Response Example */}
          <div
            className={`p-8 rounded-2xl border transition-all duration-500 ${
              darkMode
                ? "bg-gray-900/60 border-gray-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <h3 className="text-2xl font-bold text-blue-600">
                Response Example
              </h3>
            </div>
            <p className="text-lg mb-6 text-gray-500">
              A successful request will return a response like this:
            </p>
            <div className="relative">
              <pre
                className={`p-6 rounded-xl text-sm font-mono overflow-x-auto ${
                  darkMode ? "bg-gray-950" : "bg-gray-100"
                }`}
              >
                {`{
  "status": "success",
  "message": "Email sent successfully to developer@example.com"
}`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `{
  "status": "success",
  "message": "Email sent successfully to developer@example.com"
}`
                  );
                  toast.success("Copied!");
                }}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                <ClipboardCopy size={16} /> Copy
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer darkMode={darkMode} />
    </div>
  );
}
