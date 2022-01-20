# <u>Chapter 8 Methods</u>
# Instance Constructors and Classes(Reference Types)

* When createing an instance of a reference type, memory is allocated for the instance's data fields, the object's overhead fields are initialized(type object pointer, sync block index), and then type's instance constructor is called to set the initial state of Object
* Instance constructor are never inherited since it never has modifiers such as virtual, new, override, sealed, or abstract
* If you do not define any explicit constructor, Compiler will define a default constructor which calls base class's parameterless constructor.
* If the class is abstract, Compiler-produced default constructor has protected accessibility. Otherwise, public.
* If the base class does not have parameterless constructor, Compiler raises error.
* If the class is static, no Compiler-produced constructor at all.
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
* Structure Can not have parameterless constructor defined
* Can not do inline filed initialization in a Value Type
* Parameter constructor should intitialize all fields or compiler will produce error, or, you can do following example to make sure all fields are initialized
```C#
internal struct SomeValType{
    private Int32 m_x, m_y;
    public SomeValType(Int32 x){
        this = new SomValType();
        m_x = x;
    }
}
```

# Type Constructors
* Like instance constructor, type constructor is for initializing state of type
* you can only have one parameterless type constructor.
* Value Type could have one parameterless type constructor explicitly defined, you never do this, 'cause it is not gonna get called
* Type constructor is automaticaly(implicitly) private.
* Type constructor only get called once per AppDomain. To ensure this, there would be a lock when a thread calls type constructor. Therefore, type constructor is thread-safe and great place to init singleton object.
* If type constructor inside throw an unhandled exception, that type is unusable. Access to that type's member will cause System.TypeInitializationException
* Value type can have static field for inline initialization
* Since static fields are shared/inherited from base base type, type constructor does not call base type constructor.
* static finalize method is not supported, but you can do something in System.AppDomain callback DomainUnload to achieve the same behavior(do something when type is unload which means AppDomain should has been unloaded)

```c#
internal sealed class SomeType{
    private static Int32 s_x = 5;
}
//Up and down are equivalent
internal sealed class SomeType{
    private static Int32 s_x;
    static SomeType(){ s_x = 5;}
}
```

# Operator Overload Methods
* Operator only happens in compile time
* When you compile code, compiler produces method that identifies the behavior of the operator.
* Operator Overload must be public and static
For example: 
```C#
public sealed class Complex{
    public static Complex operator+(Complex c1, Complex c2){...}
}
```
When compiler sees +, it finds the corresponding method in generated code which parameters have the same type. For more detail, please see book at page 193-194.

# Conversion Operator methods

# Extension Methods

# Partial Methods