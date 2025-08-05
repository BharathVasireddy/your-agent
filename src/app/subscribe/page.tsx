import { getServerSession } from "next-auth/next";
import authConfig from "@/lib/auth";
import { subscribeAndRedirect } from "@/app/actions";
import { redirect } from "next/navigation";

async function SubscribePage() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-6">
          <h1 
            className="text-3xl font-bold"
            style={{ color: "var(--primary-red)" }}
          >
            Subscribe to Continue
          </h1>
          
          <p className="text-gray-600">
            You need an active subscription to access the Profile Wizard and create your agent profile.
          </p>

          <div className="space-y-4">
            <div className="p-4 border-2 rounded-lg" style={{ borderColor: "var(--primary-red-light)" }}>
              <h3 className="font-semibold text-lg mb-2">Agent Subscription</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Create professional agent profile</li>
                <li>• List unlimited properties</li>
                <li>• Custom domain slug</li>
                <li>• Client management tools</li>
                <li>• 1 year subscription</li>
              </ul>
            </div>

            <form action={subscribeAndRedirect}>
              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-200"
                style={{ backgroundColor: "var(--primary-red)" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red)"}
              >
                Activate Subscription
              </button>
            </form>

            <p className="text-xs text-gray-500">
              For development purposes, this will instantly grant you a 1-year subscription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscribePage;