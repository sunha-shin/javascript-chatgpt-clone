const submitButton = document.querySelector('#submit')
const outputElement = document.querySelector('#output')
const inputElement = document.querySelector('input')
const historyElement = document.querySelector('.history')
const buttonElement = document.querySelector('button')

function changeInput(value) {
    const inputElement = document.querySelector('input')
    inputElement.value = value    
    console.log('change input')
}

async function getMessage() {
    console.log('clicked')
    try {
        const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([               
                {"role": "user", "content": inputElement.value}
            ])
        });

        const data = await response.json()
        console.log(data)
        outputElement.textContent = data.choices[0].message.content
        
        if(data.choices[0].message.content) {
            const pElement = document.createElement('output')
            pElement.style.cssText = 
                'padding:8px; margin:0; fontSize:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;cursor:pointer'
            pElement.textContent = inputElement.value
            pElement.addEventListener('clcik', () => changeInput(pElement.textContent))
            historyElement.append(pElement)
        }

    } catch (error) {
        throw new Error('Network response was not ok');
    }
}

submitButton.addEventListener('click', getMessage); // 버튼 클릭 시 getMessage 함수 호출

function clearInput() {
    inputElement.value = ''
    document.getElementById('output').textContent = '';
    console.log('clear input')
}

buttonElement.addEventListener('click', clearInput)
