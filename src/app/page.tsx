import Link from 'next/link';
import { 
  CheckCircle, 
  Users, 
  Sparkles, 
  BarChart3, 
  Star,
  Phone,
  Mail,
  MapPin,
  Home
} from 'lucide-react';
import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import LoginButton from '@/components/LoginButton';
import { Pricing as AnimatedPricing } from '@/components/ui/pricing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header id="header" className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image src="/images/Your-Agent-Logo.png" alt="YourAgent" width={160} height={32} className="h-8 w-auto" />
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-zinc-600 hover:text-zinc-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-zinc-600 hover:text-zinc-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-zinc-600 hover:text-zinc-900 transition-colors">Pricing</a>
              <LoginButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-950 mb-6 leading-tight">
              Your Professional Real Estate
              <span className="text-brand"> Digital Presence</span>
          </h1>
            <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create stunning agent profiles, manage properties effortlessly, and grow your real estate business with AI-powered tools trusted by professionals across India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <LoginButton />
              <Link 
                href="#how-it-works"
                className="btn-lg border-2 border-brand text-brand bg-white rounded-md hover:bg-brand-light transition-all duration-200 font-medium flex items-center gap-2"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand" />
                <span>No technical knowledge required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Professional tools designed specifically for real estate agents in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-muted rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Professional Profiles</h3>
              <p className="text-zinc-600 leading-relaxed">
                Create stunning agent profiles with your photo, credentials, specializations, and service areas. Stand out from the competition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
                <Home className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Property Management</h3>
              <p className="text-zinc-600 leading-relaxed">
                Organize and showcase your property listings with beautiful galleries and smart categorization for sales and rentals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">AI-Powered Tools</h3>
              <p className="text-zinc-600 leading-relaxed">
                Generate professional property descriptions and personal bios with AI assistance. Save time and create compelling content.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Analytics & Insights</h3>
              <p className="text-zinc-600 leading-relaxed">
                Track your profile views, property engagement, and lead generation with detailed analytics to grow your business.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Lead Generation</h3>
              <p className="text-zinc-600 leading-relaxed">
                Get direct calls and emails from interested clients through your professional profile. Convert visitors into leads.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Local Expertise</h3>
              <p className="text-zinc-600 leading-relaxed">
                Showcase your expertise in specific Hyderabad areas like Gachibowli, Madhapur, or Kokapet. Connect with local clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Launch your professional real estate presence in minutes, not days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Sign Up with Google</h3>
              <p className="text-zinc-600 leading-relaxed">
                Quick and secure registration using your Google account. No complex forms or lengthy verification processes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Complete Your Profile</h3>
              <p className="text-zinc-600 leading-relaxed">
                Add your professional details, photo, and specializations. Our AI helps you create compelling content.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-4">Start Adding Properties</h3>
              <p className="text-zinc-600 leading-relaxed">
                Upload your property listings and watch leads start flowing. Share your profile URL anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">
              Trusted by Real Estate Professionals
            </h2>
            <p className="text-xl text-zinc-600">
              Join hundreds of agents who have transformed their business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-brand fill-current" />
                ))}
              </div>
              <p className="text-zinc-600 mb-6 leading-relaxed">
                &ldquo;YourAgent helped me create a professional online presence that clients trust. My lead generation has increased by 300% since I started using the platform.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-muted rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-brand">RK</span>
                </div>
                <div>
                  <p className="font-semibold text-zinc-950">Rajesh Kumar</p>
                  <p className="text-sm text-zinc-600">Senior Agent, Gachibowli</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-brand fill-current" />
                ))}
              </div>
              <p className="text-zinc-600 mb-6 leading-relaxed">
                &ldquo;The AI-powered bio and property descriptions save me hours every week. The platform is intuitive and my clients love the professional presentation.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-600">PS</span>
                </div>
                <div>
                  <p className="font-semibold text-zinc-950">Priya Sharma</p>
                  <p className="text-sm text-zinc-600">Real Estate Consultant, Madhapur</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-brand fill-current" />
                ))}
              </div>
              <p className="text-zinc-600 mb-6 leading-relaxed">
                &ldquo;Finally, a platform designed for Indian real estate agents. The Hyderabad area specialization features help me connect with the right local clients.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-green-600">AM</span>
                </div>
                <div>
                  <p className="font-semibold text-zinc-950">Arjun Mehta</p>
                  <p className="text-sm text-zinc-600">Property Advisor, Kokapet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-zinc-50">
        <div className="container mx-auto px-6">
          {/* INR pricing with annual toggle; links go to /subscribe */}
          <AnimatedPricing
            plans={[
              {
                name: 'STARTER',
                price: '299',
                quarterlyPrice: '283',
                yearlyPrice: '249',
                period: 'per month',
                features: [
                  'Custom domain (youragent.in/your-name)',
                  '25 Listings',
                  'Unlimited CRM Leads',
                  'WhatsApp Enquiry',
                  'Single Template',
                ],
                description: 'Great for getting started',
                buttonText: 'Choose Starter',
                href: '/subscribe',
                isPopular: false,
              },
              {
                name: 'GROWTH',
                price: '499',
                quarterlyPrice: '467',
                yearlyPrice: '416',
                period: 'per month',
                features: [
                  'Everything in Starter',
                  'Exclusive Listing Deals from YourAgent',
                  'Access to All Design Templates',
                  'Priority Support',
                ],
                description: 'Best for growing agents',
                buttonText: 'Choose Growth',
                href: '/subscribe',
                isPopular: true,
              },
              {
                name: 'PRO',
                price: '699',
                quarterlyPrice: '633',
                yearlyPrice: '583',
                period: 'per month',
                features: [
                  'Everything in Growth',
                  'Marketing Support (Meta & Google)',
                  'SEO Tools',
                  'Site Analytics',
                ],
                description: 'For power users',
                buttonText: 'Choose Pro',
                href: '/subscribe',
                isPopular: false,
              },
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
              <Image src="/images/Your-Agent-Logo.png" alt="YourAgent" width={140} height={28} className="h-7 w-auto" />
              </div>
              <p className="text-zinc-400 mb-4">
                Empowering real estate professionals with digital tools for success.
              </p>
              <p className="text-zinc-400 text-sm">
                Made in India for Indian real estate agents.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#header" className="hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-brand" />
                  <a href="mailto:support@youragent.in" className="hover:text-white transition-colors">
                    support@youragent.in
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-brand" />
                  <a href="tel:+911234567890" className="hover:text-white transition-colors">
                    +91 12345 67890
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-brand" />
                  <span>Hyderabad, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-8 pt-8 text-zinc-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
              <p>&copy; 2025 YourAgent. All rights reserved.</p>
              <p>All trademarks are the property of their respective owners.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
