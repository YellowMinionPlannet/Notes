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


# Delegate and Interface Contra-variant and Covariant Generic Type Arguments
# Generic methods
## Generic methods and Type Interface
# Generics and Other Members
# Verifiability and Constraints
## Primary Constraints
## Secondary Constraints
## Constructor Constraints
## Other Verifiability Issues