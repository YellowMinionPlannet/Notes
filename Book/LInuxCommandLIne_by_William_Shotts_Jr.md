# Wildcards Usage
|Wildcard|Matches|
|-|-|
|`*`|Any characters|
|`?`|Any single character|
|`[characters]`|Any character that is a member of the set `characters`|
|`[! characters]`|Any character that is not a member of the set `characters`|
|`[[: class :]]`|Any character that is a memember of the specified `class`|

|Character Class|Matches|
|-|-|
|`[:alnum:]`|Any alphanumeric character|
|`[:alpha:]`|Any alphabetic character|
|`[:digit:]`|Any numeral|
|`[:lower:]`|Any lowercase letter|
|`[:upper:]`|Any uppercase letter|

|Pattern|Matches|
|-|-|
|`*`|All files|
|`g*`|Any file beginning with g|
|`b*.txt`|Any file beginning with b followed by any characters and ending with .txt|
|`Data???`|Any file beginning with Data Followed by exactly 3 characters|
|`[abc]*`|Any file beginning with either a, b , or c|
|`BACKUP.[0-9][0-9][0-9]`|Any file beginning with BCKUP, following by exactly 3 numerals|
|`[[:upper:]]*`|Any file beginning with a uppercase letter|
|`[![:digit:]]`|Any file not beginning with a numeral|
|`*[[:lower:]123]`|Any file ending with lowercase letter or the numeral 1, 2, or 3|

```bash
# show current working directory
pwd

# changes the working directory to home directory
cd

# change the working direcotry to previous working directory
cd -

# list content with long format
ls -l
```

