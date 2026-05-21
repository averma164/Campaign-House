"""
Expose route submodules for `api.routes` package.

Importing the submodules here makes `from api.routes import campaign, auth`
work without triggering a circular import.
"""

from . import campaign, auth, notification