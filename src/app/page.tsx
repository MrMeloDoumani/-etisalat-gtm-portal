"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { AgentSelectorGrid } from "@/components/ui/AgentSelectorGrid";
import { ChatModal } from "@/components/chat/ChatModal";
import { ProjectStatusBoard } from "@/components/ui/ProjectStatusBoard";
import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  level: number;
  agentImplemented: boolean;
  avatar: string;
  specializations: string[];
  permissions: string[];
}

export default function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAgent, setSelectedAgent] = useState<TeamMember | null>(null);

  const handleAgentSelect = (agent: TeamMember) => {
    setSelectedAgent(agent);
    onOpen();
  };

  return (
    <Box minH="100vh" bg="white">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={6}>
        <Container maxW="7xl">
          <VStack spacing={4} align="start">
            <HStack justify="space-between" w="100%">
              <VStack align="start" spacing={1}>
                <Heading size="xl" color="brand.500">
                  e& GTM Director Portal
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Go-to-Market Operations Hub
                </Text>
              </VStack>
              
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.500">
                  Demo Environment
                </Text>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack spacing={12} align="start">
          {/* Team Directory Section */}
          <Box w="100%">
            <VStack spacing={6} align="start">
              <Box>
                <Heading size="lg" color="gray.800" mb={2}>
                  GTM Team Directory
                </Heading>
                <Text color="gray.600">
                  Select a team member to access their AI assistant for specialized support
                </Text>
              </Box>
              
              <AgentSelectorGrid onAgentSelect={handleAgentSelect} />
            </VStack>
          </Box>

          {/* Project Status Board */}
          <Box w="100%">
            <VStack spacing={6} align="start">
              <Box>
                <Heading size="lg" color="gray.800" mb={2}>
                  Active Projects
                </Heading>
                <Text color="gray.600">
                  Current pipeline and project status overview
                </Text>
              </Box>
              
              <ProjectStatusBoard />
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Chat Modal */}
      {selectedAgent && (
        <ChatModal
          isOpen={isOpen}
          onClose={onClose}
          agent={selectedAgent}
        />
      )}
    </Box>
  );
}