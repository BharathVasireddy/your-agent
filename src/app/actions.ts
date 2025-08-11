"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";
import { PRICE_PAISE, DURATION_MONTHS, addMonths, ENTITLEMENTS, type Plan, type Interval } from '@/lib/subscriptions';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniquePropertySlug(baseSlug: string): Promise<string> {
  // Fetch all existing slugs that start with baseSlug in one round-trip
  const existing = await prisma.property.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });
  const taken = new Set(existing.map(e => e.slug));
  if (!taken.has(baseSlug)) return baseSlug;
  let counter = 1;
  while (taken.has(`${baseSlug}-${counter}`)) counter++;
  return `${baseSlug}-${counter}`;
}

export async function createPropertyAction(formData: FormData) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to create a property");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true, isSubscribed: true, subscriptionPlan: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Auto-grant subscription in development, require it in production
    if (!agent.isSubscribed) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error("You must have an active subscription to create properties");
      } else {
        // Auto-grant subscription in development
        const subscriptionEndsAt = new Date();
        subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1);
        
        await prisma.agent.update({
          where: { id: agent.id },
          data: { 
            isSubscribed: true,
            subscriptionEndsAt: subscriptionEndsAt
          }
        });
      }
    }

    // Enforce listing limit based on plan
    if (agent.subscriptionPlan === 'starter') {
      const count = await prisma.property.count({ where: { agentId: agent.id } });
      if (count >= 25) {
        throw new Error('Listing limit reached for Starter plan. Upgrade to add more listings.');
      }
    }

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string);
    const area = parseInt(formData.get('area') as string);
    const bedrooms = parseInt(formData.get('bedrooms') as string);
    const bathrooms = parseInt(formData.get('bathrooms') as string);
    const location = formData.get('location') as string;
    const listingType = formData.get('listingType') as string;
    const propertyType = formData.get('propertyType') as string;
    const amenitiesJson = formData.get('amenities') as string;
    const amenities = JSON.parse(amenitiesJson || '[]');

    // Validate required fields
    if (!title || !description || !location || price <= 0 || area <= 0) {
      throw new Error("Please fill in all required fields");
    }

    // Handle photo uploads
    const photoFiles = formData.getAll('photos') as File[];
    const photoUrls: string[] = [];

    // Upload photos to Cloudinary (if any) in parallel
    const uploads = photoFiles
      .filter(f => f.size > 0)
      .map(async (file) => {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = buffer.toString('base64');
          const dataUri = `data:${file.type};base64,${base64}`;
          const { v2: cloudinary } = await import('cloudinary');
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });
          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'properties',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            ],
          });
          return uploadResult.secure_url as string;
        } catch (e) {
          console.error('Photo upload error:', e);
          return null;
        }
      });
    const results = await Promise.all(uploads);
    photoUrls.push(...results.filter((u): u is string => !!u));

    // Generate unique slug for the property
    const baseSlug = generateSlug(title);
    const uniqueSlug = await generateUniquePropertySlug(baseSlug);

    // Create the property
    const property = await prisma.property.create({
      data: {
        agentId: agent.id,
        slug: uniqueSlug,
        title,
        description,
        price,
        area,
        bedrooms,
        bathrooms,
        location,
        amenities,
        photos: photoUrls,
        listingType,
        propertyType,
        status: 'Available'
      }
    });

    // Revalidate the properties page
    revalidatePath('/agent/dashboard/properties');
    
    return { success: true, propertyId: property.id };
  } catch (error) {
    console.error("Error creating property:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create property");
  }
}

