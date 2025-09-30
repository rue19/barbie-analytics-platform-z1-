import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Zap, Upload, Sparkles, Crown, Heart } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-barbie-gradient">
      {/* Sparkle decorations */}
      <div className="absolute top-10 left-10 animate-pulse">
        <Sparkles className="text-barbie-400" size={24} />
      </div>
      <div className="absolute top-20 right-20 animate-bounce">
        <Heart className="text-barbie-500" size={28} />
      </div>
      <div className="absolute bottom-20 left-20 animate-pulse">
        <Crown className="text-barbie-600" size={32} />
      </div>

      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Crown className="text-barbie-600 mr-2" size={32} />
            <h1 className="text-2xl font-bold text-barbie-600">Excel Analytics</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-barbie-600 hover:text-barbie-700 font-medium">
              Login
            </Link>
            <Link 
              to="/upload" 
              className="bg-barbie-500 text-white px-6 py-3 rounded-full hover:bg-barbie-600 font-medium shadow-lg hover:shadow-barbie-200 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <Sparkles className="text-barbie-500" size={20} />
            <span className="text-barbie-600 font-semibold">The Most Fabulous Analytics Platform</span>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Transform Excel Files into <span className="text-barbie-500">Fabulous Insights</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Upload your Excel spreadsheets and create absolutely gorgeous visualizations with AI-powered analytics. It's everything you love, in pink! 💖
        </p>
        
        <div className="flex justify-center space-x-4 mb-16">
          <Link 
            to="/upload" 
            className="bg-barbie-500 text-white px-8 py-4 rounded-full hover:bg-barbie-600 font-medium text-lg flex items-center shadow-lg hover:shadow-barbie-200 transition-all duration-300 hover:scale-105"
          >
            <Upload className="mr-2" size={20} />
            Start Creating Magic
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-barbie-100 hover:shadow-barbie-100 transition-all duration-300">
            <div className="w-16 h-16 bg-barbie-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-barbie-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Fabulous Visualizations</h3>
            <p className="text-gray-600">Create stunning pink charts and graphs that make your data look absolutely amazing.</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-barbie-100 hover:shadow-barbie-100 transition-all duration-300">
            <div className="w-16 h-16 bg-barbie-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-barbie-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Magical AI Insights</h3>
            <p className="text-gray-600">Get automatic trend detection and insights that sparkle as much as your data.</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-barbie-100 hover:shadow-barbie-100 transition-all duration-300">
            <div className="w-16 h-16 bg-barbie-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="text-barbie-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Easy & Fun Upload</h3>
            <p className="text-gray-600">Drag and drop your Excel files in our beautiful pink upload zone.</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-barbie-100">
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Heart key={star} className="text-barbie-500 mx-1" size={20} fill="currentColor" />
            ))}
          </div>
          <p className="text-lg text-gray-700 italic mb-4">
            "This platform made data analysis so much fun! The pink theme is absolutely perfect and the visualizations are gorgeous."
          </p>
          <p className="text-barbie-600 font-semibold">- Data Analyst & Barbie Fan</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;