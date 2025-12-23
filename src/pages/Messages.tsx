import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Search, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import type { ConversationWithDetails, MessageWithSender } from "@/types/schema";
import { formatRelativeTime } from "@/lib/format";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { API_URL } from '@/lib/api';

function MessagesContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);

  const { data: conversations, isLoading: loadingConversations } = useQuery<{
    data: ConversationWithDetails[];
  }>({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: messages, isLoading: loadingMessages } = useQuery<{
    data: MessageWithSender[];
  }>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `/api/conversations/${selectedConversation}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled: !!selectedConversation,
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${API_URL}/api/conversations/${selectedConversation}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newMessage }),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const selectedConvo = conversations?.data.find(
    (c) => c.id === selectedConversation
  );
  const otherParticipant = selectedConvo?.participants.find(
    (p) => p.id !== user?.id
  );

  return (
    <div>
        <div className="mx-auto max-w-6xl h-[calc(100vh-200px)]">
          <div className="flex h-full border-x">
            <div
              className={`w-full md:w-80 border-r flex flex-col ${
                selectedConversation ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="p-4 border-b">
                <h2 className="font-heading font-semibold text-lg mb-3">
                  Messages
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-messages"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                {loadingConversations ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations?.data && conversations.data.length > 0 ? (
                  <div>
                    {conversations.data.map((conversation) => {
                      const other = conversation.participants.find(
                        (p) => p.id !== user?.id
                      );
                      return (
                        <button
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left ${
                            selectedConversation === conversation.id
                              ? "bg-muted"
                              : ""
                          }`}
                          data-testid={`conversation-${conversation.id}`}
                        >
                          <Avatar className="h-12 w-12 shrink-0">
                            <AvatarImage src={other?.profilePhotoUrl || undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {other?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium truncate">
                                {other?.name}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {conversation.lastMessageAt &&
                                  formatRelativeTime(conversation.lastMessageAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage?.text || "No messages yet"}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full mt-1">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No messages yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start a conversation by contacting a property owner or agent
                    </p>
                    <Link href="/search">
                      <Button variant="outline" size="sm">
                        Browse Properties
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </div>

            <div
              className={`flex-1 flex flex-col ${
                !selectedConversation ? "hidden md:flex" : "flex"
              }`}
            >
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                      data-testid="button-back-messages"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherParticipant?.profilePhotoUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {otherParticipant?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{otherParticipant?.name}</h3>
                      {selectedConvo?.listing && (
                        <Link
                          href={`/property/${selectedConvo.listing.slug}`}
                          className="text-sm text-primary hover:underline"
                        >
                          Re: {selectedConvo.listing.title}
                        </Link>
                      )}
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    {loadingMessages ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              i % 2 === 0 ? "justify-start" : "justify-end"
                            }`}
                          >
                            <Skeleton className="h-16 w-48 rounded-xl" />
                          </div>
                        ))}
                      </div>
                    ) : messages?.data && messages.data.length > 0 ? (
                      <div className="space-y-4">
                        {messages.data.map((message) => {
                          const isOwn = message.fromUserId === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isOwn
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted rounded-bl-none"
                                }`}
                              >
                                <p>{message.text}</p>
                                <span
                                  className={`text-xs ${
                                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}
                                >
                                  {message.createdAt && formatRelativeTime(message.createdAt)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Start the conversation by sending a message
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        data-testid="input-new-message"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        data-testid="button-send-message"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default function Messages() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}