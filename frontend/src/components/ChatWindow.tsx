import { Stack, Box, Container, Typography } from "@mui/material";
import ChatInput from "./ChatInput";
import { useState } from "react";
import { AskMessage, AskResponse, apiAsk } from "../api/chatApi";
import MessageDisplay from "./MessageDisplay"

const ChatWindow = () => {
    const [messages, setMessages] = useState<string[]>([])
    const [sessionId, setSessionId] = useState<string | null>(null);

    const handleSendMessage = async (newMessage: string) => {
        setMessages((prevMessages) => [...prevMessages, newMessage])

        const message: AskMessage = {
            question: newMessage,
            sid: sessionId,
        }

        try {
            const response: AskResponse = await apiAsk(message);

            if (response.sid) {
                setSessionId(response.sid);
            } else {
                console.warn("missing session_id in response from /api/ask", response);
            }
            if (response.ai_message) {
                setMessages((prevMessages) => [...prevMessages, response.ai_message]);
            } else {
                console.warn("missing ai in response from /api/ask", response);
            }

        } catch (error) {
            console.error("Error on handleSendMessage: ", error);
        }
    }

    return (
        <Container
            maxWidth="lg"
            sx={{
                height: "100vh",
                display: 'flex',
            }}>
            <Stack sx={{ flexGrow: 1 }}>
                <MessageDisplay messages={messages} />
                {/* <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {messages.map((message, index) => (
                        <Typography key={index} variant="body1" sx={{ marginBottom: 1 }}>
                            {message}
                        </Typography>
                    ))}
                </Box> */}
                <ChatInput onSendMessage={handleSendMessage} />
            </Stack>
        </Container>
    )
}

export default ChatWindow;