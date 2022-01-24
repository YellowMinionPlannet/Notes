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
When you give a default value to a parameter, compiler applies System.Runtime.InterropServices.DefaultParameterValueAttribute and System.Runtime.InteropServices.OptionalAttribute to the parameter. The default value is constant stored in meta data and witten to the source code.
# Implicitly Typed Local Variables
Compiler will infer the type of *var* variable and you cannot use *var* for parameters.
# Passing Parameters by Reference to a Method
For the CLR, *ref* and *out* is the same thing - instead of passing the value of arguments, now passing the referenece. The difference is, for *ref*, the collee can read and write the argument since the caller already initialized the argument. 


# Passing a variable Number of Arguments to a Method
We can use *params* infront of the parameter to indicate there's variable number of arguments. And in the caller we assign arguments using commas intead of the array.
For example:
```c#
static Int32 Add(params Int32[] values){
    Int32 sum = 0;
    if(values != null){
        for(Int32 x = 0; x < values.Length; x ++>){
            sum += values[x];
        }
    }
    return sum;
}
//In the caller, without params we do
public static void Main(){
    Add(new Int32[]{1,2,3,4,5});
}
//With params, we can do
public static void Main(){
    Add(1,2,3,4,5);
}
```
In the CLR, it will apply System.ParamArrayAttribute to the parameter. When compiler detects a call to a method, it checks the methods without PramamArray attribute, if cannot find out matched ones. If not existed, then Compiler will look for the methods with ParamArray attribute and executes the matched one.
# Parameter and Return Type Guidelines
When design methods, it is the best to assign weak(more general) type to the parameter and strong(more specific) type to the return type. There's one exception, when you want to return a collection, it is better to return weak type.
# Const-ness
C# does not supports Const on the parameter.