"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Select,
  Divider,
} from "@chakra-ui/react";
import { NavigationHeader } from "@/components/ui/NavigationHeader";
import { useRole } from "@/components/auth/RoleProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AnalyticsData {
  agentUsage: {
    totalSessions: number;
    avgSessionDuration: number;
    mostUsedAgent: string;
    totalQueries: number;
  };
  productivity: {
    documentsGenerated: number;
    approvalRate: number;
    avgResponseTime: number;
    userSatisfaction: number;
  };
  projects: {
    active: number;
    completed: number;
    overdue: number;
    onTrack: number;
  };
  team: {
    activeUsers: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    topPerformers: string[];
  };
}

export default function AnalyticsPage() {
  const { currentUser, canAccess } = useRole();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    agentUsage: {
      totalSessions: 147,
      avgSessionDuration: 8.5,
      mostUsedAgent: "Yasser Omar Zaki Shaaban",
      totalQueries: 423
    },
    productivity: {
      documentsGenerated: 89,
      approvalRate: 94.2,
      avgResponseTime: 2.3,
      userSatisfaction: 4.7
    },
    projects: {
      active: 12,
      completed: 34,
      overdue: 3,
      onTrack: 9
    },
    team: {
      activeUsers: 8,
      dailyActiveUsers: 6,
      weeklyActiveUsers: 8,
      topPerformers: ["Yasser Omar Zaki Shaaban", "Stela Paneva", "Khalid Riyad Badah"]
    }
  });

  // Check access permissions
  if (!canAccess("analytics")) {
    return (
      <Box minH="100vh" bg="white">
        <NavigationHeader />
        <Container maxW="7xl" py={20}>
          <VStack spacing={6} textAlign="center">
            <Heading size="lg" color="red.500">Access Denied</Heading>
            <Text color="gray.600">
              You don't have permission to view analytics. Please contact your administrator.
            </Text>
            <Button colorScheme="brand" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white">
      <NavigationHeader />
      
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="start">
          {/* Header */}
          <HStack justify="space-between" w="100%">
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.800">
                Analytics Dashboard
              </Heading>
              <Text color="gray.600" fontSize="lg">
                GTM Performance Insights & Metrics
              </Text>
            </VStack>
            
            <HStack spacing={4}>
              <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} w="150px">
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </Select>
              
              <Button colorScheme="brand" size="sm">
                Export Report
              </Button>
            </HStack>
          </HStack>

          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="100%">
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total AI Sessions</StatLabel>
                  <StatNumber>{analyticsData.agentUsage.totalSessions}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Avg Session Duration</StatLabel>
                  <StatNumber>{analyticsData.agentUsage.avgSessionDuration}m</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12.5%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Documents Generated</StatLabel>
                  <StatNumber>{analyticsData.productivity.documentsGenerated}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    8.2%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>User Satisfaction</StatLabel>
                  <StatNumber>{analyticsData.productivity.userSatisfaction}/5</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    4.1%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Detailed Analytics */}
          <Tabs variant="line" colorScheme="brand" w="100%">
            <TabList>
              <Tab>Agent Usage</Tab>
              <Tab>Productivity</Tab>
              <Tab>Projects</Tab>
              <Tab>Team Performance</Tab>
              <Tab>Compliance</Tab>
            </TabList>

            <TabPanels>
              {/* Agent Usage Tab */}
              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Most Active Agents</Heading>
                        <VStack spacing={3} w="100%">
                          <HStack justify="space-between" w="100%">
                            <Text>Yasser Omar Zaki Shaaban</Text>
                            <Badge colorScheme="green">87 sessions</Badge>
                          </HStack>
                          <Progress value={87} max={100} w="100%" colorScheme="green" />
                          
                          <HStack justify="space-between" w="100%">
                            <Text>Stela Paneva</Text>
                            <Badge colorScheme="blue">34 sessions</Badge>
                          </HStack>
                          <Progress value={34} max={100} w="100%" colorScheme="blue" />
                          
                          <HStack justify="space-between" w="100%">
                            <Text>Khalid Riyad Badah</Text>
                            <Badge colorScheme="orange">26 sessions</Badge>
                          </HStack>
                          <Progress value={26} max={100} w="100%" colorScheme="orange" />
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Query Types</Heading>
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th>Type</Th>
                              <Th isNumeric>Count</Th>
                              <Th isNumeric>%</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>Flyer Creation</Td>
                              <Td isNumeric>156</Td>
                              <Td isNumeric>37%</Td>
                            </Tr>
                            <Tr>
                              <Td>Strategy Planning</Td>
                              <Td isNumeric>134</Td>
                              <Td isNumeric>32%</Td>
                            </Tr>
                            <Tr>
                              <Td>Market Analysis</Td>
                              <Td isNumeric>89</Td>
                              <Td isNumeric>21%</Td>
                            </Tr>
                            <Tr>
                              <Td>Other</Td>
                              <Td isNumeric>44</Td>
                              <Td isNumeric>10%</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Productivity Tab */}
              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" mb={2}>Approval Rate</Text>
                      <Text fontSize="3xl" color="green.500" fontWeight="bold">
                        {analyticsData.productivity.approvalRate}%
                      </Text>
                      <Progress value={analyticsData.productivity.approvalRate} colorScheme="green" mt={2} />
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" mb={2}>Avg Response Time</Text>
                      <Text fontSize="3xl" color="blue.500" fontWeight="bold">
                        {analyticsData.productivity.avgResponseTime}s
                      </Text>
                      <Text fontSize="sm" color="gray.500">Target: &lt; 3s</Text>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" mb={2}>Quality Score</Text>
                      <Text fontSize="3xl" color="purple.500" fontWeight="bold">
                        {analyticsData.productivity.userSatisfaction}/5
                      </Text>
                      <Progress value={(analyticsData.productivity.userSatisfaction / 5) * 100} colorScheme="purple" mt={2} />
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Projects Tab */}
              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                        {analyticsData.projects.active}
                      </Text>
                      <Text>Active Projects</Text>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">
                        {analyticsData.projects.completed}
                      </Text>
                      <Text>Completed</Text>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="red.500">
                        {analyticsData.projects.overdue}
                      </Text>
                      <Text>Overdue</Text>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                        {analyticsData.projects.onTrack}
                      </Text>
                      <Text>On Track</Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Team Performance Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start" w="100%">
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" mb={2}>Daily Active</Text>
                        <Text fontSize="3xl" color="brand.500" fontWeight="bold">
                          {analyticsData.team.dailyActiveUsers}
                        </Text>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" mb={2}>Weekly Active</Text>
                        <Text fontSize="3xl" color="brand.500" fontWeight="bold">
                          {analyticsData.team.weeklyActiveUsers}
                        </Text>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" mb={2}>Total Users</Text>
                        <Text fontSize="3xl" color="brand.500" fontWeight="bold">
                          {analyticsData.team.activeUsers}
                        </Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  <Card w="100%">
                    <CardBody>
                      <Heading size="md" mb={4}>Top Performers</Heading>
                      <VStack spacing={3}>
                        {analyticsData.team.topPerformers.map((performer, index) => (
                          <HStack key={performer} justify="space-between" w="100%">
                            <HStack>
                              <Badge colorScheme={index === 0 ? "gold" : index === 1 ? "gray" : "orange"}>
                                #{index + 1}
                              </Badge>
                              <Text>{performer}</Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                              {index === 0 ? "98 points" : index === 1 ? "87 points" : "76 points"}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Compliance Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start" w="100%">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                    <Card>
                      <CardBody>
                        <Heading size="md" mb={4}>Audit Trail</Heading>
                        <VStack spacing={3} align="start">
                          <Text fontSize="sm"><strong>Today:</strong> 23 actions logged</Text>
                          <Text fontSize="sm"><strong>This week:</strong> 156 actions logged</Text>
                          <Text fontSize="sm"><strong>Last audit:</strong> 2 days ago</Text>
                          <Button size="sm" colorScheme="brand" mt={2}>
                            View Full Audit Log
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <Heading size="md" mb={4}>Security Metrics</Heading>
                        <VStack spacing={3} align="start">
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Failed login attempts</Text>
                            <Badge colorScheme="green">0</Badge>
                          </HStack>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Data export requests</Text>
                            <Badge colorScheme="blue">12</Badge>
                          </HStack>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="sm">Approval workflows</Text>
                            <Badge colorScheme="green">Active</Badge>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}
