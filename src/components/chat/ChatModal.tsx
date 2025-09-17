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
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent maxH="90vh" bg="white">
        <ModalHeader pb={2}>
          <HStack spacing={4}>
            <Avatar
              size="md"
              name={agent.name}
              src={agent.avatar}
              bg="brand.500"
              color="white"
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                {agent.name}
              </Text>
              <HStack spacing={3}>
                <Badge
                  colorScheme={getRoleBadgeColor(agent.role)}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {agent.role}
                </Badge>
                <Badge colorScheme="green" variant="outline" fontSize="xs">
                  AI Assistant Active
                </Badge>
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        
        <ModalCloseButton />
        
        <Divider />
        
        <ModalBody p={0} overflow="hidden">
          <Box h="70vh">
            <ChatInterface agent={agent} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
