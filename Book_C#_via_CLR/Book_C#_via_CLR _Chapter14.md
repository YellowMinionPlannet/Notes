# <u>Chapter 14: Chars, Strings, and Working with Text</u>
* In .NET Framework, char is 16-bit Unicode which can be expressed by two hex value. For example: `'\uA0AF'`. 
* The System.Char type offers two public read-only constant fields: MinValue`'\0'` and MaxValue `'\uffff'`
* You can call static GetUnicodeCategory method to get the category type of a char.
* You can also call:
    * IsDigit
    * IsLetter
    * IsWhiteSpace
    * IsUpper
    * IsLower
    * IsPunctuation
    * IsLetterOrDigit
    * IsControl
    * IsNumber
    * IsSeparator
    * IsSurrogate
    * IsLowSurrogate
    * IsHighSurrogate
    * IsSymbol
* ToLowerInvariant & ToUpperInvariant return Lower or Upper case of char with ignorance of culture info.
* For ToLower & ToUpper, you can call with culture info.
* You can call GetNumericVlaue to try to get numeric value of a char
For example:
```C#
public static class Program{
    public static void Main(){
        double d;
        d = Char.GetNumericValue('\u0033');//digit 3
        Console.WriteLine(d.ToString());//3

        d = Char.GetNumericValue('\u00bc');//1/4
        Console.WriteLine(d.ToString());//0.25

        d = Char.GetNumericValue('A');
        Console.WriteLine(d.ToString());//-1
    }
}
```

* About Casting
```C#
public static class Program{
    public static void Main(){
        Char c;
        Int32 n;

        c = (Char)65;
        Console.WriteLine(c);//A

        n = (Int32)c;
        Console.WriteLine(n);//65

        c = unchecked((Char)(65536 + 65));
        Console.WriteLine(c);//A

        c = Convert.ToChar(65);        
        Console.WriteLine(c);// Displays "A"        
        n = Convert.ToInt32(c);        
        Console.WriteLine(n);// Displays "65"         
        // This demonstrates Convert's range checking        
        try 
        {           
            c = Convert.ToChar(70000);// Too big for 16 bits           
            Console.WriteLine(c);// Doesn't execute        
        }catch (OverflowException) {           
            Console.WriteLine("Can't convert 70000 to a Char.");      
        }        
        // Convert number < > character using IConvertible        
        c = ((IConvertible) 65).ToChar(null);        
        Console.WriteLine(c);// Displays "A"        
        n = ((IConvertible) c).ToInt32(null);        
        Console.WriteLine(n);// Displays "65"  
    }
}
```

# The System.String Type
## Constructing Strings
## Strings Are Immutable
## Comparing Strings
## String Interning
## String Pooling
## Examining a String's Characters and Text Element
## Other String Operations

# Constructing a String Efficiently
## Constructing a StringBuilder Object
## StringBuilder Members

# Obtaining a String Representation of an Object: ToString
## Specific Formats and Cultures
## Formatting Multiple Objects into a Single String
## Providing Your Own Custom Formatter

# Parsing a String to Obtain an Oject: Parse
# Encodings: Converting Between Characters and Bytes
# Secure Stirngs