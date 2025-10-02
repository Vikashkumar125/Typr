let content = [];

async function getData(){
    try{
        const resp = await fetch("https://random-word-api.vercel.app/api?words=20&length=5");
        const data = await resp.json();
        content = [data.join(" ")];
    }
    catch{
        content = ["Cosmology deals with the world as the totality of space, time and all phenomena. Historically, it has had quite a broad scope, and in many cases was founded in religion. In modern use metaphysical cosmology addresses questions about the Universe which are beyond the scope of science."];
    }
}

getData();

let para = document.querySelector("#content-to-type"),
    start = document.querySelector("#start"),
    minutes = document.querySelector("#minutes"),
    seconds = document.querySelector("#seconds"),
    keys = document.querySelectorAll(".key"),
    inputContent = document.querySelector("#input-content"),
    errorVal = document.querySelector("#error-val"),
    evaluation = document.querySelector(".evaluation"),
    speedVal = document.querySelector("#speed-val"),
    scoreVal = document.querySelector("#score-val"),
    letters, typingLetterErrors=0;

document.addEventListener("keydown",keyPress);
inputContent.addEventListener("input",inputChange);
start.addEventListener("click", loadContent,true);

function keyPress(event){
    let keyboardCode = event.keyCode;
    if(!(keyboardCode>=48&&keyboardCode<=57)){
        keyboardCode+=32;
        for(let i=0;i<keys.length;i++){
            if(parseInt(keys.item(i).attributes[1].value)===keyboardCode){
                keys.item(i).classList.add("pressed");
                setTimeout(()=>keys.item(i).classList.remove("pressed"),100);
                break;
            }
        }
    }
}

function inputChange(){
    let inputVal = inputContent.value;
    let intVal = parseInt(inputVal.charAt(inputVal.length-1));
    if(!Number.isNaN(intVal)) inputContent.value = inputVal.substr(0,inputVal.length-1);
    let keyCode = inputVal.charCodeAt(inputVal.length-1);
    if(inputVal.length<=para.length-1) startBlinking(inputVal.length);
    checkInput(keyCode,inputVal);
}

function startBlinking(letterId){
    window.blinkingId = setInterval(()=>blinking(letters.item(letterId)),150);
}

function clearBlinking(){
    clearInterval(window.blinkingId);
}

function blinking(letter){
    letter.classList.toggle("current");
}

function checkInput(keyCode,inputValue){
    if(inputValue.length===letters.length){
        pauseClock("Pause");
        let [minsCompleted,secsCompleted] = getCurrentTimerValue(minutes.innerHTML,seconds.innerHTML);
        let totalCorrect = letters.length - typingLetterErrors;
        let percentageCorrect = Math.floor(totalCorrect/letters.length * 100);
        let charsPerSecond = Math.floor(totalCorrect/(minsCompleted*60 + secsCompleted));
        let wordsPerMinute = Math.floor(charsPerSecond*6)/1;
        speedVal.innerHTML = wordsPerMinute+" words/min";
        scoreVal.innerHTML = percentageCorrect;
        start.innerHTML = "Restart";
    }
    else if(inputValue.length<letters.length){
        if((keyCode>=97 && keyCode<=122) || keyCode===32){
            if(keyCode===32) keyCode = 95;
            if(letters.item(inputValue.length-1).innerHTML.charCodeAt(0)===keyCode){
                clearBlinking();
                startBlinking(inputValue.length);
                letters.item(inputValue.length-1).classList.add("typed");
            } else {
                typingLetterErrors++;
                errorVal.innerHTML = typingLetterErrors;
                clearBlinking();
                startBlinking(inputValue.length);
                letters.item(inputValue.length-1).classList.add("wrong");
            }
        }
    }
}

function loadContent(){
    if(start.innerHTML==="Restart") window.location.reload();
    inputContent.focus();
    if(start.innerHTML==="Start") setNewContent();
    else if(start.innerHTML==="Resume"){startClock(seconds.innerHTML,minutes.innerHTML,start.innerHTML);start.innerHTML="Pause";}
    else if(start.innerHTML === "Pause"){pauseClock(start.innerHTML);start.innerHTML="Resume";}
}

function setNewContent(){
    typingLetterErrors=0;
    let wordsArray = wordSeparator(content[0].toLocaleLowerCase()).filter(word=>word.length>=1);
    let typingPara =" ", letterId = 0;
    for(let wordIndex =0;wordIndex<20;wordIndex++){
        let word = wordsArray[wordIndex];
        typingPara += letterSeparator(word,letterId);
        letterId += word.length+1;
    }
    para.innerHTML = typingPara.trim();
    letters = document.querySelectorAll(".typing");
    startClock(seconds.innerHTML,minutes.innerHTML,start.innerHTML);
    start.innerHTML = "Pause";
}

function wordSeparator(content){return content.split(/[,. -_]/)}

function letterSeparator(content,id){
    let wordSpan="";
    for(let charIndex=0;charIndex<content.length;charIndex++){
        wordSpan+= `<div class="typing" id="${id}">${content.charAt(charIndex)}</div>`;
        id++;
    }
    return wordSpan+`<div class="typing" id="${id}">_</div>`;
}

function randomParaGenerator(limit){return Math.floor(Math.random()*limit)}

function startClock(secs,mins,condition){
    let [minsVal,secsVal] = getCurrentTimerValue(mins,secs);
    startBlinking(inputContent.value.length);
    window.timerClockID = setInterval(()=>{ 
        if(condition==="Start"|| condition==="Resume"){
            secsVal = increaseSeconds(secsVal);
            if(secsVal>59){secsVal = 0;minsVal++;}
            seconds.innerHTML = secsVal;
            minutes.innerHTML = minsVal;
        }
    },1000);
}  

function getCurrentTimerValue(mins,secs){
    return [parseInt(mins),parseInt(secs)];
}

function increaseSeconds(secondsValue){return secondsValue+1;}

function pauseClock(condition){if(condition==="Pause") clearInterval(window.timerClockID);}
