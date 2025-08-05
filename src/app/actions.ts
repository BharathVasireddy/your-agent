"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";

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
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to grant subscription");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const baseSlug = (session as any).user.name 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? generateSlug((session as any).user.name)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (session as any).user.email?.split('@')[0] 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? generateSlug((session as any).user.email.split('@')[0])
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

// Validation schema for agent profile data
const agentProfileSchema = z.object({
  experience: z.number().min(0).max(50),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less"),
  phone: z.string().min(1, "Phone number is required"),
  city: z.string().min(1, "City is required"),
  theme: z.string().min(1, "Theme is required"),
  profilePhotoUrl: z.string().optional(),
  slug: z.string().min(3, "Profile URL must be at least 3 characters").max(50, "Profile URL must be less than 50 characters"),
});

export async function updateAgentProfile(data: {
  experience: number;
  specialization: string;
  licenseNumber: string;
  bio: string;
  phone: string;
  city: string;
  theme: string;
  profilePhotoUrl: string;
  slug: string;
}) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update your profile");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Validate the incoming data
    const validatedData = agentProfileSchema.parse(data);

    // Find existing agent profile
    const existingAgent = await prisma.agent.findUnique({
      where: { userId }
    });

    if (!existingAgent) {
      throw new Error("Agent profile not found. Please subscribe first.");
    }

    // Check if the custom slug is available (unless it's the same agent)
    if (validatedData.slug !== existingAgent.slug) {
      const slugConflict = await prisma.agent.findUnique({
        where: { slug: validatedData.slug }
      });

      if (slugConflict) {
        throw new Error("This profile URL is already taken. Please choose a different one.");
      }
    }

    // Update the agent profile
    const updatedAgent = await prisma.agent.update({
      where: { userId },
      data: {
        experience: validatedData.experience,
        specialization: validatedData.specialization,
        licenseNumber: validatedData.licenseNumber || null,
        bio: validatedData.bio,
        phone: validatedData.phone,
        city: validatedData.city,
        theme: validatedData.theme,
        profilePhotoUrl: validatedData.profilePhotoUrl || null,
        slug: validatedData.slug,
        updatedAt: new Date()
      }
    });

    // Revalidate the agent's public profile page
    revalidatePath(`/${updatedAgent.slug}`);
    
    // Redirect to the agent's public profile page
    redirect(`/${updatedAgent.slug}`);

  } catch (error) {
    // Check if this is a Next.js redirect (which is expected behavior)
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      // This is a redirect, which is expected - re-throw it to allow Next.js to handle it
      throw error;
    }
    
    console.error("Error in updateAgentProfile:", error);
    
    if (error instanceof z.ZodError) {
      throw new Error("Invalid profile data: " + error.issues.map(e => e.message).join(", "));
    }
    
    throw new Error(error instanceof Error ? error.message : "Failed to update profile");
  }
}

export async function generateBio(data: {
  name: string;
  experience: number;
  specialization: string;
  city: string;
  licenseNumber?: string;
}) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Write a professional bio for a real estate agent with the following details:
- Name: ${data.name}
- Experience: ${data.experience} years in real estate
- Specialization: ${data.specialization}
- City: ${data.city}
${data.licenseNumber ? `- License Number: ${data.licenseNumber}` : ""}

The bio should be:
- Professional and trustworthy
- 2-3 sentences long (under 300 characters)
- Highlight their expertise and local market knowledge
- Suitable for a real estate agent profile page
- Written in first person ("I" perspective) as if the agent is speaking directly to potential clients
- Personal and engaging while maintaining professionalism

Do not include any special formatting, just plain text.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedBio = completion.choices[0]?.message?.content?.trim();
    
    if (!generatedBio) {
      throw new Error("Failed to generate bio content");
    }

    return {
      success: true,
      bio: generatedBio
    };

  } catch (error) {
    console.error("Error generating bio:", error);
    
    if (error instanceof Error && error.message.includes("API key")) {
      throw new Error("OpenAI API key not configured. Please add your API key to environment variables.");
    }
    
    throw new Error(error instanceof Error ? error.message : "Failed to generate bio");
  }
}