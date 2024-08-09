# Section 2: Python Text Basics

## Working with Text Files with Python - Part One

### f string
```python
person = "Jose"
# how to add variable to a string before 3.6
print("my name is {}".format(person)) 
# with f string
print(f"my name is {person}")
```

### collection

- Dictionary

```py
d = {'a': 123, 'b': 456}
print(f"my number is {d['a']}")
```
- List

```py
mylist = [0,1,2]
print(f"my number is {mylist[0]}")
```
- Tuples

```py
library = [('Author', 'Topic', 'Pages'), ('Twain', 'Rafting in water alone and very long title', 601), ('Feynman', 'Physics', 95), ('Hamilton', 'Mythology', 144)]

print(library)
# [('Author', 'Topic', 'Pages'), ('Twain', 'Rafting', 601), ('Feynman', 'Physics', 95), ('Hamilton', 'Mythology', 144)]

for book in library:
  print(book)
# ('Author', 'Topic', 'Pages')
# ('Twain', 'Rafting', 601)
# ('Feynman', 'Physics', 95)
# ('Hamilton', 'Mythology', 144)

for book in library:
  print(f"{book[0]}")
# Author
# Twain
# Feynman
# Hamilton
```

- DateTime

```py
from datetime import datetime
today = datetime(year=2019,month=2,day=28)
print(f"{today}")
# 2019-02-28 00:00:00

print(f"{today:%B}")
#strftime.org to check out format code

# February
```


### Text alignment and padding

```py
for author, topic, pages in library:
  print(f"{author} {topic} {pages}")

# Author Topic Pages
# Twain Rafting in water alone and very long title 601
#...

for author, topic, pages in library:
  print(f"{author:{10}} {topic:{30}} {pages:.>{10}}")
# use colon and curly braces to set up minimum space to take
# use greater than to make differnt types (string and number here) to be aligned
# use dash to fill in custom character

# Author    Topic                            ....Pages
# Twain     Rafting in water alone and very  ......601
```

## Working with Text Files with Python - Part Two

- To create text file with Jupiter Notebook

```py
# in jupiter notebook
%%writefile test.txt
Hello, this is a quick text file.
This is the second line of the file.
```

- To know where Jupiter Notebook location

```py
pwd
# C:\\Users\\...
```

- To open a text file

```py
myfile = open("test.txt")

myfile
# <_io.TextIOWrapper name='test.txt' mode='r' encoding='cp1252'>

# windows full path, remember to use double backslash
myfile = open("C:\\Users\\YourUserName\\...")

# MacOS and Linux
myfile = open("/Users/YourUserName/...")
```

- To read file

```py
myfile.read()
# 'Hello, this is a quick text file.\nThis is the second line of the file.'

myfile.read()
# ''
# subsequent call will endup empty string, you need to reset the cursor

myfile.seak(0)
content = myfile.read()
content
# 'Hello, this is a quick text file.\nThis is the second line of the file.'
```

- Always close file after done reading

```py
myfile.close()
```

- To read lines

```py
myfile = open("test.txt")
mylines = myfile.readlines()
mylines
# ['Hello, this is a quick text file.\n', 'This is the second line of the file.']
for line in mylines
  print(line.split()[0])
# Hello,
# This
```

- To overwrite file

```py
myfile = open("test.txt", 'w+')
myfile.read()
# ''

myfile.write("MY BRAND NEW TEXT")
myfile.seek(0)
myfile.read()
# 'MY BRAND NEW TEXT'
myfile.close()
```

- To append content file

```py
# a+ will create a file if there's no such file
myfile = open("doesnotexist.txt", 'a+')
myfile.write("MY FIRST LINE IN A+ OPENING")
myfile.close()

newfile = open("doesnotexist.txt")
newfile.read()
# 'MY FRIST LINE IN A+ OPENING'
newfile.close()

myfile = open("doesnotexist.txt", mode='a+')
myfile.write("This is an added line, because I used a+ mode")
myfile.seek(0)
myfile.read()
# 'MY FRIST LINE IN A+ OPENINGThis is an added line, because I used a+ mode'
```

- context manager

```py
with open('doesnotexist.txt', 'r') as mynewfile
  myvariable = mynewfile.readlines()

myvariable
# the file is automatically closed here
```