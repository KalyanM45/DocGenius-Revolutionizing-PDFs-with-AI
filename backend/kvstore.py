class GlobalKVStore:
    """
    Local storage of all temporary info
    Currently not thread-safe
    """

    _inner: dict[str, str]
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._inner = {}
        return cls._instance

    def put(self, key: str, value: str):
        """typical kvstore put method"""
        self._inner[key] = value

    def get(self, key: str) -> str | None:
        """typical kvstore get method"""
        return self._inner.get(key)

    def put_file_path(self, uuid: str, file_path: str):
        """
        Store the filepath of a file with given uuid
        """
        key = "file" + str(uuid)
        self.put(key, file_path)

    def get_file_path(self, uuid: str) -> str | None:
        """
        Get the filepath of given uuid
        """
        key = "file" + uuid
        return self.get(key)
