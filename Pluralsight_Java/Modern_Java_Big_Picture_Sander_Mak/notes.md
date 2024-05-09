# Introducing the Java Platform
There are 3 parts composite Java:
1. Programming Language
2. Runtime Environment
3. Standard Library of Java
JDK is the whole package to develop and run Java applications, it contains SE apis(standard libraries) and Runtime.

## How 3 parts connect to each other
1. You write Java application using Java Programming Language, but this code cannot run by CPU, so
2. Java Programming Language is compiled to Application bytecode through compiler
    - During the coding, there are lots of functionalities could be reused by calling Java Standard Library(JAVA SE APIs)
    - And only SE is not enough, there must be 3rd party library involved
3. these bytecode are passed to JVM(Java Virtual Machine) where the Java Runtime Environment locates, and Runtime will bridge the bytecode to operating system, operating system operates hardware of computer.

# Adopting Java
- Portability, by switching JVM, you can use same source code and run on different OS and CPUs
- Readability:
    - Long term stable supports and backward compatible to old code
    - Conservative to new feature
    - Controlled deprecationg
- Openness
    - Specification Process:
        - Java Community Process: Consists of major Java vendors and community to define specification of Java
        - Be aware there's non-formal(oracle) implementation of JDK, like IBM and Eclipse
    - Open-source:
        - [OpenJDK projects](openjdk.java.net)
    - Java Communities

## Reason to adopt JAVA
- Popularity
- Scalable Development
    - classes group to packages, packages group to modules
- Productivity:
    - Type System, strong typeed language
    - Managed Runtime
        - Memory Management
        - Garbage collection
        - Multi-threading
- Performance
    - Just-in-time compilation, that means JVM analyze cpus and OS and optimize the bytecode to machine code process.

## Reason not to use JAVA
Not suitable for Real-Time application due to the Managed Runtime, and not suitable to control low level resources/platform specific apis.

## Comparison to other language
### C/C++
    - Unmanaged
    - Compiler compiles C/C++ code directly to executable, so
    - compilers are system specific, different system has different standard library

### Python
    - Also a high-level managed language
    - Python has no compiler, Python runtime has interpreter and by which source code of Python can run in any system
    - Python does not have statically typed
    - Python 2/3 are very different, issue with backwards compatibility
    - Lower performance in runtime

### Javascript
    - run on browser
    - and NodeJS provides managed runtime and can be run on OS
    - Single-threaded


# From Desktop to Enterprise Java to the Cloud
# Exploring Popular Java Libraries
# Practices and Common Tools
# Examining Alternative Java Languages