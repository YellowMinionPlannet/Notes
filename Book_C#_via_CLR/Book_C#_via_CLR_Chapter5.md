# <u>Chapter 5: Primitive, Reference, and Value Types</u>

# Programming Language Primitive Types
All primitive types has its corresponding FCL(Framework Class Library) types.
For example:
```c#
int i = 0;
System.Int32 a = 0;
int j = new int();
System.Int32 b = new System.Int32();
```
We can think of the way of using ***int*** instead of ***System.Int32*** as
```c#
using int = System.Int32;
using uint = System.UInt32;
...
```
Way of using ***int*** is much simpler when we code, that's why we are using it.

Compiler knows the magnitude of primitive types and is able to do the ***conversion*** for us.
For example:
```c#
Int32 i = 5;// Implicit cast from Int32 to Int32
Int64 l = i;// Implicit cast form Int32 to Int64
Single s = i;// Implicit cast form Int32 to Single
Byte b = (Byte) i;// Explicit cast from Int32 to Byte
Int16 v = (Int16) s;// Explicit cast from Single to Int16
```
Compiler can do safe conversion automatically for us, but for unsafe conversion we need to do it explicitly.

Also, when we write: `int i = 5`, 5 is called ***literal*** of primitive type. Compiler will treat literal as instance of that primitive type and evaluate them in compile time to improve performance.
```C#
Console.WriteLine(123.ToString() + 456.ToString());
Boolean found = false; // Generated code sets found to 0
Int32 x = 100 + 20 + 3; // Generated code sets x to 123
String s = "a " + "bc"; // Generated code sets s to "a bc"
```
## Checked and Unchecked Primitive Type Operations
Consider code below:
```c#
Byte b = 100;
b = (Byte) (b + 200); // b now contains 44 (or 2C in Hex).
```
> In line#2 b and 200 are first converted to 32-bit values and then added together. Therefore 32bit value needs a explicit conversion to Byte.

Overflow Exception is thrown by CLR. The overflow exception can be turned off/on by several ways you set in Compiler.

1. /checked+ flag(in VS settings)
2. checked/unchecked syntax

For example:
```c#
checked{
    Byte b = 100;
    b +=200; // throw Overflow Exception
}

//However
checked{
    //Assume SomeMethod tries to load 400 into a byte
    SomeMethod(400);// will not throw if SomeMethod were not covered by checked block
}
```
C# by default, overflow exception is turned off.

> Decimal and BigInteger are excluded from the rules above. Decimal always throw Overflow Exception and BigInteger never throws oveflow exception but could throw OutOfMemory Exception instead.


# Rerence Types and Value Types
> Primitive types are concept in Compiler level. But the class what we actually used are from FCL in the CLR.

## Value Types
* all structures are immediately derived from the System.ValueType where System.ValueType is derived from System.object. System.Enum is derived from System.ValueType.
* Value types are sealed
* Value types are in stack which means the variable stored this has a actual copy of value type itself rather than a address pointer
* Value types have two representations: unboxed form and boxed form
* You should provide explicit implementations for Equals and GetHashCode methods for your own value types
* Becareful when pass value type or return value type from a method, these processes copy the whole value type which can hurt the performance

# Boxinig and Unboxing Values Types

# Object Hash Codes
# The ***dynamic*** Primitive Type

# <u>Chapter 8 Methods</u>
# Instance Constructors and Classes(Reference Types)
* When createing an instance or a reference type, memory is allocated for the instance's data fields, the object's overhead fields are initialized, and then type's instance constructor is called to set the initial state of Object
* Instance constructor are never inherited since never has modifiers such as virtual, new, override, sealed, or abstract
* If you do not define any explicit constructor, Compiler will define a default constructor which calls base class's parameterless constructor.
* If the class is abstract, Compiler-produced default constructor has protected accessibility. Otherwise, public.
* If the base class does not have parameterless constructor, Compiler raises error.
* If hte class is static, no Compiler-produced constructor at all.
* Compiler call base class constructor if derived class does not explicitly call base class constructor.

In the example below:
```c#
internal sealed class SomeType{
    private Int32 m_x = 5;
    private String m_s = "Hi there";
    private Double m_d = 3.14159;
    private Byte m_b;
    
    public SomeType() {}
    public SomeType(Int32 x){}
    public SomeType(String s) {}
}

```
1. Compiler generates code at the beginning of each constructor method to include initialization of m_x, m_s, and m_d. 
2. Compiler inserts a call to the base class's constructor
3. Compiler appends code that appears in the constructor methods

To avoid generates inline initialization each time when define a instance constructor, we can do a common constructor and call this constructor in instance constructors. For example:
```C#
    private Int32 m_x;
    private String m_s;
    private Double m_d;
    private Byte m_b;
    
    public SomeType() {
        m_x = 5;
        m_s = "Hi there";
        m_d = 3.14159;
        m_b = 0xff;
    }
    public SomeType(Int32 x){
        m_x = x;
    }
    public SomeType(String s) {
        m_s = s;
    }
```
# Instance Constructors and Structures(Value Types)
* Value type does not allow explicitly defined parameterless constructor
* constructor will not be called if you do not explictly call constructor
* Can not do inline filed initialization in a Value Type

You can do following example to make sure all fields are initialized
```C#
public SomeValType(Int32 x){
    this = new SomValType();
    m_x = x;
}

```

# Type Constructors

# Operator Overload Methods
# Conversion Operator methods
# Extension Methods
# Partial Methods