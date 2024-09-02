# <u>Chapter 10: Properties</u>
There are two types of properties
1. properties
2. indexers

Indexers are just properties with parameters.

# Parameterless Properties
People can easily alter type state by changing the value of fields.
```c#
public sealed class Employee{
    public String Name;
    public Int32 Age;
}

Employee e = new Employee();
e.Name = "Jeffrey Richter";
e.Age = 48;

Console.WriteLine(e.Name);
```

But such action is against Data Encapsulation concept of OOP. To avoid this, we should wrap the accessor of field and make fields private. But that would cause use of a type need to call methods to access fields. Finally, we have properties to solve all of these.

For example:
```C#
public sealed class Employee{
    private String m_Name;
    private Int32 m_Age;

    public String Name{
        get{return (m_Name);}
        set{m_Name = value;}
    }
    public Int32 Age{
        get{return(m_Age);}
        set{
            if(value < 0)
                throw new ArgumentOutOfRangeException("value", value.ToString());
            m_Age = value;
        }
    }
}

e.Name = "Jeffrey Richter";
String EmployeeName = e.Name;
e.Age = 48;
e.Age = -5;
Int32 EmployeeAge = e.Age;
```

When you define a property, CLR emit following:
1. A method representing the property's get accessor method, only when you define a *get* accessor
2. A method representing the property's *set* accessor method, only when you define *set* accessor
3. A property definition in the managed assembly's metadata.

for example: for the last example, CLR emits
```c#
public sealed class Employee{
    private String m_Name;
    private Int32 m_Age;
    public String get_Name(){
        return m_Name;
    }
    public void set_Name(String value){
        m_Name = value;
    }
    public Int32 get_Age(){
        return m_Age;
    }
    public void set_Age(Int32 value){
        if(value < 0){
            throw new ArgumentOutOfRangeException("value", value.ToString());
        }
        m_Age = value;
    }
}
```
## Automatically Implemented Properties
If there's no "extra" logic in get and set accessor, you can define like this:
```C#
public sealed class Employee{
    public String Name {get;set;}
    private Int32 m_Age;
    public Int32 Age{
        get{return m_Age;}
        set{
            if(value < 0){
                throw new ArgumentOutOfRangeException("value", value.ToString())
            }
            m_Age = value;
        }
    }
}
```

# Parameterful Properties(indexer)
Skipped