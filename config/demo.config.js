// Demo configuration for Etisalat GTM Portal
module.exports = {
  demoPassword: "etisalat2025",
  appUrl: "http://localhost:3000",
  environment: "development",
  
  // AI Configuration (for future use)
  aiProviders: {
    openai: {
      enabled: false,
      apiKey: process.env.OPENAI_API_KEY,
    },
    claude: {
      enabled: false,
      apiKey: process.env.CLAUDE_API_KEY,
    }
  },
  
  // Security settings
  auth: {
    secret: "etisalat-gtm-portal-secret-key-2025",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Rate limiting
  rateLimit: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};
