# Section 2: Python Text Basics

## f string
```python
person = "Jose"
# how to add variable to a string before 3.6
print("my name is {}".format(person)) 
# with f string
print(f"my name is {person}")
```

## collection

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


## Text alignment and padding

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