export async function updatePropertyAction(propertySlug: string, formData: FormData) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update a property");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile and verify property ownership
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true, isSubscribed: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Verify the property belongs to this agent
    const existingProperty = await prisma.property.findFirst({
      where: {
        slug: propertySlug,
        agentId: agent.id
      },
      select: { id: true, title: true }
    });

    if (!existingProperty) {
      throw new Error("Property not found or you don't have permission to edit it");
    }

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string);
    const area = parseInt(formData.get('area') as string);
    const bedrooms = parseInt(formData.get('bedrooms') as string);
    const bathrooms = parseInt(formData.get('bathrooms') as string);
    const location = formData.get('location') as string;
    const listingType = formData.get('listingType') as string;
    const propertyType = formData.get('propertyType') as string;
    const amenitiesJson = formData.get('amenities') as string;
    const amenities = JSON.parse(amenitiesJson || '[]');

    // Validate required fields
    if (!title || !description || !location || price <= 0 || area <= 0) {
      throw new Error("Please fill in all required fields");
    }

    // Handle photo uploads (new photos)
    const photoFiles = formData.getAll('photos') as File[];
    const existingPhotos = formData.get('existingPhotos') as string;
    const existingPhotoUrls = existingPhotos ? JSON.parse(existingPhotos) : [];
    const photoUrls: string[] = [...existingPhotoUrls];

    // Upload new photos to Cloudinary (if any) in parallel
    const newUploads = photoFiles
      .filter(f => f.size > 0)
      .map(async (file) => {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = buffer.toString('base64');
          const dataUri = `data:${file.type};base64,${base64}`;
          const { v2: cloudinary } = await import('cloudinary');
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });
          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'properties',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            ],
          });
          return uploadResult.secure_url as string;
        } catch (e) {
          console.error('Photo upload error:', e);
          return null;
        }
      });
    const newResults = await Promise.all(newUploads);
    photoUrls.push(...newResults.filter((u): u is string => !!u));

    // Generate new slug if title changed
    const updateData: {
      title: string;
      description: string;
      price: number;
      area: number;
      bedrooms: number;
      bathrooms: number;
      location: string;
      amenities: string[];
      status: string;
      listingType: string;
      propertyType: string;
      photos?: string[];
      slug?: string;
    } = {
      title,
      description,
      price,
      area,
      bedrooms,
      bathrooms,
      location,
      amenities,
      photos: photoUrls,
      status: 'Available',
      listingType,
      propertyType
    };

    // If title changed, generate new slug
    if (existingProperty.title !== title) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await generateUniquePropertySlug(baseSlug);
      updateData.slug = uniqueSlug;
    }

    // Update the property
    const property = await prisma.property.update({
      where: { id: existingProperty.id },
      data: updateData
    });

    // Revalidate the properties page
    revalidatePath('/agent/dashboard');
    revalidatePath('/agent/dashboard/properties');
    
    return { success: true, propertyId: property.id };
  } catch (error) {
    console.error("Error updating property:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update property");
  }
}

export async function deletePropertyAction(propertySlug: string) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to delete a property");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Verify the property belongs to this agent and get photo URLs for cleanup
    const existingProperty = await prisma.property.findFirst({
      where: {
        slug: propertySlug,
        agentId: agent.id
      },
      select: { id: true, photos: true }
    });

    if (!existingProperty) {
      throw new Error("Property not found or you don't have permission to delete it");
    }

    // Delete photos from Cloudinary (optional cleanup)
    if (existingProperty.photos.length > 0) {
      try {
        const { v2: cloudinary } = await import('cloudinary');
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Extract public IDs from URLs and delete
        for (const photoUrl of existingProperty.photos) {
          const publicId = photoUrl.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`properties/${publicId}`);
          }
        }
      } catch (cleanupError) {
        console.error('Photo cleanup error:', cleanupError);
        // Continue with property deletion even if photo cleanup fails
      }
    }

    // Delete the property
    await prisma.property.delete({
      where: { id: existingProperty.id }
    });

    // Revalidate the properties page
    revalidatePath('/agent/dashboard');
    revalidatePath('/agent/dashboard/properties');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete property");
  }
}



