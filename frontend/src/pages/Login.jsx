import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.login({ email, password });
            setStep(2);
            toast.info("OTP sent to your email");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { user } = await authService.verifyOtp({ email, otp });
            login(user); // save user in context/localStorage
            toast.success("Logged in successfully");

            // 🔀 Redirect based on role
            switch (user.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "company":
                    navigate("/company/dashboard");
                    break;
                case "seeker":
                    navigate("/seeker/dashboard");
                    break;
                default:
                    navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-12 p-8 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            {step === 1 && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Login"}
                    </button>
                    <p className="text-sm text-center mt-2">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Register here
                        </a>
                    </p>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Enter OTP sent to your email</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? "Verifying OTP..." : "Verify OTP"}
                    </button>
                </form>
            )}
        </div>
    );
}
