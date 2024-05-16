# 3 Variables, Data Types, and Math Operators
## Primitive Data Types
There are 4 major primitive data types:
1. integer
    - byte, 8bits, -128~127
    - short, 16bits, -32768~32767
    - int, 32bits, -2147483648~2147483647
    - long, 64bits, -9223372036854775808~9223372036854775807
        - eg. `long milesInALightYear = 5879000000000L;`
2. floating point
    - float, 32bits, 1.4\*10<sup>-45</sup>~3.4\*10<sup>38</sup>
        - eg. `float kilometersInAMarathon = 42.195f`
    - double, 64bits, 4.9\*10<sup>-324</sup>~1.7\*10<sup>308</sup>
        - eg. `double atomWidthInMeters = 0.0000000001d;`
3. character
    - single Unicode character
        - eg. 
        ```java
            char regularU = 'U'; 
            char accetedU = '\u00DA';
        ```
4. boolean
    - eg. `boolean iLoveJava = true;`

## Primitive Types and Treat as Values
### Compound operators
`+=`, `-=` etc.

## Type Conversion
```java
public static void main(String[] args){
    float floatVal = 1.0f;
    double doubleVal = 4.0d;
    byte byteVal = 7;
    short shortVal = 7;
    long longVal = 5;

    short result1 = (short) longVal;
    short result2 = (short)(byteVal - longVal); //byteVal - longVal gives us long type
    float result3 = longVal - floatVal; //
}
```
## Inferring Variable Type
- by using keyword `var`

# 6 Understanding Methods
## Clarify 2 group of definition
1. Function vs. Methods
method is related to an instance. function is just block of reusable code.
2. Parameter vs. Arguments
parameter is part of definition of function/method.
argument is the actual values passed to the function/method.

## Parameter Passing Behavior
In java, parameter passed "by values". which meanse they don't pass reference, but copy of the original value. Even some of the parameter is referenced type, they copied the value of reference.

# 7 Working with Strings
## String is immutable
```java
String s1 = "I love";
s1 = s1 + " Java"; // now we initiate a new string value and save the new reference into s1
```
## Comparison of Strings
```java
String s1 = "I love";
String s2 = "I love";
s1 = s1 + " Java";
s2 = s2 + " Java";
if(s1 == s2){
  // never execute, because '==' sign compares the reference value of s1 and s2
}
if(s1.equals(s2)){
  // Execute, 'cause String.equals compares the actual value of String
}
```
So we can imagine that `String.equals` method will compare each of the character from two strings, which is very unefficient.

The workarround is compare through `String.intern()`method.
```java
String s3 = s1.intern();
String s4 = s2.intern();
if(s3 == s4){
  //Executes because s3 s4 is the same reference.
}
```
## String Methods and String Conversions