export async function grantSubscription(opts?: { plan?: Plan; interval?: Interval; endsAt?: Date; amountPaise?: number }) {
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

    // Determine plan/interval/end date
    const plan: Plan = opts?.plan ?? 'growth';
    const interval: Interval = opts?.interval ?? 'monthly';
    const subscriptionEndsAt = opts?.endsAt ?? addMonths(new Date(), DURATION_MONTHS[interval]);

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
          subscriptionPlan: plan,
          subscriptionInterval: interval,
          template: "classic-professional",
          bio: `Professional real estate agent with expertise in property sales and customer service.`,
          city: "Your City",
          area: "Central Area"
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
          subscriptionPlan: plan,
          subscriptionInterval: interval,
          updatedAt: new Date()
        }
      });

      // Revalidate the /dev page to refresh data
      revalidatePath('/dev');
      
      return {
        success: true,
        message: `Agent profile updated! Subscription (${plan}/${interval}) active until ${subscriptionEndsAt.toLocaleDateString()}.`,
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

// Razorpay payment integration
export async function createRazorpayOrder(plan: Plan, interval: Interval) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'Authentication required' };
    }

    // Create Razorpay order
    const { default: Razorpay } = await import('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const amount = PRICE_PAISE[plan][interval];
    const currency = 'INR';

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `subscription_${Date.now()}`,
      notes: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: (session as any).user.id,
        email: session.user.email,
        type: 'subscription',
        plan,
        interval
      }
    });

    return { success: true, order };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create payment order' 
    };
  }
}

export async function verifyPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}, plan: Plan, interval: Interval) {
  try {
    const crypto = await import('crypto');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'Authentication required' };
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== paymentData.razorpay_signature) {
      return { success: false, error: 'Payment verification failed' };
    }

    // Payment verified successfully, grant subscription
    const endsAt = addMonths(new Date(), DURATION_MONTHS[interval]);
    await grantSubscription({ plan, interval, endsAt, amountPaise: PRICE_PAISE[plan][interval] });

    // Store payment record
    const userId = session.user?.id as string;
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    await prisma.payment.create({
      data: {
        userId,
        agentId: agent?.id || null,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        amount: PRICE_PAISE[plan][interval],
        currency: 'INR',
        status: 'completed',
        type: 'subscription',
        plan,
        interval,
        periodEndsAt: endsAt,
        pricePaidPaise: PRICE_PAISE[plan][interval]
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment verification failed' 
    };
  }
}

