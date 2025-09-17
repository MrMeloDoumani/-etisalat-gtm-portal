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
  // Create a canvas element for image generation
  const canvas = createCanvas(dimensions.width, dimensions.height);
  const ctx = canvas.getContext();
  
  // Set background
  const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(1, '#f7fafc');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  
  // Add etisalat red accent
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, dimensions.width, 8);
  
  // Add headline
  ctx.fillStyle = '#2D3748';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  
  const headlineY = 80;
  wrapText(ctx, content.headline || 'e& Business Solutions', dimensions.width / 2, headlineY, dimensions.width - 60, 40);
  
  // Add subheading
  if (content.subheading) {
    ctx.fillStyle = '#4A5568';
    ctx.font = '18px Arial, sans-serif';
    wrapText(ctx, content.subheading, dimensions.width / 2, headlineY + 80, dimensions.width - 60, 25);
  }
  
  // Add bullet points
  if (content.bullets && content.bullets.length > 0) {
    ctx.fillStyle = '#2D3748';
    ctx.font = '16px Arial, sans-serif';
    ctx.textAlign = 'left';
    
    let bulletY = headlineY + 160;
    content.bullets.forEach((bullet: string, index: number) => {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(60, bulletY - 8, 4, 4);
      ctx.fillStyle = '#2D3748';
      ctx.fillText(bullet, 80, bulletY);
      bulletY += 30;
    });
  }
  
  // Add CTA
  if (content.cta) {
    const ctaY = dimensions.height - 100;
    
    // CTA Button background
    ctx.fillStyle = '#FF0000';
    const buttonWidth = 200;
    const buttonHeight = 40;
    const buttonX = (dimensions.width - buttonWidth) / 2;
    roundRect(ctx, buttonX, ctaY - 20, buttonWidth, buttonHeight, 5);
    
    // CTA Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(content.cta, dimensions.width / 2, ctaY);
  }
  
  // Add etisalat logo placeholder
  ctx.fillStyle = '#FF0000';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('e&', dimensions.width - 40, dimensions.height - 30);
  
  return canvas.toDataURL('image/png');
}

// Helper functions for canvas
function createCanvas(width: number, height: number) {
  // For server-side rendering, we'll create a mock canvas
  return {
    width,
    height,
    getContext: () => ({
      createLinearGradient: (x1: number, y1: number, x2: number, y2: number) => ({
        addColorStop: (offset: number, color: string) => {}
      }),
      fillStyle: '',
      fillRect: (x: number, y: number, width: number, height: number) => {},
      font: '',
      textAlign: '',
      fillText: (text: string, x: number, y: number) => {},
      measureText: (text: string) => ({ width: text.length * 8 })
    }),
    toDataURL: (format: string) => generatePlaceholderImage(width, height)
  };
}

function generatePlaceholderImage(width: number, height: number): string {
  // Generate a simple placeholder image data URL
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f7fafc;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="8" fill="#FF0000"/>
      <text x="50%" y="80" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#2D3748">e& Business Solutions</text>
      <text x="50%" y="120" text-anchor="middle" font-family="Arial" font-size="18" fill="#4A5568">Professional connectivity for growing businesses</text>
      <text x="60" y="180" font-family="Arial" font-size="16" fill="#2D3748">• 99.9% uptime reliability</text>
      <text x="60" y="210" font-family="Arial" font-size="16" fill="#2D3748">• 24/7 local UAE support</text>
      <text x="60" y="240" font-family="Arial" font-size="16" fill="#2D3748">• Scalable solutions</text>
      <text x="60" y="270" font-family="Arial" font-size="16" fill="#2D3748">• Trusted by 10,000+ businesses</text>
      <rect x="${(width - 200) / 2}" y="${height - 120}" width="200" height="40" rx="5" fill="#FF0000"/>
      <text x="50%" y="${height - 95}" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#FFFFFF">Get Started Today</text>
      <text x="${width - 40}" y="${height - 30}" text-anchor="end" font-family="Arial" font-size="24" font-weight="bold" fill="#FF0000">e&</text>
    </svg>
  `)}`;
}

function wrapText(ctx: { measureText: (text: string) => { width: number }; fillText: (text: string, x: number, y: number) => void; }, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function roundRect(ctx: { beginPath?: () => void; moveTo?: (x: number, y: number) => void; lineTo?: (x: number, y: number) => void; quadraticCurveTo?: (x1: number, y1: number, x2: number, y2: number) => void; closePath?: () => void; fill?: () => void; }, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath?.();
  ctx.moveTo?.(x + radius, y);
  ctx.lineTo?.(x + width - radius, y);
  ctx.quadraticCurveTo?.(x + width, y, x + width, y + radius);
  ctx.lineTo?.(x + width, y + height - radius);
  ctx.quadraticCurveTo?.(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo?.(x + radius, y + height);
  ctx.quadraticCurveTo?.(x, y + height, x, y + height - radius);
  ctx.lineTo?.(x, y + radius);
  ctx.quadraticCurveTo?.(x, y, x + radius, y);
  ctx.closePath?.();
  ctx.fill?.();
}
