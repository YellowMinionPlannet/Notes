# <u>Chapter 12: Generics</u>
CLR allows:
* Generic Reference Type/ Value Type
* Generic Interfaces / Delegates
* Generic Methods defined in Reference Type / Value Type / Interface

An example of Generic in FCL
```c#
[Serializable]
public class List<T> : IList<T>, ICollection<T>, IEnumerable<T>, IList, ICollection, IEnumerable{
    public List();
    public void Add(T item);
    public Int32 BinarySearch(T item);
    public void Clear();
    public Boolean Contains(T item);
    public Int32 IndexOf(T item);
    public Boolean Remove(T item);
    public void Sort();
    public void Sort(IComparer<T> comparer);
    public void Sort(Comparison<T> comparison);
    public T[] ToArray();

    public Int32 Count{get;}
    public T this[Int32 idex]{get;set;}
}
```

Here T is called type parameter, and you can use T as a data type in this List\<T\> type.
# Generics in the Framework Class Library

# Generics Infrastructure
## Open and Closed Types
When code reference a generic type CLR will create an internal *type object* for this type also(just like other normal type). However, if you do not specify all type arguments which declared by type parameters, it is an *open type*. Open type is not allowed to create instance with. However, if you specify all type arguments, it is considered a *closed type*. Closed type is allowed creating instance with.

When you use GetType() to get Generic Type Object's type you will see backtick(`) and number to show you how many does this generic type parameter requires.

Since every closed type has its own type object, List\<String\> and List\<DateTime\> have different type objects. So they do not share the same static field.

## Generic Types and Inheritance
Remember, type argument does not have effect of generic type's base type.
For example:
```C#
//Node<T> is derived from System.Object 
internal sealed class Node<T>{
    public T m_data;
    public Node<T> m_next;
    public Node(T data) : this(data, null){

    }
    public Node(T data, Node<T> next){
        m_data = data; 
        m_next = next;
    }
    public override String ToString(){
        return m_data.ToString() +
        ((m_next != null) ? m_next.ToString() : String.Empty);
    }
}

private static void Main(){
    Node<Char> head = new Node<Char>('C');
    head = new Node<Char>('B', head);
    head = new Node<Char>('A', head);
    Console.WriteLine(head.ToString()); // "ABC"
}
```
Example above, the generic type is derived from System.Object since it does not specify the base type in the declaration.

For Example:
```C#
internal class Node{
    protected Node m_next;

    public Node(Node next){
        m_next = next;
    }
}
//Node<T> is derived from System.Object 
internal sealed class TypedNode<T> : Node{
    public T m_data;
    
    public TypedNode(T data) : this(data, null){

    }
    public TypedNode(T data, Node<T> next) : base(next){
        m_data = data; 
    }
    public override String ToString(){
        return m_data.ToString() +
        ((m_next != null) ? m_next.ToString() : String.Empty);
    }
}

private static void Main(){
    Node head = new TypedNode<Char>('.');
    head = new TypedNode<DateTime>(DateTime.Now, head);
    head = new TypedNode<String>("Today is", head);
    Console.WriteLine(head.ToString()); // "Today is 2022-01-26."
}
```
Example above, the generic type is inherited from Node.

## Generic Type Identity
## Code Explosion

# Generic Interfaces
A reference or value type can implement a generic interface by specifying or unspecifying type arguments.

For example:
```c#
//Specifying
internal sealed class Triangle : IEnumerator<Point>{
    private Point[] m_vertices;
    public Point Current { get{...} }
}

//Unspecifying
internal sealed class ArrayEnumerator<T> : IEnumerator<T>{
    private T[] m_array;
    public T Current { get{...} }
}
```
# Generic Delegates
See Chapter 17

# Delegate and Interface Contra-variant and Covariant Generic Type Arguments

Generic Type Parameter can be Contravariant declared by *in* keyword and Covariant declared by *out* keyword.

Contravariant means type argument can change from a type to its children type.

Covariant means type argument can change from a type to one of its base type.
For example:
```C#
public delegate TResult Func<in T, out TResult>(T arg);

//if we have following delegate
Func<Object, ArgumentException> fn1 = null;
//Then we can do following without explicit cast, since String is derived from Object and Exception is base class of ArgumentException
Func<String, Exception> f2 = f1;
Exception e = fn2("");

// We have
public interface IEnumerable<out T> : System.Collections.IEnumerable{...}

//Therefore because String is drived from Object, Object is base type of String
Int32 Count(IEnumerable<Object> collection) {...}
Int32 c = Count(new[] {"Grant"});
```
# Generic methods
When we declare a generic class, struct, or interface, we can use that generic parameter for their method member's parameter type, return type, and local variables. At the same time, we can also declare a method member with its own generic parameter (which will make that method generic).

