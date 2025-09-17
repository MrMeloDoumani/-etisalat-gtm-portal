"use client";

import { Box, Text } from "@chakra-ui/react";

export function GlobalFooter() {
  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="transparent"
      py={1}
      px={4}
      zIndex={10}
      pointerEvents="none"
    >
      <Text
        fontSize="10px"
        color="gray.400"
        textAlign="center"
        fontWeight="normal"
      >
        Created by mrmelo.com
      </Text>
    </Box>
  );
}
