from dotenv import load_dotenv
import streamlit as st
from PyPDF2 import PdfReader
from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from PIL import Image
from langchain_community.vectorstores import FAISS

load_dotenv()
img = Image.open("./images.jpeg")
st.set_page_config(page_title="DocGenius: 文档生成AI", page_icon=img)
st.header("询问您的PDF📄")
pdf = st.file_uploader("上传您的PDF", type="pdf")

if pdf is None:
    st.error("请上传一个PDF文件")
    st.stop()

pdf_reader = PdfReader(pdf)
text = ""
for page in pdf_reader.pages:
    text += page.extract_text() + "\n"

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

splits = text_splitter.split_text(text)

embeddings = OpenAIEmbeddings()
vectorStore = FAISS.from_texts(splits, embeddings)
retriever = vectorStore.as_retriever()
prompt = hub.pull("rlm/rag-prompt")
llm = ChatOpenAI(model="gpt-4o-mini")


query = st.text_input("询问关于您PDF的问题")
if query:
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(query)

    st.success(response)
