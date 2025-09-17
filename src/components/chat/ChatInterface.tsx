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
import { documentExporter, DocumentData, ExportOptions } from "@/lib/documentExport";
import { emailService } from "@/lib/emailService";
import { revisionHistory } from "@/lib/revisionHistory";

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
  hasImageGeneration?: boolean;
  imageType?: string;
  generatedImage?: string;
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
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
        hasImageGeneration: data.hasImageGeneration,
        imageType: data.imageType,
      };

      setMessages(prev => [...prev, agentMessage]);

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

  const generateImage = async (message: Message) => {
    setIsGeneratingImage(true);
    
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: message.imageType || "flyer",
          content: {
            headline: message.imageType === "flyer" ? "Streamline Your Business Operations" : "Transform Your Business with e& Solutions",
            subheading: "Professional connectivity for growing businesses",
            bullets: [
              "99.9% uptime reliability",
              "24/7 local UAE support", 
              "Scalable solutions",
              "Trusted by 10,000+ businesses"
            ],
            cta: "Get Started Today"
          },
          dimensions: {
            width: message.imageType === "brochure" ? 600 : 800,
            height: message.imageType === "brochure" ? 800 : 1000
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

      // Update the message with the generated image
      setMessages(prev => prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, generatedImage: data.imageUrl }
          : msg
      ));

      toast({
        title: "Image Generated!",
        description: `${message.imageType || 'Image'} has been created successfully`,
        status: "success",
        duration: 3000,
      });

    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const exportConversation = async (format: 'pdf' | 'docx' | 'html' | 'txt') => {
    try {
      const conversationContent = messages.map(msg => 
        `${msg.sender === 'user' ? 'You' : agent.name}: ${msg.content}`
      ).join('\n\n');

      const documentData: DocumentData = {
        title: `Conversation with ${agent.name}`,
        content: conversationContent,
        author: `${agent.name} (${agent.role})`,
        createdAt: new Date(),
        agent: agent.name,
        images: messages
          .filter(msg => msg.generatedImage)
          .map(msg => msg.generatedImage!)
      };

      const exportOptions: ExportOptions = {
        format,
        template: "business",
        includeImages: true,
        addBranding: true
      };

      const blob = await documentExporter.exportDocument(documentData, exportOptions);
      const filename = `conversation-${agent.name.replace(/\s+/g, '-')}-${Date.now()}.${format}`;
      
      documentExporter.downloadBlob(blob, filename);

      toast({
        title: "Export Successful",
        description: `Conversation exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Unable to export conversation",
        status: "error",
        duration: 3000,
      });
    }
  };

  const shareConversation = async () => {
    setIsSharing(true);
    try {
      const recipients = prompt("Enter email addresses (comma-separated):");
      if (!recipients) return;

      const emailList = recipients.split(',').map(email => email.trim());
      
      const result = await emailService.shareConversation(
        {
          agent: agent.name,
          messages: messages
        },
        emailList,
        `Conversation with ${agent.name} from e& GTM Portal`
      );

      if (result.success) {
        toast({
          title: "Conversation Shared",
          description: `Sent to ${emailList.length} recipient(s)`,
          status: "success",
          duration: 3000,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      toast({
        title: "Sharing Failed",
        description: "Unable to share conversation",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const saveRevision = () => {
    const conversationId = `conversation-${agent.name}-${Date.now()}`;
    const content = messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : agent.name}: ${msg.content}`
    ).join('\n\n');

    revisionHistory.createRevision(
      conversationId,
      content,
      'conversation',
      'Current User',
      'Conversation saved',
      {
        agent: agent.name,
        messageCount: messages.length,
        hasImages: messages.some(msg => msg.generatedImage)
      }
    );

    toast({
      title: "Revision Saved",
      description: "Conversation saved to revision history",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <VStack h="100%" spacing={0} align="stretch">
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
                      <Text fontSize="sm" whiteSpace="pre-wrap">{message.content}</Text>
                      
                      {message.sender === "agent" && (
                        <VStack spacing={2} mt={2} w="100%" align="start">
                          <HStack spacing={2} wrap="wrap">
                            <Button
                              size={{ base: "sm", md: "xs" }}
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(message.content);
                                toast({
                                  title: "Copied",
                                  description: "Response copied to clipboard",
                                  status: "success",
                                  duration: 2000,
                                });
                              }}
                            >
                              📋 Copy
                            </Button>
                            
                            {message.hasImageGeneration && (
                              <Button
                                size={{ base: "sm", md: "xs" }}
                                colorScheme="brand"
                                onClick={() => generateImage(message)}
                                isLoading={isGeneratingImage}
                              >
                                🎨 Generate {message.imageType || 'Image'}
                              </Button>
                            )}
                            
                            <Button
                              size={{ base: "sm", md: "xs" }}
                              variant="outline"
                              colorScheme="green"
                              onClick={() => exportConversation('pdf')}
                            >
                              📄 Export PDF
                            </Button>
                            
                            <Button
                              size={{ base: "sm", md: "xs" }}
                              variant="outline"
                              colorScheme="blue"
                              onClick={shareConversation}
                              isLoading={isSharing}
                            >
                              📧 Share
                            </Button>
                            
                            <Button
                              size={{ base: "sm", md: "xs" }}
                              variant="outline"
                              colorScheme="purple"
                              onClick={saveRevision}
                            >
                              💾 Save
                            </Button>
                          </HStack>
                        </VStack>
                      )}

                      {message.generatedImage && (
                        <Box mt={3} p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                          <VStack spacing={3} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="brand.500">
                              Generated {message.imageType || 'Image'}:
                            </Text>
                            <Box
                              as="img"
                              src={message.generatedImage}
                              alt={`Generated ${message.imageType || 'image'}`}
                              maxW="300px"
                              maxH="400px"
                              borderRadius="md"
                              border="1px solid"
                              borderColor="gray.200"
                            />
                            <HStack spacing={2}>
                              <Button
                                size="xs"
                                colorScheme="brand"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = message.generatedImage!;
                                  link.download = `${message.imageType || 'image'}-${Date.now()}.png`;
                                  link.click();
                                }}
                              >
                                Download
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                  window.open(message.generatedImage, '_blank');
                                }}
                              >
                                View Full Size
                              </Button>
                            </HStack>
                          </VStack>
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

    </HStack>
  );
}
