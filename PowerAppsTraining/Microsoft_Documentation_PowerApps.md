# Canvas apps

## Design and build an app

### Configure app functionality

#### Understand variables

- Avoid using variables since you can get inputs values from formulas
- You can use variables in three different ways:
  - Global variables
  - Context Variables
  - Collections

| Variables type    | Scope  | Description                                                                                                                                                                                | Functions that establish |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| Global Variables  | App    | Simplest to use. Holds a number, string, Boolean, record table etc. that can be referenced from anywhere in the app                                                                        | Set                      |
| Context variables | Screen | Great for passing values to a screen, much like parameters to a procedure in other languages. Can be referenced from only one screen                                                       | UpdateContext Navigate   |
| Collections       | App    | Holds a table that can be referenced from anywhere in the app. Allows the contents of the table to be modified rather being set as a whole. Can be saved to the local device for later use | Collect ClearCollect     |

- Create and remove variables

  - Create - By define corresponding functions in the apps.
  - Remove - By deleting all the corresponding function and dependents on those variables.

- Variable lifetime and initial value.

  - lifetime - live in local app's memo
  - init - blank value when app is opened

- Global variables

  - `Set(Radius, 12)` - u can set global variables with set function
  - `Pi() * Power(Radius, 2)` - u can use Radius anywhere in the app

If context variables' name collide with global variables, context variables has priority. But user can always refer to global variables with `@Radius`

- Use a context variables

  - `UpdateContext({X : 1})` - to set data
  - `Navigate(Screen1, None, {Running Total: -1000})` - to jump to new screen and set Running Total context variable to -1000.

- Use a collection

  - `Clear(PaperTape); LoadData(PaperTable, "StoredPaperTape", true)`- if you don't clear, stored values in StoredPaperTape will be append to the end of collection of PaperTape
  - `SaveData(PaperTape, "StoredPaperTape")` - save to local device

  _These two function only available in Mobile._
