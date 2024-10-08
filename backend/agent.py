"""
Codes related to agent
"""

import uuid
from typing import Tuple


class RagAgent:
    """
    The AI model which make full use of rag
    """

    def __init__(self) -> None:
        self.retrieval_augmented = False
        pass

    def augmented_with(self, docs: list[str]) -> None:
        if self.retrieval_augmented:
            return

        # TODO:
        self.retrieval_augmented = True

    def ask(self, question: str) -> str:
        pass


agents_pool: dict[str, RagAgent] = {}


def get_agent(session_id: str | None) -> Tuple[RagAgent, str]:
    if session_id is None:
        session_id = uuid.uuid1()
        agents_pool[session_id] = RagAgent()
    elif session_id is not None and agents_pool[session_id] is None:
        raise RuntimeError("Invalid session_id")
    return agents_pool[session_id], session_id
