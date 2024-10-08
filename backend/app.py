import uuid
from flask import Flask, request, jsonify
from .kvstore import GlobalKVStore
from .agent import get_agent
from pypdf import PdfReader

app = Flask(__name__)
kvstore = GlobalKVStore()


@app.route("/api/upload/pdf", methods=["POST"])
def upload_pdf():
    """
    Upload a pdf file

    Response:
        - fuid (str): uid of the file
    """
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "no selected file"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "only pdf files are allowed"}), 400

    uid = uuid.uuid1()
    file_path = f"./uploads/{file.filename}"
    kvstore.put_file_path(str(uid), file_path)
    return jsonify({"fuid": str(uid)}), 200


@app.route("api/ask", methods=["POST"])
def ask_question():
    """
    Ask question based on the pdf or not.

    Json Body should contains:
     - required:
        - question (str): a question that user provide

     - optional:
        - fuid (str): the uid of file to be retrieved. If not given, will not use rag.
        - sid (str): the session id. If not given, will create a new one and respond with it.

    Response:
        - ai (str): ai message
        - sid (str) : session id given or generated
    """
    # TODO: use stream api
    data = request.get_json()
    if not data:
        return jsonify({"error": "no dataprovided"}), 400

    question: str | None = data.get("question")
    if not question:
        return jsonify({"error": "question is required"}), 400

    session_id: str | None = data.get("sid")
    agent, session_id = get_agent(session_id)

    fuid: str | None = data.get("fuid")
    if fuid is not None:
        file_path = kvstore.get_file_path(fuid)
        reader = PdfReader(file_path)
        docs = [page.extract_text() for page in reader.pages]
        agent.augmented_with(docs)

    response = agent.ask(question)
    return jsonify({"ai": response, "sid": session_id}), 200