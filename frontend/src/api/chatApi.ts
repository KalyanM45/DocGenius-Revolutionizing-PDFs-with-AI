export interface AskMessage {
    question: string,
    sid: string | null,
};

export interface AskResponse {
    sid: string,
    ai_message: string,
};

export const apiAsk = async (message: AskMessage): Promise<AskResponse> => {
    const response = await fetch('http://localhost:5000/api/ask', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json()
}