// Validation schema for agent profile data
  const agentProfileSchema = z.object({
  experience: z.number().min(0).max(50),
  bio: z.string().max(500, "Bio must be 500 characters or less"),
  phone: z.string().min(1, "Phone number is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().optional(),
    template: z.string().min(1, "Template is required"),
  profilePhotoUrl: z.string().optional(),
  slug: z.string().min(3, "Profile URL must be at least 3 characters").max(50, "Profile URL must be less than 50 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  logoUrl: z.string().optional(),
  logoFont: z.string().optional(),
  logoMaxHeight: z.number().optional(),
  logoMaxWidth: z.number().optional(),
  heroImage: z.string().optional(),
  heroTitle: z.string().max(100, "Hero title must be 100 characters or less").optional(),
  heroSubtitle: z.string().max(150, "Hero subtitle must be 150 characters or less").optional(),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    facebookUrl: z.string().url().optional().or(z.literal('')),
    instagramUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    youtubeUrl: z.string().url().optional().or(z.literal('')),
    twitterUrl: z.string().url().optional().or(z.literal('')),
});

export async function updateAgentProfile(data: {
  experience: number;
  bio: string;
  phone: string;
  city: string;
  area: string;
  template: string;
  profilePhotoUrl: string;
  slug: string;
  dateOfBirth: string;
  logoUrl?: string;
  logoFont?: string;
  logoMaxHeight?: number;
  logoMaxWidth?: number;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  // Optionally collect and update user fields during onboarding
  name?: string;
  email?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
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

    // Optionally update the User record with name/email if provided
    if (data.name || data.email) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.email ? { email: data.email } : {}),
        }
      });
    }

    // Find existing agent profile
    let existingAgent = await prisma.agent.findUnique({
      where: { userId }
    });

    if (!existingAgent) {
      // Create a new agent profile for first-time users (no subscription yet)
      existingAgent = await prisma.agent.create({
        data: {
          userId,
          slug: validatedData.slug,
          isSubscribed: false,
          experience: validatedData.experience,
          bio: validatedData.bio,
          phone: validatedData.phone,
          city: validatedData.city,
          area: validatedData.area || null,
          template: validatedData.template,
          profilePhotoUrl: validatedData.profilePhotoUrl || null,
          dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
          logoUrl: validatedData.logoUrl || null,
          logoFont: validatedData.logoFont || null,
          logoMaxHeight: validatedData.logoMaxHeight ?? null,
          logoMaxWidth: validatedData.logoMaxWidth ?? null,
          heroImage: validatedData.heroImage || null,
          heroTitle: validatedData.heroTitle || null,
          heroSubtitle: validatedData.heroSubtitle || null,
          websiteUrl: validatedData.websiteUrl ? validatedData.websiteUrl : null,
          facebookUrl: validatedData.facebookUrl ? validatedData.facebookUrl : null,
          instagramUrl: validatedData.instagramUrl ? validatedData.instagramUrl : null,
          linkedinUrl: validatedData.linkedinUrl ? validatedData.linkedinUrl : null,
          youtubeUrl: validatedData.youtubeUrl ? validatedData.youtubeUrl : null,
          twitterUrl: validatedData.twitterUrl ? validatedData.twitterUrl : null,
        }
      });
      revalidatePath(`/${existingAgent.slug}`);
      revalidatePath('/agent/dashboard');
      revalidatePath('/agent/dashboard/profile');
      return { success: true, agent: existingAgent };
    }

    // Enforce template entitlement based on plan
    const plan = (existingAgent?.subscriptionPlan as 'starter'|'growth'|'pro' | undefined) ?? 'starter';
    const templatesEntitlement = ENTITLEMENTS[plan].templates;
    if (templatesEntitlement !== 'all') {
      const allowed = new Set<string>((templatesEntitlement as unknown) as string[]);
      if (!allowed.has(validatedData.template)) {
        throw new Error('Your plan does not include this template. Please upgrade to use it.');
      }
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
        bio: validatedData.bio,
        phone: validatedData.phone,
        city: validatedData.city,
        area: validatedData.area || null,
        template: validatedData.template,
        profilePhotoUrl: validatedData.profilePhotoUrl || null,
        slug: validatedData.slug,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        logoUrl: validatedData.logoUrl || null,
        logoFont: validatedData.logoFont || null,
        logoMaxHeight: validatedData.logoMaxHeight ?? null,
        logoMaxWidth: validatedData.logoMaxWidth ?? null,
        heroImage: validatedData.heroImage || null,
        heroTitle: validatedData.heroTitle || null,
        heroSubtitle: validatedData.heroSubtitle || null,
        websiteUrl: validatedData.websiteUrl ? validatedData.websiteUrl : null,
        facebookUrl: validatedData.facebookUrl ? validatedData.facebookUrl : null,
        instagramUrl: validatedData.instagramUrl ? validatedData.instagramUrl : null,
        linkedinUrl: validatedData.linkedinUrl ? validatedData.linkedinUrl : null,
        youtubeUrl: validatedData.youtubeUrl ? validatedData.youtubeUrl : null,
        twitterUrl: validatedData.twitterUrl ? validatedData.twitterUrl : null,
        updatedAt: new Date()
      }
    });

      // Revalidate the agent's public profile page and dashboard
    revalidatePath(`/${updatedAgent.slug}`);
    revalidatePath('/agent/dashboard');
    revalidatePath('/agent/dashboard/profile');
    
    return { success: true, agent: updatedAgent };

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
  city: string;
  area?: string;
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
- City: ${data.city}
${data.area ? `- Primary Area: ${data.area}` : ""}

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

