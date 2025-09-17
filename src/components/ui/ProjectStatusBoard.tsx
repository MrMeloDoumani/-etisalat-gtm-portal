"use client";

import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
} from "@chakra-ui/react";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/stat";
import { useState, useEffect } from "react";

interface Project {
  projectId: string;
  name: string;
  status: string;
  owner: string;
  pipelineValue: string;
  expectedCloseDate: string;
  probability: number;
  stage: string;
  products: string[];
  lastActivity: string;
  nextStep: string;
}

export function ProjectStatusBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load CRM data
    fetch("/api/crm/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "closed won":
        return "green";
      case "in progress":
      case "negotiation":
        return "blue";
      case "qualified lead":
        return "yellow";
      case "discovery":
        return "purple";
      default:
        return "gray";
    }
  };

  const totalPipelineValue = projects.reduce((sum, project) => {
    const value = parseFloat(project.pipelineValue.replace(/[^\d.]/g, ""));
    return sum + value;
  }, 0);

  const avgProbability = projects.length > 0 
    ? projects.reduce((sum, project) => sum + project.probability, 0) / projects.length
    : 0;

  if (loading) {
    return <Text>Loading project data...</Text>;
  }

  return (
    <VStack spacing={6} w="100%" align="start">
      {/* Summary Statistics */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Pipeline Value</StatLabel>
              <StatNumber color="brand.500">
                AED {totalPipelineValue.toLocaleString()}
              </StatNumber>
              <StatHelpText>Across {projects.length} active projects</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average Win Probability</StatLabel>
              <StatNumber color="blue.500">{avgProbability.toFixed(0)}%</StatNumber>
              <StatHelpText>Weighted average across pipeline</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Projects</StatLabel>
              <StatNumber color="purple.500">{projects.length}</StatNumber>
              <StatHelpText>
                {projects.filter(p => p.status === "Closed Won").length} closed this month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Project Cards */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="100%">
        {projects.map((project) => (
          <Card key={project.projectId} border="1px solid" borderColor="gray.200">
            <CardBody>
              <VStack spacing={4} align="start">
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="gray.800">
                      {project.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {project.projectId}
                    </Text>
                  </VStack>
                  
                  <Badge
                    colorScheme={getStatusColor(project.status)}
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {project.status}
                  </Badge>
                </HStack>

                <VStack spacing={2} align="start" w="100%">
                  <HStack justify="space-between" w="100%">
                    <Text fontSize="sm" color="gray.600">Owner:</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {project.owner}
                    </Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <Text fontSize="sm" color="gray.600">Value:</Text>
                    <Text fontSize="sm" fontWeight="bold" color="brand.500">
                      {project.pipelineValue}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="100%">
                    <Text fontSize="sm" color="gray.600">Expected Close:</Text>
                    <Text fontSize="sm">
                      {new Date(project.expectedCloseDate).toLocaleDateString()}
                    </Text>
                  </HStack>
                </VStack>

                <Box w="100%">
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm" color="gray.600">Win Probability</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {project.probability}%
                    </Text>
                  </HStack>
                  <Progress
                    value={project.probability}
                    colorScheme="brand"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>

                <VStack spacing={1} align="start" w="100%">
                  <Text fontSize="sm" color="gray.600">Stage:</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {project.stage}
                  </Text>
                  
                  <Text fontSize="sm" color="gray.600">Next Step:</Text>
                  <Text fontSize="sm">
                    {project.nextStep}
                  </Text>
                </VStack>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Products:</Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {project.products.map((product) => (
                      <Badge
                        key={product}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                      >
                        {product}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
