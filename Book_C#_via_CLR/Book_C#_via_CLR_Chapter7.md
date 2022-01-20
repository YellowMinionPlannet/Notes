# <u>Chapter 7: Constants and Fields</u>
# Constants
* When mark a field as **constant**, its value must be determined at compile time. The compiler saves the constant's value in the assembly's metadata. 

* So the constants are always primitive types.(Boolean, Char, Byte, SByte, Int16, UInt16, Int32, UInt32, Int64, UInt64, Single, Double, Decimal, and String).

* You can define a non-primitive type if you set value to **null**.

* Because constants are embeded in code, they do not take memo.

* So use constant cautiously, because if you embeded in code, re-compile the referenced assembly which has constants in it, would not affect referer assembly. Unless you recompile the referer assembly too.

# Fields
Fields is data member holds an instance of a value type or a reference to a reference type.

Field Modifiers:
|CLR Term|C# Term|Description|
|--|--|--|
|Static|static|The field is part of the type's state, as opposed to being part of an instance's state|
|Instance|(default)|The field is associated with an instance of the type, not the type itself.|
|InitOnly|readonly|The field can be written to only by code contained in a constructor method|
|Volatile|volatile|Code that accesses the field is not subject to some thread-unsafe optimizations that may be performed by the compiler, the CLR, or by hardware.Only the following types can be marked volatile : all reference types, Single , Boolean , Byte , SByte , Int16 , UInt16 , Int32 , UInt32 , Char , and all enumerated types with an underlying type of Byte , SByte , Int16 , UInt16 , Int32 , or UInt32.|

**readonly** is defined to fields that are only allowed written in constructor. (although reflection can modify readonly field too)

C# treats initializing a field inline as shorthand syntax for initializing the field in a constructor.
For example:
```C#
public sealed class SomeType{
    //inline init static readonly field
    //initialized when class is first init at run time
    public static readonly Random s_random = new Random();
    //inline init static read/write field
    private static Int32 s_numberOfWrites = 0;
    //inline init instance readonly field
    public readonly String Pathname = "Untitled";

    private System.IO.FileStream m_fs;

    public SomeType(String pathname){
        this.Pathname = pathname;
    }

    public String DoSomething(){
        //change static read/write field
        s_numberOfWrites = s_numberOfWrites + 1;

        return Pathname;
    }
}
```

When a field is reference type and is readonly, the immutable part is only the reference but not the instance itself.
For example:
```C#
public sealed class AType{
    public static readonly Char[] InvalidChars = new Char[] {'A', 'B', 'C'};
}

public sealed class AnotherType{
    public static void M(){
        AType.InvalidChars[0] = 'X';
        //next line won't compile
        AType.InvalidChars = new Char[] {'X', 'Y', 'Z'};
    }
}
```