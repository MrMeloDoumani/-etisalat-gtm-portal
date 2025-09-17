"use client";

import {
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
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

interface AgentSelectorGridProps {
  onAgentSelect: (agent: TeamMember) => void;
}

export function AgentSelectorGrid({ onAgentSelect }: AgentSelectorGridProps) {
  const [teamData, setTeamData] = useState<{
    director: TeamMember;
    seniorManagers: TeamMember[];
    managers: TeamMember[];
    specialists: TeamMember[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<Record<string, {
    lastUsed: string;
    lastDuration?: number;
    totalSessions?: number;
  }>>({});
  const toast = useToast();

  const loadUsageData = () => {
    const usage: Record<string, {
      lastUsed: string;
      lastDuration?: number;
      totalSessions?: number;
    }> = {};
    
    // Load usage data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('agent_')) {
        const agentName = key.replace('agent_', '');
        const data = localStorage.getItem(key);
        if (data) {
          usage[agentName] = JSON.parse(data);
        }
      }
    }
    
    setUsageData(usage);
  };

  useEffect(() => {
    // Load team hierarchy data
    fetch("/api/team/hierarchy")
      .then((res) => res.json())
      .then((data) => {
        setTeamData(data);
        setLoading(false);
        loadUsageData();
      })
      .catch((error) => {
        console.error("Error loading team data:", error);
        setLoading(false);
      });
      
    // Load usage data on mount and when window gains focus
    loadUsageData();
    const handleFocus = () => loadUsageData();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleAgentClick = (agent: TeamMember) => {
    if (!agent.agentImplemented) {
      toast({
        title: "Agent Not Available",
        description: `${agent.name}'s AI assistant is not yet implemented. Only Yasser's agent is currently active.`,
        status: "info",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    onAgentSelect(agent);
  };

  if (loading) {
    return <Text>Loading team directory...</Text>;
  }

  if (!teamData) {
    return <Text>Unable to load team directory</Text>;
  }

  // Flatten team structure for display
  const allMembers: TeamMember[] = [
    teamData.director,
    ...teamData.seniorManagers,
    ...teamData.managers,
    ...teamData.specialists,
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Director":
        return "brand";
      case "Senior Manager":
        return "purple";
      case "Manager":
        return "blue";
      case "Specialist":
        return "green";
      default:
        return "gray";
    }
  };

    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${remainingSeconds}s`;
    };

    const formatLastUsed = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        return `${diffDays}d ago`;
      } else if (diffHours > 0) {
        return `${diffHours}h ago`;
      } else {
        return "Recently";
      }
    };

    return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6} w="100%">
      {allMembers.map((member) => {
        const usage = usageData[member.name];
        
        return (
        <Card
          key={member.name}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            transform: "translateY(-2px)",
            shadow: "lg",
            borderColor: member.agentImplemented ? "brand.300" : "gray.300",
          }}
          onClick={() => handleAgentClick(member)}
          opacity={member.agentImplemented ? 1 : 0.7}
          border="1px solid"
          borderColor={member.agentImplemented ? "gray.200" : "gray.300"}
        >
          <CardBody>
            <VStack spacing={4} align="center">
              <Avatar
                size="lg"
                name={member.name}
                src={member.avatar}
                bg={member.agentImplemented ? "brand.500" : "gray.400"}
                color="white"
              />

              <VStack spacing={2} align="center" textAlign="center">
                <Text fontWeight="bold" fontSize="md" color="gray.800">
                  {member.name}
                </Text>
                
                <Badge
                  colorScheme={getRoleBadgeColor(member.role)}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {member.role}
                </Badge>

                <VStack spacing={1} align="center">
                  {member.specializations.slice(0, 2).map((spec) => (
                    <Text
                      key={spec}
                      fontSize="xs"
                      color="gray.600"
                      textAlign="center"
                    >
                      {spec}
                    </Text>
                  ))}
                </VStack>
              </VStack>

              <VStack spacing={2} w="100%">
                <HStack spacing={2} justify="center">
                  <Badge
                    colorScheme={member.agentImplemented ? "green" : "gray"}
                    variant="outline"
                    fontSize="xs"
                  >
                    {member.agentImplemented ? "AI Available" : "Coming Soon"}
                  </Badge>
                </HStack>
                
                {usage && member.agentImplemented && (
                  <VStack spacing={1} w="100%">
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Last used: {formatLastUsed(usage.lastUsed)}
                    </Text>
                    {usage.lastDuration && (
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Duration: {formatDuration(usage.lastDuration)}
                      </Text>
                    )}
                  </VStack>
                )}
              </VStack>

              {member.agentImplemented && (
                <Button
                  size="sm"
                  colorScheme="brand"
                  variant="solid"
                  w="100%"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentClick(member);
                  }}
                >
                  Chat with AI
                </Button>
              )}
            </VStack>
          </CardBody>
        </Card>
        );
      })}
    </SimpleGrid>
  );
}
