[ORIGINAL_MATERIALS](https://experienceleague.adobe.com/en/docs/experience-manager-65/content/security/security)

# Security
## User Administration and Security

### Users and Groups in AEM
#### Users
Users has:
- unique account
- each account holds accounts details + assigned privileges
#### Groups
Group could be a collection of users, or, a collection of other groups.

Examples of roles:
1. to classify who is contributor and who is content browser
2. to grant access to different group of contributors to corresponding branch of content.

#### Built-in Users and Groups
//TODO:content table

## Permissions in AEM
AEM uses ACL to determine:
1. what action a user/group can perform
2. where that action can perform
### Actions
|Action|Description|
|--|--|
|Read|Allow to read the page and child pages|
|Modify|* modify existing content on the page and on the child pages * create paragraphs on the page |
|Create|* if modify is denied, user can only create a jcr:content node, but cannot modify subtree under it|
|Delete|* if modify is denied, user can only remove jcr:content node, but not subtree|
|Read ACL|The user can read the access control list of the page or child pages.|
|Edit ACL|The user can modify the access control list of the page or any child pages.|
|Replicate|The user can replicate content to another environment (for example, the Publish environment). The privilege is also applied to any child pages.|

### ACL and how they are evaluated
