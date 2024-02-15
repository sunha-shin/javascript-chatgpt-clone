let shouldAddToHistory = true; // 전역 변수로 historyElementCreator 호출 여부를 제어

const submitButton = document.querySelector('#submit');
const outputElement = document.querySelector('#output');
const inputElement = document.querySelector('input');
const historyElement = document.querySelector('.history');
const newChatButton = document.querySelector('#new-chat');

const getMessage = async () => {
    console.log('Fetching message...');
    // 로딩 아이콘을 표시 (세 개의 점으로 구성)
    showLoadingIcon();
    
    try {
        const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ "role": "user", "content": inputElement.value }])
        });

        const data = await response.json();
        console.log(data);

        outputElement.innerHTML = ''; // 로딩 아이콘 제거
        const chatResponse = data.choices[0].message.content;
        typeWriter('output', chatResponse);

        if (chatResponse && shouldAddToHistory) {
            historyElementCreator(inputElement.value);
        }
    } catch (error) {
        console.error('Network response was not ok');
        outputElement.innerHTML = 'Error fetching message.';
    }
};



const historyElementCreator = (text) => {
    const historyP = document.createElement('p');
    historyP.textContent = text;
    historyElement.append(historyP);

    historyP.addEventListener('click', () => {
        changeInput(historyP.textContent, false); // false indicates not to add to history again
    });

    !shouldAddToHistory
};

const changeInput = (value) => {
    inputElement.value = value;
    shouldAddToHistory = false;
    getMessage();
};

const clearInput = () => {
    inputElement.value = '';
    outputElement.textContent = '';
};

const typeWriter = (elementId, text, typingDelay = 30) => {
    const element = document.getElementById(elementId);
    let i = 0;

    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, typingDelay);
        }
    };
    type();
};

const showLoadingIcon = () => {
    outputElement.innerHTML = `
      <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
}

// Activate submission via Enter key
inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getMessage();
        event.preventDefault();
    }
});

submitButton.addEventListener('click', getMessage);
newChatButton.addEventListener('click', clearInput);
