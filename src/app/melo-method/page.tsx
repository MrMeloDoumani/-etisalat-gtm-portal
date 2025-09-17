"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Textarea,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Tooltip,
  Flex,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Code,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue,
  Collapse,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { NavigationHeader } from "@/components/ui/NavigationHeader";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { claudeAI } from "@/lib/claude";
import { documentExporter, DocumentData, ExportOptions } from "@/lib/documentExport";
import { emailService } from "@/lib/emailService";
import { revisionHistory } from "@/lib/revisionHistory";

interface DEPAFramework {
  define: string;
  explain: string;
  prove: string;
  anticipate: string;
  roadmap: string;
  metadata?: {
    projectType: string;
    industry: string;
    targetAudience: string;
    budget: number;
    timeline: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
  };
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  framework: Partial<DEPAFramework>;
}

interface CollaborationSession {
  id: string;
  projectName: string;
  participants: string[];
  lastActivity: Date;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export default function MeloMethodPage() {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("marketing-campaign");
  const [industry, setIndustry] = useState("telecommunications");
  const [targetAudience, setTargetAudience] = useState("SMB");
  const [budget, setBudget] = useState(50000);
  const [timeline, setTimeline] = useState("3-months");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  
  const [depaFramework, setDepaFramework] = useState<DEPAFramework>({
    define: "",
    explain: "",
    prove: "",
    anticipate: "",
    roadmap: "",
    metadata: {
      projectType: "marketing-campaign",
      industry: "telecommunications",
      targetAudience: "SMB",
      budget: 50000,
      timeline: "3-months",
      priority: 'medium',
      tags: []
    }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedProjects, setSavedProjects] = useState<DEPAFramework[]>([]);
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  
  const { isOpen: isTemplateOpen, onOpen: onTemplateOpen, onClose: onTemplateClose } = useDisclosure();
  const { isOpen: isCollaborationOpen, onOpen: onCollaborationOpen, onClose: onCollaborationClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  
  const toast = useToast();

  // Project templates
  const projectTemplates: ProjectTemplate[] = [
    {
      id: "marketing-campaign",
      name: "Marketing Campaign",
      description: "Comprehensive marketing campaign strategy",
      category: "Marketing",
      industry: "telecommunications",
      complexity: "intermediate",
      estimatedTime: "2-3 weeks",
      framework: {
        define: "Launch a comprehensive marketing campaign to increase brand awareness and drive customer acquisition in the UAE SMB market",
        explain: "Multi-channel approach combining digital advertising, content marketing, email campaigns, and direct outreach to target decision-makers in small and medium businesses",
        prove: "Market research shows 70% of UAE SMBs are planning digital transformation initiatives, with connectivity being their top priority. Our previous campaigns achieved 35% increase in qualified leads",
        anticipate: "Budget constraints and market saturation challenges will be addressed through targeted segmentation, performance-based optimization, and strategic partnerships",
        roadmap: "Phase 1: Market research & segmentation (Week 1) → Phase 2: Creative development & channel setup (Week 2-3) → Phase 3: Campaign launch & optimization (Week 4-8) → Phase 4: Performance analysis & scaling (Week 9-12)"
      }
    },
    {
      id: "product-launch",
      name: "Product Launch",
      description: "Strategic product launch framework",
      category: "Product",
      industry: "telecommunications",
      complexity: "advanced",
      estimatedTime: "4-6 weeks",
      framework: {
        define: "Successfully launch a new telecommunications product/service in the UAE market with maximum market penetration and customer adoption",
        explain: "Comprehensive go-to-market strategy including market positioning, pricing strategy, channel development, and customer education programs",
        prove: "Based on market analysis, there's a 40% growth opportunity in the target segment. Similar launches have achieved 25% market share within 6 months",
        anticipate: "Competitive response and market saturation risks will be mitigated through unique value proposition, early customer acquisition, and strong support infrastructure",
        roadmap: "Pre-launch: Market research & product finalization (Month 1) → Soft launch: Beta testing & feedback (Month 2) → Full launch: Marketing blitz & channel activation (Month 3) → Post-launch: Optimization & scaling (Month 4-6)"
      }
    },
    {
      id: "brand-awareness",
      name: "Brand Awareness",
      description: "Brand awareness and recognition campaign",
      category: "Branding",
      industry: "telecommunications",
      complexity: "beginner",
      estimatedTime: "1-2 weeks",
      framework: {
        define: "Increase brand awareness and recognition for e& business solutions among UAE SMB decision-makers",
        explain: "Integrated brand awareness campaign using social media, content marketing, PR, and strategic partnerships to reach target audience",
        prove: "Current brand awareness is at 45% in target segment. Industry benchmarks show 60% awareness leads to 3x higher conversion rates",
        anticipate: "Market noise and competitor activity will be addressed through consistent messaging, unique positioning, and high-quality content",
        roadmap: "Week 1: Brand audit & strategy development → Week 2: Content creation & channel setup → Week 3-8: Campaign execution & monitoring → Week 9-12: Analysis & optimization"
      }
    }
  ];

  // Load saved projects on mount
  useEffect(() => {
    const saved = localStorage.getItem('melo-method-projects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  }, []);

  // Save projects to localStorage
  const saveProject = () => {
    const updatedProjects = [...savedProjects, depaFramework];
    setSavedProjects(updatedProjects);
    localStorage.setItem('melo-method-projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Project Saved",
      description: "Your DEPA framework has been saved successfully",
      status: "success",
      duration: 3000,
    });
  };

  // Load template
  const loadTemplate = (template: ProjectTemplate) => {
    setProjectType(template.id);
    setIndustry(template.industry);
    setDepaFramework(prev => ({
      ...prev,
      ...template.framework,
      metadata: {
        ...prev.metadata,
        projectType: template.id,
        industry: template.industry,
        tags: template.framework.metadata?.tags || []
      }
    }));
    setSelectedTemplate(template);
    onTemplateClose();
    
    toast({
      title: "Template Loaded",
      description: `${template.name} template has been applied`,
      status: "success",
      duration: 3000,
    });
  };

  // Generate DEPA framework with AI
  const generateDEPAFramework = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name to generate the DEPA framework",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use Claude AI for intelligent framework generation
      if (process.env.CLAUDE_API_KEY) {
        const context = {
          userId: 'melo-method-user',
          agentName: 'Strategic Planning Assistant',
          conversationHistory: [],
          userPreferences: {
            role: 'Strategic Planner',
            company: 'e& UAE',
            industry: 'telecommunications'
          }
        };

        const prompt = `Generate a comprehensive DEPA framework for:
        Project: ${projectName}
        Type: ${projectType}
        Industry: ${industry}
        Target Audience: ${targetAudience}
        Budget: $${budget}
        Timeline: ${timeline}
        Priority: ${priority}
        
        Please provide detailed, actionable content for each DEPA section that's specific to the UAE telecommunications market and e& business context.`;

        const aiResponse = await claudeAI.chat(prompt, context);
        
        // Parse AI response into DEPA sections
        const sections = aiResponse.response.split(/\n(?=DEFINE|EXPLAIN|PROVE|ANTICIPATE|ROADMAP)/i);
        
        const newFramework: DEPAFramework = {
          define: sections.find(s => s.toLowerCase().includes('define'))?.replace(/define\s*:?\s*/i, '').trim() || "",
          explain: sections.find(s => s.toLowerCase().includes('explain'))?.replace(/explain\s*:?\s*/i, '').trim() || "",
          prove: sections.find(s => s.toLowerCase().includes('prove'))?.replace(/prove\s*:?\s*/i, '').trim() || "",
          anticipate: sections.find(s => s.toLowerCase().includes('anticipate'))?.replace(/anticipate\s*:?\s*/i, '').trim() || "",
          roadmap: sections.find(s => s.toLowerCase().includes('roadmap'))?.replace(/roadmap\s*:?\s*/i, '').trim() || "",
          metadata: {
            projectType,
            industry,
            targetAudience,
            budget,
            timeline,
            priority,
            tags
          }
        };
        
        setDepaFramework(newFramework);
      } else {
        // Fallback to template-based generation
        const template = projectTemplates.find(t => t.id === projectType);
        if (template) {
          setDepaFramework(prev => ({
            ...prev,
            ...template.framework,
            metadata: {
              ...prev.metadata,
              projectType,
              industry,
              targetAudience,
              budget,
              timeline,
              priority,
              tags
            }
          }));
        }
      }
      
      toast({
        title: "DEPA Framework Generated",
        description: "Your strategic framework has been created successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating framework:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate framework. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Export framework
  const exportFramework = async (format: 'pdf' | 'docx' | 'html' | 'json') => {
    try {
      if (format === 'json') {
        const exportData = {
          projectName,
          framework: depaFramework,
          generatedAt: new Date().toISOString(),
          method: "Melo Method - DEPA Framework"
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `melo-method-${projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      } else {
        const content = `
# ${projectName} - DEPA Framework

## DEFINE
${depaFramework.define}

## EXPLAIN
${depaFramework.explain}

## PROVE
${depaFramework.prove}

## ANTICIPATE
${depaFramework.anticipate}

## ROADMAP
${depaFramework.roadmap}

---
*Generated using the Melo Method - e& GTM Director Portal*
        `;

        const documentData: DocumentData = {
          title: `${projectName} - DEPA Framework`,
          content,
          author: "Strategic Planning Assistant",
          createdAt: new Date(),
          agent: "Melo Method",
          metadata: depaFramework.metadata
        };

        const exportOptions: ExportOptions = {
          format,
          template: "business",
          includeImages: false,
          addBranding: true
        };

        const blob = await documentExporter.exportDocument(documentData, exportOptions);
        const filename = `melo-method-${projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${format}`;
        documentExporter.downloadBlob(blob, filename);
      }

      toast({
        title: "Framework Exported",
        description: `DEPA framework exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Unable to export framework",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setDepaFramework(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata!,
          tags: updatedTags
        }
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setDepaFramework(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata!,
        tags: updatedTags
      }
    }));
  };

  // Calculate framework completeness
  const getCompleteness = () => {
    const sections = [depaFramework.define, depaFramework.explain, depaFramework.prove, depaFramework.anticipate, depaFramework.roadmap];
    const filledSections = sections.filter(section => section.trim().length > 0).length;
    return Math.round((filledSections / sections.length) * 100);
  };

  return (
    <Box minH="100vh" bg="white">
      <NavigationHeader />
      
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="start">
          {/* Header */}
          <Box w="100%">
            <HStack justify="space-between" align="start" mb={4}>
              <VStack align="start" spacing={2}>
                <Heading size="xl" color="gray.800">
                  🎯 Melo Method
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Advanced Strategic Planning with DEPA Framework
                </Text>
              </VStack>
              
              <HStack spacing={2}>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={onTemplateOpen}
                  size="sm"
                >
                  📋 Templates
                </Button>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={onCollaborationOpen}
                  size="sm"
                >
                  👥 Collaborate
                </Button>
                <Button
                  colorScheme="purple"
                  variant="outline"
                  onClick={onExportOpen}
                  size="sm"
                >
                  📤 Export
                </Button>
              </HStack>
            </HStack>

            {/* Progress Bar */}
            <Box w="100%" mb={4}>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">Framework Completeness</Text>
                <Text fontSize="sm" color="gray.600">{getCompleteness()}%</Text>
              </HStack>
              <Progress value={getCompleteness()} colorScheme="brand" size="sm" borderRadius="md" />
            </Box>
          </Box>

          <Tabs variant="enclosed" w="100%" index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>🎯 Framework Builder</Tab>
              <Tab>📊 Analytics</Tab>
              <Tab>💾 Saved Projects</Tab>
              <Tab>📚 Learning Center</Tab>
            </TabList>

            <TabPanels>
              {/* Framework Builder Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start">
                  {/* Project Configuration */}
                  <Card w="100%">
                    <CardBody>
                      <VStack spacing={6} align="start">
                        <Heading size="md">Project Configuration</Heading>
                        
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="100%">
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Project Name *</Text>
                            <Input
                              placeholder="Enter your project name..."
                              value={projectName}
                              onChange={(e) => setProjectName(e.target.value)}
                            />
                          </VStack>
                          
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Project Type</Text>
                            <Select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                              <option value="marketing-campaign">Marketing Campaign</option>
                              <option value="product-launch">Product Launch</option>
                              <option value="brand-awareness">Brand Awareness</option>
                              <option value="sales-strategy">Sales Strategy</option>
                              <option value="content-strategy">Content Strategy</option>
                            </Select>
                          </VStack>

                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Industry</Text>
                            <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                              <option value="telecommunications">Telecommunications</option>
                              <option value="technology">Technology</option>
                              <option value="finance">Finance</option>
                              <option value="healthcare">Healthcare</option>
                              <option value="retail">Retail</option>
                            </Select>
                          </VStack>

                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Target Audience</Text>
                            <Select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
                              <option value="SMB">Small & Medium Business</option>
                              <option value="Enterprise">Enterprise</option>
                              <option value="Government">Government</option>
                              <option value="Consumer">Consumer</option>
                            </Select>
                          </VStack>

                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Budget (AED)</Text>
                            <NumberInput value={budget} onChange={(value) => setBudget(Number(value))}>
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </VStack>

                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Timeline</Text>
                            <Select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                              <option value="1-month">1 Month</option>
                              <option value="3-months">3 Months</option>
                              <option value="6-months">6 Months</option>
                              <option value="1-year">1 Year</option>
                            </Select>
                          </VStack>
                        </SimpleGrid>

                        {/* Advanced Options */}
                        <Box w="100%">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            mb={4}
                          >
                            {showAdvanced ? "Hide" : "Show"} Advanced Options
                          </Button>
                          
                          <Collapse in={showAdvanced}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <VStack align="start" spacing={2}>
                                <Text fontWeight="medium">Priority Level</Text>
                                <Select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </Select>
                              </VStack>

                              <VStack align="start" spacing={2}>
                                <Text fontWeight="medium">Tags</Text>
                                <HStack w="100%">
                                  <Input
                                    placeholder="Add tag..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                  />
                                  <Button size="sm" onClick={addTag}>Add</Button>
                                </HStack>
                                <HStack wrap="wrap" spacing={2}>
                                  {tags.map(tag => (
                                    <Tag key={tag} size="sm" colorScheme="blue">
                                      <TagLabel>{tag}</TagLabel>
                                      <TagCloseButton onClick={() => removeTag(tag)} />
                                    </Tag>
                                  ))}
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          </Collapse>
                        </Box>

                        <HStack spacing={4} w="100%">
                          <Button
                            colorScheme="brand"
                            onClick={generateDEPAFramework}
                            isLoading={isGenerating}
                            loadingText="Generating Framework..."
                            flex="1"
                          >
                            🤖 Generate with AI
                          </Button>
                          <Button
                            variant="outline"
                            onClick={saveProject}
                            isDisabled={!depaFramework.define}
                          >
                            💾 Save Project
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* DEPA Framework Display */}
                  {(depaFramework.define || depaFramework.explain) && (
                    <Card w="100%">
                      <CardBody>
                        <HStack justify="space-between" mb={6}>
                          <Heading size="md">DEPA Framework</Heading>
                          <HStack spacing={2}>
                            <Badge colorScheme="green" px={3} py={1}>
                              {getCompleteness()}% Complete
                            </Badge>
                            <Badge colorScheme="brand" px={3} py={1}>
                              Melo Method
                            </Badge>
                          </HStack>
                        </HStack>

                        <VStack spacing={6} align="start">
                          {/* Define */}
                          <Box w="100%">
                            <HStack spacing={2} mb={3}>
                              <Badge colorScheme="brand" variant="solid" fontSize="md" px={3} py={1}>D</Badge>
                              <Text fontWeight="bold" color="brand.500" textTransform="uppercase" fontSize="lg">
                                Define
                              </Text>
                              <Text fontSize="sm" color="gray.500">Clear objectives and scope</Text>
                            </HStack>
                            <Textarea
                              value={depaFramework.define}
                              onChange={(e) => setDepaFramework(prev => ({ ...prev, define: e.target.value }))}
                              placeholder="Define the core objective and scope of your project..."
                              rows={4}
                              fontSize="sm"
                            />
                          </Box>

                          <Divider />

                          {/* Explain */}
                          <Box w="100%">
                            <HStack spacing={2} mb={3}>
                              <Badge colorScheme="blue" variant="solid" fontSize="md" px={3} py={1}>E</Badge>
                              <Text fontWeight="bold" color="blue.500" textTransform="uppercase" fontSize="lg">
                                Explain
                              </Text>
                              <Text fontSize="sm" color="gray.500">Methodology and approach</Text>
                            </HStack>
                            <Textarea
                              value={depaFramework.explain}
                              onChange={(e) => setDepaFramework(prev => ({ ...prev, explain: e.target.value }))}
                              placeholder="Explain your approach and methodology..."
                              rows={4}
                              fontSize="sm"
                            />
                          </Box>

                          <Divider />

                          {/* Prove */}
                          <Box w="100%">
                            <HStack spacing={2} mb={3}>
                              <Badge colorScheme="green" variant="solid" fontSize="md" px={3} py={1}>P</Badge>
                              <Text fontWeight="bold" color="green.500" textTransform="uppercase" fontSize="lg">
                                Prove
                              </Text>
                              <Text fontSize="sm" color="gray.500">Evidence and validation</Text>
                            </HStack>
                            <Textarea
                              value={depaFramework.prove}
                              onChange={(e) => setDepaFramework(prev => ({ ...prev, prove: e.target.value }))}
                              placeholder="Provide evidence and validation for your approach..."
                              rows={4}
                              fontSize="sm"
                            />
                          </Box>

                          <Divider />

                          {/* Anticipate */}
                          <Box w="100%">
                            <HStack spacing={2} mb={3}>
                              <Badge colorScheme="orange" variant="solid" fontSize="md" px={3} py={1}>A</Badge>
                              <Text fontWeight="bold" color="orange.500" textTransform="uppercase" fontSize="lg">
                                Anticipate
                              </Text>
                              <Text fontSize="sm" color="gray.500">Challenges and solutions</Text>
                            </HStack>
                            <Textarea
                              value={depaFramework.anticipate}
                              onChange={(e) => setDepaFramework(prev => ({ ...prev, anticipate: e.target.value }))}
                              placeholder="Anticipate challenges and provide solutions..."
                              rows={4}
                              fontSize="sm"
                            />
                          </Box>

                          <Divider />

                          {/* Roadmap */}
                          <Box w="100%">
                            <HStack spacing={2} mb={3}>
                              <Badge colorScheme="purple" variant="solid" fontSize="md" px={3} py={1}>R</Badge>
                              <Text fontWeight="bold" color="purple.500" textTransform="uppercase" fontSize="lg">
                                Roadmap
                              </Text>
                              <Text fontSize="sm" color="gray.500">Implementation timeline</Text>
                            </HStack>
                            <Textarea
                              value={depaFramework.roadmap}
                              onChange={(e) => setDepaFramework(prev => ({ ...prev, roadmap: e.target.value }))}
                              placeholder="Define your implementation roadmap and timeline..."
                              rows={4}
                              fontSize="sm"
                            />
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>

              {/* Analytics Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start">
                  <Heading size="md">Framework Analytics</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Projects Created</StatLabel>
                          <StatNumber>{savedProjects.length}</StatNumber>
                          <StatHelpText>Total frameworks generated</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Completion Rate</StatLabel>
                          <StatNumber>{getCompleteness()}%</StatNumber>
                          <StatHelpText>Current framework</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>AI Usage</StatLabel>
                          <StatNumber>85%</StatNumber>
                          <StatHelpText>AI-generated content</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  <Card w="100%">
                    <CardBody>
                      <Heading size="sm" mb={4}>Framework Distribution</Heading>
                      <VStack spacing={3} align="start">
                        <HStack w="100%" justify="space-between">
                          <Text fontSize="sm">Define</Text>
                          <Progress value={depaFramework.define ? 100 : 0} size="sm" w="60%" colorScheme="brand" />
                        </HStack>
                        <HStack w="100%" justify="space-between">
                          <Text fontSize="sm">Explain</Text>
                          <Progress value={depaFramework.explain ? 100 : 0} size="sm" w="60%" colorScheme="blue" />
                        </HStack>
                        <HStack w="100%" justify="space-between">
                          <Text fontSize="sm">Prove</Text>
                          <Progress value={depaFramework.prove ? 100 : 0} size="sm" w="60%" colorScheme="green" />
                        </HStack>
                        <HStack w="100%" justify="space-between">
                          <Text fontSize="sm">Anticipate</Text>
                          <Progress value={depaFramework.anticipate ? 100 : 0} size="sm" w="60%" colorScheme="orange" />
                        </HStack>
                        <HStack w="100%" justify="space-between">
                          <Text fontSize="sm">Roadmap</Text>
                          <Progress value={depaFramework.roadmap ? 100 : 0} size="sm" w="60%" colorScheme="purple" />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Saved Projects Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start">
                  <Heading size="md">Saved Projects</Heading>
                  
                  {savedProjects.length === 0 ? (
                    <Card w="100%">
                      <CardBody textAlign="center" py={12}>
                        <Text color="gray.500" mb={4}>No saved projects yet</Text>
                        <Text fontSize="sm" color="gray.400">
                          Create and save your first DEPA framework to see it here
                        </Text>
                      </CardBody>
                    </Card>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="100%">
                      {savedProjects.map((project, index) => (
                        <Card key={index} cursor="pointer" _hover={{ shadow: "lg" }}>
                          <CardBody>
                            <VStack align="start" spacing={3}>
                              <HStack justify="space-between" w="100%">
                                <Text fontWeight="bold" fontSize="sm">
                                  {project.metadata?.projectType || 'Project'} #{index + 1}
                                </Text>
                                <Badge size="sm" colorScheme="blue">
                                  {project.metadata?.priority || 'medium'}
                                </Badge>
                              </HStack>
                              
                              <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                {project.define.substring(0, 100)}...
                              </Text>
                              
                              <HStack spacing={2} wrap="wrap">
                                {project.metadata?.tags?.slice(0, 3).map(tag => (
                                  <Tag key={tag} size="xs" colorScheme="gray">
                                    <TagLabel>{tag}</TagLabel>
                                  </Tag>
                                ))}
                              </HStack>
                              
                              <HStack justify="space-between" w="100%">
                                <Text fontSize="xs" color="gray.500">
                                  {project.metadata?.timeline || 'No timeline'}
                                </Text>
                                <Button size="xs" variant="outline">
                                  Load
                                </Button>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  )}
                </VStack>
              </TabPanel>

              {/* Learning Center Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start">
                  <Heading size="md">Learning Center</Heading>
                  
                  <Accordion allowToggle w="100%">
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">What is the Melo Method?</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Text fontSize="sm" color="gray.600">
                          The Melo Method is a comprehensive strategic planning framework designed specifically for 
                          go-to-market initiatives and marketing campaigns. It ensures thorough analysis and planning 
                          through five critical phases: Define, Explain, Prove, Anticipate, and Roadmap.
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">How to Use DEPA Framework</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <VStack align="start" spacing={3}>
                          <Text fontSize="sm" color="gray.600">
                            Follow these steps to create a comprehensive strategic framework:
                          </Text>
                          <List spacing={2} fontSize="sm">
                            <ListItem>
                              <ListIcon color="brand.500" />
                              <strong>Define:</strong> Clearly state your objective and scope
                            </ListItem>
                            <ListItem>
                              <ListIcon color="blue.500" />
                              <strong>Explain:</strong> Detail your methodology and approach
                            </ListItem>
                            <ListItem>
                              <ListIcon color="green.500" />
                              <strong>Prove:</strong> Provide evidence and validation
                            </ListItem>
                            <ListItem>
                              <ListIcon color="orange.500" />
                              <strong>Anticipate:</strong> Address challenges and solutions
                            </ListItem>
                            <ListItem>
                              <ListIcon color="purple.500" />
                              <strong>Roadmap:</strong> Create implementation timeline
                            </ListItem>
                          </List>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">Best Practices</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <VStack align="start" spacing={3}>
                          <Text fontSize="sm" color="gray.600">
                            Follow these best practices for optimal results:
                          </Text>
                          <List spacing={2} fontSize="sm">
                            <ListItem>• Be specific and measurable in your objectives</ListItem>
                            <ListItem>• Use data and research to support your approach</ListItem>
                            <ListItem>• Consider multiple scenarios and challenges</ListItem>
                            <ListItem>• Set realistic timelines and milestones</ListItem>
                            <ListItem>• Regularly review and update your framework</ListItem>
                          </List>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Template Selection Modal */}
      <Modal isOpen={isTemplateOpen} onClose={onTemplateClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Project Templates</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {projectTemplates.map(template => (
                <Card key={template.id} cursor="pointer" _hover={{ shadow: "md" }} onClick={() => loadTemplate(template)}>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="bold">{template.name}</Text>
                        <Badge colorScheme={template.complexity === 'beginner' ? 'green' : template.complexity === 'intermediate' ? 'yellow' : 'red'}>
                          {template.complexity}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">{template.description}</Text>
                      <Text fontSize="xs" color="gray.500">Estimated time: {template.estimatedTime}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export Framework</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Choose your preferred export format:
              </Text>
              <SimpleGrid columns={2} spacing={4} w="100%">
                <Button onClick={() => exportFramework('pdf')} colorScheme="red" variant="outline">
                  📄 PDF
                </Button>
                <Button onClick={() => exportFramework('docx')} colorScheme="blue" variant="outline">
                  📝 Word
                </Button>
                <Button onClick={() => exportFramework('html')} colorScheme="green" variant="outline">
                  🌐 HTML
                </Button>
                <Button onClick={() => exportFramework('json')} colorScheme="purple" variant="outline">
                  📊 JSON
                </Button>
              </SimpleGrid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}