```ps
conda activate nlp_course
jupyter notebook
```

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

## Working with PDFs
```ps
pip install PyPDF2
```

- Open PDF File

```py
pdf_file = open('.\\UPDATED_NPL_COURSE\\....\\xx.pdf')

pdf_reader = PyPDF2.PdfReader(myfile)

len(pdf_reader.pages)

page_one = pdf_reader.pages[0]

page_one.extract_text()

myfile.close()
```

- Concat PDF File

```py
f = open("")
pdf_reader = PyPDF2.PdfReader(f)
first_page = pdf_reader.pages(0)
pdf_writer = PYPDF2.
```

## Regular Expressions Part One

```py
text = "The phone number of the agent is 408-555-1234. Call soon!"

import re
pattern = "phone"
my_match = re.search(pattern, text)
# <_sre.SRE_Match object; span=(4,9), match='phone'>
my_match.span()
# (4, 9)

text = "my phone is new phone"
match = re.search(pattern, text)

matches = re.findall("phone", text)
len(matches)
# 2

for match in re.finditer("phone", text)
  print(match.span())
```

- Use general pattern
> Check on `02-Regular_expression.ipynb`

```py
text = "My telephone number is 777-555-1234"
# using r before the pattern string to signal it's a pattern
pattern = r'\d\d\d-\d\d\d-\d\d\d\d'
target = re.search(patter, text)
target.group()
# 777-555-1234
```

## Regular Expressions Part Two
- grouping

To make final match result into chunks, so that you can get specific part of the match easily

```py
pattern = r'(\d{3})-(\d{3})-(\d{4})'
mymatch = re.search(pattern, text)
mymatch.group(1)
# 777
```

- Confusions

```py
r'^\d' means starts with a digit
r'[^\d]' means exclude one digit
r'[\w\d]+' means a alphneumeric and a digit as a group appears one or multiple times
```

# Section 3: Natural Language Processing Basics
## What is Natural Language Processing?

```ps
<!-- Run as Admin -->
conda install -c conda-forge spacy
python -m spacy download en
```

```py
import spacy
nlp = spacy.load('en_core_web_sm')
# tokenization
doc = nlp(u'Tesla is looking at buying U.S. startup for $6 million')
for token in doc:
  print(token.text, token.pos_, token.dep_)
```

## Tokenization - Part One
- Named Entity

```py
doc8 = nlp(u'Apple to build a Hong Kong factory for $6 million')
for t in doc8:
  print(token.text, end=' | ')
# Apple | to | build | a | Hong | Kong | factory | for | $ | 6 | million |

for entity in doc8.ents:
  print(entity)
  print(entity.label_)
  print(str(spacy.explain(entity.label_)))
# Apple ORG Companies ... Hong Kong GPE Countires... $6 million MONEY Monetary values...
```

- Noun Chunks, noun + word describe that

```py
doc9 = nlp(u'Autonomous cars shift insurance liability toward manufacturers.')
for chunk in doc9.noun_chunks:
  print(chunk)
# Autonomous cars
# insurance liability
# manufacturers
```

## Tokenization - Part Two
