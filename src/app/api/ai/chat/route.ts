import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, agent, role } = body;

    // Generate natural conversational AI response
    const lowerMessage = message.toLowerCase();
    let response = "";
    
    if (lowerMessage.includes("flyer") || lowerMessage.includes("marketing")) {
      response = `I'd be happy to help you create a compelling business flyer! For e& Business Pro, I'd suggest focusing on:

**Key Message**: "Streamline Your Business Operations"

**Main Benefits to Highlight**:
• 99.9% uptime reliability for uninterrupted operations
• 24/7 local UAE support when you need it most  
• Scalable solutions that grow with your business
• Trusted by 10,000+ UAE businesses

**Suggested Layout**:
- Eye-catching headline about business transformation
- Clear value propositions with specific benefits
- Local testimonial or case study snippet
- Simple call-to-action for consultation

🎨 **Generate Visual Flyer**: I can also create an actual flyer image for you! Would you like me to generate a professional flyer design with these elements?

Would you like me to develop any specific section further, or shall I create the visual design?`;

      // Return with image generation capability
      return NextResponse.json({
        message: response,
        timestamp: new Date().toISOString(),
        agent: agent,
        success: true,
        hasImageGeneration: true,
        imageType: "flyer"
      });

    } else if (lowerMessage.includes("strategy") || lowerMessage.includes("planning")) {
      response = `Great question about GTM strategy! For the UAE SMB market, I'd recommend a multi-layered approach:

**Primary Focus**: Digital-first customer acquisition
- 70% of UAE SMBs are planning digital upgrades in the next 12 months
- Connectivity solutions are their top priority

**Recommended Channels**:
1. **Direct Sales**: Target medium businesses with dedicated account managers
2. **Digital Marketing**: LinkedIn campaigns for decision-makers, Google Ads for product searches
3. **Partner Network**: Leverage existing technology partners and resellers

**Key Differentiators**:
- Emphasize local support advantage (24/7 UAE-based team)
- Government partnership credentials for compliance
- Flexible pricing models for different business sizes

**Quick Win Opportunities**:
- Focus on businesses outgrowing basic internet packages
- Target companies expanding to multiple locations
- Healthcare and retail sectors showing highest growth

What specific aspect would you like to dive deeper into?`;

    } else if (lowerMessage.includes("competition") || lowerMessage.includes("competitor")) {
      response = `Good strategic thinking! Here's how we can position against key competitors:

**vs. du Business**: Emphasize our superior network coverage and local expertise
**vs. International Providers**: Highlight regulatory compliance and local support
**vs. Smaller ISPs**: Focus on reliability, scale, and comprehensive solutions

**Competitive Advantages to Leverage**:
- Market leader position with proven track record
- Government partnerships for regulatory compliance  
- Comprehensive portfolio beyond just connectivity
- Local customer support in Arabic and English

**Areas to Watch**:
- Pricing pressure from smaller players
- New technologies from international competitors
- Government initiatives affecting market dynamics

Would you like me to analyze any specific competitor or develop counter-positioning strategies?`;

    } else if (lowerMessage.includes("brochure")) {
      response = `I can help you create an effective brochure for e& business solutions!

**Suggested Structure**:

**Cover**: "Transform Your Business with e& Solutions"
**Page 1**: Core connectivity packages with clear pricing
**Page 2**: Value-added services (cloud, security, support)
**Page 3**: Customer success stories from UAE businesses
**Back**: Contact information and next steps

**Key Messages to Include**:
- UAE market leader with proven track record
- Local expertise and 24/7 support
- Scalable solutions for growing businesses
- Government partnership credentials

**Design Tips**:
- Use e& brand colors (red, white, clean layout)
- Include specific UAE testimonials
- Clear pricing tiers for easy comparison
- Strong call-to-action for business consultation

🎨 **Generate Visual Brochure**: I can create a professional brochure design with these elements! Shall I generate the visual layout for you?

Would you like me to develop content for any specific section or create the visual design?`;

      return NextResponse.json({
        message: response,
        timestamp: new Date().toISOString(),
        agent: agent,
        success: true,
        hasImageGeneration: true,
        imageType: "brochure"
      });

    } else if (lowerMessage.includes("email") || lowerMessage.includes("campaign")) {
      response = `I can help you craft an effective email campaign! Here's my recommendation:

**Subject Line Options**:
- "Upgrade Your Business Connectivity - Limited Time Offer"
- "Transform Operations with e& Business Solutions"
- "UAE's #1 Business Internet - Special Pricing Inside"

**Email Structure**:
1. **Personal greeting** with company name
2. **Problem identification** (current connectivity issues)
3. **Solution presentation** (e& business packages)
4. **Social proof** (local business testimonials)
5. **Clear call-to-action** (schedule consultation)

**Key Points to Emphasize**:
- Local UAE support and expertise
- Proven reliability (99.9% uptime)
- Flexible pricing for business growth
- Government partnership credibility

**Personalization Ideas**:
- Reference their industry-specific needs
- Mention local business success stories
- Include location-specific support contacts

Would you like me to draft specific copy for any section?`;

    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      response = `Hello! I'm ${agent}'s AI assistant, here to help with all your GTM initiatives and marketing needs.

I can assist you with:
• **Content Creation**: Marketing materials, presentations, proposals
• **Strategy Development**: Market analysis, competitive positioning  
• **Campaign Planning**: Email, social media, advertising strategies
• **Sales Support**: Pitch decks, objection handling, pricing
• **Market Intelligence**: Industry trends, competitor insights

What can I help you work on today?`;

    } else if (lowerMessage.includes("melo method") || lowerMessage.includes("depa") || lowerMessage.includes("framework")) {
      response = `The **Melo Method** is our structured framework for creating comprehensive marketing strategies. It follows the DEPA approach:

**D**efine → **E**xplain → **P**rove → **A**nticipate → **R**oadmap

This methodology ensures thorough, strategic thinking for all marketing initiatives. Would you like me to apply the Melo Method to a specific project or challenge you're working on?

*Note: This is available as a separate specialized feature for strategic planning.*`;

    } else {
      response = `I'm here to help with your GTM initiatives! As ${agent}'s AI assistant, I can provide guidance on:

**Marketing & Content**:
- Flyers, brochures, presentations
- Email campaigns and social media
- Website copy and landing pages

**Strategy & Planning**:
- Market analysis and competitive intelligence
- Go-to-market strategy development
- Customer segmentation and targeting

**Sales Support**:
- Pitch decks and proposals
- Objection handling strategies
- Pricing and positioning guidance

What specific challenge are you working on? I'm here to provide practical, actionable advice tailored to the UAE market and e& business objectives.`;
    }

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
      agent: agent,
      success: true
    });

  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}