# <u>Chapter 6: Type and Member Basics</u>

# The Different Kinds of Type Members

* Constants: static member
* Fields: static / instance member, recommanded to be private in either condition
* Instance constructors: To initialize instance fields
* Type constructors: To initialize static fields
* Methods: static / instance member
* Operator overloads: 
* Conversion operators
* Properties
* Events
* Types

Regardless what language you are using, the compiler is in charge of producing metadata and IL to CLR. The metadata is identical across the language so that languages are able to communicate with each other.

# Type Visibility
* Public: visible to all code
* Internal: only visible to code within the defining assembly

If you do not specify, internal is being used.

## Friend Assemblies
We can use internal types in other assemblies by adding attribute, which makes it friend assemblies.
```c#
using System;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Wintellect", PublicKey="1234567890abcdef")]

internal sealed class SomeInternalType {...}
```

# Member Accessibility
CLR Term vs. C# Term of accessibility for Type members
|CLR Term|C# Term|Description|
|--|--|--|
|Private|private|The member is accessible only by methods in the defining type or any nested type|
|Family|protected|The member is accessible only by methods in the defining type or any nested type, or one of its derived types without regard to assembly|
|Family and Assembly|(not supported)|The member is accessible only by methods in the defining type or any nested type, or by any derived types defined in the same assembly|
|Assembly|internal|The member is accessible only by methods in the defining assembly|
|Family or Assembly|protected internal|The member is accessible by any nested type, any derived type, or any mthods in the defining assembly|
|Public|public|The member is accessible to all methods in any assembly|

Compiler and JIT compiler is responsible to check the accessibility. Run time also checks it to avoid different behaviors in different version of assembly.

If member is accessible but type is not, this member is still not accessible.

Private will be used if you do not specify member accessibility in most cases. 

For Interface, public is a must, but you don't have to clarify this.


# Static Classes
**Console**, **Math**, **Environment**, and **ThreadPool** are static and not instantiable(create instance from them). Value Types are always instantiable.

Restrictions on static class:
* static class must directly derived from System.Object
* static class must not implement any interfaces
* static class must define only static members
* static class cannot be used as field, method parameter, or local variable

# Partial Classes, Structures, and Interfaces
**partial** keyword tells compiler that the source code for class, structure, or interface definition may span one or more source code files.

# Components, Polymorphism, and Versioning


## How the CLR Calls Virtual Methods, Properties and Events
## Using Type Visibility and Member Accessibility Intelligently
## Dealing with Virtual Methods When Versioning Types