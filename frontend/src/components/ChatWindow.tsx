import { Stack, Box, Container, Typography } from "@mui/material";
import ChatInput from "./ChatInput";
import { useState } from "react";

interface ApiAskResponse {
    sid: string,
    ai_message: string,
};

const ChatWindow = () => {
    const [messages, setMessages] = useState<string[]>([])
    const [sessionId, setSessionId] = useState<string | null>(null);

    const handleSendMessage = async (newMessage: string) => {
        setMessages((prevMessages) => [...prevMessages, newMessage])

        const payload = {
            "question": newMessage,
            "sid": sessionId,
        }

        try {
            const response = await fetch("http://localhost:500/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Bad Network");
            }
            const responseData: ApiAskResponse = await response.json();
            if (responseData.sid) {
                setSessionId(responseData.sid);
            } else {
                console.warn("missing session_id in response from /api/ask");
            }
            if (responseData.ai_message) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                console.warn("missing ai in response from /api/ask");
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
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {messages.map((message, index) => (
                        <Typography key={index} variant="body1" sx={{ marginBottom: 1 }}>
                            {message}
                        </Typography>
                    ))}
                </Box>
                <ChatInput onSendMessage={handleSendMessage} />
            </Stack>
        </Container>
    )
}

export default ChatWindow;