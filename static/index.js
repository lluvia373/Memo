async function creatMemo(value) {
  const res = await fetch("/memos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: new Date(),
      content: value,
    }),
  });
  const jsonRes = await res.json();
  readMemos();
}

async function readMemos() {
  const res = await fetch("/memos");
  const jsonRes = await res.json();
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = "";
  jsonRes.memos.forEach(displayMemo);
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul");
  const li = document.createElement("li");
  li.textContent = `[id:${memo.id}] ${memo.content}`;
  ul.appendChild(li);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("#memo-input");
  creatMemo(input.value);
  input.value = "";
}
readMemos();
const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);

// 수정하기 기능 넣기
// 삭제 기능 넣기
