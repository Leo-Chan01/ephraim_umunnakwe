import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Inbox, MessageSquare, Trash2, Mail, User, Clock, CheckCircle, ChevronRight } from 'lucide-react';
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
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
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
      <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
        <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Communications...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Communications Hub">
      <div className="mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-16 h-2 bg-accent"></div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">
            Inbound Submissions {unreadCount > 0 && <span className="text-accent ml-2">[{unreadCount} PENDING]</span>}
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
          <CheckCircle size={14} className="text-green-500" />
          System Operational
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
          <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
          <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Accessing neural uplink...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Messages List - 5/12 columns */}
          <div className="lg:col-span-5 space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="py-12 text-center border-4 border-neutral-100 dark:border-neutral-900">
                <Inbox size={48} className="text-neutral-200 dark:text-neutral-800 mx-auto mb-4" />
                <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Archive Empty</p>
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
                  className={`group relative p-8 border-4 transition-all cursor-pointer ${selectedMessage?.id === message.id
                      ? 'bg-neutral-900 border-neutral-900 dark:bg-accent dark:border-accent text-white translate-x-3'
                      : message.is_read
                        ? 'bg-white dark:bg-primary border-neutral-100 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-accent/20 dark:border-accent/10 border-l-accent border-l-[12px]'
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`font-black uppercase tracking-tight truncate ${selectedMessage?.id === message.id ? 'text-white' : 'text-neutral-900 dark:text-white'
                      }`}>{message.name}</h3>
                    <ChevronRight size={16} className={selectedMessage?.id === message.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} />
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-widest truncate mb-4 ${selectedMessage?.id === message.id ? 'text-white/80' : 'text-accent'
                    }`}>{message.subject}</p>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-current opacity-20">
                    <span className="text-[10px] font-black uppercase">{new Date(message.created_at).toLocaleDateString()}</span>
                    {!message.is_read && selectedMessage?.id !== message.id && (
                      <span className="text-[10px] font-black uppercase text-accent">NEW ENTRY</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail - 7/12 columns */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-12 sticky top-0">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                  <div className="space-y-6">
                    <div className="inline-block bg-accent text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-neutral-900">
                      IDENTIFIED SOURCE
                    </div>
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none">{selectedMessage.subject}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                        <User size={14} className="text-accent" />
                        <span className="uppercase tracking-widest">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                        <Mail size={14} className="text-accent" />
                        <span className="lowercase font-medium">{selectedMessage.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                        <Clock size={14} className="text-accent" />
                        <span className="uppercase tracking-widest">{new Date(selectedMessage.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all text-center"
                    >
                      SEND RESPONSE
                    </a>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="bg-transparent text-neutral-400 hover:text-red-500 hover:border-red-500 px-8 py-4 border-4 border-neutral-100 dark:border-neutral-800 font-black text-xs uppercase tracking-widest transition-all"
                    >
                      PURGE DATA
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 p-10 border-4 border-neutral-100 dark:border-neutral-900">
                  <div className="w-10 h-1 bg-accent mb-8"></div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-4 border-dashed border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center p-12 text-center">
                <MessageSquare size={64} className="text-neutral-200 dark:text-neutral-800 mb-8" />
                <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-widest mb-4">Select Communication</h3>
                <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Neural link ready for selection</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}