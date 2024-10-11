import { Paper, Box, Typography, Stack } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AndroidIcon from '@mui/icons-material/Android'

interface MessageItemProps {
    message: string,
    from: string
};

const MessageItem = ({ message, from }: MessageItemProps) => {
    const flex = from === 'user' ? 'flex-end' : 'flex-start';
    const IconComponent = from === 'user' ? PersonIcon : AndroidIcon;
    return (
        <Stack
            spacing={1}
            direction="row"
            sx={{ alignItems: "center", justifyContent: flex }}
        >
            {from === 'ai' && <IconComponent />}
            <Box
                sx={{ p: 1, border: 1, borderRadius: 2, }}>
                <Typography variant='body1'>{message}</Typography>
            </Box>
            {from === 'user' && <IconComponent />}
        </Stack>
    )
}


interface MessageDisplayProps {
    messages: string[]
};

const MessageDisplay = ({ messages }: MessageDisplayProps) => {
    return (
        <Paper elevation={0} sx={{ flex: 1, overflowY: 'auto' }}>
            <Stack spacing={3} sx={{ p: 2 }}>
                {messages.map((message, index) => (
                    <MessageItem
                        message={message}
                        from={index % 2 === 0 ? 'user' : 'ai'}
                    />
                ))}
            </Stack>
        </Paper>
    )
}

export default MessageDisplay;