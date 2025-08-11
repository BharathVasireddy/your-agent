'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-zinc-900 text-white py-12">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">YourAgent</h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Connecting people with their perfect homes. Professional real estate services 
                with a personal touch.
              </p>
              <div className="flex items-center text-sm text-zinc-400">
                Made with <Heart className="w-4 h-4 mx-1 text-brand" /> for real estate excellence
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#hero');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#properties');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#about');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#testimonials');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-zinc-400">
                <li>Residential Sales</li>
                <li>Property Buying</li>
                <li>Investment Consulting</li>
                <li>Market Analysis</li>
                <li>Property Valuation</li>
                <li>First-Time Buyer Support</li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-zinc-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-zinc-400 text-sm mb-4 md:mb-0">
                © {currentYear} YourAgent. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6">
                <button
                  onClick={scrollToTop}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Back to Top ↑
                </button>
                <div className="text-zinc-400 text-sm">
                  Professional Real Estate Services
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}