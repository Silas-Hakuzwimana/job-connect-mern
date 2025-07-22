import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {

    const navigate = useNavigate();
    const redirectTo = (path) => {
       navigate(path);
    };

    return (
        <footer className="bg-gray-900 text-white py-12 mt-auto w-100">
            <div className="container mx-auto px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Briefcase className="h-8 w-8 text-blue-400" />
                            <span className="text-2xl font-bold">JobConnect</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Connecting talent with opportunity through innovative job matching technology.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Phone className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <MapPin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Job Seekers */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">For Job Seekers</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Browse Jobs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors hover:underline">Career Resources</a></li>
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Resume Builder</a></li>
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Interview Tips</a></li>
                        </ul>
                    </div>

                    {/* Employers */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">For Employers</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Post Jobs</a></li>
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Talent Search</a></li>
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Pricing Plans</a></li>
                            <li><a href="#" onClick={() => redirectTo('/login')} className="hover:text-white transition-colors hover:underline">Recruiting Tools</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Company</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors hover:underline">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors hover:underline">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}