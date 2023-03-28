const key = document.querySelector('#openai_key');

const sysPrompts = document.querySelector('#gpt-sys');
const userPrompts = document.querySelector('#gpt-user');
const gptChatBox = document.querySelector('#gpt-chat');
const gptMsg = document.querySelector('#gpt-msg');
const gptSend = document.querySelector('#gpt-send');
const gptReset = document.querySelector('#gpt-reset');

let gptHistory = [];

async function sendChat() {
    messages = [];
    sysPrompts.value.split('\n').forEach(p => {
        if(p !== '')
        messages.push({ role: 'system', content: p});
    });
    userPrompts.value.split('\n').forEach(p => {
        if(p !== '')
        messages.push({ role: 'user', content: p});
    });
    messages = messages.concat(gptHistory);
    const msg = {
        role: 'user',
        content: gptMsg.value
    };
    gptChatBox.textContent += '\nUser: ' + gptMsg.value;
    gptMsg.value = '';
    messages.push(msg);
    gptHistory.push(msg);
    gptSend.disabled = true;
    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: messages,
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key.value}`
        }
    });
    gptSend.disabled = false;
    const respMsg = resp.data.choices[0].message;
    gptHistory.push(respMsg);
    gptChatBox.textContent += '\nDuck: ' + respMsg.content;
}

gptSend.onclick = sendChat;
gptReset.onclick = () => {
    gptHistory = [];
    gptChatBox.textContent = '';
}

const davHeader = document.querySelector('#davinci-header');
const davChatBox = document.querySelector('#davinci-chat');
const davMsg = document.querySelector('#davinci-msg');
const davSend = document.querySelector('#davinci-send');
const davReset = document.querySelector('#davinci-reset');


async function sendCompletion() {
    davChatBox.textContent += '\nUser: ' + davMsg.value;
    davMsg.value = '';

    const prompt = davHeader.value + davChatBox.textContent + '\nDuck:';
    davSend.disabled = true;
    const resp = await axios.post('https://api.openai.com/v1/completions', {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.9,
        stop: ['Duck:', 'User:'],
        frequency_penalty: 1
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key.value}`
        }
    });
    davSend.disabled = false;
    const respMsg = resp.data.choices[0].text;
    davChatBox.textContent += '\nDuck: ' + respMsg;
}

davSend.onclick = sendCompletion;
davReset.onclick = davChatBox.textContent = '';