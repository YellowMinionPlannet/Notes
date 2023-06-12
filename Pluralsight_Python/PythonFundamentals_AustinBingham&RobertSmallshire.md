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
from urllib.request import urlopen
with urlopen("http://sixty-north.com/c/t.txt") as story:
    story_words = []
    for line in story:
        line_words = line.decode("utf-8").split()
        for word in line_words:
            story_words.append(word)

story_words
```

# Modularity
