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
} from "@chakra-ui/react";
import { NavigationHeader } from "@/components/ui/NavigationHeader";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

interface DEPAFramework {
  define: string;
  explain: string;
  prove: string;
  anticipate: string;
  roadmap: string;
}

export default function MeloMethodPage() {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("flyer");
  const [depaFramework, setDepaFramework] = useState<DEPAFramework>({
    define: "",
    explain: "",
    prove: "",
    anticipate: "",
    roadmap: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

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
    
    // Simulate AI generation - in real app this would call a specialized API
    setTimeout(() => {
      const templates = {
        flyer: {
          define: `Professional business flyer for "${projectName}" targeting UAE SMB market for enhanced connectivity solutions`,
          explain: "Comprehensive e& business solutions designed to streamline operations and boost productivity for growing companies",
          prove: "Trusted by 10,000+ UAE businesses with 99.9% uptime SLA and 24/7 local support",
          anticipate: "Address concerns about setup complexity and costs with our simplified onboarding and flexible pricing",
          roadmap: "Contact business center → Consultation within 48hrs → Implementation in 5-7 business days"
        },
        strategy: {
          define: `Strategic go-to-market approach for "${projectName}" targeting UAE SMB segment with focus on digital transformation`,
          explain: "Multi-channel strategy leveraging direct sales, digital marketing, and partner networks to reach 50,000+ potential customers",
          prove: "Market research shows 70% of UAE SMBs plan digital upgrades in next 12 months, with connectivity as top priority",
          anticipate: "Competition challenges addressed through superior local support, government partnerships, and flexible pricing models",
          roadmap: "Market analysis → Customer segmentation → Channel activation → Campaign launch → Performance optimization"
        },
        campaign: {
          define: `Integrated marketing campaign for "${projectName}" designed to increase brand awareness and customer acquisition in UAE market`,
          explain: "Multi-touchpoint campaign combining digital advertising, content marketing, and direct outreach to target decision-makers",
          prove: "Previous campaigns achieved 35% increase in qualified leads and 28% boost in brand recognition within target segment",
          anticipate: "Budget constraints addressed through phased rollout and performance-based optimization across channels",
          roadmap: "Campaign design → Content creation → Channel setup → Launch execution → Performance monitoring → Optimization"
        }
      };

      const template = templates[projectType as keyof typeof templates] || templates.flyer;
      setDepaFramework(template);
      setIsGenerating(false);
      
      toast({
        title: "DEPA Framework Generated",
        description: "Your strategic framework has been created successfully",
        status: "success",
        duration: 3000,
      });
    }, 2000);
  };

  const exportFramework = () => {
    const exportData = {
      projectName,
      projectType,
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

    toast({
      title: "Framework Exported",
      description: "DEPA framework downloaded successfully",
      status: "success",
      duration: 3000,
    });
  };

  return (
    <Box minH="100vh" bg="white">
      <NavigationHeader />
      
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="start">
          {/* Header */}
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Melo Method
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Strategic DEPA Framework for Comprehensive Planning
            </Text>
          </Box>

          {/* Method Explanation */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>The Melo Method - DEPA Framework</AlertTitle>
              <AlertDescription>
                A structured approach to strategic planning that ensures comprehensive coverage of all critical aspects:
                <strong> Define → Explain → Prove → Anticipate → Roadmap</strong>
              </AlertDescription>
            </Box>
          </Alert>

          {/* Framework Generator */}
          <Card w="100%">
            <CardBody>
              <VStack spacing={6} align="start">
                <Heading size="md">Generate DEPA Framework</Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="medium">Project Name</Text>
                    <Input
                      placeholder="Enter your project name..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="medium">Project Type</Text>
                    <select
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "16px"
                      }}
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                    >
                      <option value="flyer">Marketing Flyer</option>
                      <option value="strategy">GTM Strategy</option>
                      <option value="campaign">Marketing Campaign</option>
                    </select>
                  </VStack>
                </SimpleGrid>

                <Button
                  colorScheme="brand"
                  onClick={generateDEPAFramework}
                  isLoading={isGenerating}
                  loadingText="Generating Framework..."
                >
                  Generate DEPA Framework
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* DEPA Framework Display */}
          {(depaFramework.define || depaFramework.explain) && (
            <Card w="100%">
              <CardBody>
                <HStack justify="space-between" mb={6}>
                  <Heading size="md">DEPA Framework Results</Heading>
                  <HStack spacing={2}>
                    <Button size="sm" variant="outline" onClick={exportFramework}>
                      Export Framework
                    </Button>
                    <Badge colorScheme="green" px={3} py={1}>
                      Melo Method
                    </Badge>
                  </HStack>
                </HStack>

                <VStack spacing={6} align="start">
                  {/* Define */}
                  <Box w="100%">
                    <HStack spacing={2} mb={2}>
                      <Badge colorScheme="brand" variant="solid">D</Badge>
                      <Text fontWeight="bold" color="brand.500" textTransform="uppercase">
                        Define
                      </Text>
                    </HStack>
                    <Textarea
                      value={depaFramework.define}
                      onChange={(e) => setDepaFramework(prev => ({ ...prev, define: e.target.value }))}
                      placeholder="Define the core objective and scope..."
                      rows={3}
                    />
                  </Box>

                  <Divider />

                  {/* Explain */}
                  <Box w="100%">
                    <HStack spacing={2} mb={2}>
                      <Badge colorScheme="blue" variant="solid">E</Badge>
                      <Text fontWeight="bold" color="blue.500" textTransform="uppercase">
                        Explain
                      </Text>
                    </HStack>
                    <Textarea
                      value={depaFramework.explain}
                      onChange={(e) => setDepaFramework(prev => ({ ...prev, explain: e.target.value }))}
                      placeholder="Explain the approach and methodology..."
                      rows={3}
                    />
                  </Box>

                  <Divider />

                  {/* Prove */}
                  <Box w="100%">
                    <HStack spacing={2} mb={2}>
                      <Badge colorScheme="green" variant="solid">P</Badge>
                      <Text fontWeight="bold" color="green.500" textTransform="uppercase">
                        Prove
                      </Text>
                    </HStack>
                    <Textarea
                      value={depaFramework.prove}
                      onChange={(e) => setDepaFramework(prev => ({ ...prev, prove: e.target.value }))}
                      placeholder="Provide evidence and validation..."
                      rows={3}
                    />
                  </Box>

                  <Divider />

                  {/* Anticipate */}
                  <Box w="100%">
                    <HStack spacing={2} mb={2}>
                      <Badge colorScheme="orange" variant="solid">A</Badge>
                      <Text fontWeight="bold" color="orange.500" textTransform="uppercase">
                        Anticipate
                      </Text>
                    </HStack>
                    <Textarea
                      value={depaFramework.anticipate}
                      onChange={(e) => setDepaFramework(prev => ({ ...prev, anticipate: e.target.value }))}
                      placeholder="Anticipate challenges and objections..."
                      rows={3}
                    />
                  </Box>

                  <Divider />

                  {/* Roadmap */}
                  <Box w="100%">
                    <HStack spacing={2} mb={2}>
                      <Badge colorScheme="purple" variant="solid">R</Badge>
                      <Text fontWeight="bold" color="purple.500" textTransform="uppercase">
                        Roadmap
                      </Text>
                    </HStack>
                    <Textarea
                      value={depaFramework.roadmap}
                      onChange={(e) => setDepaFramework(prev => ({ ...prev, roadmap: e.target.value }))}
                      placeholder="Define the implementation roadmap..."
                      rows={3}
                    />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Method Documentation */}
          <Card w="100%">
            <CardBody>
              <Heading size="md" mb={4}>About the Melo Method</Heading>
              <VStack spacing={4} align="start">
                <Text>
                  The Melo Method is a comprehensive strategic planning framework designed specifically for 
                  go-to-market initiatives and marketing campaigns. It ensures thorough analysis and planning 
                  through five critical phases:
                </Text>

                <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4} w="100%">
                  <Box textAlign="center">
                    <Badge colorScheme="brand" variant="solid" mb={2} fontSize="lg" px={3} py={2}>D</Badge>
                    <Text fontWeight="bold" fontSize="sm">DEFINE</Text>
                    <Text fontSize="xs" color="gray.600">Clear objectives and scope</Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Badge colorScheme="blue" variant="solid" mb={2} fontSize="lg" px={3} py={2}>E</Badge>
                    <Text fontWeight="bold" fontSize="sm">EXPLAIN</Text>
                    <Text fontSize="xs" color="gray.600">Methodology and approach</Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Badge colorScheme="green" variant="solid" mb={2} fontSize="lg" px={3} py={2}>P</Badge>
                    <Text fontWeight="bold" fontSize="sm">PROVE</Text>
                    <Text fontSize="xs" color="gray.600">Evidence and validation</Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Badge colorScheme="orange" variant="solid" mb={2} fontSize="lg" px={3} py={2}>A</Badge>
                    <Text fontWeight="bold" fontSize="sm">ANTICIPATE</Text>
                    <Text fontSize="xs" color="gray.600">Challenges and solutions</Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Badge colorScheme="purple" variant="solid" mb={2} fontSize="lg" px={3} py={2}>R</Badge>
                    <Text fontWeight="bold" fontSize="sm">ROADMAP</Text>
                    <Text fontSize="xs" color="gray.600">Implementation timeline</Text>
                  </Box>
                </SimpleGrid>

                <Text color="gray.600" fontSize="sm">
                  This framework has been successfully applied across various marketing initiatives, 
                  ensuring comprehensive coverage and strategic alignment with business objectives.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
