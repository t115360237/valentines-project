Let yesSize = 20;
let noDodges = 0;
let selectedDates = [];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const gif = document.getElementById("gif");
const message = document.getElementById("message");
const title = document.getElementById("title");
const heartsContainer = document.getElementById("hearts-container");

// 換成可愛的慶祝 GIF（可以自行替換網址）
const happyGif = "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif";

// 1. 中文化拒絕訊息
const messages = [
    "真的不要嗎？🥹",
    "再想想看嘛～",
    "我會很傷心喔...💔",
    "大膽！不准拒絕！",
    "按鈕要塞滿螢幕囉！😆",
    "再給你一次機會！🥰",
    "這是我特地為你做的捏 ❤️",
    "最後機會！😖",
    "不管啦，你只能選 YES！✨"
];

// 只有 YES 點擊時生效
yesBtn.addEventListener("click", sayYes);

// NO 觸發躲避效果
noBtn.addEventListener("mouseenter", dodgeNoButton);
noBtn.addEventListener("touchstart", dodgeNoButton, { passive: true });

function sayYes() {
    document.body.classList.add("success");
    title.textContent = "耶！約定好了喔！❤️🥰";
    message.textContent = "就知道你會答應！請選擇你想約會的時間：";

    // 隱藏原始按鈕
    noBtn.style.display = "none";
    yesBtn.style.display = "none";

    gif.style.opacity = "0";
    setTimeout(() => {
        gif.src = happyGif;
        gif.style.opacity = "1";
    }, 250);

    startHearts();
    startConfetti();

    // 2. 顯示日期選擇區塊
    showDateOptions();
}

function showDateOptions() {
    const container = document.querySelector(".button-container");
    container.innerHTML = `
        <div id="date-selection" style="display:flex; flex-direction:column; gap:12px; align-items:center; margin-top:15px;">
            <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                <button class="date-btn" data-date="12/19" onclick="selectSingleDate('12/19', this)">12/19</button>
                <button class="date-btn" data-date="12/26" onclick="selectSingleDate('12/26', this)">12/26</button>
                <button class="date-btn" data-date="12/27" onclick="selectSingleDate('12/27', this)">12/27</button>
                <button class="date-btn" data-date="12/28" onclick="selectSingleDate('12/28', this)">12/28</button>
            </div>
            <button id="multiBtn" onclick="enableMultiSelect()" style="background-color:#ff8fab; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer;">想約不只一天！✨</button>
            <button id="submitBtn" onclick="sendResult()" style="display:none; margin-top:10px; background-color:#ff4d6d; color:white; padding:10px 25px; border-radius:10px; border:none; font-weight:bold; cursor:pointer;">確認送出 ❤️</button>
        </div>
    `;
}

let isMultiSelect = false;

function enableMultiSelect() {
    isMultiSelect = true;
    document.getElementById("multiBtn").style.display = "none";
    document.getElementById("submitBtn").style.display = "inline-block";
    message.textContent = "太讚了！請勾選所有你方便的日期（可複選）：";
}

function selectSingleDate(date, btn) {
    if (!isMultiSelect) {
        // 單選模式：直接記錄並送出
        selectedDates = [date];
        sendResult();
    } else {
        // 多選模式：切換選取狀態
        if (selectedDates.includes(date)) {
            selectedDates = selectedDates.filter(d => d !== date);
            btn.style.backgroundColor = "";
            btn.style.color = "";
        } else {
            selectedDates.push(date);
            btn.style.backgroundColor = "#ff4d6d";
            btn.style.color = "white";
        }
    }
}

// 3. 回傳結果到你的 Email (使用 Formspree)
function sendResult() {
    if (selectedDates.length === 0) {
        alert("請至少選擇一個日期喔！");
        return;
    }

    // 替換成你在 Formspree 申請的 Form ID (例如 https://formspree.io/f/xeqwzaby 中的 xeqwzaby)
    const FORMSPREE_ID = "YOUR_FORMSPREE_ID"; 

    const dateText = selectedDates.join(", ");
    
    // 顯示送出中
    document.getElementById("date-selection").innerHTML = `<p style="font-size:1.2rem; color:#ff4d6d;">正在把約會時間傳送給我...💌</p>`;

    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            answer: "YES!",
            chosen_dates: dateText,
            timestamp: new Date().toLocaleString()
        })
    }).then(response => {
        document.getElementById("date-selection").innerHTML = `
            <p style="font-size:1.3rem; font-weight:bold; color:#ff4d6d;">
                太好了！我們約好了 ${dateText} 號！訊息已經傳給我囉 ❤️
            </p>
        `;
    }).catch(error => {
        document.getElementById("date-selection").innerHTML = `
            <p style="font-size:1.1rem; color:#ff4d6d;">
                約定成功了 (${dateText})！等等記得截圖發給我喔！傳送失敗時備用 😉
            </p>
        `;
    });
}

function dodgeNoButton(event) {
    noDodges++;

    message.style.opacity = "0";

    setTimeout(() => {
        message.textContent = messages[(noDodges - 1) % messages.length];
        message.style.opacity = "1";
    }, 100);

    yesSize += 3;
    yesBtn.style.fontSize = `${Math.min(yesSize, 40)}px`;
    yesBtn.style.padding = `${Math.min(12 + noDodges, 28)}px ${Math.min(25 + noDodges * 2, 45)}px`;

    moveNoButton();

    const scale = Math.max(0.65, 1 - noDodges * 0.035);
    noBtn.style.transform = `scale(${scale})`;
}

function moveNoButton() {
    const container = document.querySelector(".button-container");
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(0, containerRect.width - buttonRect.width);
    const maxY = 120;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    noBtn.style.position = "relative";
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}

function startHearts() {
    for (let i = 0; i < 60; i++) {
        setTimeout(() => { createHeart(); }, i * 35);
    }
}

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    const heartTypes = ["❤️", "💖", "💕", "💗", "💓", "💘"];
    heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${80 + Math.random() * 20}vh`;
    heart.style.fontSize = `${20 + Math.random() * 25}px`;
    heartsContainer.appendChild(heart);

    setTimeout(() => { heart.remove(); }, 2600);
}

function startConfetti() {
    for (let i = 0; i < 80; i++) {
        setTimeout(() => { createConfetti(); }, i * 25);
    }
}

function createConfetti() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = "-20px";
    confetti.style.backgroundColor = getRandomConfettiColor();
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    document.body.appendChild(confetti);

    setTimeout(() => { confetti.remove(); }, 4000);
}

function getRandomConfettiColor() {
    const colors = ["#ff4d6d", "#ff758f", "#ffb3c1", "#ffccd5", "#ff8fab", "#ffffff"];
    return colors[Math.floor(Math.random() * colors.length)];
}