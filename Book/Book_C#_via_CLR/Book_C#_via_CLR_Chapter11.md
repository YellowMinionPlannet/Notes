# <u>Chpater 11: Events</u>
# Designing a Type That Exposes an Event

Event is the last type member in type. You can raise an event to notice any object who has callback methods registered in that event.

## Step #1: Define a type that will hold any additional information that should be sent to receivers of the event notification
If you want to pass additional information when event is raised to the subscribed objects, you need to encapsulates these info into a class which is derrived from System.EventArgs

```c#
internal class NewMailEventArgs : EventArgs{
    private readonly String m_from, m_to, m_subject;
    public NewMailEventArgs(String from, String to, String subject){
        m_from = from;
        m_to = to;
        m_subject = subject;
    }
    public String From {get{return m_from;}}
    public String To {get{return m_to;}}
    public String Subject{get{return m_subject;}}
}
```
When you need to pass a EventArgs without any additional info, you should use `EvnetArgs.Empty` rather than constructing a new EventArgs object. Because of this:
```c#
public class EventArgs{
    public static readonly EventArgs Empty = new EvnetArgs();
    public EventArgs(){

    }
}
```

## Step #2: Define the event member

We need to declare an event member and it consists:
1. event keyword
2. delegate type name
3. name for event itself

For example:
```c#
internal class MailManager{
    public event EvnetHandler<NewMailEventArgs> NewMail;
}
```
Where EventHandler is a predefined delegate type in C#.
```c#
public delegate void EventHandler<TEventArgs>(Object sender, TEventArgs e);
```


## Step #3: Define a method responsible for raising the event to notify registered objects that the event has occured
```c#
internal class MailManager{
    protected virtual void OnNewMail(NewMailEventArgs e){
        //Volatile.Read is similar as lock keyword but a lock between multi-core processor
        EventHandler<NewMailEventArgs> temp = Volatile.Read(ref NewMail);

        if(temp != null) temp(this,e);
    }
}
```
Once NewMail(this, e) is called all registered methods will be called

## Step #4: Define a method that translates the input into the desired event

Now we need to call OnNewMail for each time mail is arrived
```C#
internal class MailManager{
    //When new mail comes call this method
    public void SimulateNewMail(String from, String to, String subject){
        NewMailEventArgs e = new NewMailEventArgs(from, to, subject);

        OnNewMail(e);
    }
}
```
# How the Compiler implements an Event
# Designing a Type that Listens for an Event

```c#
internal sealed class Fax{
    public Fax(MailManager mm){
        mm.NewMail += FaxMsg;
    }

    private void FaxMsg(Object sender, NewMailEventArgs e){
        Console.Writeline("Faxing mail message:");
    }

    public void Unregister(MailManager mm){
        mm.NewMail -= FaxMsg;
    }
}
```

# Explicitly Implementing an Event
Skipped but very valuable knowledge to know about.

