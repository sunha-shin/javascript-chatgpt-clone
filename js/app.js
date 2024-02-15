// DOM 요소 선택
const submitButton = document.querySelector('#submit');
const outputElement = document.querySelector('#output');
const inputElement = document.querySelector('input');
const historyElement = document.querySelector('.history');
const newChatButton = document.querySelector('#new-chat');

const dataReqRes = [] // 지난 응답값을 관리하는 배열

const fetchChatResponse = async (userInput) => {
    const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ "role": "user", "content": userInput }])
    });

    if (!response.ok) {
        // 더 상세한 에러 분류 가능
        throw new Error(`서버 에러: ${response.statusText}`);
    }
    
    return response.json();
};

const getMessage = async () => {    
    showLoadingIcon(); // 로딩 아이콘을 표시

    try {
        const data = await fetchChatResponse(inputElement.value);
        const chatResponse = data.choices[0].message.content;
        dataReqRes.push({ question: inputElement.value, response: chatResponse });

        clearOutput() 
        typeWriter(outputElement, chatResponse); // 타이핑 효과로 응답 표시
        historyElementCreator(inputElement.value); // 입력 이력 생성        
        console.log("dataReqRes: ", dataReqRes);

    } catch (error) {
        console.error(error);
        outputElement.innerHTML = '<p class="error-message">메시지를 가져오는 데 실패했습니다. 나중에 다시 시도해주세요.</p>';
    }
};

// 입력 이력을 생성하고, 클릭 시 해당 내용을 재출력하는 함수
const historyElementCreator = (inputValue) => {
    const historyChild = document.createElement('p');
    historyChild.textContent = inputValue;
    historyElement.append(historyChild);
};

const clickHistoryChild = (event) => {
    // 클릭된 요소가 'P' 태그가 아니라면 함수 종료
    if (event.target.tagName !== 'P') return;

    // 이 시점부터는 클릭된 요소가 'P' 태그인 경우만 처리
    const historyChild = event.target; // 클릭된 p 요소
    clearOutput() // 기존 출력 내용 클리어

    // 객체 배열에서 해당 질문의 응답 찾기
    const matchedEntry = dataReqRes.find(entry => entry.question === historyChild.textContent);
    if (!matchedEntry) return; // 매칭되는 질문이 없다면 함수 종료

    // 저장된 응답 재출력
    typeWriter('output', matchedEntry.response);
    
    // 입력 필드에 클릭된 질문 설정
    changeInput(historyChild.textContent);
};

// 입력 필드 값을 변경하는 함수
const changeInput = (value) => {
    inputElement.value = value;
};

// 입력 필드와 출력 요소를 클리어하는 함수
const clearInput = () => {
    inputElement.value = '';
    outputElement.textContent = '';
};

const clearOutput = () => {
    outputElement.innerHTML = '';
};

// 텍스트를 타이핑 효과로 표시하는 함수
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

// 로딩 아이콘을 표시하는 함수
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

// Enter시 메시지 전송 이벤트 리스너
inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getMessage();
        event.preventDefault();
    }
});

// 버튼 클릭 이벤트 리스너
submitButton.addEventListener('click', getMessage);
newChatButton.addEventListener('click', clearInput);
historyElement.addEventListener('click', clickHistoryChild)