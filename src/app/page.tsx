"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AgentSelectorGrid } from "@/components/ui/AgentSelectorGrid";
import { ChatModal } from "@/components/chat/ChatModal";
import { ProjectStatusBoard } from "@/components/ui/ProjectStatusBoard";
import { NavigationHeader } from "@/components/ui/NavigationHeader";
import { useState, useEffect } from "react";

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

  // Ensure modal closes when selectedAgent is cleared
  useEffect(() => {
    if (!selectedAgent && isOpen) {
      onClose();
    }
  }, [selectedAgent, isOpen, onClose]);

  const handleAgentSelect = (agent: TeamMember) => {
    // Track usage
    const now = new Date();
    const usageData = {
      agentName: agent.name,
      lastUsed: now.toISOString(),
      sessionStart: now.toISOString(),
    };
    
    localStorage.setItem(`agent_${agent.name}`, JSON.stringify(usageData));
    setSelectedAgent(agent);
    onOpen();
  };

  const handleChatClose = () => {
    // Track session duration
    if (selectedAgent) {
      const usageKey = `agent_${selectedAgent.name}`;
      const storedData = localStorage.getItem(usageKey);
      
      if (storedData) {
        const data = JSON.parse(storedData);
        const sessionEnd = new Date();
        const sessionStart = new Date(data.sessionStart);
        const duration = Math.round((sessionEnd.getTime() - sessionStart.getTime()) / 1000); // seconds
        
        const updatedData = {
          ...data,
          lastDuration: duration,
          totalSessions: (data.totalSessions || 0) + 1,
        };
        
        localStorage.setItem(usageKey, JSON.stringify(updatedData));
      }
    }
    
    // Clear selected agent and close modal
    setSelectedAgent(null);
    onClose();
  };

  return (
    <Box minH="100vh" bg="white">
      {/* Navigation Header */}
      <NavigationHeader />

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
          isOpen={isOpen && !!selectedAgent}
          onClose={handleChatClose}
          agent={selectedAgent}
        />
      )}
    </Box>
  );
}