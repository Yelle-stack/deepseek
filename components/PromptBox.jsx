import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const PromptBox = ({setIsLoading, isLoading}) => {

    const [prompt, setPrompt] = useState('');
    const {user, chats, setChats, selectedChat, setSelectedChat} = useAppContext();

    const sendPrompt = async (e)=>{
        const promptCopy = prompt;

        try {
          e.preventDefault();
          if(!user) return toast.error('Login to send message');
          if(isLoading) return toast.error('Wait for the previous prompt response');

          setIsLoading(true)
          setPrompt("")

          const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
          }

          // saving user prompt in chats array

          setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id ? 
          {
            ...chat,
            messages: [...chat.messages, userPrompt]
          }: chat
        ))
        // saving user prompt in selected chat

        setSelectedChat((prev)=> ({
          ...prev,
          messages: [...prev.messages, userPrompt]
        }))

        const {data} = await axios.post('/api/chat/ai', {
          chatId: selectedChat._id,
          prompt
        })

        if(data.success){
          setChats((prevChats)=>prevChats.map((chat)=>chat._id === selectedChat._id ? {...chat, messages: [...chat.messages, data.data]} : chat))
        }else{
          toast.error(data.message)
          setPrompt(promptCopy);
        }

        } catch (error) {
          toast.error(error.message)
          setPrompt(promptCopy);
        }
    }

  return (
    <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 mt-4 rounded-2xl transition-all`}>
      <textarea 
      className='outline-none w-full resize-none overflow-hidden wrap-break-word bg-transparent'
      rows={2}
      placeholder='Message DeepSeek' 
      required 
      onChange={(e)=>setPrompt(e.target.value)}
      value={prompt}/>

      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2'>
            <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                <Image className='h-5' src={assets.deepthink_icon} alt=''/>
                DeepThink (R1)
            </p>
            <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                <Image className='h-5' src={assets.search_icon} alt=''/>
                Search
            </p>
        </div>

        <div className='flex items-center gap-2'>
            <Image className='w-4 cursor-pointer' src={assets.pin_icon} alt=''/>
            <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
            <Image className='w-3.5 aspect-square' src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt=''/>
            </button>
        </div>
      </div>
    </form>
  )
}

export default PromptBox
