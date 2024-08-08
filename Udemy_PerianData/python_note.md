# Section 3 Python Object and Data Structure

## Introduction to Strings

Reverse Index of String type

| str           | h   | e   | l   | l   | o   |
| ------------- | --- | --- | --- | --- | --- |
| Index         | 0   | 1   | 2   | 3   | 4   |
| Reverse Index | 0   | -4  | -3  | -2  | -1  |

### Slicing

[start:stop:step]

- **start** is a numerical index for the slice start
- **stop** is a index you will go up to (not included)
- **step** is the size of the "jump" you take

### len()

```python
len("I am")
# 4
```

## Indexing and Slicing with Strings

```python
mystring = "abcdefghijk"
mystring[2:]
# cdefghijk
mystring[:3]
# abc
mystring[3:6]
# def
mystring[::]
# abcdefghijk
mystring[::2]
# acegik
mystring[2:7]
# cdefg

mystring[2:7:2]
# ceg

# Reverse String trick
mystring[::-1]
# kjihgfedcba
```

## String Properties and Methods

- String is immutable.

So if you have String valued "Sam", how to change it to "Pam".

### String concatenation

```python
name = "Sam"
last_letters = name[1:]
name_new = 'P' + last_letters
```

### String multiplication

```python
letter = "z"
letter * 10
# zzzzzzzzzz
```
