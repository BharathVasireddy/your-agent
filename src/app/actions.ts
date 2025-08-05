"use server";

import { getServerSession } from "next-auth/next";
import authConfig from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function grantSubscription() {
  try {
    // Get the current user's session
    const session = await getServerSession(authConfig);
    
    if (!session || !session.user || !session.user.id) {
      throw new Error("You must be signed in to grant subscription");
    }

    const userId = session.user.id as string;

    // Try to find existing agent profile
    let agent = await prisma.agent.findUnique({
      where: { userId }
    });

    // Set subscription end date to 1 year from now
    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1);

    if (!agent) {
      // Create new agent profile
      // Generate a unique slug based on user name or email
      const baseSlug = session.user.name 
        ? generateSlug(session.user.name)
        : session.user.email?.split('@')[0] 
          ? generateSlug(session.user.email.split('@')[0])
          : 'agent';
      
      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      
      while (await prisma.agent.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      agent = await prisma.agent.create({
        data: {
          userId,
          slug,
          isSubscribed: true,
          subscriptionEndsAt,
          theme: "professional-blue",
          bio: `Professional real estate agent with expertise in property sales and customer service.`,
          city: "Your City",
          specialization: "Residential Properties"
        }
      });

      // Revalidate the /dev page to refresh data
      revalidatePath('/dev');

      return {
        success: true,
        message: `New agent profile created with slug '${slug}'! Subscription active until ${subscriptionEndsAt.toLocaleDateString()}.`,
        agent
      };
    } else {
      // Update existing agent profile
      agent = await prisma.agent.update({
        where: { userId },
        data: {
          isSubscribed: true,
          subscriptionEndsAt,
          updatedAt: new Date()
        }
      });

      // Revalidate the /dev page to refresh data
      revalidatePath('/dev');
      
      return {
        success: true,
        message: `Agent profile updated! Subscription active until ${subscriptionEndsAt.toLocaleDateString()}.`,
        agent
      };
    }

  } catch (error) {
    console.error("Error in grantSubscription:", error);
    
    throw new Error(error instanceof Error ? error.message : "Failed to grant subscription");
  }
}

export async function subscribeAndRedirect() {
  try {
    // Grant the subscription
    await grantSubscription();
    
    // Revalidate and redirect to wizard
    revalidatePath('/onboarding/wizard');
    redirect('/onboarding/wizard');
  } catch (error) {
    // If error occurs, redirect back to subscribe page with error
    revalidatePath('/subscribe');
    redirect('/subscribe?error=' + encodeURIComponent(error instanceof Error ? error.message : "Failed to subscribe"));
  }
}