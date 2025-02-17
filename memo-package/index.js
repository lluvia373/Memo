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
  li.textContent = `[id:${memo.id}] ${memo.content}`; //textContent는 부모요소에 문자열 넣을때 사용
  li.appendChild(creatDeleteButton(memo)); //appendChil는 부모요소에 요소를 넣을때 사용
  ul.appendChild(li);
}

function creatDeleteButton(memo) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => {
    deleteMemo(memo.id);
  }); // eventlistener을 호출할때 즉시 실행되지않고 이벤트가 발생한후 하려면 콜백함수 사용
  return deleteButton;
}

async function deleteMemo(id) {
  const res = await fetch(`/memos/${id}`, { method: "DELETE" });
  if (res.ok) {
    readMemos();
  } else {
    return;
  }
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

// 수정 기능 넣기
