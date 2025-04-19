import type { ChatMessage } from "@/components/chat/chat-interface"

// Helper function to generate a unique ID for messages
export function generateMessageId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}

// Helper function to format the current time for message timestamps
export function getCurrentTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Helper function to create a new message object
export function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: generateMessageId(),
    role,
    content,
    timestamp: getCurrentTimestamp(),
  }
}

// Helper function to prepare messages for the GPT API
export function prepareMessagesForAPI(messages: ChatMessage[]): { role: string; content: string }[] {
  return messages.map(({ role, content }) => ({
    role,
    content,
  }))
}
