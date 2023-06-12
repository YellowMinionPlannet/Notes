# 2 Getting Starting With Python 3

## Importing From the Python Standard Library

```python
import math
math.sqrt(81)
# 9.0
math.factorial(5)
# 120
math.factorial(6)
# 720
n = 5
k = 3
math.factorial(n) / (math.factorial(k) * math.factorial(n-k))
# 10.0

from math import factorial
factorial(n) / (factorial(k) * factorial(n-k))
# 10.0

from math import factorial as fac
fac(n) / (fac(k) * fac(n-k))
# 10.0

fac(n) // (fac(k) * fac(n-k))
# 10


2**31-1
# 2147483647
fac(13)
# 6227020800
n = 100
k = 2
fac(n) // (fac(k) & fac(n-k))
# 4950
fac(n)
# 9332621544......
len(str(fac(n)))
# 158
```

## Scalar Types: int, float, None and bool

- int
- float
- None, the null object
- bool

```python
## Integer

10
# 10

0b10
# 2
0o10
# 8
0x10
# 16

int(3.5)
# 3
int(-3.5)
# -3
int("496")
# 496
int("1000", 3)
# 81


## Float

3.125
# 3.125
3e8
# 300000000.0
1.616e-35
# 1.616e-35

float(7)
# 7.0
float("1.618")
# 1.618
float("nan")
# nan
float("inf")
# inf
float("-inf")
# -inf

3.0 + 1
# 4.0


## None


a = None
a is None
# True


## Boolean


True
# True
False
# False
bool(0)
# False
bool(42)
# True
bool(-1)
# True
bool(0.0)
# False
bool(0.207)
# True
bool(-1.117)
# True
bool([])
# False
bool([1,5,8])
# True
bool("")
# False
bool("Spam")
# True
bool("False")
# True
```

## Relational Operators

```python
# value equality
==
# value inequality
!=
# less than
<
# greater than
>
# less-than or equal to
<=
# greater-than or equal to
>=

## example

g = 20
g == 20
# True
g == 13
# False
g != 13
# True
g < 30
# True
g > 30
# False
g <= 20
# True
g >= 20
# False

```

## Conditional Statement

```python
if True:
    print("It's true!")
# It's true!
if False:
    print("It's true!")
#

if bool("eggs"):
    print("Yes please!")
# Yes please!
if "eggs":
    print("Yes please!")
# Yes please!

h = 42
if h > 50:
    print("Greater than 50")
else:
    print("50 or smaller")
# 50 or smaller

if h > 50:
    print("Greater than 50")
elif h < 20:
    print("Less than 20")
else:
    print("Between 20 and 50")
# Between 20 and 50
```

## While loops

```python
c = 5
while c != 0:
    print(c)
    c -= 1
# 5
# 4
# 3
# 2
# 1

c = 5
while c:
    print(c)
    c -= 1
# 5
# 4
# 3
# 2
# 1

while True:
    response = input()
    if int(response) % 7 == 0:
        break
```

# 3 Strings and Collections

```python
"first""second"
# firstsecond

'a new string'
# a new string

"""a multi-line
string"""
# a multi-line\nstring

m = "a multi-line\nstring"
print(m)
#a multi-line
#string

"This is a scaped string \""
# This is a scaped string"

k = "A \\ in a string"
print(k)
# A \ in a string

path = r'C:\Users\Merlin\Documents\Spells'
print(path)
# C:\Users\Merlin\Documents\Spells

s = 'parrot'
s[4]
# 'o'

type(s[4])
# <class 'str'>

c = 'oslo'
c.capitalize()
# 'Oslo'
```

## Bytes

```python
a = "helpmeout"
b = b"helpmeout"
c = a.encode("ASCII")

if(b == c):
    print("SAME!")

# SAME!
```

## Lists

```python
[1, 9, 8]
a = ["apple", "orange", "banana"]
a[1] = 7
a
# ["applie", 7, "banana"]

b = []
b.append(1.83)
b.append(2.37)
```

## Dictionaries

```python
d = {"alice": "777-9999-999", "lei": "010-6951-877"}
d["alice"] = "000-0000-000"

e = {}
```

## For-Loops

```python
cities = ["London", "Beijing", "New York"]
for city in cities:
    print(city)

colors = {"crimson": 0xdc143c, "coral": 0xff7f50, "teal": 0x008080}
for color in colors:
    print(color, colors[color])
```

