from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


app = FastAPI()

class Memo(BaseModel):
    id: str
    content: str

memos = []

@app.post("/memos")
def create_memo(memo: Memo):
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
        return {"message": "memo deleted"}
    else:
        return


@app.put("/memos/{memo_id}")
def edit_memo(memo_id: str, updated_memo: Memo):
    global memos
    for memo in memos:
        if memo.id == memo_id:
            memo.content = updated_memo.content
            return {"message": "memo updated"}
        else:
            return
        
app.mount("/", StaticFiles(directory="memo-package", html = True), name="memo")