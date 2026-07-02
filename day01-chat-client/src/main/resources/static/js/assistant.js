const endpoint = "/api/assistant/chat";
const recentKey = "data-platform-assistant-recent";

const topics = [
    "전체 구조",
    "Kafka",
    "Spark Streaming",
    "TimescaleDB",
    "Lakehouse",
    "Airflow",
    "API",
    "Monitoring",
    "Docker/Kubernetes",
    "면접 모드",
    "오늘의 학습"
];

const quickQuestions = [
    {
        label: "전체 구조 설명",
        prompt: "data-platform 프로젝트의 전체 구조를 쉽게 설명해줘. 실시간 경로와 배치 경로를 나누어 설명하고, 마지막에 면접용 30초 답변도 작성해줘."
    },
    {
        label: "Kafka 왜 사용?",
        prompt: "이 프로젝트에서 Kafka를 왜 사용하는지 설명해줘. 수집 계층과 적재 계층 분리, downstream 장애 완충, 재처리 가능성 관점에서 설명해줘."
    },
    {
        label: "upsert 설명",
        prompt: "upsert가 무엇인지 설명하고, 이 프로젝트에서 Spark Structured Streaming과 TimescaleDB upsert가 왜 필요한지 설명해줘."
    },
    {
        label: "at-least-once 설명",
        prompt: "at-least-once가 무엇인지 설명하고, 이 프로젝트에서 왜 exactly-once라고 단정하면 안 되는지 설명해줘."
    },
    {
        label: "TimescaleDB 왜 사용?",
        prompt: "이 프로젝트에서 TimescaleDB를 사용하는 이유를 설명해줘. hypertable, event_time, index, compression 관점에서 설명해줘."
    },
    {
        label: "Lakehouse 이유",
        prompt: "이 프로젝트에서 TimescaleDB와 별도로 Lakehouse를 두는 이유를 설명해줘. Bronze, Silver, Gold Parquet 구조도 함께 설명해줘."
    },
    {
        label: "Airflow 역할",
        prompt: "이 프로젝트에서 Airflow DAG가 어떤 역할을 하는지 설명해줘. lakehouse pipeline과 data quality check 관점에서 설명해줘."
    },
    {
        label: "장애 복구 설명",
        prompt: "이 프로젝트에서 장애 복구와 재처리를 어떻게 고려했는지 설명해줘. Kafka, Spark checkpoint, TimescaleDB upsert, Airflow retry 관점에서 설명해줘."
    },
    {
        label: "30초 프로젝트 소개",
        prompt: "data-platform 프로젝트를 기술 면접에서 30초 안에 설명할 수 있는 답변으로 만들어줘. 너무 과장하지 말고 실제 구현한 데이터 흐름 중심으로 작성해줘."
    },
    {
        label: "오늘 공부 추천",
        prompt: "오늘 2시간 동안 data-platform 프로젝트를 공부한다고 가정하고 학습 순서를 추천해줘. 볼 파일, 이해 목표, 확인 질문을 함께 제시해줘."
    }
];

const modes = [
    {
        label: "쉽게 설명",
        wrap: (text) => `다음 질문에 대해 초보자도 이해할 수 있게 쉽게 설명해줘.\n\n질문:\n${text}`
    },
    {
        label: "기술 설명",
        wrap: (text) => `다음 질문에 대해 기술적인 구조와 설계 이유 중심으로 설명해줘.\n\n질문:\n${text}`
    },
    {
        label: "면접 답변",
        wrap: (text) => `다음 질문에 대해 기술 면접에서 답할 수 있는 형태로 정리해줘. 30초 답변과 1분 답변을 작성해줘.\n\n질문:\n${text}`
    },
    {
        label: "코드 위치",
        wrap: (text) => `다음 질문과 관련된 코드 위치나 파일 경로를 알려줘. 정확히 모르는 경로는 추측하지 말고 모른다고 말해줘.\n\n질문:\n${text}`
    },
    {
        label: "꼬리질문",
        wrap: (text) => `다음 주제에 대해 기술 면접 꼬리질문 5개를 만들어줘. 각 질문마다 면접관이 확인하려는 포인트도 함께 작성해줘.\n\n주제:\n${text}`
    },
    {
        label: "내 답변 피드백",
        wrap: (text) => `아래 답변을 기술 면접 답변이라고 생각하고 피드백해줘.\n\n피드백 형식:\n- 평가: 좋음 / 보완 필요 / 위험한 답변\n- 잘한 점\n- 부족한 점\n- 면접에서 조심해야 할 표현\n- 개선 답변 예시\n\n내 답변:\n${text}`
    }
];

const messagesEl = document.querySelector("#messages");
const inputEl = document.querySelector("#messageInput");
const formEl = document.querySelector("#chatForm");
const sendButton = document.querySelector("#sendButton");
const toastEl = document.querySelector("#toast");

function init() {
    renderTopics();
    renderQuickQuestions();
    renderModes();
    renderRecent();
    addWelcomeMessage();
}

function renderTopics() {
    const list = document.querySelector("#topicList");
    list.innerHTML = "";
    topics.forEach((topic) => {
        const button = document.createElement("button");
        button.className = "topic-button";
        button.type = "button";
        button.textContent = topic;
        button.addEventListener("click", () => {
            inputEl.value = `${topic}에 대해 data-platform 프로젝트 기준으로 설명해줘.`;
            inputEl.focus();
        });
        list.appendChild(button);
    });
}

