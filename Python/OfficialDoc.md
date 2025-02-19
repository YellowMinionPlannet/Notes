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