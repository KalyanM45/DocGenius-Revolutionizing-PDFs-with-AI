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

const ChatInput = () => {
    const [text, setText] = useState('');

    const onSend = () => {
        if (text.trim()) {
            alert(text);
            setText("");
        }
    }

    return (
        <Stack
            direction="row"
            maxWidth="800px"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ margin: "0 auto", alignItems: "center" }}
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
                        onSend();
                    }
                }}
            />
            <SendButton onClick={onSend} />
        </Stack>
    )
}

export default ChatInput;