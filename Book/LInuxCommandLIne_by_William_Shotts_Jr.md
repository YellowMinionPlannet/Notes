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
# HardLink
- it's more like reference to the real file bytes bulk. When all references(hard links) are deleted, the file bytes are removed and reallocated.
- Hardlink cannot reference a file outside its own filesystem
- Hardlink cannot reference a directory 

# Symbolic Links
- It can points to file or directory
- when file is deleted, the symbolic link remains but remains as broken
- when write to symbolic link, file also synced

# Commands
The categories of commands:
1. Executable program, files in `usr/bin`. Compiled binaries, like program written in C, C++, or Shell, Perl, Python, Rubby
2. Command built into the shell, which is bash's *shell builtins*
3. shell function,customized function by us.
4. Alias

We can us `type [command]` to examine what type the command is.

```bash
type type
type ls
type cp
```

We can us `which [command]` to show where executable's location:
```bash
which ls
# /bin/ls
```

We can search command using `apropos`
```bash
apropos floppy
# floppy
# gfloppy
# ...
```

# alias
We can build alias by `alias`
```bash
alias foo='cd /usr; ls; cd -'
unalias foo

# to list all alias:
alias
# alias l.='ls -d .* --color=tty'
```

# Redirection
There are mainly three parts of shell program that can be interact with end user:
1. standard output(stdout)
2. standard error(stderr)
3. standard input(stdin)

redirecton is the mechanism that can redirect one of the parts into other.

To redirect standard output into a file:
```bash
ls -l /usr/bin > ls-output.txt
```
or if this command has error it will redirect the error to the file:
```bash
# /bin/usr does not exist
ls -l /bin/usr 2> ls-output.txt
```
To append and redirect
```bash
ls -l /usr/bin >> ls-log.txt 2>$1
```
To dispose unwanted output
```bash
ls -l /bin/usr 2> /dev/null
```

# pipeline
Take output and input into next pipe and output
To use less take the output of ls as input
```bash
ls -l /usr/bin | less
```

We can chain this pipeline:
```bash
ls /bin /usr/bin | sort | uniq | wc -l
```

Use grep to match pattern
```bash
# list sorted and unique items match zip
ls /bin /usr/bin | sort | uniq | grep zip
```