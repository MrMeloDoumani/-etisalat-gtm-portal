"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useToast } from "@chakra-ui/toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("etisalat-gtm-auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (inputPassword: string): boolean => {
    // In production, this should be environment variable
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "etisalat2025";
    
    if (inputPassword === demoPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("etisalat-gtm-auth", "authenticated");
      toast({
        title: "Access Granted",
        description: "Welcome to the e& GTM Director Portal",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("etisalat-gtm-auth");
    router.push("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(password);
  };

  if (isLoading) {
    return (
      <Box 
        minH="100vh" 
        bg="white" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="white" py={20}>
        <Container maxW="md">
          <VStack spacing={8} align="center">
            <Box textAlign="center">
              <Heading size="xl" color="brand.500" mb={2}>
                e& GTM Director Portal
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Secure access required
              </Text>
            </Box>

            <Card w="100%" maxW="400px">
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Portal Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter demo password"
                        size="lg"
                      />
                    </FormControl>
                    
                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="100%"
                    >
                      Access Portal
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              This is a demo portal for e& business operations.<br />
              All information is for demonstration purposes only.
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
