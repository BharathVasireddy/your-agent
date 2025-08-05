"use server";

import prisma from "@/lib/prisma";

export async function makeSubscribedAgent(userId: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { agentProfile: true }
    });

    if (!user) {
      return {
        success: false,
        error: "User not found"
      };
    }

    // Set subscription end date to 1 year from now
    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1);

    let agent;

    if (user.agentProfile) {
      // Update existing agent profile
      agent = await prisma.agent.update({
        where: { userId: userId },
        data: {
          isSubscribed: true,
          subscriptionEndsAt: subscriptionEndsAt,
          updatedAt: new Date()
        }
      });
      
      return {
        success: true,
        message: `Agent profile updated! Subscription active until ${subscriptionEndsAt.toLocaleDateString()}.`,
        agent
      };
    } else {
      // Create new agent profile
      // Generate a unique slug based on user name or email
      const baseSlug = user.name 
        ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
        : user.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '') || 'agent';
      
      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      
      while (await prisma.agent.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      agent = await prisma.agent.create({
        data: {
          userId: userId,
          slug: slug,
          isSubscribed: true,
          subscriptionEndsAt: subscriptionEndsAt,
          theme: "professional-blue",
          // Optional: Set some default values
          bio: `Professional real estate agent with expertise in property sales and customer service.`,
          city: "Your City",
          specialization: "Residential Properties"
        }
      });

      return {
        success: true,
        message: `New agent profile created with slug '${slug}'! Subscription active until ${subscriptionEndsAt.toLocaleDateString()}.`,
        agent
      };
    }

  } catch (error) {
    console.error("Error in makeSubscribedAgent:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update agent profile"
    };
  }
}