function renderQuickQuestions() {
    const row = document.querySelector("#quickQuestions");
    row.innerHTML = "";
    quickQuestions.forEach((item) => {
        const button = document.createElement("button");
        button.className = "quick-button";
        button.type = "button";
        button.textContent = item.label;
        button.addEventListener("click", () => sendMessage(item.prompt, item.label));
        row.appendChild(button);
    });
}

function renderModes() {
    const row = document.querySelector("#modeButtons");
    row.innerHTML = "";
    modes.forEach((mode) => {
        const button = document.createElement("button");
        button.className = "mode-button";
        button.type = "button";
        button.textContent = mode.label;
        button.addEventListener("click", () => {
            const text = inputEl.value.trim();
            if (!text) {
                showToast("먼저 질문이나 답변을 입력해 주세요.");
                inputEl.focus();
                return;
            }
            sendMessage(mode.wrap(text), `${mode.label}: ${text}`);
        });
        row.appendChild(button);
    });
}

function addWelcomeMessage() {
    appendMessage("ai", `안녕하세요. 저는 data-platform 프로젝트 학습 도우미입니다.\n\n아래 버튼으로 빠르게 시작할 수 있습니다.\n- 전체 구조 설명\n- Kafka 왜 사용?\n- 30초 프로젝트 소개\n- 오늘 공부 추천\n\n직접 질문해도 됩니다.\n예: "Spark checkpoint와 upsert는 어떻게 연결돼?"`);
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = inputEl.value.trim();
    if (!text) {
        return;
    }
    sendMessage(text);
});

inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        formEl.requestSubmit();
    }
});

document.querySelector("#clearChatButton").addEventListener("click", () => {
    messagesEl.innerHTML = "";
    addWelcomeMessage();
});

document.querySelector("#clearRecentButton").addEventListener("click", () => {
    localStorage.removeItem(recentKey);
    renderRecent();
});

async function sendMessage(prompt, displayText = prompt) {
    const message = prompt.trim();
    if (!message || sendButton.disabled) {
        return;
    }

    appendMessage("user", displayText);
    inputEl.value = "";
    saveRecent(displayText);

    const loadingId = appendMessage("ai", "AI 응답을 기다리는 중입니다...", { loading: true });
    setSending(true);

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
            ? await response.json()
            : { answer: await response.text() };
        updateMessage(loadingId, data.answer || "응답 내용이 비어 있습니다.");
    } catch (error) {
        updateMessage(
            loadingId,
            "AI 응답을 가져오지 못했습니다. Ollama 서버가 실행 중인지 확인해 주세요.",
            true
        );
    } finally {
        setSending(false);
    }
}

function appendMessage(role, text, options = {}) {
    const id = `message-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const wrapper = document.createElement("article");
    wrapper.className = `message ${role}${options.loading ? " loading" : ""}`;
    wrapper.dataset.messageId = id;

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const head = document.createElement("div");
    head.className = "bubble-head";
    head.innerHTML = `<span>${role === "user" ? "나" : "AI"}</span>`;

    if (role === "ai" && !options.loading) {
        head.appendChild(createCopyButton(text));
    }

    const body = document.createElement("div");
    body.className = "bubble-body";
    body.textContent = text;

    bubble.appendChild(head);
    bubble.appendChild(body);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
}

function updateMessage(id, text, isError = false) {
    const wrapper = messagesEl.querySelector(`[data-message-id="${id}"]`);
    if (!wrapper) {
        return;
    }

    wrapper.classList.remove("loading");
    if (isError) {
        wrapper.classList.add("error");
    }

    const body = wrapper.querySelector(".bubble-body");
    body.textContent = text;

    const head = wrapper.querySelector(".bubble-head");
    const oldButton = head.querySelector("button");
    if (oldButton) {
        oldButton.remove();
    }
    if (!isError) {
        head.appendChild(createCopyButton(text));
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function createCopyButton(text) {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "답변 복사";
    button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(text);
        showToast("복사 완료");
    });
    return button;
}

function setSending(isSending) {
    sendButton.disabled = isSending;
    sendButton.textContent = isSending ? "응답 대기" : "전송";
}

function getRecent() {
    try {
        return JSON.parse(localStorage.getItem(recentKey)) || [];
    } catch {
        return [];
    }
}

function saveRecent(text) {
    const normalized = text.trim();
    const recent = getRecent().filter((item) => item !== normalized);
    recent.unshift(normalized);
    localStorage.setItem(recentKey, JSON.stringify(recent.slice(0, 10)));
    renderRecent();
}

function renderRecent() {
    const list = document.querySelector("#recentList");
    const recent = getRecent();
    list.innerHTML = "";

    if (recent.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "최근 질문이 없습니다.";
        list.appendChild(empty);
        return;
    }

    recent.forEach((item) => {
        const button = document.createElement("button");
        button.className = "recent-button";
        button.type = "button";
        button.textContent = item;
        button.addEventListener("click", () => {
            inputEl.value = item;
            inputEl.focus();
        });
        list.appendChild(button);
    });
}

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toastEl.classList.remove("show");
    }, 1600);
}

init();