```python
# word.py ver1.0
from urllib.request import urlopen
with urlopen("http://sixty-north.com/c/t.txt") as story:
    story_words = []
    for line in story:
        line_words = line.decode("utf-8").split()
        for word in line_words:
            story_words.append(word)

for word in story_words:
    print(word)
```

# Modularity

We can save our snippet into `words.py` file and import it from another REPL

```python
import word
```

It would be very easy to reuse if we put our logic into a function

```python
def square(x):
    return x * x

square(5)
# 25

def even_or_odd(n):
    if n % 2 == 0:
        print("even")
        return
    print("odd")

w = even_or_odd(31)
w is None
# True, since the function return nothing.
```

## Destinguishing between Module Import and Module Execution

```python
# word.py ver2.0
from urllib.request import urlopen

def fetch_words():
    with urlopen("http://sixty-north.com/c/t.txt") as story:
        story_words = []
        for line in story:
            line_words = line.decode("utf-8").split()
            for word in line_words:
                story_words.append(word)

    for word in story_words:
        print(word)
```

```python
import words
words.fetch_words()
```

```python
# word.py ver3.0
from urllib.request import urlopen

def fetch_words():
    with urlopen("http://sixty-north.com/c/t.txt") as story:
        story_words = []
        for line in story:
            line_words = line.decode("utf-8").split()
            for word in line_words:
                story_words.append(word)

    for word in story_words:
        print(word)

if __name__ == "__main__":
    fetch_words()
else
    print(__name__)
```

The last if statment will do :

- if the word.py is imported, word will be printed
- if the word.py is executed, the fetch_words function will be called

## Main Functions and Command Line Arguments

```python
# word.py ver4.0
import sys
from urllib.request import urlopen

def fetch_words(url):
    with urlopen("http://sixty-north.com/c/t.txt") as story:
        story_words = []
        for line in story:
            line_words = line.decode("utf-8").split()
            for word in line_words:
                story_words.append(word)
        return story_words

def print_items(items):
    for item in items:
        print(item)

def main(url):
    print_items(fetch_words(url))


if __name__ == "__main__":
    main(sys.argv[1])
else
    print(__name__)
```

## Documenting Your Code Using Docstrings

```py
# word.py ver5.0

"""
Retrieve a dn print words from a URL.

Usage:
    python3 word.py <URL>
"""
import sys
from urllib.request import urlopen

def fetch_words(url):
    """Fetch a list of words from the URL
    Args:
        url: The URL of a UTF-8 text document.
    Returns:
        A list of strings containing the words from the document.
    """
    with urlopen(url) as story:
        story_words = []
        for line in story:
            line_words = line.decode("utf-8").split()
            for word in line_words:
                story_words.append(word)
        return story_words

def print_items(items):
    """Print items one per line.
    Args:
        An iterable series of printable items
    """
    for item in items:
        print(item)

def main(url):
    """Print each word from a text document from a URL.
    Args:
        url: The URL of a UTF-8 text document.
    """
    print_items(fetch_words(url))


if __name__ == "__main__":
    main(sys.argv[1])
else:
    print(__name__)
```

# Objects

Python uses reference variable. Every variable is a reference of an object. And everything is an object. Function pass argument by reference type but not copy of object.

## Id function

```python
a = 500
c = id(a)
c
# 1660910711024
b = 500
d = id(b)
d
# 1660910710992

b == a
# True

b is a
# False

b = a

b is a
# True

```

`is` return if two item's ids are the same, where `==` returns if two items content are the same.

## Function Arguments

```py
# menu.py ver1.0
def add_spam(menu = []):
    menu.append("spam")
    print(menu)
```

```py
from menu import add_spam

add_spam()
# ["spam"]
add_spam()
# ["spam", "spam"]
add_spam()
# ["spam", "spam", "spam"]
```

`menu` was created once when `def` is executed, and persists in the scope.

## Type System

```py
def add(a, b):
    return a + b

add([1, 3], [4, 5])
# [1, 3, 4, 5]

add("The answer is", 54)
# TypeError: Can't convert "int" object to str implicitly

```

## Scope

variable names are determined follow order of:

1. Local: Inside the current function
2. Enclosing: Any and all enclosing functions
3. Global: Top-level of module
4. Built-in: All built-in modules in Python

```py
count = 0

def set_count(num):
    count = num

def print_count():
    print("count = ", count)

print_count()
# count = 0

set_count(4)
print_count()
# count = 0
```

`count` in set_count is local and will have higher priority than global `count`. So it never set value for global `count`.

# Collections
