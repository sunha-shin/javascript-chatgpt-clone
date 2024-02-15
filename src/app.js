// DOM 요소 선택
const submitButton = document.querySelector('#submit');
const outputElement = document.querySelector('#output');
const inputElement = document.querySelector('input');
const historyElement = document.querySelector('.history');
const newChatButton = document.querySelector('#new-chat');

const dataReqRes = [] // 지난 응답값을 관리하는 배열

const getMessage = async () => {    
    showLoadingIcon(); // 로딩 아이콘을 표시

    try {
        const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ "role": "user", "content": inputElement.value }])
        });

        const data = await response.json();
        const chatResponse = data.choices[0].message.content;
        dataReqRes.push({ question: inputElement.value, response: chatResponse });        

        outputElement.innerHTML = ''; // 로딩 아이콘 제거

        typeWriter('output', chatResponse); // 타이핑 효과로 응답 표시
        historyElementCreator(inputElement.value); // 입력 이력 생성
        
        console.log("@@dataReqRes: ", dataReqRes)
    } catch (error) {
        console.log(error);
        // 에러 발생 시 로딩 아이콘 제거하고 에러 메시지 표시
        outputElement.innerHTML = '<p class="error-message">메시지를 가져오는 데 실패했습니다. 나중에 다시 시도해주세요.</p>';
    }
};


// 텍스트를 타이핑 효과로 표시하는 함수
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

// 입력 이력을 생성하고, 클릭 시 해당 내용을 재출력하는 함수
const historyElementCreator = (inputValue) => {
    const historyP = document.createElement('p');
    historyP.textContent = inputValue;
    
    // 클릭 시에만 실행되어 화면에 결과 값 보여줌
    historyP.addEventListener('click', () => {
        outputElement.innerHTML = '';
        changeInput(historyP.textContent);
        
        // 객체 배열에서 해당 질문의 응답 찾기
        const matchedEntry = dataReqRes.find(entry => entry.question === historyP.textContent);
        if (matchedEntry) {
            typeWriter('output', matchedEntry.response); // 저장된 응답 재출력
        }
    });

    historyElement.append(historyP);    
    // getMessage가 불려야 실행됨 --> 엔터나 버튼클릭 이벤트 필요
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