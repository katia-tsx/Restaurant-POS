"""Custom HTTP exceptions.
Author: Josber
Version: 1.0.0
"""
from fastapi import HTTPException

class NotFoundException(HTTPException):
    def __init__(self, detail:str='Not found')->None:
        super().__init__(status_code=404, detail=detail)
