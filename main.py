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

app.mount("/", StaticFiles(directory="static", html=True), name="static")