import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Building2, Shield, ChevronRight, Star, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';

export default function Home() {
  //const [activeTab, setActiveTab] = useState(0);
  const [statsCount, setStatsCount] = useState({ jobs: 0, companies: 0, users: 0 });

  // Animated counter effect
  useEffect(() => {
    const targetStats = { jobs: 2500, companies: 850, users: 12000 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStatsCount({
        jobs: Math.floor(targetStats.jobs * progress),
        companies: Math.floor(targetStats.companies * progress),
        users: Math.floor(targetStats.users * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setStatsCount(targetStats);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();
  const redirectTo = (url) => {
    navigate(url);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "TechCorp",
      content: "Found my dream job within 2 weeks! The platform's matching algorithm is incredible.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "HR Director",
      company: "Innovation Labs",
      content: "Best recruitment platform we've used. Quality candidates and intuitive interface.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Marketing Manager",
      company: "Creative Agency",
      content: "The application tracking feature saved me so much time. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 -mx-4 -my-8">{/* Compensate for Layout padding */}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and ambitions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Search Jobs
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{statsCount.jobs.toLocaleString()}+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{statsCount.companies.toLocaleString()}+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{statsCount.users.toLocaleString()}+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-10 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Features for Every User
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to make job searching and hiring effortless
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Job Seekers */}
          <div className="group p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-700">Job Seekers</h3>
            </div>
            <div className="space-y-4">
              {[
                "Register with secure 2FA authentication",
                "Upload resumes and profile pictures",
                "Smart job matching algorithm",
                "Track application status in real-time",
                "Bookmark and organize favorite jobs"
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2" onClick={() => redirectTo('/login')}>
              <span>Get Started</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Companies */}
          <div className="group p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700">Companies</h3>
            </div>
            <div className="space-y-4">
              {[
                "Quick registration with admin approval",
                "Post and manage job listings easily",
                "Define detailed job requirements",
                "Advanced applicant filtering",
                "Real-time notifications system"
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2" onClick={() => redirectTo('/login')}>
              <span>Start Hiring</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Admin */}
          <div className="group p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-700">Admin</h3>
            </div>
            <div className="space-y-4">
              {[
                "Comprehensive user management",
                "Company and job approval system",
                "Advanced analytics dashboard",
                "Custom email notification system",
                "Platform monitoring tools"
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2" onClick={() => redirectTo('/login')}>
              <span>Admin Panel</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 mx-[-2.5rem]">
        <div className="px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect talent with opportunity
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Create Profile</h3>
              <p className="text-gray-600">Sign up and build your professional profile with all relevant information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Find Matches</h3>
              <p className="text-gray-600">Our algorithm matches you with relevant opportunities or candidates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Connect & Hire</h3>
              <p className="text-gray-600">Apply or review applications and make successful connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied job seekers and employers</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white mx-[-2.5rem]">
        <div className="px-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join JobHub today and take the next step in your career journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold" onClick={() => redirectTo('/login')}>
              Find Jobs
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold" onClick={() => redirectTo('/login')}>
              Post Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}