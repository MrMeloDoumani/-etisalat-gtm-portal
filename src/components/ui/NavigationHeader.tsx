"use client";

import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  Link,
  VStack,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@/components/auth/RoleProvider";

export function NavigationHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, canAccess } = useRole();

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Home", href: "/" }];
    
    let currentPath = "";
    paths.forEach(path => {
      currentPath += `/${path}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ name, href: currentPath });
    });
    
    return breadcrumbs;
  };

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

            {/* Right - Navigation Links & User */}
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
                variant="ghost"
                colorScheme="brand"
                onClick={() => router.push("/melo-method")}
              >
                Melo Method
              </Button>

              {canAccess("analytics") && (
                <Button
                  variant="ghost"
                  colorScheme="brand"
                  onClick={() => router.push("/analytics")}
                >
                  Analytics
                </Button>
              )}
              
              {/* User Menu */}
              <Menu>
                <MenuButton>
                  <HStack spacing={2}>
                    <Avatar size="sm" name={currentUser?.name} />
                    <VStack spacing={0} align="start">
                      <Text fontSize="sm" fontWeight="medium">
                        {currentUser?.name}
                      </Text>
                      <Badge size="sm" colorScheme="green">
                        {currentUser?.level === 1 ? "Director" : 
                         currentUser?.level === 2 ? "Senior Manager" :
                         currentUser?.level === 3 ? "Manager" : "Specialist"}
                      </Badge>
                    </VStack>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push("/profile")}>
                    Profile Settings
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/permissions")}>
                    Permissions
                  </MenuItem>
                  <MenuItem>
                    Demo Mode
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>

          {/* Breadcrumbs */}
          {pathname !== "/" && (
            <Breadcrumb fontSize="sm" color="gray.600">
              {getBreadcrumbs().map((crumb) => (
                <BreadcrumbItem key={crumb.href}>
                  <BreadcrumbLink 
                    onClick={() => router.push(crumb.href)}
                    cursor="pointer"
                    _hover={{ color: "brand.500" }}
                  >
                    {crumb.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