For example:
```C#
// T is the generic parameter of GenericType
internal sealed class GenericType<T>{
    private T m_value;
    public GenericType(T vlaue){m_value = value;}

    //TOutput is the generic paramter of method Converter, which makes converter a generic method
    public TOutput Converter<TOutput>(){
        TOutput result = (TOutput) Convert.ChangeType(m_value, typeof(TOutput));
        return result;
    }
}
```

## Generic methods and Type Inference
Compiler always match non-generic method first and then the generic method.
```c#
public static class SomeType{
    public static void Display(String s){
        Console.WriteLine(s);
    }
    public static void Display<T>(T o){
        //If we have o (instead of o.ToString())to the argument we will have infinite loop
        Display(o.ToString());
    }
}

Display("Jeff")// Calls to Display(String)
Display(123)   // Calls to Display<T>
Display<String>("Adian"); // Calls to Display<T>
```


# Generics and Other Members

# Verifiability and Constraints
Without constraint of generic type parameter, you can only do what Object do to the generic type parameter.
```C#
private static Boolean MethodTakingAnyType<T>(T o){
    T temp = o;
    Console.WriteLine(o.ToString());
    return temp.Equals(o);
}
```

With constraint you tell compiler that the generic type is specifically implement or derived from some interface or type.
```c#
public static T Min<T>(T o1, T o2) where T : IComparable<T>{
    if(o1.CompareTo(o2) < 0) return o1;
    return o2;
}
```

For overriding rules, here are the sample code.
```c#
// It is OK to define the following types:  
internal sealed class AType {}  
internal sealed class AType<T> {}  
internal sealed class AType<T1, T2> {}  // Error: conflicts with AType<T> that has no constraints  
internal sealed class AType<T> where T : IComparable<T> {}  // Error: conflicts with AType<T1, T2>  
internal sealed class AType<T3, T4> {}  internal sealed class AnotherType {     
    // It is OK to define the following methods:     
private static void M() {}     
private static void M<T>() {}     
private static void M<T1, T2>() {}     // Error: conflicts with M<T> that has no constraints    
private static void M<T>() where T : IComparable<T> {}     // Error: conflicts with M<T1, T2>     
private static void M<T3, T4>() {}  }
```
## Primary Constraints
A type parameter can specify 0 / 1 primary constraint. You cannot use
* System.Object
* System.Array
* System.Delegate
* System.MulticastDelegate
* System.ValueType
* System.Enum
* System.Void
There are 2 special primary constraint
1. class(Reference type)
2. struct(Value Type)

## Secondary Constraints
A type parameter can specify 0 / multiple secondary constraint where secondary constraint represents an interface type.
Sample of generic argument relationship declaration:
```C#
private static List<TBase> ConvertIList<T, TBase>(IList<T> list) where T : TBase 
{     
    List<TBase> baseList = new List<TBase>(list.Count);     
    for (Int32 index = 0; index < list.Count; index++) {        
        baseList.Add(list[index]);     
    }     
    return baseList;  
}

private static void CallingConvertIList() {     
    // Construct and initialize a List<String> (which implements IList<String>)     
    IList<String> ls = new List<String>();     
    ls.Add("A String");     
    // Convert the IList<String> to an IList<Object>     
    IList<Object> lo = ConvertIList<String, Object>(ls);     
    // Convert the IList<String> to an IList<IComparable>     
    IList<IComparable> lc = ConvertIList<String, IComparable>(ls);     
    // Convert the IList<String> to an IList<IComparable<String>>     
    IList<IComparable<String>> lcs =         
    ConvertIList<String, IComparable<String>>(ls);     
    // Convert the IList<String> to an IList<String>     
    IList<String> ls2 = ConvertIList<String, String>(ls);     
    // Convert the IList<String> to an IList<Exception>     
    IList<Exception> le = ConvertIList<String, Exception>(ls);// Error  
}
```
## Constructor Constraints
A type parameter can specify 0 / 1 constructor constraint. It must be non-abstract type with public and parameterless constructor. This constraint will require T has a public and parameterless constructor.
```C#
internal sealed class ConstructorConstraint<T> where T : new() 
{     
    public static T Factory() {        
        // Allowed because all value types implicitly         // have a public, parameterless constructor and because        
        // the constraint requires that any specified reference         
        // type also have a public, parameterless constructor        
        return new T();     
        }  
}
```
## Other Verifiability Issues
```c#
private static void ERRORANDWORK<T>(T obj){
    //ERROR
    Int32 x = (Int32) obj;
    String s = (String)obj;
    //WORK
    Int32 x = (Int32)(Object)obj;
    String s = (String)(Object) obj;

    //ERROR
    T temp = null;
    //WORK
    T temp = default(T);
}
```