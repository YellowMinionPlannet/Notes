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
The value type is efficient, since it's allocated in stack and not referred to by pointers(like reference type). However, sometimes we need to cast value type to reference type to complete the task.

For example: ArrayList
```c#
// Declare a value type.
struct Point {
    public Int32 x, y;
}

public sealed class Program {
    public static void Main(){
        ArrayList a = new ArrayList();
        Point p;
        for(Int32 i = 0; i < 10; i++){
            p.x = p.y = i; // Initialize the members in the value type;
            a.Add(p); // Box the value type to reference type;
        }
    }
}
```
It's possible to convert a value type to a reference type by using a mechanism called *boxing*. Here's what happened:
1. Memory si allocated from the managed heap. The amount of memo allocated is the size required by the value type's fields plus the two additional overhead members, the type object pointer and the sync block index, required by all objects on the managed heap.
2. The value type's fields are copied to hte newly allocated heap memo
3. Address of the object is returned. This address is now a reference to an object. and the value type is now reference type.

To unboxing the reference type to value type:
```c#
Point p = (Point) a[0];
```
Here's what happened:
1. Address of the Point fields in the boxed object is obtained.
2. The values of these fields are copied from the heap to the stack.

And when unbox, there might be 2 types of exception thrown:
1. Null-ReferenceException if type instance is null.
2. InvalidCastException if boxed instance is the desired type 

Interesting Example:
```C#
public static void Main(){
    Point p;
    p.x = p.y = 1;
    Object o = p;

    p = (Point) o; // Unbox and copy

    p.x = 2;
    o = p //Box again and o refer to a new boxed instance
}
```

Boxing hurt the performance the most, unboxing is not that hurt since it's just copying. If you concerns the performance, you should avoid boxing and unboxing operations which are automatically generated by the compiler.  You can always check operations of IL by ILDasm.exe.

> Sometimes geting boxed is automatically proceeded when you call value type's non-virtual inherited method(such as GetType and MemberwiseClone), please see the book at page 133 for detailed info.

## Object Equality and Identity
Sometimes you need to put objects in a collection and you need to sort, search, or compare items in a collection. For this condition, you need to write your own Equals and GetHashCode methods.

Equals in System.Object:
```c#
public class Object{
    public virtual Boolean Equals(Object obj){
        if (this == obje) return true;
        return false;
    }
}
```

What Equals should look like:
```C#
public class Object{
    public virtual Boolean Equals(Object obj){
        if(obj == null) return false;
        if(this.GetType() != obj.GetType()) return false;
        return true;
    }
}
```
This behavior is identical to the previous one. (Self Tested already)

Internally, ValueType's Equals method uses reflection which is slow, so, you should override Equals.

For defining Equals for any type, there are rules to follow:
* Equals must be reflexive:
    x.Equals(x) must return true
* symmetic:
    x.Equals(y) must return the same value as y.Equals(x)
* transitive:
    if x.Equals(y) returns true and y.Equals(z) returns true,
    then x.Equals(z) must return true
* consistent: No changes made to two values the Equal result should be the same all the time



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