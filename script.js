const API_KEY = 'AIzaSyAaOe_DR6O9D4iX7YBgwvOKIpSg5RxIqKM';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {
    const promptFunction = `Você é um bot especializado no time brasileiro de counter strike chamado FURIA. Responda todas as perguntas em português com foco nesses temas. Pergunta: ${prompt}`;
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: promptFunction
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Falha ao gerar resposta.');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
    return text
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.png' : 'bot.png';
    profileImage.alt = isUser ? 'User' : 'Bot';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        sendButton.disabled = true;
        userInput.disabled = true;

        try {
            const botMessage = await generateResponse(userMessage);
            addMessage(cleanMarkdown(botMessage), false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Desculpe, ocorreu um erro. Tente novamente.', false);
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});
