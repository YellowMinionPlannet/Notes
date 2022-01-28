# <u>Chapter 13: Interfaces</u>
# Class and Interface Inheritance
# Defining an Interface

Interface is a named set of method signiture. So it can define events, parameterless properties, and parameterful properties(because these are methods anyway). But interface cannot define any constructor methods or instance fields.

# Inheriting an Interface
To inherit an interface, you need to implement the all methods defined in interface. All methods include the implemented interface methods and also the base interface method of that implemented interface.
```c#
public interface IComparable<in T>{
    Int32 CompareTo(T other);
}

public sealed class Point: IComparable<Point>{
    private Int32 m_x, m_y;
    public Point(Int32 x, Int32 y){
        m_x = x;
        m_y = y;
    }
    public Int32 CompareTo(Point other){
        return Math.Sign(Math.Sqrt(m_x * m_x + m_y * m_y) - Math.Sqrt(other.m_x * other.m_x + other.m_y * other.m_y));
    }
    public override String ToString(){
        return String.Format("{0}, {1}", m_x, m_y);
    }
}
```
Compiler requires method that implements interface method to be marked public. CLR requires interface method to be marked virtual. If you explicitly mark virtual for interface method, it's virtual and unsealed. If you do not do that, it's virtual and sealed.

Calling interface method is tricky. It's the associated object's type's method being called.

```c#
// This class is derived from Object and it implements IDisposable  
internal class Base : IDisposable {     
    // This method is implicitly sealed and cannot be overridden     
    public void Dispose() {        
        Console.WriteLine("Base's Dispose");     
    }  
}  
// This class is derived from Base and it re implements IDisposable  
internal class Derived : Base, IDisposable {     
    // This method cannot override Base's Dispose. 'new' is used to indicate      
    // that this method re implements IDisposable's Dispose method     
    new public void Dispose() {        Console.WriteLine("Derived's Dispose");        
    // NOTE: The next line shows how to call a base class's implementation (if desired)        
    // base.Dispose();     
    }  
}
public static class Program {     
    public static void Main() {        /************************* First Example *************************/        
    Base b = new Base();        // Calls Dispose by using b's type: "Base's Dispose"        
    b.Dispose();        // Calls Dispose by using b's object's type: "Base's Dispose"        
    ((IDisposable)b).Dispose();        /************************* Second Example ************************/        
    Derived d = new Derived();        // Calls Dispose by using d's type: "Derived's Dispose"        
    d.Dispose();        // Calls Dispose by using d's object's type: "Derived's Dispose"        
    ((IDisposable)d).Dispose();  
    /************************* Third Example *************************/        
    b = new Derived();        // Calls Dispose by using b's type: "Base's Dispose"        
    b.Dispose();        // Calls Dispose by using b's object's type: "Derived's Dispose"        
    ((IDisposable)b).Dispose();     
    }  
}  
```
# More About Calling Interface Methods
We have several rules for calling interface variable's method. For example:
```C#
String s = "Jeffrey";
//Sinsce String type implements all the interfaces below, you can do the following
ICloneable cloeable = s;

IComparable comparable = s;

IEnumerable enumerable  = (IEnumerable) comparable;
```

If s is value type, it must be boxed before cast into interface type variable.
# Implicit and Explicit Interface Method Implementations

Interface method could be implicit if instance method has same signature to it. You can also explicitly declare interface method in your type, which is called EIMI.

```C#
internal sealed class SimpleType : Idisposable{
    public void Dispose(){
        Console.WriteLine("public Dispose");
    }
    void IDisposable.Dispose(){
        Console.WriteLine("IDisposable Dispose");
    }
}
```
IDisposable.Dispose is the EIMI and must be private and non-virtual.

# Generic Interface
If you implement interface, you'd better implement the generic one, which will provides you type safty and avoid boxing.
# Generics and Interface Constraint
If you have interface constraint on type parameter, that type parameter should implement all of the interfaces mentioned in that constraint.

```c#
//T must implement IComparable and IConvertible
private static Int32 M<T>(T t) where T : IComparable, IConvertible{

}
```
# Implementing Multiple Interfaces That Have the Same Method Name and Signature
# Improving Compile-Time Type Safety with Explicit Interface Method Implementations
# Becareful with Explicit Interface Method Implementation
# Design: Base Class or Interface?