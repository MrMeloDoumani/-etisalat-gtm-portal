"use client";

import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export function NavigationHeader() {
  const router = useRouter();

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
      <Container maxW="7xl">
        <VStack spacing={3} align="start">
          {/* Main Navigation */}
          <HStack justify="space-between" w="100%" align="center">
            {/* Left - Title */}
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                e& GTM Director Portal
              </Text>
              <Text fontSize="sm" color="gray.600">
                This project was created by{" "}
                <Link
                  href="https://www.mrmelo.com"
                  target="_blank"
                  color="brand.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: "underline" }}
                >
                  mrmelo.com
                </Link>
              </Text>
            </VStack>

            {/* Right - Navigation Links */}
            <HStack spacing={4}>
              <Button
                variant="ghost"
                colorScheme="brand"
                onClick={() => router.push("/")}
              >
                Agents
              </Button>
              
              <Button
                variant="ghost"
                colorScheme="brand"
                as={Link}
                href="https://www.etisalat.ae/en/smb/index.html"
                target="_blank"
                _hover={{ textDecoration: "none" }}
              >
                e& Website
              </Button>
              
              <Button
                variant="ghost"
                colorScheme="brand"
                onClick={() => router.push("/planner")}
              >
                Planner
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                colorScheme="brand"
              >
                Demo Mode
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
