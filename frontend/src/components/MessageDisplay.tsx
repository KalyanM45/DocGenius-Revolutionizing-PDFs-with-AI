import { Paper, List, ListItem, ListItemText } from '@mui/material'

interface MessageDisplayProps {
    messages: string[]
};

const MessageDisplay = ({ messages }: MessageDisplayProps) => {
    return (
        <Paper sx={{ overflowY: 'auto' }}>
            <List>
                {
                    messages.map((message, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={message} />
                        </ListItem>
                    ))
                }
            </List>
        </Paper>
    )
}

export default MessageDisplay;