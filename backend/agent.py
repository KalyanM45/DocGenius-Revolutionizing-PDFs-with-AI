"""
Codes related to agent
"""

import uuid
from typing import Tuple
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.documents import Document
from langchain_chroma import Chroma


class RagAgent:
    """
    The AI model which make full use of rag
    """

    def __init__(self) -> None:
        self._retrieval_augmented = False
        self._rag_prompt = PromptTemplate.from_template(
            "Solve the following question based on the retrievaled context"
            "Question: {question}"
            "Context: {context}"
        )
        self._simple_prompt = PromptTemplate.from_template("{question}")
        self._llm = ChatOpenAI()
        self._str_parser = StrOutputParser()
        self._retriever = None

    @property
    def _chain(self):
        if self._retrieval_augmented:
            return (
                {"context": self._retriever, "question": RunnablePassthrough()}
                | self._rag_prompt
                | self._llm
                | self._str_parser
            )
        else:
            return (
                {"question": RunnablePassthrough()}
                | self._simple_prompt
                | self._llm
                | self._str_parser
            )

    def augmented_with(self, docs: list[str], file_path: str) -> None:
        if self._retrieval_augmented:
            return
        vectorstore = Chroma.from_documents(
            documents=[
                Document(page_content=doc, metadata={"source": file_path})
                for doc in docs
            ],
            embedding=OpenAIEmbeddings(),
        )
        self._retriever = vectorstore.as_retriever(
            search_type="similarity", search_kwargs={"k": 5}
        )
        self._retrieval_augmented = True

    def ask(self, question: str) -> str:
        return self._chain.invoke(question)


agents_pool: dict[str, RagAgent] = {}


def get_agent(session_id: str | None = None) -> Tuple[RagAgent, str]:
    if session_id is None:
        session_id = uuid.uuid1()
        agents_pool[session_id] = RagAgent()
    elif session_id is not None and agents_pool[session_id] is None:
        raise RuntimeError("Invalid session_id")
    return agents_pool[session_id], session_id

# unit test
if __name__ == "__main__":
    agent, sid = get_agent()
    print(agent.ask("What is 2 + 2 = ?"))
