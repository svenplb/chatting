'use client'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from './ui/input'
import { MessageSquare, Volume2, VolumeX, Mic, MicOff, Headphones, PhoneOff, Monitor, Plus } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string | number
  username: string
  content: string
  color: string
  avatar: string
  createdAt?: string
}

const USER_COLORS = [
  "text-blue-400",
  "text-green-400",
  "text-pink-400",
  "text-yellow-400",
  "text-purple-400",
  "text-red-400",
  "text-orange-400",
  "text-cyan-400",
];

function getColorForUsername(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

export default function ChattingWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentChannel, setCurrentChannel] = useState("dev-discussion")
  const socketRef = useRef<Socket | null>(null)
  const [username, setUsername] = useState("You")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Load messages from database on component mount
  useEffect(() => {
    loadMessages()
  }, [currentChannel])

  // Connect to Socket.IO server
  useEffect(() => {
    const socket = io("ws://localhost:4000")
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Socket connected!", socket.id);
    });

    socket.on("chat-message", (msg: any) => {
      console.log("Received message:", msg);
      if (msg.channelName === currentChannel) {
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [currentChannel])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, currentChannel])

  const loadMessages = async () => {
    try {
      // First, get the channel ID by name
      const channelResponse = await fetch(`/api/chat/channels?name=${currentChannel}`)
      if (channelResponse.ok) {
        const channel = await channelResponse.json()
        if (channel) {
          const response = await fetch(`/api/chat?channelId=${channel.id}`)
          if (response.ok) {
            const dbMessages = await response.json()
            const formattedMessages: Message[] = dbMessages.map((msg: any) => ({
              id: msg.id,
              username: msg.user.username,
              content: msg.content,
              color: msg.user.color,
              avatar: msg.user.avatar,
              createdAt: msg.createdAt
            }))
            setMessages(formattedMessages)
          }
        } else {
          // Channel doesn't exist, so clear messages
          setMessages([])
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        username: username,
        content: inputValue.trim(),
        color: getColorForUsername(username),
        avatar: "YO",
        createdAt: new Date().toISOString(),
      }

      setInputValue("")

      // Emit to Socket.IO server
      if (socketRef.current) {
        console.log("Emitting message:", { ...newMessage, channelName: currentChannel });
        socketRef.current.emit("chat-message", {
          ...newMessage,
          channelName: currentChannel,
        })
      }

      try {
        // Save to database
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage.content,
            username: newMessage.username,
            channelName: currentChannel,
            avatar: newMessage.avatar,
            color: newMessage.color,
          }),
        })

        if (!response.ok) {
          console.error("Failed to save message")
          // Optionally show an error to the user
        }
      } catch (error) {
        console.error("Error saving message:", error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-black text-gray-300">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 flex flex-col h-screen flex-shrink-0">
        {/* Text Channels */}
        <div className="p-4 space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start px-3 py-2 h-auto rounded-lg ${
              currentChannel === "general"
                ? "bg-zinc-800 text-gray-200 hover:bg-zinc-800 hover:text-gray-200"
                : "text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
            }`}
            onClick={() => setCurrentChannel("general")}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            general
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start px-3 py-2 h-auto rounded-lg ${
              currentChannel === "dev-discussion"
                ? "bg-zinc-800 text-gray-200 hover:bg-zinc-800 hover:text-gray-200"
                : "text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
            }`}
            onClick={() => setCurrentChannel("dev-discussion")}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            dev-discussion
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start px-3 py-2 h-auto rounded-lg ${
              currentChannel === "off-topic"
                ? "bg-zinc-800 text-gray-200 hover:bg-zinc-800 hover:text-gray-200"
                : "text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
            }`}
            onClick={() => setCurrentChannel("off-topic")}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            off-topic
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start px-3 py-2 h-auto rounded-lg ${
              currentChannel === "github"
                ? "bg-zinc-800 text-gray-200 hover:bg-zinc-800 hover:text-gray-200"
                : "text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
            }`}
            onClick={() => setCurrentChannel("github")}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            github
          </Button>
        </div>

        {/* Voice Channels */}
        <div className="px-4 pb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
            Voice Channels
            <Button variant="ghost" size="icon" className="w-4 h-4 ml-auto">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
          >
            <Volume2 className="w-4 h-4 mr-3" />
            general
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
          >
            <VolumeX className="w-4 h-4 mr-3" />
            development
          </Button>
        </div>

        {/* Voice Connected Panel */}
        <div className="mt-auto">
          <div className="mx-4 mb-4 p-3 bg-zinc-800 rounded-lg">
            <div className="flex items-center text-green-400 text-sm font-medium mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Voice Connected
            </div>
            <div className="text-gray-300 text-sm mb-3">general</div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-zinc-700">
                <Monitor className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-zinc-700">
                <MicOff className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-zinc-700">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-zinc-700">
                <Headphones className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-zinc-700 text-red-400">
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Username Input */}
        <div className="p-4 flex items-center gap-2 flex-shrink-0">
          <span className={`w-4 h-4 rounded-full inline-block bg-current ${getColorForUsername(username)}`}></span>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="mb-2 px-2 py-1 rounded bg-zinc-800 text-gray-200"
          />
          <span className={`font-bold ${getColorForUsername(username)}`}>{username}</span>
        </div>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-zinc-700 text-gray-300">{message.avatar}</AvatarFallback>
                </Avatar>
                <div className="bg-zinc-800 px-4 py-2 rounded-2xl max-w-md">
                  <div className={`text-sm font-medium ${getColorForUsername(message.username)} mb-1`}>{message.username}</div>
                  <p className="text-gray-300 text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Message Input */}
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Write a message to '${currentChannel}'`}
              className="w-full bg-zinc-800 border-none text-gray-300 placeholder-gray-500 rounded-lg px-4 py-3 focus-visible:ring-1 focus-visible:ring-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
