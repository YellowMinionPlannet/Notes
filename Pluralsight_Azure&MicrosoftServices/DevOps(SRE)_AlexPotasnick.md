# 2: Analyzing Metrics
## Big Picture: What is Site Reliability Engineering (SRE)
Q: What Is Reliability?

A: The application can be used when and how it is expected to

- Availability
- Performance
- Latency
- Security

Difference between SRE and Developers:

|SRE|Developers|
|-|-|
|Focus on feedback and observing on the production side|Focus on errors and observing on the code(development stage) side|
|Need to embrace risk to improve performance|Need to avoid errors as much as possible|

## Exploring Metric Charts and Dashboards

### Azure Monitor
a central location to gather information from your application, infrastructure, and Azure resources

|Metrics|Logs|
|-|-|
|Data that measure how the system is performing at a certain time|Messages about certain events in a system|

### Monitor Metrics
- Visualize metrics in dashboard
- Analyze
- Alert, inform you when threshold is met
- Automation

Go to `portal.azure.com`, Monitor and Metrics.

## Implementing Application Health Checks

### Application Insights, a feature in monitor 

#### URL Ping Test
a feature that is able to send http request to a specific URL to test availability.

it will tell you the request duration and success rate.

#### Dependent Request
Test availability of images, sripts, or style files

What else you can do:
- Enable retrys
- Test frequency
- Configure test locations(where to send test requests)
- Create alerts

### Demo
Monitor => Insights => Applications => Investigate => Availability => Add test

## Exploring System Load and Failure Conditions

### What is Failure Mode Analysis?


- Fault point: place in the architecture that can fail
- Fault mode: pattern of that failure

- Assess Rate Risk and Severity: is there data loss?

- Determine response: what should be done for such failure?

### How to Plan for Failure
- Understand how the application works
- Criticality of this application
- Is there dependency of this application

### How can we reduce failure
- Fault domain (different rack)
- Zones (different availability zones)
- Cross-region 
- Scaling on the instances

### Performance Testing
1. Load Testing, normal/heavy load
2. Stress Testing, overload system
3. Spikes

## Discovering Application Insights Smart Detection and Dynamic Thresholds

Q: Why we use this feature?

A: Because as the time flows, the defined baseline metrics might updates too.

- Dynamic Thresholds, use ML to decide how to update the baseline metrics

- Application Insights Smart Detection, use ML to detect anomalies.

Smart Detection Categories:
- Failure, send alert real time, after meets min data amount and 24 hours
- Performance, send alert everyday, after meets min data and 8 days

## Deciding Which Dependencies to Set Alerts On

Application Insights => Application Map

# 3 Designing and Implementing a Source Control Strategy

## Submodules

Importing a external git repo as submodule, the key file is `.gitmodules`. You will not have the actual code of that submoduled repo until you `git submodule add` and `git submodule init` `git submodule update`

## Discovering Scalar
- Scalar, help to maintain a large git repo, when it becomes so big.
  - reduce data transfer
  - Reduce command runtime

Use:
  - `scalar clone` to create a repo
  - `scalar register` to register a existing repo

## Incorporating Changelogs

`git log`

`git log --oneline`
`git log --pretty="- %s"`

### Automation Options
- GitHub Changelog Generator
- Auto Changelog
#### IDE Plugins
- Visual Studio changelog plugin
#### Pipeline Plugins
- Jenkins Changelog plugin

**To see full log of git**

`git log --pretty=fuller`
`git reflog`

# 4 Planning and Implementing Branching Strategies for the Source Code

## Configuring Branches

- Branch Policies, initial safeguards
  - Require approval from a number of reviewer on PR
  - Linked Work Items for traceability
  - Check for Comment All resolved
  - Limit merge Types???

- Branch Restrictions, Advanced safeguards
  - Build Validation
  - Status Checks, Other services status check
  - Designate code reviewers to be included automatically, also called Manual Approval
  - Restrict Who can Push to the Branch

- Branch Protections, Minimize catastrophic actions
  - Prevent Deletion
  - Prevent overwriting, borbid **force push**

## Descovering Branch Strategies

So correcty Branching Strategy will help you to:

- Optimize productivity
- Enable Parallel Development
- Plan sets of structured releases
- Prepare path for CICD, especially for production deployment
- Tackle delivered changes quickly
- Support multi-version software and patches.

### Types of Branching Strategy

1. Trunk-Based

  Bug fix, feature updates, all into `main` branch

2. Feature(Task), Branch per story

  `development` Branch created, and each feature, bug fixes are created in a new branch, and merged into `development`, and finally, into `main` branch for release.

2. Feature Flag
  
  Use flags to flag which feature branch is enabled and which one is disabled when release.

3. Release, All applicable user stories

  Create a `release x.x.x` version branch for each version of release, and above that release branch, create a `development` branch and feature branches.

  This critical when creating some customized branch for specific customer.

## Understanding the PR workflow

## Configuring Repositories

### Use Git Tags to Organize Your Repository

Tags are substitue name for a commit.

There are 2 types of tags:

1. Lightweight, No notes, just tag name, simply a pointer to a specific commit
`git tag v1.2`

2. Annotated, Attatch a note on the tag, stores the tagged commmit as full object in Git Database.
`git tag -a 1.2 -m "Updated html template"`

Web portal only can creeate Anotated tag

Need to push tag seperately into remote repo `git push origin v1.2`

But first you need a branch and newly created commit.

## Handling Large Repository

- When Large Files are updated git keeps copies of versions of those large files. So you want to avoid that to happen. Because when you clone or pull, the copies would slow down the process.

- However some necessary large files are designated to be in repo. You need LFS for this special condition.

- There is a command to clear git garbage collection.
`git gc --aggressive`

`git --prune=<date>`

`git --no-prune` , do not delete loose object.

## Exploring Repository Permissions

Branch Permissions are default inherited by the Organization and Project Permission.

- Branch Lock can make a branch into "read-only" condition. It can prevent changes when Pull Request being reviewed. Project Admin has that Authority.

## Removing Repository Data

Q: Why we need it?
A: Because we maybe commit sensitive data into git, and even we revert the change and commit again, the committed content still prevails. So in order to remove those thing, we need to manipulate the history of Git.

2 scenarios:

|Local but not on remote|Pushed to remote|
|-|-|
| <li>"bad" commit on local, not yet pushed to remote</li><li>Remove/amend bad local commit</li>|<li>"bad" commit pushed to remote</li><li>delete remote commit</li><li>delete history through caveat</li>|

### Removing/Amending Local Commit Before Push
- Delete Unwanted File
- Remove file from Git tree/index `git rm --cached <filename>`
- Delete or amend previous commit,
  - To delete the whole commit `git reset HEAD^`
  - To keep other file in commit `git commit --amend -m "comment"`

### Removing Commit that pushed to Remote Repo

- Reset back to last "good" commit `git reset --hard #commitSHA`
- Force push to remove commits past the last good one. `git push --force`
- All branch commits past the reset one will be deleted.

## Recovering Repository Data
Q: Why we need this?
A: When we accidentally deleted branch or repository, we need to recover them.

### Deleted Repository

To restore an deleted repo:

```http
PATCH
https://dev.azure.com/{organization}/{project}/_apis/git/recycleBin/repositories/{repositoryId}?api-version=6.0-preview.1
```
### Deleted Branch

