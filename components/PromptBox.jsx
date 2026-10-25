"use client";
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, setChats, selectedChat, setSelectedChat } = useAppContext();

  const canSend = prompt.trim().length > 0 && !isLoading;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendPrompt();
    }
  };

  // Affiche la réponse mot par mot et ne se termine qu'à la fin de l'animation
  const typeMessage = (content, chatId) =>
    new Promise((resolve) => {
      const words = content.split(' ');
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setSelectedChat((prev) => {
          if (!prev || prev._id !== chatId) return prev; // l'utilisateur a changé de chat
          const messages = [...prev.messages];
          messages[messages.length - 1] = {
            ...messages[messages.length - 1],
            content: words.slice(0, i).join(' '),
          };
          return { ...prev, messages };
        });
        if (i >= words.length) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });

  const sendPrompt = async (e) => {
    e?.preventDefault();

    const text = prompt.trim();
    if (!text) return;
    if (!user) return toast.error('Login to send message');
    if (!selectedChat) return toast.error('Select or create a chat first');
    if (isLoading) return toast.error('Wait for the previous prompt response');

    const chatId = selectedChat._id;
    const promptCopy = prompt;

    try {
      setIsLoading(true);
      setPrompt('');

      const userPrompt = { role: 'user', content: text, timestamp: Date.now() };

      // Ajoute le message de l'utilisateur à la liste des chats et au chat sélectionné
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, messages: [...chat.messages, userPrompt] } : chat
        )
      );
      setSelectedChat((prev) => ({ ...prev, messages: [...prev.messages, userPrompt] }));

      const { data } = await axios.post('/api/chat/ai', { chatId, prompt: text });

      if (data.success) {
        // Version complète dans la liste des chats
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId ? { ...chat, messages: [...chat.messages, data.data] } : chat
          )
        );

        // Message vide, rempli progressivement par l'animation
        const assistantMessage = { role: 'assistant', content: '', timestamp: Date.now() };
        setSelectedChat((prev) => ({ ...prev, messages: [...prev.messages, assistantMessage] }));

        await typeMessage(data.data.content, chatId);
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className="w-full max-w-2xl bg-[#404045] p-4 mt-4 rounded-2xl transition-all"
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden wrap-break-word bg-transparent"
        rows={2}
        placeholder="Message DeepSeek"
        aria-label="Message"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Envoyer le message"
            className={`${canSend ? 'bg-primary cursor-pointer' : 'bg-[#71717a] cursor-not-allowed'} rounded-full p-2`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={canSend ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
