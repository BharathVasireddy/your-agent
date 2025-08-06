'use client';

import { Button } from '@/components/ui/button';
import EditableWrapper from '@/components/ClientOnlyEditableWrapper';
import { updateAgentBio } from '@/app/actions';
import { useParams } from 'next/navigation';

interface Agent {
  id: string;
  experience: number | null;
  bio: string | null;
  city: string | null;
  area: string | null;
  profilePhotoUrl: string | null;
  user: {
    name: string | null;
  };
}

interface AboutSectionProps {
  agent: Agent;
}

export default function AboutSection({ agent }: AboutSectionProps) {
  const params = useParams();
  const agentSlug = params.agentSlug as string;

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadVCard = () => {
    // This would typically generate and download a vCard file
    // For now, we'll just scroll to contact
    scrollToContact();
  };

  // Default bio if none provided
  const defaultBio = `With over ${agent.experience || 15} years of experience in luxury real estate, I specialize in helping clients find their dream homes in ${agent.city || 'the city'}'s most prestigious neighborhoods. My deep knowledge of the local market, combined with a passion for exceptional service, ensures that every client receives personalized attention and expert guidance throughout their real estate journey.`;

  const stats = [
    {
      number: `${agent.experience || 15}+`,
      label: 'Years Experience',
      bgColor: 'bg-blue-200',
      textColor: 'text-blue-900'
    },
    {
      number: '200+',
      label: 'Clients',
      bgColor: 'bg-purple-200',
      textColor: 'text-purple-900'
    },
    {
      number: '450+',
      label: 'Property Sold',
      bgColor: 'bg-orange-200',
      textColor: 'text-orange-900'
    }
  ];

  return (
    <section id="about" className="w-full py-16 lg:py-24 bg-white">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Agent Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                {agent.profilePhotoUrl ? (
                  <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={agent.profilePhotoUrl}
                        alt={agent.user.name || 'Agent photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="aspect-[4/5] rounded-3xl bg-gray-300 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <div className="text-4xl mb-2">👤</div>
                        <div className="text-sm">No photo available</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              {/* About Tag */}
              <div className="inline-flex items-center px-4 py-2 bg-gray-200 rounded-full mb-6">
                <span className="text-gray-700 text-sm font-medium">About</span>
              </div>

              {/* Agent Name */}
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {agent.user.name || 'Agent Name'}
              </h2>

              {/* Bio Text */}
              <EditableWrapper
                value={agent.bio || defaultBio}
                onSave={async (newBio) => {
                  await updateAgentBio(agentSlug, newBio);
                }}
                type="textarea"
                placeholder="Tell your story..."
              >
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {agent.bio || defaultBio}
                </p>
              </EditableWrapper>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.bgColor} rounded-2xl p-8 text-center min-h-[120px] flex flex-col justify-center`}
                  >
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.textColor} mb-1`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm ${stat.textColor} font-medium`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToContact}
                  className="bg-black hover:bg-gray-800 text-white px-12 py-4 rounded-full font-medium transition-all duration-300 text-lg"
                  size="lg"
                >
                  Book a slot
                </Button>
                <Button
                  onClick={downloadVCard}
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 px-12 py-4 rounded-full font-medium transition-all duration-300 bg-transparent text-lg"
                  size="lg"
                >
                  Download visiting card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}