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
  const toast = useToast();

  useEffect(() => {
    // Load team hierarchy data
    fetch("/api/team/hierarchy")
      .then((res) => res.json())
      .then((data) => {
        setTeamData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading team data:", error);
        setLoading(false);
      });
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

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6} w="100%">
      {allMembers.map((member) => (
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

              <HStack spacing={2}>
                <Badge
                  colorScheme={member.agentImplemented ? "green" : "gray"}
                  variant="outline"
                  fontSize="xs"
                >
                  {member.agentImplemented ? "AI Available" : "Coming Soon"}
                </Badge>
              </HStack>

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
      ))}
    </SimpleGrid>
  );
}