// Testimonial Management Actions
export async function addTestimonial(data: { text: string; author: string; role?: string | null; rating?: number | null }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new Error("You must be signed in to add testimonials");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Create the testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        agentId: agent.id,
        text: data.text.trim(),
        author: data.author.trim(),
        role: data.role?.trim() || null,
        rating: data.rating || null
      }
    });

    revalidatePath('/agent/dashboard/profile');
    
    return { success: true, testimonial };
  } catch (error) {
    console.error("Error adding testimonial:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to add testimonial");
  }
}

export async function updateTestimonial(id: string, data: { text: string; author: string; role?: string | null; rating?: number | null }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new Error("You must be signed in to update testimonials");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Verify the testimonial belongs to this agent
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { id, agentId: agent.id }
    });

    if (!existingTestimonial) {
      throw new Error("Testimonial not found or you don't have permission to edit it");
    }

    // Update the testimonial
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        text: data.text.trim(),
        author: data.author.trim(),
        role: data.role?.trim() || null,
        rating: data.rating || null
      }
    });

    revalidatePath('/agent/dashboard/profile');
    
    return { success: true, testimonial };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update testimonial");
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new Error("You must be signed in to delete testimonials");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Verify the testimonial belongs to this agent
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { id, agentId: agent.id }
    });

    if (!existingTestimonial) {
      throw new Error("Testimonial not found or you don't have permission to delete it");
    }

    // Delete the testimonial
    await prisma.testimonial.delete({
      where: { id }
    });

    revalidatePath('/agent/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete testimonial");
  }
}

// FAQ Management Actions
export async function addFAQ(data: { question: string; answer: string }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new Error("You must be signed in to add FAQs");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Create the FAQ
    const faq = await prisma.fAQ.create({
      data: {
        agentId: agent.id,
        question: data.question.trim(),
        answer: data.answer.trim()
      }
    });

    revalidatePath('/agent/dashboard/profile');
    
    return { success: true, faq };
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to add FAQ");
  }
}

export async function updateFAQ(id: string, data: { question: string; answer: string }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new Error("You must be signed in to update FAQs");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Verify the FAQ belongs to this agent
    const existingFAQ = await prisma.fAQ.findFirst({
      where: { id, agentId: agent.id }
    });

    if (!existingFAQ) {
      throw new Error("FAQ not found or you don't have permission to edit it");
    }

    // Update the FAQ
    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: data.question.trim(),
        answer: data.answer.trim()
      }
    });

    revalidatePath('/agent/dashboard/profile');
    
    return { success: true, faq };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update FAQ");
  }
}

export async function deleteFAQ(id: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new Error("You must be signed in to delete FAQs");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!agent) {
      throw new Error("Agent profile not found");
    }

    // Verify the FAQ belongs to this agent
    const existingFAQ = await prisma.fAQ.findFirst({
      where: { id, agentId: agent.id }
    });

    if (!existingFAQ) {
      throw new Error("FAQ not found or you don't have permission to delete it");
    }

    // Delete the FAQ
    await prisma.fAQ.delete({
      where: { id }
    });

    revalidatePath('/agent/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete FAQ");
  }
}

// Profile Update Actions for Live Editing
export async function updateAgentHeroTitle(agentSlug: string, heroTitle: string) {
  try {
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update profile");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Find the agent and verify ownership
    const agent = await prisma.agent.findFirst({
      where: {
        slug: agentSlug,
        userId: userId
      }
    });

    if (!agent) {
      throw new Error("Agent not found or you don't have permission to edit");
    }

    await prisma.agent.update({
      where: { id: agent.id },
      data: { heroTitle }
    });

    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating hero title:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update hero title");
  }
}

export async function updateAgentHeroSubtitle(agentSlug: string, heroSubtitle: string) {
  try {
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update profile");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({
      where: {
        slug: agentSlug,
        userId: userId
      }
    });

    if (!agent) {
      throw new Error("Agent not found or you don't have permission to edit");
    }

    await prisma.agent.update({
      where: { id: agent.id },
      data: { heroSubtitle }
    });

    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating hero subtitle:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update hero subtitle");
  }
}

