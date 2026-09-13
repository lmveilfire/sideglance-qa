from __future__ import annotations

from dirty_equals import IsInt, IsPartialDict, IsStr

PhotoMatcher = {
    "base": IsPartialDict(
        id=IsInt,
        title=IsStr,
        author=IsStr,
        url=IsStr,
        fullUrl=IsStr,
        likes=IsInt,
        views=IsInt,
    ),
}

CategoryMatcher = {
    "base": IsPartialDict(
        id=IsInt,
        name=IsStr,
    ),
}

SubcategoryMatcher = {
    "base": IsPartialDict(
        categoryId=IsInt,
        id=IsInt,
        name=IsStr,
    ),
}
