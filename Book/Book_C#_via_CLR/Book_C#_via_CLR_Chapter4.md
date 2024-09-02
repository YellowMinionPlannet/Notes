# <u>Chapter 4: Type Fundamental</u>

# All Types Are Derived from System.Object

```c#
Employee e = new Employee("Lei");
```

Code above does following things:

1. CLR calculates all required bytes(including Employee and System.Object). Every object on the heap requires some additional members - type object pinter and the sync block index
2. Alocate bytes and set them to zeros
3. Initialize object's type object pointer and sync block index
4. Instance constructor is called. Initializes instance fields, and call base constructor. Untill System.Object's constructor is called which does nothing but returen.

# Casting Between Types
There's no way to override GetType, 'cause it's nonvirtual. Which means you always get object's correct type using this method

```c#
//No cast needed since new returns an Employee object and its base type is System.Object
Object o = new Employee();
//Cast is required since Employee is drived from Object
Empoyee e = (Employee)o;
```
Code display following rules:
* Without special syntax, developer can cast object to 
1. its own type
2. its base type

* With specific syntax, developer can cast object to its derived type.

More examples of casting:
```c#
internal class Employee{
}
internal class Manager : Employee{
}
public sealed class Program{
    public static void Main(){
        Manager m = new Manager();
        DateTime newYears = new DateTime(2013, 1, 1);
        PromoteEmployee(newYears);//Willl throw InvalidCastException
    }
    public static void PromoteEmployee(Object o){
        Employee e = (Employee)o;
    }
}
```

## Casting with the C# is and as Operators
* ***is*** operator never throws exceptions
* ***is*** operator returns false if reference is null

For example:
```c#
Object o = new Object();
Employee e = new Employee();
Console.WriteLine(o is Object);//true
Console.WriteLine(o is Employee);//false
Console.WriteLine(e is Object);//true

if(o is Employee){
    Employee result  = (Employee)o;
}
```

* ***as*** operator never throws exceptions
* ***as*** operator returns null if cast is failed

For example: 
```c#
Employee e = o as Employee;
if(e != null){
    //Do Something
}
```
# Namespaces and Assemblies

# How Things Relate at Run Time
* Stack is in Thread
* Heap is in CLR
* What's in stack:
    * Local variables in method
    * Method argument
    * Method return pointer

* What's in heap:
    * Type Object:
        * Type object pointer
        * sync block index
        * Static field
        * Methods:
            * non-virtual
            * virtual
            * static
    * Object(instance)
        * Type object pointer
        * sync block index
        * instance fields
```c#
internal class Employee {     
    public         Int32     GetYearsEmployed()   { ... }     
    public virtual String    GetProgressReport()  { ... }     
    public static  Employee  Lookup(String name)  { ... }  
}  
internal sealed class Manager : Employee {     
    public override String   GetProgressReport()  { ... }  
}
```

![CSharp_via_CLR_Chapter4_1.png](CSharp_via_CLR_Chapter4_1.png?raw=true)

