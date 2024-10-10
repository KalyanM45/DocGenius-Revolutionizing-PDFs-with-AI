import React from "react";
import { Stack, TextField, Button, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send"
import { useState } from "react";

interface SendButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SendButton = ({ onClick }: SendButtonProps) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            size="medium"
            startIcon={<SendIcon />}
        >
            Send
        </Button>
    )
}

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSendMessage(text);
            setText("");
        }
    }

    return (
        <Stack
            direction="row"
            maxWidth="1200px"
            width="100%"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ p: 2, alignItems: "center" }}
        >
            <TextField
                label="question"
                multiline
                maxRows={4}
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                    }
                }}
            />
            <SendButton onClick={handleSend} />
        </Stack>
    )
}

export default ChatInput;