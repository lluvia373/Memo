from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

class Memo(BaseModel):
    id: str
    content: str

memos = []

@app.post("/memos")
def create_memo(memo:Memo):
    memos.append(memo)
    return "memo created"

@app.get("/memos")
def get_memos():
    return {"memos": memos}

@app.delete("/memos/{memo_id}")
def delete_memo(memo_id: str):
    global memos
    memo = next((memo for memo in memos if memo.id == memo_id), None)
    if memo:
        memos.remove(memo)
    else:
        return
app.mount("/", StaticFiles(directory="memo-package", html=True), name="memo")