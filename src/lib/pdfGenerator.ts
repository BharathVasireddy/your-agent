import jsPDF from 'jspdf';
import { type Property } from '@/types/dashboard';
import { getPropertyFeatures, formatPrice } from '@/lib/property-display-utils';

interface Agent {
  user: {
    name: string | null;
    email: string | null;
  };
  phone: string | null;
  city: string | null;
  area: string | null;
  experience: number | null;
  bio: string | null;
}

// Helper function to load image as base64
async function loadImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
}

export async function generatePropertyBrochure(property: Property, agent: Agent): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  


  // Modern color scheme
  const colors = {
    primary: [220, 38, 38] as const, // red-600
    secondary: [31, 41, 55] as const, // gray-800
    light: [249, 250, 251] as const, // gray-50
    accent: [239, 68, 68] as const, // red-500
    text: [17, 24, 39] as const, // gray-900
    textLight: [107, 114, 128] as const, // gray-500
    white: [255, 255, 255] as const
  };

  let yPos = 0;

  // Page 1: Hero Section with Property Image
  // Header Section - Clean and minimal
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, pageWidth, 60, 'F');

  // Property title in header
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(property.title, contentWidth - 40);
  pdf.text(titleLines, margin, 25);

  // Agent name in header
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`by ${agent.user.name || 'Real Estate Agent'}`, margin, titleLines.length > 1 ? 45 : 35);

  // Price in header - right aligned
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const priceText = formatPrice(property.price);
  const priceWidth = pdf.getTextWidth(priceText);
  pdf.text(priceText, pageWidth - margin - priceWidth, 30);

  yPos = 80;

  // Property Image Section
  if (property.photos && property.photos.length > 0) {
    try {
      const imageData = await loadImageAsBase64(property.photos[0]);
      if (imageData) {
        const imgWidth = contentWidth;
        const imgHeight = 100;
        
        // Add a subtle border around image
        pdf.setDrawColor(229, 231, 235); // gray-200
        pdf.setLineWidth(0.5);
        pdf.rect(margin - 1, yPos - 1, imgWidth + 2, imgHeight + 2, 'S');
        
        pdf.addImage(imageData, 'JPEG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 20;
      }
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      yPos += 20;
    }
  }

  // Property Details Card
  pdf.setFillColor(...colors.light);
  pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');

  // Location
  pdf.setTextColor(...colors.textLight);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('LOCATION', margin + 10, yPos + 12);

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(property.location, margin + 10, yPos + 22);

  // Property specs - horizontal layout with dynamic features
  const specStartX = margin + 10;
  const specY = yPos + 35;
  const specSpacing = 60;
  
  const features = getPropertyFeatures(property).slice(0, 3);

  features.forEach((feature, index) => {
    const xPos = specStartX + (index * specSpacing);
    
    // Feature label
    pdf.setTextColor(...colors.textLight);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(feature.label.toUpperCase(), xPos, specY);
    
    // Feature value
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(feature.value, xPos, specY + 8);
  });

  // Property type and status badges
  const badgeY = yPos + 38;
  const badgeStartX = pageWidth - margin - 60;

  // Property type badge
  pdf.setFillColor(239, 246, 255); // blue-50
  pdf.setDrawColor(147, 197, 253); // blue-300
  pdf.roundedRect(badgeStartX, badgeY - 8, 25, 12, 2, 2, 'FD');
  pdf.setTextColor(30, 64, 175); // blue-800
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  const typeText = property.propertyType.length > 8 ? property.propertyType.substring(0, 8) : property.propertyType;
  pdf.text(typeText, badgeStartX + 2, badgeY - 2);

  // Status badge
  pdf.setFillColor(220, 252, 231); // green-50
  pdf.setDrawColor(134, 239, 172); // green-300
  pdf.roundedRect(badgeStartX + 30, badgeY - 8, 25, 12, 2, 2, 'FD');
  pdf.setTextColor(22, 101, 52); // green-800
  pdf.text(property.status, badgeStartX + 32, badgeY - 2);

  yPos += 65;

  // Description Section
  pdf.setTextColor(...colors.textLight);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ABOUT THIS PROPERTY', margin, yPos);

  yPos += 10;

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const descLines = pdf.splitTextToSize(property.description, contentWidth);
  pdf.text(descLines, margin, yPos);
  yPos += (descLines.length * 5) + 15;

  // Amenities Section
  if (property.amenities && property.amenities.length > 0) {
    pdf.setTextColor(...colors.textLight);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('AMENITIES', margin, yPos);

    yPos += 10;

    pdf.setTextColor(...colors.text);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const amenitiesPerRow = 2;
    const colWidth = contentWidth / amenitiesPerRow;

    (property.amenities || []).slice(0, 10).forEach((amenity, index) => {
      const col = index % amenitiesPerRow;
      const row = Math.floor(index / amenitiesPerRow);
      const x = margin + (col * colWidth);
      const y = yPos + (row * 6);
      
      pdf.text(`• ${amenity}`, x, y);
    });

    yPos += Math.ceil(Math.min((property.amenities || []).length, 10) / amenitiesPerRow) * 6 + 20;
  }

  // Agent Information Section - Modern card design
  const agentCardY = pageHeight - 80;
  
  pdf.setFillColor(...colors.secondary);
  pdf.roundedRect(margin, agentCardY, contentWidth, 50, 4, 4, 'F');

  // Agent info
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(agent.user.name || 'YourAgent', margin + 15, agentCardY + 15);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (agent.experience) {
    pdf.text(`${agent.experience}+ years experience`, margin + 15, agentCardY + 25);
  }

  if (agent.city) {
    pdf.text(`Specializing in ${agent.city}`, margin + 15, agentCardY + 32);
  }

  // Contact info - right side
  const contactX = pageWidth - margin - 60;
  
  if (agent.phone) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PHONE', contactX, agentCardY + 15);
    pdf.setFont('helvetica', 'normal');
    pdf.text(agent.phone, contactX, agentCardY + 23);
  }

  if (agent.user.email) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EMAIL', contactX, agentCardY + 32);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(agent.user.email, contactX, agentCardY + 40);
  }

  // Footer
  pdf.setTextColor(...colors.textLight);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  const timestamp = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  pdf.text(`Generated on ${timestamp}`, margin, pageHeight - 10);
  
  const disclaimerText = 'This brochure is auto-generated. Contact agent for latest information.';
  const disclaimerWidth = pdf.getTextWidth(disclaimerText);
  pdf.text(disclaimerText, pageWidth - margin - disclaimerWidth, pageHeight - 10);

  // Download the PDF
  const fileName = `${property.title.replace(/[^a-zA-Z0-9]/g, '_')}_Brochure.pdf`;
  pdf.save(fileName);
}