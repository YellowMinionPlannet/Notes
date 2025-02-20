# Using the Python Interpreter
To invoke the interpreter
```bash
python

# to see the version
python --version
```

To quit the interpreter
```bash
quit()
```

UTF-8 is the default encoding, if you want to specify other one, within a python file:
```python
# -*- coding: cp1252 -*-
```

# 3 An Informal Introduction to Python
The magic `_` variable, is to store the last printed expression. So DO NOT assign value to this `_`, or you will mask another variable on top of it, and `_` will lose its magic.
```python
tax = 12.5/100
price = 100.50
price * tax # 12.5625
price + _ # 113.0625
round(_, 2) # 113.06
```

To print raw strings, you need to add r in front of a string.
```python
print('C:\some\name')
# C:\some
# ame

print(r'C:\some\name')
# C:\some\name
```

You can treat string type as a squence with indices
```python
word = 'python'
word[0]
# 'p'

word[-1]
# 'n'

word[0:2] # second parameter is always excluded.
# 'py'

```

Multiline can be achieved using `'''...'''` or `"""..."""`, you can "save" a new ling by `\`
```python
print("""\
Usage: thingy
""")
# Usage: thingy
#

print("""
... Usage: thingy
... """)
#
# Usage: thingy
#
```

To Concatenate strings, you can 
1. use `+` sign
2. just concatenate with space
```python
"Py" + "thon"
# Python

3 * "Py" + "thon"
# PyPyPython

"Py" "thon"
# Python
```

But you can't use the 2nd method for variable or expression

# 4 More Control Flow Tools

`range()` Function
```python
for i in range(5):
    print(i)

# 0
# 1
# 2
# 3
# 4
```

So range function actually returns a iterable object, you can pass that to some function that receives a iterable object. Like `list()`

```python
list(range(5, 10))
# [5, 6, 7, 8, 9]

list(range(0, 10, 3))
# [0, 3, 6, 9]

list(range(-10, -100, -30))
# [-10, -40, -70]
```

Combine `range()` and `len()` function with `for` statement
```python
a = ['Mary', 'had', 'a', 'little', 'lamb']
for i in range(len(a)):
    print(i, a[i])

# 0 Mary
# 1 had
# 2 a 
# 3 little
# 4 lamb
```

`sum()` function can also accepts an iterable object
```python
sum(range(4))
# 6
```

`else` statement combined with `for` loop
```python
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            print(n, 'equals', x, '*', n//x)
            break
    else: # for loop ended without break, will continue from here
        print(n, 'is a prime number')

# 2 is a prime number
# 3 is a prime number
# 4 equals 2 * 2
# 5 is a prime number
# 6 equals 2 * 3
# 7 is a prime number
# 8 equals 2 * 4
# 9 equals 3 * 3
```

`match()` function
```python
def http_error(status):
        match status:
            case 400:
                return "Bad request"
            case 404:
                return "Not found"
            case 418:
                return "I'm a teapot"
            case 401|403:
                return "Not allowed"
            case _:
                return "Something's wrong with internet"

http_error(404)
# 'Not found'
```

```python
from enum import enum
class Color(Enum):
        RED = "red"
        GREEN = "green"
        BLUE = "blue"

color = Color(input("Enter your choice of 'red', 'blue' or 'green'"))

match color:
    case Color.RED:
        print("I see red!")
    case Color.GREEN:
        print("Grass is green")
    case Color.BLUE:
        print("I'm feeling the blues :(")

```