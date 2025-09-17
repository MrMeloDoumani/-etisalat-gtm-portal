import { NextRequest, NextResponse } from "next/server";

interface ImageGenerationRequest {
  type: "flyer" | "brochure" | "poster" | "social";
  content: {
    headline: string;
    subheading?: string;
    bullets?: string[];
    cta?: string;
    colors?: string[];
  };
  dimensions?: {
    width: number;
    height: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { type, content, dimensions = { width: 800, height: 1000 } } = body;

    // For demo purposes, we'll create a mock image generation
    // In production, this would integrate with DALL-E, Midjourney, or Stable Diffusion
    
    const designPrompt = createDesignPrompt(type, content);
    
    // Simulate image generation with canvas (for demo)
    const imageDataUrl = await generateMockImage(type, content, dimensions);
    
    return NextResponse.json({
      success: true,
      imageUrl: imageDataUrl,
      downloadUrl: imageDataUrl,
      designPrompt,
      metadata: {
        type,
        dimensions,
        generatedAt: new Date().toISOString(),
        format: "PNG"
      }
    });

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

function createDesignPrompt(type: string, content: { headline: string; subheading?: string; bullets?: string[]; cta?: string; }): string {
  const baseStyle = "professional business design, clean modern layout, etisalat red and white color scheme";
  
  switch (type) {
    case "flyer":
      return `Create a professional business flyer with "${content.headline}" as the main headline, ${content.subheading || "business benefits"} as subheading, clean layout with bullet points, etisalat branding, ${baseStyle}`;
    
    case "brochure":
      return `Design a tri-fold business brochure with "${content.headline}" prominently displayed, multiple sections for services, professional UAE business style, ${baseStyle}`;
    
    case "poster":
      return `Create a large format business poster with "${content.headline}", eye-catching design for business events, ${baseStyle}`;
    
    case "social":
      return `Design a social media post with "${content.headline}", square format, engaging visual elements, ${baseStyle}`;
    
    default:
      return `Professional business marketing material with "${content.headline}", ${baseStyle}`;
  }
}

async function generateMockImage(type: string, content: { headline?: string; subheading?: string; bullets?: string[]; cta?: string; }, dimensions: { width: number; height: number }): Promise<string> {
  // Generate SVG directly for better compatibility
  return generateSVGImage(type, content, dimensions);
}


function generateSVGImage(type: string, content: { headline?: string; subheading?: string; bullets?: string[]; cta?: string; }, dimensions: { width: number; height: number }): string {
  const headline = content.headline || 'e& Business Solutions';
  const subheading = content.subheading || 'Professional connectivity for growing businesses';
  const bullets = content.bullets || ['99.9% uptime reliability', '24/7 local UAE support', 'Scalable solutions', 'Trusted by 10,000+ businesses'];
  const cta = content.cta || 'Get Started Today';

  const bulletElements = bullets.map((bullet, index) => 
    `<text x="60" y="${180 + (index * 30)}" font-family="Arial" font-size="16" fill="#2D3748">• ${bullet}</text>`
  ).join('');

  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f7fafc;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="8" fill="#FF0000"/>
      <text x="50%" y="80" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#2D3748">${headline}</text>
      <text x="50%" y="120" text-anchor="middle" font-family="Arial" font-size="18" fill="#4A5568">${subheading}</text>
      ${bulletElements}
      <rect x="${(dimensions.width - 200) / 2}" y="${dimensions.height - 120}" width="200" height="40" rx="5" fill="#FF0000"/>
      <text x="50%" y="${dimensions.height - 95}" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#FFFFFF">${cta}</text>
      <text x="${dimensions.width - 40}" y="${dimensions.height - 30}" text-anchor="end" font-family="Arial" font-size="24" font-weight="bold" fill="#FF0000">e&</text>
    </svg>
  `)}`;
}

