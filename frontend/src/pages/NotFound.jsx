import React from 'react';
import { Home, ArrowLeft, Search, Briefcase } from 'lucide-react';

const NotFound = () => {
  // In your actual implementation, you'll import these from react-router-dom
  const navigate = (direction) => {
    // navigate(-1) for going back
    console.log('Navigate:', direction);
  };
  
  const Link = ({ to, children, className, ...props }) => {
    // This is a mock Link component for the artifact
    return (
      <a href={to} className={className} {...props} onClick={(e) => {
        e.preventDefault();
        console.log('Navigate to:', to);
      }}>
        {children}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 -mx-4 -my-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Large 404 with gradient */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Error message */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/jobs"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Search className="h-5 w-5" />
            <span>Browse Jobs</span>
          </Link>
        </div>

        {/* Helpful suggestions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What would you like to do?
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left group"
            >
              <div className="font-semibold text-blue-700 group-hover:text-blue-800">
                Explore Our Platform
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Discover how JobHub works
              </div>
            </Link>
            
            <Link
              to="/jobs"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left group"
            >
              <div className="font-semibold text-green-700 group-hover:text-green-800">
                Find Your Next Job
              </div>
              <div className="text-sm text-green-600 mt-1">
                Browse available positions
              </div>
            </Link>
          </div>
        </div>

        {/* Floating animation elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-32 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
};

export default NotFound;