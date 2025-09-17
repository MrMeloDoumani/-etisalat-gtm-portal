"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Card,
  CardBody,
  Textarea,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useState, useRef, useEffect } from "react";
import { ResultViewer } from "./ResultViewer";

interface TeamMember {
  name: string;
  role: string;
  level: number;
  agentImplemented: boolean;
  avatar: string;
  specializations: string[];
  permissions: string[];
}

interface Message {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
  result?: {
    depa?: Record<string, string>;
    starterSentences?: string[];
    [key: string]: unknown;
  };
}

interface ChatInterfaceProps {
  agent: TeamMember;
}

export function ChatInterface({ agent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    depa?: Record<string, string>;
    starterSentences?: string[];
    [key: string]: unknown;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "agent",
      content: `Hello! I'm ${agent.name}'s AI assistant. I specialize in ${agent.specializations.join(", ")}. How can I help you with your GTM needs today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Determine which AI function to call based on the input
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          agent: agent.name,
          role: agent.role,
          specializations: agent.specializations,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        content: data.message || "I've generated a response for you.",
        timestamp: new Date(),
        result: data.result,
      };

      setMessages(prev => [...prev, agentMessage]);
      if (data.result) {
        console.log("Setting result:", data.result); // Debug log
        setCurrentResult(data.result);
      }

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <HStack h="100%" spacing={0} align="stretch">
      {/* Chat Area */}
      <VStack flex="1" h="100%" spacing={0} bg="gray.50">
        {/* Messages */}
        <Box flex="1" w="100%" p={4} overflowY="auto">
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <HStack
                key={message.id}
                justify={message.sender === "user" ? "flex-end" : "flex-start"}
                align="start"
                spacing={3}
              >
                {message.sender === "agent" && (
                  <Avatar
                    size="sm"
                    name={agent.name}
                    src={agent.avatar}
                    bg="brand.500"
                    color="white"
                  />
                )}
                
                <Card
                  maxW="70%"
                  bg={message.sender === "user" ? "brand.500" : "white"}
                  color={message.sender === "user" ? "white" : "gray.800"}
                  shadow="sm"
                >
                  <CardBody py={3} px={4}>
                    <VStack spacing={2} align="start">
                      <Text fontSize="sm">{message.content}</Text>
                      
                      {message.result && (
                        <Box>
                          <Badge colorScheme="green" size="sm" mb={2}>
                            DEPA Result Generated
                          </Badge>
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme={message.sender === "user" ? "whiteAlpha" : "brand"}
                            onClick={() => setCurrentResult(message.result || null)}
                          >
                            View Result
                          </Button>
                        </Box>
                      )}
                      
                      <Text fontSize="xs" opacity={0.7}>
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                {message.sender === "user" && (
                  <Avatar size="sm" bg="gray.400" />
                )}
              </HStack>
            ))}
            
            {isLoading && (
              <HStack justify="flex-start" align="start" spacing={3}>
                <Avatar
                  size="sm"
                  name={agent.name}
                  src={agent.avatar}
                  bg="brand.500"
                  color="white"
                />
                <Card bg="white" shadow="sm">
                  <CardBody py={3} px={4}>
                    <Text fontSize="sm" color="gray.600">
                      Thinking...
                    </Text>
                  </CardBody>
                </Card>
              </HStack>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Input Area */}
        <Box w="100%" p={4} bg="white" borderTop="1px" borderColor="gray.200">
          <form onSubmit={handleSubmit}>
            <HStack spacing={3}>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${agent.name}'s AI assistant for help with ${agent.specializations[0]}...`}
                resize="none"
                rows={2}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={isLoading}
                disabled={!input.trim()}
                size="lg"
              >
                Send
              </Button>
            </HStack>
          </form>
        </Box>
      </VStack>

      {/* Results Panel */}
      {currentResult && (
        <>
          <Divider orientation="vertical" />
          <Box w="400px" h="100%" bg="white">
            <ResultViewer result={currentResult} />
          </Box>
        </>
      )}
    </HStack>
  );
}
