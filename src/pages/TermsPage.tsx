import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <Link to="/register" className="text-blue-600 hover:text-blue-500 mb-6 inline-block">
            ← Back to registration
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Excel Analytics Platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use Excel Analytics Platform for personal and business purposes. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Account</h2>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Privacy</h2>
              <p className="text-gray-700 mb-4">
                We respect your privacy and are committed to protecting your personal data. Please refer to our Privacy Policy for details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Excel Analytics or its suppliers be liable for any damages arising out of the use or inability to use the service.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
              <p className="text-blue-800 text-sm">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@excelanalytics.com" className="font-medium underline">
                  legal@excelanalytics.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;