export async function updateAgentHeroPrimaryCtaLabel(agentSlug: string, heroPrimaryCtaLabel: string) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update profile");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({ where: { slug: agentSlug, userId } });
    if (!agent) throw new Error("Agent not found or you don't have permission to edit");

    await prisma.agent.update({ where: { id: agent.id }, data: { heroPrimaryCtaLabel } });
    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating hero primary CTA label:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update hero primary CTA label');
  }
}

export async function updateAgentHeroSecondaryCtaLabel(agentSlug: string, heroSecondaryCtaLabel: string) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update profile");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({ where: { slug: agentSlug, userId } });
    if (!agent) throw new Error("Agent not found or you don't have permission to edit");

    await prisma.agent.update({ where: { id: agent.id }, data: { heroSecondaryCtaLabel } });
    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating hero secondary CTA label:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update hero secondary CTA label');
  }
}

export async function updateAgentHeroStat(
  agentSlug: string,
  index: number,
  field: 'number' | 'label',
  value: string
) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error('You must be signed in to update profile');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({ where: { slug: agentSlug, userId } });
    if (!agent) throw new Error("Agent not found or you don't have permission to edit");

    const existingStats = (agent as unknown as { heroStats?: unknown }).heroStats as
      | Array<{ number: string; label: string }>
      | null
      | undefined;
    const fallback = [
      { number: '200+', label: 'Property Sold' },
      { number: '70+', label: 'Happy Clients' },
      { number: '140+', label: 'Builders' },
      { number: `${agent.experience || 14}+`, label: 'Years Experience' },
    ];

    const stats = Array.isArray(existingStats) && existingStats.length === 4 ? existingStats : fallback;
    const updated = stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));

    await prisma.agent.update({ where: { id: agent.id }, data: { heroStats: updated } });
    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating hero stat:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update hero stat');
  }
}

export async function updateAgentCity(agentSlug: string, city: string) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error('You must be signed in to update profile');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({ where: { slug: agentSlug, userId } });
    if (!agent) throw new Error("Agent not found or you don't have permission to edit");

    await prisma.agent.update({ where: { id: agent.id }, data: { city } });
    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating city:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update city');
  }
}

// Generic template data editor for front-end editable static text across sections
export async function updateAgentTemplateValue(
  agentSlug: string,
  path: string,
  value: unknown
) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error('You must be signed in to update content');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({ where: { slug: agentSlug, userId } });
    if (!agent) throw new Error("Agent not found or you don't have permission to edit");

    // Build updated templateData by applying a simple dotted path set
    const current = (agent as unknown as { templateData?: unknown }).templateData as Record<string, unknown> | null | undefined;
    const clone: Record<string, unknown> = current ? JSON.parse(JSON.stringify(current)) : {};

    const segments = path.split('.');
    let node: Record<string, unknown> = clone;
    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i] as string;
      const next = node[key];
      if (typeof next !== 'object' || next === null || Array.isArray(next)) {
        node[key] = {} as Record<string, unknown>;
      }
      node = node[key] as Record<string, unknown>;
    }
    node[segments[segments.length - 1] as string] = value as unknown;

    // Cast to JSON-safe type for Prisma (InputJsonValue)
    await prisma.agent.update({ where: { id: agent.id }, data: { templateData: clone as unknown as import('@prisma/client').Prisma.InputJsonValue } });
    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating template value:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update content');
  }
}
export async function updateAgentBio(agentSlug: string, bio: string) {
  try {
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user || !(session as any).user.id) {
      throw new Error("You must be signed in to update profile");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    const agent = await prisma.agent.findFirst({
      where: {
        slug: agentSlug,
        userId: userId
      }
    });

    if (!agent) {
      throw new Error("Agent not found or you don't have permission to edit");
    }

    await prisma.agent.update({
      where: { id: agent.id },
      data: { bio }
    });

    revalidatePath(`/${agentSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating bio:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update bio");
  }
}