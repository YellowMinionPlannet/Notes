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

## Tuple

```py
t = ("Norway", 123.0, 3)
t[0]
# Norway

t * 3
# ("Norway", 123.0, 3, "Norway", 123.0, 3, "Norway", 123.0, 3)

len(t)
# 3

for item in t:
    print(item)
# Norway
# 123.0
# 3

t + (381.4, 265e9)
# ("Norway", 123.0, 3, 381.4, 265e9)

a = ((23, 1), (23, 2), (23, 5))

e = (123,)
type(e)
# <class 'tuple'>

e1 = ()
type(e1)
# <class 'tuple'>

p = 1, 1, 1, 4, 5, 19
p
# (1, 1, 1, 4, 5, 19)

def minmax(items):
    return min(items), max(items)

lower, upper = minmax([83, 33, 82, 89])

(a, (b, (c, d))) = (4, (3, (2, 1)))
a
# 4
b
# 3
c
# 2
d
# 1

# Swap in python
a = "jelly"
b = "bean"
a , b = b, a
a
# "bean"
b
# "jelly"

# tuple constructor
tuple([3, 4, 5, 6])
# (3, 4, 5, 6)

tuple("lei")
# ("l", "e", "i")

5 in (3, 4, 18 248, 29999)
# True
5 not in (123, 239, 49, 5)
# False
```

## String

```py
"New" + "found" + "land"
# "Newfoundland"

# Efficient way of join
s = ";".join(['#45ff23', "#2321fa"])
s
# #45ff23;#2321fa
s.split(";")
# ['#45ff23', "#2321fa"]

# Efficient way of concatenate strings
''.join([]"high", "way"])
# "highway"

"unforgetable".partition("forget")
# ("un", "forget", "able")

place, _, food = "Boston-Pizza".partition("-")
place
# Boston
food
# Pizza

"The age of {0} is {1}".format("Jim", 12)

"The position is {latitude} {longitude}".format(latitude="60N",longitude="5E")
# 'The position is 60N 5E'

pos = (52.2, 23,1, 82.2)
"Galactic position x={pos[0]} y={pos[1]} z={pos[2]}".format(pos=pos)

import math
"Math constants: pi={m.pi:.3f} e={m.e:.3f}".format(m=math)
```

## Range

```py
range(5)
for item in range(5):
    print(item)
# 0
# 1
# 2
# 3
# 4

for item in range(5,10):
    print(item)
# 5
# 6
# 7
# 8
# 9

list(range(3, 10, 2))
# [3, 5, 7, 9]

t=[6, 372, 8862, 148800, 2096886]
for p in enumerate(t):
    print(p)
# (0, 6)
# (1, 372)
# (2, 8862)
# (3, 148800)
# (4, 2096886)

for i, v in enumerate(t):
    print("i={}, v={}".format(i, v))
# i=0, v=6
# i=1, v=372
# i=2, v=8862
# i=3, v=148800
# i=4, v=2096886

```

## List

```py
t = "show how to index into sequences"
s = t.split()
s[1:4]
# ["how", "to", "index"]

s[:3]
#["show", "how", "to"]

full_slice = s[:]
full_slice is s
# False
full_slice == s
# True

u = s.copy()
v = list(s) # These two methods also copy the lists, and all of these three methods are shallow copy.

a = [[1, 2], [8, 9]]
b = a[:]

a[0] = [8, 9]
b[0]
# [1, 2]
a[1].append(5)
a[1]
# [3, 4, 5]
b[1]
# [3, 4, 5]


```

## List Repetition

```py
s = [[-1, 1]] * 5
s[3].append(7)
s
# [[-1, 1, 7],[-1, 1, 7],[-1, 1, 7],[-1, 1, 7],[-1, 1, 7]]
```

## More on list

```py
w = "the quick brown fox jumps owver the lazy dog".split()

i = w.index("fox")

w.index("unicorn")
# Error

w = "jackdaws love my big sphinx of quartz".split()
del u[3]

u.remove("jackdaws")

u.remove("pyramid")
# Error

a = "Iaccidentally the whole universe".split()
a.insert(2, "destroyed")

```

## Growing list

```py
m = [2, 1, 3]
n = [3, 10, 11]
k = m + n
k.extend([5, 0])
k += [19, 20]
```

## Reversing and Sorting Lists

```py
x = [4, 0, 2, 1]
x.sort()
x.reverse()
x.sort(reverse=True)

h = "Hi World"
h.sort(key=len)

y = sorted(x)
q = reversed(x)
list(q) # reversed return iterator instead of list
```

## Dictionary

```py
names_and_ages = [("Alice", 32), ("Bob", 48)]
d = dict(names_and_ages)
phonetic = dict(a="alfa", b="bravo")

g = (c="Chao")

phonetic.update(g) # Extend dictionary

for key in phonetic:
    print(phonetic[key])

for value in phonetic.values():
    print(value)

for key in phonetic.keys():
    print(key)

for key, value in colors.items():
    print("{key} => {value}".format(key=key, value=value))

from pprint import pprint as pp
pp(phonetic)
```

## Set

```py
s = {1, 2, 3}
type(s)
# <class 'set'>

e = set()

s = set([2, 3, 4, 2, 129]) # remove duplicate items
s
#{2, 3, 4, 129}

s.add(54)

s.update([23, 21])

s.remove(23) # raise error if 23 not in the set
s.discard(23) # does not raise error

s1 = {1, 2, 3}
s2 = {1, 3, 4}

s1.union(s2)
# {1, 2, 3, 4}
s1.intersection(s2)
# {1, 3}
s1.difference(s2)
# {2}
s2.difference(s1)
# {4}
s1.symmetic_difference(s2)
# {2, 4}
s1.issubset(s2)
s1.issuperset(s2)
s1.isdisjoint(s2)
```

## Collection Protocal

| Protocol         | methods                                                  | collections                               |
| ---------------- | -------------------------------------------------------- | ----------------------------------------- |
| Container        | in/not in                                                | str, list, range, tuple, bytes, set, dict |
| Sized            | len()                                                    | str, list, range, tuple, bytes, set, dict |
| Iterable         | for in                                                   | str, list, range, tuple, bytes, set, dict |
| Sequence         | seq[index]/seq.index(item)/seq.count(item)/reversed(seq) | str, list, range, tuple, bytes            |
| Mutable Sequence |                                                          | list                                      |
| Mutable Set      |                                                          | set                                       |
| Mutable Mapping  |                                                          | dict                                      |

## Handling Exceptions

```py
# exeptional.py ver1.0
def convert(s):
    x = int(s)
    return x

```

```py

from exceptional import convert
convert("33")
convert("Hello World")
# Error
```

```py
# exceptional.py ver2.0
def convert(s):
    x = -1
    try:
        x = int(s)
        print("Conversion succeeded")
    except (ValueError, TypeError):
        print("Conversion failed")
    return x
```

```py
# exceptional.py ver3.0
def convert(s):
    x = -1
    try:
        x = int(s)
        print("Conversion succeeded")
    except (ValueError, TypeError) as e:
        print("Conversion error: {}".format(str(e)), file=sys.stderr)
    return x
```
