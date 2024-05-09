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
## Desktop
- 1st GUI is called AWT, abstract windowing toolkit; Hard to build portable applications among differnt OS, 'cause different OS has different behavior for Native controls, AWT uses Native Controls which comes with OS
- Swing uses Java RUNTIME GUI, you can make sure each Control look and feel across platforms. Also comes with MVC
- JavaFX, using XML based syntax to create UI, which is called FXML, CSS can be used, and 3D graphics effects. From Java 11, JavaFX is seperated from JDK, and becomes OpenJFX.

## Enterprise
- distributed communication
- scheduling tasks etc.
- data persistence, transactions
- Web applications
- security
- messaging
- JSON/XML

There was once a time a Java EE Application Server between JAVA Web Application and JAVA Runtime
- Samples for JEE Application Server APIs:
    - Java Persistence Architecture, connect relation database, and object mapping
    - Enterprise Java Beans, transactional business logic
    - Java Server Faces, JSF, web front ends.
- Java Web Application is deployed to JEE Application server as WAR(Web Archive), Server is running on top of JVM, Famous Java Web Application Server:
    - Wildfy(Red Hat)
    - WebSphere(IBM)
    - WebLogic(Oracle)
    - Tomcat(Apache)
- Java EE 8 is the last Oracle release, it migrate to [Jakarta EE](jakarta.ee)(Eclipse Foundation). 
- Spring Framework

## Cloud
When we talk about JEE Application Server, usually it's designed for Monolithic web apps, and Spring is born for distributed(microservices).

Spring Boot Application combined with Spring/Netflix Libraries run on top of SE and JVM, there's no JEE Application server involved anymore.

Other than Spring:
- MicroProfile, inherit knowlege of JEE
- Vert.x (Red Hat)
- Play Framework

## Android
- Uses JAVA 7 and Subset of JAVA 8 Programing Language
- Compile to JAVA Bytecode and finally  Transfer to DEX(Dalvik Executable Format) which runs on the phone.
- With Android APIs and JAVA SEish APIs
- Run top of Dalvik Virtual Machine

# Exploring Popular Java Libraries

# Practices and Common Tools
# Examining Alternative Java Languages