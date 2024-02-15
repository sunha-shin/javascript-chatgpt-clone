// DOM 요소 선택: 필요한 HTML 요소들을 선택하여 변수에 할당합니다.
const submitButton = document.querySelector('#submit'); // 제출 버튼
const outputElement = document.querySelector('#output'); // 출력을 표시할 요소
const inputElement = document.querySelector('input'); // 사용자 입력을 받는 input 요소
const historyElement = document.querySelector('.history'); // 이전 채팅 내역을 표시할 요소
const newChatButton = document.querySelector('#new-chat'); // 새 채팅 시작 버튼

// 지난 응답값을 관리하는 배열
const dataReqRes = [];

// fetchChatResponse: 사용자 입력을 바탕으로 API에 요청을 보내고 응답을 받는 비동기 함수입니다.
const fetchChatResponse = async (userInput) => {
    const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ "role": "user", "content": userInput }])
    });

    if (!response.ok) {
        throw new Error(`서버 에러: ${response.statusText}`);
    }
    
    return response.json();
};

// getMessage: 사용자 입력을 처리하고, API 응답을 화면에 표시하는 메인 함수입니다.
const getMessage = async () => {    
    showLoadingIcon(); // 로딩 아이콘을 표시

    try {
        const data = await fetchChatResponse(inputElement.value);
        const chatResponse = data.choices[0].message.content;
        dataReqRes.push({ question: inputElement.value, response: chatResponse });

        clearOutput(); 
        typeWriter(outputElement, chatResponse); // 타이핑 효과로 응답 표시
        historyElementCreator(inputElement.value); // 입력 이력 생성        
        console.log("dataReqRes: ", dataReqRes);

    } catch (error) {
        console.error(error);
        outputElement.innerHTML = '<p class="error-message">메시지를 가져오는 데 실패했습니다. 나중에 다시 시도해주세요.</p>';
    }
};

// historyElementCreator: 사용자가 입력한 채팅 내역을 기록하는 함수입니다.
const historyElementCreator = (inputValue) => {
    const historyChild = document.createElement('p');
    historyChild.textContent = inputValue;
    historyElement.append(historyChild);
};

// clickHistoryChild: 채팅 이력을 클릭했을 때 해당 내용을 다시 출력하는 이벤트 핸들러입니다.
const clickHistoryChild = (event) => {
    if (event.target.tagName !== 'P') return;

    const historyChild = event.target;
    clearOutput();
    const matchedEntry = dataReqRes.find(entry => entry.question === historyChild.textContent);
    
    if (!matchedEntry) return;

    typeWriter(outputElement, matchedEntry.response);
    changeInput(historyChild.textContent);
};

// changeInput: 입력 필드의 값을 변경하는 함수입니다.
const changeInput = (value) => {
    inputElement.value = value;
};

// clearInput: 입력 필드와 출력 요소를 클리어하는 함수입니다.
const clearInput = () => {
    inputElement.value = '';
    outputElement.textContent = '';
};

// clearOutput: 출력 요소의 내용을 클리어하는 함수입니다.
const clearOutput = () => {
    outputElement.innerHTML = '';
};

// typeWriter: 텍스트를 타이핑 효과로 표시하는 함수입니다.
const typeWriter = (element, text, typingDelay = 30) => {
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

// showLoadingIcon: 로딩 아이콘을 표시하는 함수입니다.
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

// inputElement에 'keypress' 이벤트 리스너 추가: Enter 키를 눌렀을 때 메시지를 전송합니다.
inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getMessage();
        event.preventDefault();
    }
});

// submitButton에 'click' 이벤트 리스너 추가: 버튼 클릭 시 메시지를 전송합니다.
submitButton.addEventListener('click', getMessage);

// newChatButton에 'click' 이벤트 리스너 추가: 새 채팅을 시작하고 입력 필드와 출력을 클리어합니다.
newChatButton.addEventListener('click', clearInput);

// historyElement에 'click' 이벤트 리스너 추가: 채팅 이력을 클릭하면 해당 내용을 재출력합니다.
historyElement.addEventListener('click', clickHistoryChild)
