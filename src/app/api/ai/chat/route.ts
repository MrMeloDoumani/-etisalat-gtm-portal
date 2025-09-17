import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Simple AI response generation without external APIs for demo
function generateMockAIResponse(message: string, _agent: string, _role: string): {
  message: string;
  result?: {
    depa: Record<string, string>;
    starterSentences?: string[];
    medium?: string;
    tone?: string;
    recommendations?: string[];
    nextSteps?: string[];
  };
} {
  const lowerMessage = message.toLowerCase();
  
  // Load copy guidelines
  const copyGuidelinesPath = join(process.cwd(), "knowledge", "copy", "copy_guidelines.json");
  const copyGuidelines = JSON.parse(readFileSync(copyGuidelinesPath, "utf8"));
  
  // Load products
  const productsPath = join(process.cwd(), "knowledge", "products", "products.json");
  const products = JSON.parse(readFileSync(productsPath, "utf8"));
  
  // Load DEPA template
  const depaTemplatePath = join(process.cwd(), "knowledge", "templates", "depa_template.json");
  const depaTemplate = JSON.parse(readFileSync(depaTemplatePath, "utf8"));

  // Detect what type of content is being requested
  if (lowerMessage.includes("flyer") || lowerMessage.includes("flier")) {
    const guidelines = copyGuidelines.mediums.flyer;
    return {
      message: "I've created a business flyer using the DEPA framework:",
      result: {
        depa: {
          define: "Professional business flyer targeting UAE SMB market for enhanced connectivity solutions",
          explain: "Comprehensive e& business solutions designed to streamline operations and boost productivity for growing companies",
          prove: "Trusted by 10,000+ UAE businesses with 99.9% uptime SLA and 24/7 local support",
          anticipate: "Address concerns about setup complexity and costs with our simplified onboarding and flexible pricing",
          roadmap: "Contact business center → Consultation within 48hrs → Implementation in 5-7 business days"
        },
        starterSentences: guidelines.starterSentences,
        medium: "flyer",
        tone: guidelines.tone
      }
    };
  }

  if (lowerMessage.includes("brochure")) {
    const guidelines = copyGuidelines.mediums.brochure;
    return {
      message: "I've created a business brochure using the DEPA framework:",
      result: {
        depa: {
          define: "Comprehensive enterprise brochure showcasing e& digital transformation solutions for medium-large businesses",
          explain: "End-to-end digital solutions including cloud infrastructure, cybersecurity, AI tools, and managed connectivity services",
          prove: "Industry leader with 500+ enterprise clients, government partnerships, and 15+ years UAE market experience",
          anticipate: "Enterprise security concerns addressed with UAE-based data centers, compliance certifications, and dedicated support",
          roadmap: "Discovery phase → Custom solution design → Pilot implementation → Full deployment → Ongoing optimization"
        },
        starterSentences: guidelines.starterSentences,
        medium: "brochure", 
        tone: guidelines.tone
      }
    };
  }

  if (lowerMessage.includes("landing page") || lowerMessage.includes("website")) {
    const guidelines = copyGuidelines.mediums.website_landing_page;
    return {
      message: "I've created website landing page content using the DEPA framework:",
      result: {
        depa: {
          define: "High-converting landing page for e& business solutions targeting self-service customers and online prospects",
          explain: "User-friendly digital experience showcasing product benefits, pricing transparency, and instant activation options",
          prove: "30% faster business setup compared to competitors, with instant online ordering and same-day activation available",
          anticipate: "Simplified pricing eliminates confusion, while live chat support ensures immediate assistance when needed",
          roadmap: "Browse solutions → Select package → Online checkout → Instant activation → Dedicated account management"
        },
        starterSentences: guidelines.starterSentences,
        medium: "website_landing_page",
        tone: guidelines.tone
      }
    };
  }

  if (lowerMessage.includes("email") || lowerMessage.includes("edm")) {
    const guidelines = copyGuidelines.mediums.email;
    return {
      message: "I've created email marketing content using the DEPA framework:",
      result: {
        depa: {
          define: "Personalized email campaign for existing customers highlighting new AI solutions and upgrade opportunities",
          explain: "Exclusive early access to e& AI-powered business tools designed to automate processes and increase efficiency",
          prove: "Beta customers report 40% productivity gains and 25% cost reduction within first 90 days of implementation",
          anticipate: "Existing infrastructure seamlessly integrates with new AI tools, no disruption to current operations",
          roadmap: "Schedule demo → Free trial period → Implementation support → Performance review → Full optimization"
        },
        starterSentences: guidelines.starterSentences,
        medium: "email",
        tone: guidelines.tone
      }
    };
  }

  if (lowerMessage.includes("social") || lowerMessage.includes("linkedin") || lowerMessage.includes("facebook")) {
    const guidelines = copyGuidelines.mediums.social;
    return {
      message: "I've created social media content using the DEPA framework:",
      result: {
        depa: {
          define: "Engaging social media post celebrating business success stories and community achievement",
          explain: "Showcase real UAE business transformations powered by e& solutions, highlighting growth and innovation",
          prove: "Featured client achieved 200% revenue growth and expanded to 3 new locations with e& digital solutions",
          anticipate: "Success stories inspire confidence while demonstrating tangible business outcomes for similar companies",
          roadmap: "Follow success journey → Schedule consultation → Customize solution → Implement changes → Share your story"
        },
        starterSentences: guidelines.starterSentences,
        medium: "social",
        tone: guidelines.tone
      }
    };
  }

  if (lowerMessage.includes("sms")) {
    const guidelines = copyGuidelines.mediums.sms;
    return {
      message: "I've created SMS marketing content using the DEPA framework:",
      result: {
        depa: {
          define: "Urgent SMS notification for qualified business customers about limited-time connectivity upgrade offer",
          explain: "Exclusive 48-hour window for existing customers to upgrade internet speed at 50% discount with instant activation",
          prove: "Limited offer: Only 100 spots available, exclusively for loyal customers with 2+ years tenure",
          anticipate: "Quick upgrade process ensures no service interruption, installation scheduled at your convenience",
          roadmap: "Reply YES → Instant confirmation → Technician booking → Same-day upgrade → Immediate speed boost"
        },
        starterSentences: guidelines.starterSentences,
        medium: "sms",
        tone: guidelines.tone
      }
    };
  }

  if (lowerMessage.includes("webinar")) {
    const guidelines = copyGuidelines.mediums.webinar;
    return {
      message: "I've created webinar content structure using the DEPA framework:",
      result: {
        depa: {
          define: "Educational webinar for business leaders on digital transformation strategies and practical implementation",
          explain: "Expert-led session covering UAE market trends, technology adoption best practices, and ROI optimization",
          prove: "Industry experts with 50+ successful digital transformations share case studies and proven methodologies",
          anticipate: "Interactive Q&A addresses specific industry challenges and provides customized recommendations",
          roadmap: "Register now → Pre-event resources → Live participation → Follow-up consultation → Implementation planning"
        },
        starterSentences: guidelines.starterSentences,
        medium: "webinar",
        tone: guidelines.tone
      }
    };
  }

  // Default GTM strategy response
  return {
    message: "I've analyzed your request and created a comprehensive GTM strategy using the DEPA framework:",
    result: {
      depa: {
        define: "Strategic go-to-market approach for e& business solutions targeting UAE SMB segment with focus on digital transformation",
        explain: "Multi-channel strategy leveraging direct sales, digital marketing, and partner networks to reach 50,000+ potential customers",
        prove: "Market research shows 70% of UAE SMBs plan digital upgrades in next 12 months, with connectivity as top priority",
        anticipate: "Competition challenges addressed through superior local support, government partnerships, and flexible pricing models",
        roadmap: "Market analysis → Customer segmentation → Channel activation → Campaign launch → Performance optimization"
      },
      recommendations: [
        "Focus on digital-first customer acquisition",
        "Leverage success stories and case studies",
        "Implement account-based marketing for enterprise segment",
        "Develop industry-specific solution packages"
      ],
      nextSteps: [
        "Conduct detailed market analysis",
        "Create customer persona profiles", 
        "Design campaign messaging framework",
        "Set up tracking and analytics"
      ]
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, agent, role, specializations } = await request.json();

    if (!message || !agent) {
      return NextResponse.json(
        { error: "Message and agent are required" },
        { status: 400 }
      );
    }

    // Generate AI response (in production, this would call OpenAI/Claude)
    const response = generateMockAIResponse(message, agent, role);

    // Add audit logging
    const auditLog = {
      timestamp: new Date().toISOString(),
      agent,
      role,
      message,
      response: response.message,
      hasResult: !!response.result,
    };

    console.log("AI Chat Audit:", auditLog);

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
