import connectDB from "@/context/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const { userId } = getAuth(req)

        if(!userId){
            return NextResponse.json({success: false, message: "User not authenticated",})
        }
     // Prepare the chat data to be saved in the database

     const chatData = {
        userId,
        messages: [],
        name: "New Chat",
    };

    

    } catch (error) {
        
    }
}