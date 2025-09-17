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
  Button,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Textarea,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { NavigationHeader } from "@/components/ui/NavigationHeader";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  project: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: string;
  team: string[];
  dueDate: string;
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Create e& Business Pro marketing campaign",
      description: "Develop comprehensive marketing materials for Business Pro package launch",
      status: "in-progress",
      priority: "high",
      assignee: "Yasser Omar Zaki Shaaban",
      dueDate: "2025-10-01",
      project: "Business Pro Launch"
    },
    {
      id: "2", 
      title: "SMB market research analysis",
      description: "Analyze UAE SMB market trends and competitive landscape",
      status: "todo",
      priority: "medium",
      assignee: "Maryam Bakhit Alsuwaidi",
      dueDate: "2025-09-25",
      project: "Market Analysis Q4"
    },
    {
      id: "3",
      title: "Partner integration roadmap",
      description: "Define technical requirements for new partner integrations",
      status: "completed",
      priority: "high",
      assignee: "Khalid Riyad Badah",
      dueDate: "2025-09-15",
      project: "Partnership Expansion"
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Business Pro Launch",
      description: "Launch new Business Pro package targeting medium enterprises",
      progress: 65,
      status: "On Track",
      team: ["Yasser Omar Zaki Shaaban", "Stela Paneva", "Fadhal Abdul Majeed"],
      dueDate: "2025-10-15"
    },
    {
      id: "2",
      name: "Market Analysis Q4",
      description: "Comprehensive market analysis for Q4 strategy planning",
      progress: 30,
      status: "In Progress",
      team: ["Maryam Bakhit Alsuwaidi", "Sara Abdelaziz Alhammadi"],
      dueDate: "2025-10-30"
    },
    {
      id: "3",
      name: "Partnership Expansion",
      description: "Expand partnership network with key technology providers",
      progress: 85,
      status: "Nearly Complete",
      team: ["Khalid Riyad Badah", "Elham Husain Al Hammadi"],
      dueDate: "2025-09-30"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "green";
      case "in-progress":
        return "blue";
      case "todo":
        return "gray";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Box minH="100vh" bg="white">
      <NavigationHeader />
      
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="start">
          {/* Header */}
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              GTM Project Planner
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Organize tasks, track progress, and coordinate team activities
            </Text>
          </Box>

          {/* Tabs */}
          <Tabs variant="line" colorScheme="brand" w="100%">
            <TabList>
              <Tab>Dashboard</Tab>
              <Tab>Projects</Tab>
              <Tab>Tasks</Tab>
              <Tab>Calendar</Tab>
              <Tab>Reports</Tab>
            </TabList>

            <TabPanels>
              {/* Dashboard Tab */}
              <TabPanel px={0}>
                <VStack spacing={8} align="start" w="100%">
                  {/* Quick Stats */}
                  <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} w="100%">
                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                          {projects.length}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Active Projects
                        </Text>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {tasks.filter(t => t.status === "in-progress").length}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          In Progress
                        </Text>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          {tasks.filter(t => t.status === "completed").length}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Completed
                        </Text>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="red.500">
                          {tasks.filter(t => t.priority === "high").length}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          High Priority
                        </Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  {/* Recent Projects */}
                  <Box w="100%">
                    <Heading size="md" mb={4}>Recent Projects</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {projects.map((project) => (
                        <Card key={project.id}>
                          <CardBody>
                            <VStack spacing={3} align="start">
                              <HStack justify="space-between" w="100%">
                                <Text fontWeight="bold">{project.name}</Text>
                                <Badge colorScheme="blue">{project.status}</Badge>
                              </HStack>
                              
                              <Text fontSize="sm" color="gray.600">
                                {project.description}
                              </Text>
                              
                              <Box w="100%">
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="sm">Progress</Text>
                                  <Text fontSize="sm">{project.progress}%</Text>
                                </HStack>
                                <Progress value={project.progress} colorScheme="brand" />
                              </Box>
                              
                              <Text fontSize="xs" color="gray.500">
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Projects Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start" w="100%">
                  <HStack justify="space-between" w="100%">
                    <Heading size="md">Projects</Heading>
                    <Button colorScheme="brand" size="sm">
                      + New Project
                    </Button>
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="100%">
                    {projects.map((project) => (
                      <Card key={project.id}>
                        <CardBody>
                          <VStack spacing={4} align="start">
                            <HStack justify="space-between" w="100%">
                              <Text fontWeight="bold" fontSize="lg">{project.name}</Text>
                              <Badge colorScheme="blue">{project.status}</Badge>
                            </HStack>
                            
                            <Text color="gray.600">{project.description}</Text>
                            
                            <Box w="100%">
                              <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm" fontWeight="medium">Progress</Text>
                                <Text fontSize="sm">{project.progress}%</Text>
                              </HStack>
                              <Progress value={project.progress} colorScheme="brand" size="lg" />
                            </Box>
                            
                            <VStack spacing={2} align="start" w="100%">
                              <Text fontSize="sm" fontWeight="medium">Team:</Text>
                              <VStack spacing={1} align="start">
                                {project.team.map((member) => (
                                  <Text key={member} fontSize="sm" color="gray.600">
                                    • {member}
                                  </Text>
                                ))}
                              </VStack>
                            </VStack>
                            
                            <HStack justify="space-between" w="100%">
                              <Text fontSize="sm" color="gray.500">
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </Text>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </VStack>
              </TabPanel>

              {/* Tasks Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start" w="100%">
                  <HStack justify="space-between" w="100%">
                    <Heading size="md">Tasks</Heading>
                    <Button colorScheme="brand" size="sm">
                      + New Task
                    </Button>
                  </HStack>
                  
                  <VStack spacing={4} w="100%">
                    {tasks.map((task) => (
                      <Card key={task.id} w="100%">
                        <CardBody>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={2} flex="1">
                              <HStack spacing={3}>
                                <Text fontWeight="bold">{task.title}</Text>
                                <Badge colorScheme={getStatusColor(task.status)}>
                                  {task.status.replace("-", " ")}
                                </Badge>
                                <Badge colorScheme={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </HStack>
                              
                              <Text color="gray.600" fontSize="sm">
                                {task.description}
                              </Text>
                              
                              <HStack spacing={4}>
                                <Text fontSize="sm" color="gray.500">
                                  Assignee: {task.assignee}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  Project: {task.project}
                                </Text>
                              </HStack>
                            </VStack>
                            
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Calendar Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start" w="100%">
                  <Heading size="md">Calendar View</Heading>
                  <Card w="100%" minH="400px">
                    <CardBody display="flex" alignItems="center" justifyContent="center">
                      <VStack spacing={4}>
                        <Text fontSize="lg" color="gray.600">
                          📅 Calendar Integration
                        </Text>
                        <Text color="gray.500" textAlign="center">
                          Calendar view for project deadlines, meetings, and milestones.<br />
                          This would integrate with your existing calendar system.
                        </Text>
                        <Button colorScheme="brand">
                          Connect Calendar
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Reports Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="start" w="100%">
                  <Heading size="md">Reports & Analytics</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                    <Card>
                      <CardBody>
                        <VStack spacing={4} align="start">
                          <Text fontWeight="bold">Team Performance</Text>
                          <Text color="gray.600">
                            Track team productivity and task completion rates
                          </Text>
                          <Button size="sm" colorScheme="brand">
                            Generate Report
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <VStack spacing={4} align="start">
                          <Text fontWeight="bold">Project Timeline</Text>
                          <Text color="gray.600">
                            Visualize project timelines and dependencies
                          </Text>
                          <Button size="sm" colorScheme="brand">
                            View Timeline
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <VStack spacing={4} align="start">
                          <Text fontWeight="bold">Resource Allocation</Text>
                          <Text color="gray.600">
                            Analyze team workload and resource distribution
                          </Text>
                          <Button size="sm" colorScheme="brand">
                            View Resources
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <VStack spacing={4} align="start">
                          <Text fontWeight="bold">ROI Analysis</Text>
                          <Text color="gray.600">
                            Measure project return on investment and success metrics
                          </Text>
                          <Button size="sm" colorScheme="brand">
                            Calculate ROI
                          </Button>
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
