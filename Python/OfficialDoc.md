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

```python
letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
letters
# ['a', 'b', 'c', 'd', 'e', 'f', 'g']

# replace some values
letters[2:5] = ['C', 'D', 'E']
letters
# ['a', 'b', 'C', 'D', 'E', 'f', 'g']

# now remove them
letters[2:5] = []
letters
# ['a', 'b', 'f', 'g']

# clear the list by replacing all the elements with an empty list
letters[:] = []
letters
# []
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

Funciton can accept tuples and dictionary, specified by `*` and `**`
```python
def cheeseshop(kind, *arguments, **keywords):
    print(kind)
    print(arguments)
    print(keywords)

cheeseshop('a', 'b', 'c', name=1, school=2)
# a
# ('b', 'c')
# {'name': 1, 'school': 2}

args = [3, 6]
list(range(*args))
[3, 4, 5]
```

Function parameters could be seperated into 3 types:
1. standard
2. positional only, must have `/` at the end of arguments
3. keyword only, must have `*` at the begining of arguments

```python
def standard_arg(arg):
    print(arg)

def pos_only_arg(arg, /):
    print(arg)

def kwd_only_arg(*, arg):
    print(arg)

def combined_example(pos_only, /, standard, *, kwd_only):
    print(arg)
```

Potential parameter name collision, use `/` to clarify the keyword only parameters will solve the parameter name collision.

```python
def foo(name, **kwds):
    return 'name' in kwds

foo(1, name=2) # name = 1, and name = 2
# Traceback (most recent call last):
# File "<stdin>", line 1, in <module>
# TypeError: foo() got multiple values for argument 'name'

def foo(name, /, **kwds):
    return 'name' in kwds

