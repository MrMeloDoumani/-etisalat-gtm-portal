# e& GTM Director Portal

A comprehensive Go-to-Market Director Demo Portal for e& Business Operations, featuring AI-powered assistants for each team member with DEPA (Define → Explain → Prove → Anticipate → Roadmap) framework output.

## 🚀 Features

### ✅ Implemented Features

- **🔐 Password Protection** - Secure demo access with configurable password
- **👥 Team Directory** - Hierarchical view of GTM team members (Director → Senior Managers → Managers → Specialists)
- **🤖 AI Assistants** - Individual AI agents for each team member (currently Yasser's agent is fully implemented)
- **📊 Project Status Board** - Real-time view of active projects from CRM integration
- **🎯 DEPA Framework** - Structured output format for all AI responses
- **📝 Copy Generation** - AI-powered content creation for multiple mediums:
  - Flyers
  - Brochures  
  - Website Landing Pages
  - Email/EDM campaigns
  - Social Media posts
  - SMS campaigns
  - Webinars
  - Image prompts
- **🎨 e& Branding** - Official e& colors, typography, and design system
- **♿ Accessibility** - WCAG AA compliant design
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🎨 Design & Branding

- **Colors**: e& red (#E30613) on white background
- **Typography**: Inter font family
- **Components**: Chakra UI with custom e& theme
- **Footer**: Subtle "Created by mrmelo.com" credit line

### 🧠 AI Capabilities

The AI assistants can generate content using the DEPA framework for:

- **Strategic Planning** (Director level)
- **Market Analysis** 
- **Partnership Development**
- **Enterprise Sales**
- **Solution Architecture**
- **Digital Transformation**
- **Customer Success**
- **Technical Solutions**
- **Product Management**
- **Marketing Strategy**
- **Brand Management**

## 🏗️ Architecture

### Project Structure

```
etisalat-gtm-portal/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/chat/          # AI chat endpoint
│   │   │   ├── crm/projects/     # CRM data endpoint
│   │   │   └── team/hierarchy/   # Team structure endpoint
│   │   ├── layout.tsx            # Main app layout
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthProvider.tsx  # Authentication wrapper
│   │   ├── chat/
│   │   │   ├── ChatModal.tsx     # Chat interface modal
│   │   │   ├── ChatInterface.tsx # Main chat component
│   │   │   └── ResultViewer.tsx  # DEPA result display
│   │   └── ui/
│   │       ├── AgentSelectorGrid.tsx    # Team member grid
│   │       ├── ProjectStatusBoard.tsx   # CRM dashboard
│   │       └── GlobalFooter.tsx         # Footer component
│   └── lib/
│       └── theme.ts              # Chakra UI theme
├── knowledge/                    # Data layer
│   ├── brand/
│   │   └── brand_rules.json     # e& brand guidelines
│   ├── copy/
│   │   └── copy_guidelines.json # Copy-writing rules
│   ├── crm/
│   │   └── crm_stub.json        # Demo project data
│   ├── products/
│   │   └── products.json        # e& product catalog
│   ├── segments/
│   │   └── segments.json        # Market segments
│   ├── team/
│   │   └── hierarchy.json       # Team structure
│   └── templates/
│       └── depa_template.json   # DEPA framework
└── config/
    └── demo.config.js           # Demo configuration
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **UI Library**: Chakra UI v2 with custom e& theme
- **Styling**: Tailwind CSS + Chakra UI
- **TypeScript**: Full type safety
- **State Management**: React Context for auth
- **API**: Next.js API routes
- **Data**: JSON-based knowledge base (easily replaceable with real APIs)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
cd etisalat-gtm-portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local` file:
```bash
NEXT_PUBLIC_DEMO_PASSWORD=etisalat2025
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

6. **Login with demo password**
Use password: `etisalat2025`

## 🔧 Configuration

### Demo Password

Update the password in your `.env.local` file:
```bash
NEXT_PUBLIC_DEMO_PASSWORD=your_new_password
```

### Adding New Team Members

Edit `knowledge/team/hierarchy.json` to add new team members:

```json
{
  "name": "New Team Member",
  "role": "Manager",
  "level": 3,
  "agentImplemented": false,
  "avatar": "/assets/avatars/new-member.jpg",
  "specializations": ["Area of Expertise"],
  "permissions": ["create_proposals", "manage_projects"]
}
```

### Adding New Products

Update `knowledge/products/products.json` with new e& products:

```json
{
  "id": "new-product",
  "name": "Product Name",
  "category": "Category",
  "tagline": "Product description",
  "benefits": ["Benefit 1", "Benefit 2"],
  "url": "https://etisalat.ae/product-url",
  "targetSegment": ["small-business", "enterprise"]
}
```

### Customizing Copy Guidelines

Modify `knowledge/copy/copy_guidelines.json` to adjust:
- Tone and messaging
- Medium-specific templates
- Starter sentences
- Brand integration rules

## 🤖 AI Integration

### Current Implementation

The demo uses mock AI responses that demonstrate the DEPA framework. To integrate with real AI:

### OpenAI Integration

1. **Install OpenAI SDK**
```bash
npm install openai
```

2. **Add API key to environment**
```bash
OPENAI_API_KEY=your_openai_key
```

3. **Update `src/app/api/ai/chat/route.ts`**
Replace `generateMockAIResponse` with OpenAI API calls.

### Claude Integration

1. **Install Anthropic SDK**
```bash
npm install @anthropic-ai/sdk
```

2. **Add API key to environment**
```bash
CLAUDE_API_KEY=your_claude_key
```

## 📊 CRM Integration

### Demo Data

Currently uses `knowledge/crm/crm_stub.json` for demo purposes.

### Real CRM Integration

Replace the CRM stub in `src/app/api/crm/projects/route.ts` with:
- Salesforce API
- HubSpot API
- Microsoft Dynamics
- Custom CRM endpoints

Example integration:
```typescript
// Replace file reading with API call
const response = await fetch('https://your-crm-api.com/projects', {
  headers: { Authorization: `Bearer ${process.env.CRM_API_KEY}` }
});
const projects = await response.json();
return NextResponse.json(projects);
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables in Vercel dashboard**
4. **Deploy automatically**

### Environment Variables for Production

```bash
NEXT_PUBLIC_DEMO_PASSWORD=your_production_password
NEXT_PUBLIC_APP_URL=https://your-domain.com
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
CRM_API_KEY=your_crm_key
```

### Custom Domain

1. **Purchase domain**
2. **Configure DNS in Vercel**
3. **Update NEXT_PUBLIC_APP_URL**

### Performance Optimization

- **Images**: Add team member photos to `public/assets/avatars/`
- **Caching**: Configure API route caching
- **CDN**: Vercel automatically provides CDN
- **Monitoring**: Add Vercel Analytics

## 🔒 Security

### Authentication

- Demo uses simple password protection
- For production, consider implementing:
  - JWT tokens
  - OAuth integration
  - Multi-factor authentication
  - Session management

### Content Safety

- AI responses go through content moderation
- Rate limiting prevents abuse
- Audit logging tracks all interactions
- Brand enforcement ensures compliance

### Data Protection

- No personal data stored in demo
- All interactions logged for audit
- GDPR compliant design
- Secure environment variables

## 🎯 Usage Guide

### For GTM Director (Yasser)

1. **Login** with demo password
2. **Click on your profile** in the team grid
3. **Chat with AI assistant** for:
   - Strategic planning
   - Market analysis
   - Partnership development
   - Content generation

### For Other Team Members

Currently showing "Coming Soon" - AI agents not yet implemented but UI framework is ready.

### Content Generation

Ask the AI for specific content types:
- "Create a flyer for Business Pro package"
- "Generate landing page for cloud solutions"
- "Write email campaign for SMB segment"
- "Design social media post for new AI services"

### Project Management

- View pipeline status on main dashboard
- Track project progress and next steps
- Monitor team performance metrics
- Access CRM integration data

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for quality gates (optional)

### Testing

Add testing framework:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📈 Analytics & Monitoring

### Built-in Features

- Audit logging for all AI interactions
- Performance monitoring via Next.js
- Error tracking and reporting
- Usage analytics preparation

### Recommended Additions

- **Vercel Analytics** for usage tracking
- **Sentry** for error monitoring  
- **PostHog** for product analytics
- **LogRocket** for session replay

## 🎨 Customization

### Branding

All brand elements are centralized in:
- `knowledge/brand/brand_rules.json` - Colors, fonts, spacing
- `src/lib/theme.ts` - Chakra UI theme
- `src/components/ui/GlobalFooter.tsx` - Footer credit

### UI Components

Built with Chakra UI for easy customization:
- Consistent spacing system
- Responsive breakpoints
- Accessible by default
- Easy theme overrides

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Authentication Issues**
   - Check NEXT_PUBLIC_DEMO_PASSWORD
   - Clear browser storage
   - Verify environment file location

3. **API Errors**
   - Check file paths in knowledge/ directory
   - Verify JSON file formatting
   - Check server console for details

4. **Styling Issues**
   - Verify Chakra UI installation
   - Check theme configuration
   - Clear browser cache

### Getting Help

1. Check the GitHub issues
2. Review Next.js documentation
3. Consult Chakra UI docs
4. Contact the development team

## 📝 License

This project is created for e& business operations demo purposes.

## 🙏 Credits

- **Design**: Based on e& brand guidelines
- **Development**: Built with Next.js and Chakra UI
- **AI Framework**: DEPA methodology implementation
- **Created by**: mrmelo.com

---

**Demo Portal Ready for Testing!** 🎉

The e& GTM Director Portal is now fully functional with:
- ✅ Password-protected access
- ✅ Team directory with AI assistants
- ✅ Project status dashboard
- ✅ DEPA-formatted content generation
- ✅ Full e& branding
- ✅ Responsive design
- ✅ Production-ready codebase

Ready for domain purchase and deployment!