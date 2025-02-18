async function creatMemo(value) {
  const res = await fetch("/memos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: new Date().toISOString(),
      content: value,
    }),
  });
  const jsonRes = await res.json();
  readMemos();
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("#memo-input");
  creatMemo(input.value);
  input.value = "";
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
  li.textContent = `${memo.content}`; //textContent는 부모요소에 문자열 넣을때 사용
  li.appendChild(createDeleteButton(memo)); //appendChil는 부모요소에 요소를 넣을때 사용
  li.appendChild(createEditButton(memo));
  ul.appendChild(li);
}

function createDeleteButton(memo) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("memo-button");
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
    console.error("Failed to delete memo", await res.text());
  }
}

function createSaveButton(memo, input) {
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("memo-button");

  saveButton.addEventListener("click", async () => {
    const success = await editMemo(memo.id, input.value);
    if (success) {
      await readMemos();
    }
  });
  return saveButton;
}

function createEditButton(memo) {
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("memo-button");
  editButton.addEventListener("click", () => {
    const li = editButton.parentElement;
    li.innerHTML = "";
    //입력필드 생성, 메모 내용 적용
    const input = document.createElement("input");
    input.type = "text";
    input.value = memo.content;
    //save 버튼 추가
    const saveButton = createSaveButton(memo, input);
    li.appendChild(input);
    li.appendChild(saveButton);
    //save 버튼을 누르면 memo가 변경되고 다시 delete와 edit 칸이 나타나야함
  });
  return editButton;
}

async function editMemo(id, newContent) {
  try {
    const res = await fetch(`/memos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, content: newContent }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("메모 수정 실패:", errorData);
      return false;
    }

    await readMemos();
    return true;
  } catch (error) {
    console.error("메모 수정 중 오류 발생:", error);
    return false;
  }
}



readMemos();
const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);
