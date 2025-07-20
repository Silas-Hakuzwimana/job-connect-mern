import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "jobseeker",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        // Basic client-side validation
        if (form.name.length < 2) {
            setError("Name must be at least 2 characters");
            setLoading(false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError("Invalid email format");
            setLoading(false);
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }


        try {
            await authService.register({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            });

            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Registration failed"
            );
            return;
        } finally {
            setLoading(false);
        }
        setForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "jobseeker",
        });
        setError("");
        setLoading(false);
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Enter your password"
                        minLength={6}
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirm your password"
                        minLength={6}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="jobseeker">Job Seeker</option>
                        <option value="company">Company</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Companies require admin approval before activation.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <p>
                    <span className="text-gray-600">Already have an account?</span>
                    &nbsp;
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </a>
                </p>
            </form>
        </div>
    );
}
