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

