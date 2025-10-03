import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { adminService } from '../../lib/admin-service';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadMessages();
  }, [router, mounted]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    setIsLoading(false);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await adminService.markMessageAsRead(id);
      setMessages(messages.map(m => m.id === id ? {...m, is_read: true} : m));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await adminService.deleteMessage(id);
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (!mounted || !isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Messages {unreadCount > 0 && <span className="text-red-400">({unreadCount} unread)</span>}
        </h1>
        <p className="text-gray-300">Contact form submissions from your portfolio</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-300">Loading messages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-300">No messages yet</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.is_read) {
                      handleMarkAsRead(message.id);
                    }
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMessage?.id === message.id
                      ? 'bg-blue-500/20 border-blue-500/30'
                      : message.is_read
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold truncate">{message.name}</h3>
                    {!message.is_read && (
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm truncate mb-2">{message.subject}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                    <div className="text-gray-300">
                      <p><strong>From:</strong> {selectedMessage.name}</p>
                      <p><strong>Email:</strong> {selectedMessage.email}</p>
                      <p><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Message</h3>
                <p className="text-gray-300">Choose a message from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}