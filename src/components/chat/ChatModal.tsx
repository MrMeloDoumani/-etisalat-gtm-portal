"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Box,
  Divider,
} from "@chakra-ui/react";
import { ChatInterface } from "./ChatInterface";

interface TeamMember {
  name: string;
  role: string;
  level: number;
  agentImplemented: boolean;
  avatar: string;
  specializations: string[];
  permissions: string[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: TeamMember;
}

export function ChatModal({ isOpen, onClose, agent }: ChatModalProps) {
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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={{ base: "full", md: "6xl" }} 
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent 
        maxH={{ base: "100vh", md: "90vh" }} 
        bg="white"
        borderRadius={{ base: "none", md: "lg" }}
        m={{ base: 0, md: 4 }}
      >
        <ModalHeader pb={2} px={{ base: 4, md: 6 }}>
          <VStack spacing={3} align="start" w="100%">
            <HStack spacing={4} w="100%">
              <Avatar
                size={{ base: "md", md: "md" }}
                name={agent.name}
                src={agent.avatar}
                bg="brand.500"
                color="white"
              />
              <VStack align="start" spacing={1} flex="1">
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
                  {agent.name}
                </Text>
                <HStack spacing={2} wrap="wrap">
                  <Badge
                    colorScheme={getRoleBadgeColor(agent.role)}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    {agent.role}
                  </Badge>
                  <Badge colorScheme="green" variant="outline" fontSize="xs">
                    AI Active
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </ModalHeader>
        
        <ModalCloseButton />
        
        <Divider />
        
        <ModalBody p={0} overflow="hidden">
          <Box h={{ base: "calc(100vh - 140px)", md: "70vh" }}>
            <ChatInterface agent={agent} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
