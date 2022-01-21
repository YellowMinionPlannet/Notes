# <u>Chapter 9: Parameters</u>

# Optional and Named Arguments
* You can assign default values to some or all of parameters. When calling method, you can specify arguments by using anme of their parameters.

For example:
```C#
public static class Program{
    private static Int32 s_n = 0;
    private static void M(Int32 x = 9, String s = "A", DateTime dt = default(DateTime), Guid guid = new Guid())){
        Console.WriteLine("x={0}, s={1}, dt={2}, guid={3}", x, s, dt, guid);
    }
    public static void Main(){
        M();
        M(8, "X");
        M(s:(s_n++).ToString(), x: s_n++);//x=1 s=0 dt=1/1/0001 guid=00000000-0000-0000-0000-000000000000
    }
}
```

## Rules and Guidelines
* You can do default value of parameters in:
    * methods
    * constructor methods
    * parameterful properties(indexers)
    * delegate definition

* You can only specify default valued parameter after normal parameters
* Default value should be constant values(primitive types, enumerted types) and reference type must be null
* Do not rename parameter name, if you do so, all codes reference such parameter's method needs to rename also
* Cannot set default value for ref and out keyworded parameter
* Named arguments must always appear at the end of arguments list
* Named arguments for ref / out parameter, please see the example below:

```c#
private static void M(ref Int32 x){...}

Int32 x = 5;
M(x: ref a);
```
## The DefaultParameterValue and Optional Attributes

# Implicitly Typed Local Variables

# Passing Parameters by Reference to a Method



# Passing a variable Number of Arguments to a Method
# Parameter and Return Type Guidelines
# Const-ness