foo(1, name=2)
# True
```

Lambda
```python
pairs = [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four')]
pairs.sort(key=lambda pair: pair[1]) # specify sort by each pair's second element
pairs
# [(4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]
```

Coding Convention:

- Use 4-space indentation, and no tabs.

4 spaces are a good compromise between small indentation (allows greater nesting depth) and large indentation (easier to read). Tabs introduce confusion, and are best left out.

- Wrap lines so that they don’t exceed 79 characters.

This helps users with small displays and makes it possible to have several code files side-by-side on larger displays.

- Use blank lines to separate functions and classes, and larger blocks of code inside functions.

- When possible, put comments on a line of their own.

- Use docstrings.

- Use spaces around operators and after commas, but not directly inside bracketing constructs: a = f(1, 2) + g(3, 4).

- Name your classes and functions consistently; the convention is to use UpperCamelCase for classes and lowercase_with_underscores for functions and methods. Always use self as the name for the first method argument (see A First Look at Classes for more on classes and methods).

- Don’t use fancy encodings if your code is meant to be used in international environments. Python’s default, UTF-8, or even plain ASCII work best in any case.

- Likewise, don’t use non-ASCII characters in identifiers if there is only the slightest chance people speaking a different language will read or maintain the code.

# 5 Data Structures

## List Comprehensions

```python
squares = []
for x in range(10):
    squares.append(x**2)

squares
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

squares = list(map(lambda x: x**2, range(10)))
squares = [x**2 for x in range(10)]
# two has the same output as first logic.

[(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
# [(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]

combs = []
for x in [1,2,3]:
    for y in [3,1,4]:
        if x != y:
            combs.append((x, y))

combs
# [(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]

vec = [-4, -2, 0, 2, 4]
# create a new list with the values doubled
[x*2 for x in vec]
# [-8, -4, 0, 4, 8]

# filter the list to exclude negative numbers
[x for x in vec if x >= 0]
# [0, 2, 4]

# apply a function to all the elements
[abs(x) for x in vec]
# [4, 2, 0, 2, 4]

# call a method on each element
freshfruit = ['  banana', '  loganberry ', 'passion fruit  ']
[weapon.strip() for weapon in freshfruit]
# ['banana', 'loganberry', 'passion fruit']

# create a list of 2-tuples like (number, square)
[(x, x**2) for x in range(6)]
# [(0, 0), (1, 1), (2, 4), (3, 9), (4, 16), (5, 25)]

# flatten a list using a listcomp with two 'for'
vec = [[1,2,3], [4,5,6], [7,8,9]]
[num for elem in vec for num in elem]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## Nested List Comprehensions
```python
# to transpose this matrix, we have several methods to do it, and it will result the same.

matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9,10,11,12]
]

# Method1
[[row[i] for row in matrix] for i in range(4)]

# [[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]

# Method2
transposed = []
for i in range(4):
    transposed.append([row[i] for row in matrix])

transposed
#[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]

# Method3
transposed = []
for i in range(4)
    transposed_row = []
    for row in matrix:
        transposed_row.append(row[i])
    transposed.append(transposed_row)

transposed

# Method4
list(zip(*matrix))
# [(1, 5, 9), (2, 6, 10), (3, 7, 11), (4, 8, 12)]
```

### About `zip()` function
```python
for item in zip([1, 2, 3], ['sugar', 'spice', 'everything nice']):
    print(item)

# (1, 'sugar')
# (2, 'spice')
# (3, 'everything nice')
```

### About Unpacking Argument Lists
```python
list(range(3, 6))
# [3, 4, 5]
args = [3, 6]
list(range(*args))
# [3, 4, 6]
```

## The `del` statement
`del` is used for removing item in a list by its index given.
```python
a = [-1, 1, 66.25, 333, 333, 1234.5]
del a[0]
a
#[1, 66.25, 333, 333, 1234.5]
del a[2:4]
a
#[1, 66.25, 1234.5]
del a[:]
a
#[]

del a
# delete variable a
```

## Tuples and Sequences
In python, tuple is a standard way to express squence of data.
```python
t = 12345, 54321, 'hello!'
t[0]
# 12345

t
#(12345, 54321, 'hello!')

u = t, (1, 2, 3, 4, 5)
u
#((12345, 54321, 'hello!'), (1, 2, 3, 4, 5))

t[0] = 88888
# Error, because tuples are immutable

v = ([1, 2, 3], [3, 2, 1])
v
# ([1, 2, 3], [3, 2, 1])

empty = ()

singleton = 'hello',

len(empty)
# 0

len(singleton)
# 1

singleton
# ('hello', )

# multiple assignment for unpacking tuple/squence

x, y, z = t
```

## Sets
No duplicate elements, have to use `set()` function to create empty set.
```python
emptySet = set()
emptySet
# set()

basket = {'apple', 'orange', 'apple', 'pear', 'orange', 'banana'}
basket
# {'apple', 'orange', 'pear', 'banana'}

'orange' in basket
# true

'some other fruit' in basket
# false

# CAUTION: using set() instead of {}
a = set('asdfasdf')
b = set('asd')
a
# {'a','s','d','f'}
a - b
# in a but not b
# {'f'}

a|b
# in a or b or both
# {'a', 's', 'd', 'f'}

a&b
# in both a and b
# {'a','s','d'}

a^b
# in a or b but not both
# {'f'}
```

## Dictionaries
It is indexed by keys, and keys can be any immutable types, strings and numbers, Tuples can be keys if they only contain strings, numbers.
```python
tel = {'jack': 4098, 'sape': 4139}
tel['guido'] = 4127
tel
# {'jack': 4098, 'sape': 4139, 'guido': 4127}
tel['jack']
# 4098

del tel['sape']
tel['irv'] = 4127
tel
# {'jack': 4098, 'guido': 4127, 'irv': 4127}

list(tel)
#['jack', 'guido', 'irv']

sorted(tel)
#['guido', 'irv', 'jack']

'guido' in tel
# true

{x: x**2 for x in (2, 4, 6)}
# {2:4, 4:16, 6:36}

dict(sape=4139, guido=4127, jack=4098)
#{'sape': 4139, 'guido': 4127, 'jack':4098}
```

## Looping Techniques

## Comparing Squences and Other TYpes
```python
(1, 2, 3)              < (1, 2, 4)
[1, 2, 3]              < [1, 2, 4]
'ABC' < 'C' < 'Pascal' < 'Python'
(1, 2, 3, 4)           < (1, 2, 4)
(1, 2)                 < (1, 2, -1)
(1, 2, 3)             == (1.0, 2.0, 3.0)
(1, 2, ('aa', 'ab'))   < (1, 2, ('abc', 'a'), 4)

# all of these statements are true

```

python compare two squences by elements one by one, and if the same position are two squence typed element, the comparing will be recursive. The comparison will be ended when one of the sequence / subsequence is exhausted.

# 6 Modules
To achieve code reuse, we can use scripts or modules.

A module is a file containing Python definitions and statements.
- file name must be module name with suffix `.py`
- module name is available as a global variable called `__name__`

Take a example for module:

```python
def fib(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()

def fib2(n):
    result = []
    a, b = 0, 1
    while a < n:
        result.append(a)
        a, b = b, a+b
    return result

# in another python script

import fibo

fibo.fib(1000)
# 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987

fib = fibo.fib
fib(500)
# 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377
```

Several syntax about importing:
```python
from fibo import fib as fibonacci

from fibo import fib, fib2

from fibo import *

import fibo as fib

```

You need to call `importlib.reload()` to reload module if you have updated the code.

## Executing modules as scripts
This is the syntax to run a module as script

```python
python fibo.py 50
```

That means u set `__name__` global variable to "__main__" and run like:
```python
if __name__ == "__main__":
    import sys
    fib(int(sys.argv[1]))
```

## The Module Search Path

When a module named *spam* is imported, the interpreter will look for this module in following places:
- `sys.builtin_module_names`
- Directories given by the variable `sys.path`:
    - The directory containing the input script
    - PYTHONPATH
    - Standard Python modules(`prefix`) and Extension modules(`.pyd`, `exec_prefix`)
    - Installation-dependent default

## "Compiled" Python files

To speed up loading modules, Python caches the compiled version of each module in the `__pycache__` directory under the name `module.version.pyc`. For example, in CPython(the windows version of python?) release 3.3, the compiled version of spam.py would be cached as `__pycache__/spam.cpython-33.pyc`.

So when running if the current modified date is later than the compiled one, then the module will be recompiled. Command line is always recompiled, and if there is no source module, then the cache is ignored.

## Standard Modules
