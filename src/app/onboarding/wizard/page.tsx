import { getServerSession } from "next-auth/next";
import authConfig from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingWizardPage() {
  // Get the user's session
  const session = await getServerSession(authConfig);

  // If no session, redirect to sign in
  if (!session || !session.user || !session.user.id) {
    redirect('/api/auth/signin');
  }

  // Query the database for the user's agent profile
  const agent = await prisma.agent.findUnique({
    where: { 
      userId: session.user.id as string 
    }
  });

  // Check if user is subscribed
  if (!agent || !agent.isSubscribed) {
    redirect('/subscribe');
  }

  // User is subscribed, show the wizard
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-6">
          <h1 
            className="text-4xl font-bold"
            style={{ color: "var(--primary-red)" }}
          >
            Welcome to the Profile Wizard!
          </h1>
          
          <p className="text-xl text-gray-700">
            Hello, {session.user.name || session.user.email}! 
          </p>
          
          <p className="text-gray-600">
            Let&apos;s set up your real estate agent profile to showcase your expertise and attract clients.
          </p>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Your subscription is active until {agent.subscriptionEndsAt?.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}