"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Heading,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface ResultViewerProps {
  result: {
    depa?: Record<string, string>;
    starterSentences?: string[];
    [key: string]: unknown;
  };
}

export function ResultViewer({ result }: ResultViewerProps) {
  const [viewMode, setViewMode] = useState<"formatted" | "json">("formatted");
  const toast = useToast();
  
  console.log("ResultViewer received:", result); // Debug log

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const downloadAsJson = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `etisalat-gtm-${Date.now()}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Downloaded",
      description: "JSON file downloaded successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const renderFormatted = () => {
    if (!result) return null;

    // Check if it's a DEPA format result
    if (result.depa) {
      return (
        <VStack spacing={4} align="start" w="100%">
          {Object.entries(result.depa).map(([key, value]) => (
            <Box key={key} w="100%">
              <Heading size="sm" color="brand.500" mb={2} textTransform="capitalize">
                {key}
              </Heading>
              <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                {value as string}
              </Text>
              <Divider mt={3} />
            </Box>
          ))}
          
          {result.starterSentences && (
            <Box w="100%">
              <Heading size="sm" color="brand.500" mb={2}>
                Starter Sentences
              </Heading>
              <VStack spacing={2} align="start">
                {result.starterSentences.map((sentence: string, index: number) => (
                  <Text key={index} fontSize="sm" color="gray.700">
                    • {sentence}
                  </Text>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      );
    }

    // For other result formats
    return (
      <VStack spacing={4} align="start" w="100%">
        {Object.entries(result).map(([key, value]) => (
          <Box key={key} w="100%">
            <Heading size="sm" color="brand.500" mb={2} textTransform="capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Heading>
            <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
              {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
            </Text>
            <Divider mt={3} />
          </Box>
        ))}
      </VStack>
    );
  };

  const renderJson = () => {
    return (
      <Box
        as="pre"
        fontSize="xs"
        color="gray.700"
        bg="gray.50"
        p={3}
        borderRadius="md"
        overflow="auto"
        w="100%"
        fontFamily="mono"
      >
        {JSON.stringify(result, null, 2)}
      </Box>
    );
  };

  return (
    <VStack h="100%" spacing={0} align="stretch">
      {/* Header */}
      <Box p={4} bg="gray.50" borderBottom="1px" borderColor="gray.200">
        <VStack spacing={3} align="start">
          <HStack justify="space-between" w="100%">
            <Heading size="md" color="gray.800">
              Result Preview
            </Heading>
            <Badge colorScheme="brand" variant="outline">
              DEPA Format
            </Badge>
          </HStack>
          
          <HStack spacing={2}>
            <Button
              size="sm"
              variant={viewMode === "formatted" ? "solid" : "outline"}
              colorScheme="brand"
              onClick={() => setViewMode("formatted")}
            >
              Formatted
            </Button>
            <Button
              size="sm"
              variant={viewMode === "json" ? "solid" : "outline"}
              colorScheme="brand"
              onClick={() => setViewMode("json")}
            >
              JSON
            </Button>
          </HStack>
          
          <HStack spacing={2}>
            <IconButton
              aria-label="Copy to clipboard"
              icon={<CopyIcon />}
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
            />
            <IconButton
              aria-label="Download JSON"
              icon={<DownloadIcon />}
              size="sm"
              variant="outline"
              onClick={downloadAsJson}
            />
          </HStack>
        </VStack>
      </Box>

      {/* Content */}
      <Box flex="1" p={4} overflow="auto">
        {viewMode === "formatted" ? renderFormatted() : renderJson()}
      </Box>
    </VStack>
  );
}
