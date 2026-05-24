import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Zap, Shield, Search, Moon, ArrowRight, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const features = [
    {
      icon: <CheckSquare className="w-6 h-6 text-primary-600" />,
      title: 'Smart Task Management',
      desc: 'Create, update, and organize tasks with priorities, due dates, and status tracking.',
    },
    {
      icon: <Shield className="w-6 h-6 text-primary-600" />,
      title: 'Secure Authentication',
      desc: 'JWT-based auth with email OTP verification keeps your account safe.',
    },
    {
      icon: <Search className="w-6 h-6 text-primary-600" />,
      title: 'Search & Filter',
      desc: 'Instantly find tasks by title, filter by status, and sort by date or priority.',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary-600" />,
      title: 'Lightning Fast',
      desc: 'Built with React + Vite for instant page loads and smooth interactions.',
    },
    {
      icon: <Moon className="w-6 h-6 text-primary-600" />,
      title: 'Dark Mode',
      desc: 'Easy on the eyes with a beautiful dark theme that persists across sessions.',
    },
    {
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      title: 'Real-time Updates',
      desc: 'Changes reflect instantly without page reloads for a seamless experience.',
    },
  ];

  const steps = [
    { step: '01', title: 'Create Account', desc: 'Sign up with your email and verify with a one-time password.' },
    { step: '02', title: 'Add Your Tasks', desc: 'Create tasks with titles, descriptions, priorities, and due dates.' },
    { step: '03', title: 'Stay Organized', desc: 'Track progress, filter by status, and never miss a deadline.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-28">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          Full-Stack Task Manager
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight max-w-3xl mb-6">
          Manage Tasks with{' '}
          <span className="text-primary-600">Clarity & Speed</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-10 leading-relaxed">
          TaskFlow is a full-stack productivity app with secure authentication, real-time task management, and a beautiful UI — built with React, Node.js & MongoDB.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary-200 dark:shadow-none"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-sm mx-auto">
          {[
            { value: '100%', label: 'Open Source' },
            { value: 'JWT', label: 'Secure Auth' },
            { value: 'OTP', label: 'Email Verify' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A complete task management solution with all the features you need to stay productive.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 group">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400">Get up and running in minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Organized?</h2>
          <p className="text-primary-100 mb-8">Join TaskFlow today and take control of your productivity.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-primary-100 text-sm">
            {['No credit card required', 'Free forever', 'Open source'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;