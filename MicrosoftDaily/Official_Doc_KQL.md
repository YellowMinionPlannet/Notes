# Azure Data Explorer
## Query Language
### Syntax conventions

|Convention|Description|Notes|
|-|-|-|
|**Block**|String literal to be entered exactly as shown|When you see **bold syntax**, the content is required and immutable|
|*Italic*|Parameters to be provided a value upon use of the funciton or command|The content is a parameter|
|[]|Denotes that the enclosed item is optional||
|()|Denotes that at least one of the enclosed items is required||
|\||Used within square or round brackets to denote that you may specify one of the items separated by the pipe character. In this form, the pipe is equivalent to the logical OR operator. When in a block (\|), the pipe is part of the KQL query syntax.|When used within [] it's an OR operator, if it's within (), it means required pipe \||
|[, ...]|Indicates that the preceding ***parameter*** can be repeated multiple times, separated by commas.||
|;|Query statement terminator.||

Example 1:

T | sort by *column* [asc | desc][nulls first | nulls last][, ...]

StormEvents | sort by State asc, StartTime desc

Example 2:

evaluate http_request (*Uri*[, *RequestHeaders*[, *Options*]])

- here, you need to provide options as parameter only if you provide requestheaders.

