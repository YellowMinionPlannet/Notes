[Source_Doc](https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops)

# pipeline run sequence
1. Expands templates and evaluate template expressions
2. Evaluates dependencies at the stage-level, and pick the first stage
3. Each stage:
    1. Gathers and validates all job resources for authorization to run
    2. Evaluates dependencies at job-level, and pick the first job
    3. Each Job:
        1. Expands YAML `strategy: matrix`/`strategy: parallel`
        2. Evaluates conditions to decide whether the job is eligible to run
        3. Requests an agent for each job
        4. Preparation: download task and create spaces for job
        5. Run job
        6. Each steps:
            1. Executed in sequence
            2. each task will route inputs and outputs, alert system path, create new variable
            3. each step has isolated enviroments

We can use following syntax to create variable that might be used in other step:
```bash
echo '##vso[task.setVariable variable=myVariable]myValue'
```

```bash
echo $(myVariable)
```


Parameters can be used before running each job, however, variables only lives in job running. So we can not use variables in authorization process.

Piepline-level variable might be an exception.

A job always reflect the worst condition of its steps:
- if one step fails, the job fails

# Pipeline default branch

By default, pipeline's default branch is the default branch of the repository.

First make sure your pipeline yml file is validated, and click triggers from the pipeline edit mode to view triggers of the current pipeline. 

The default branch is displayed in YAML tab and Get sources item.

# Clone or import a pipeline

YAML Pipeline
- Copy current yml file and put it into your new repository, or select existing yml file when create your pipeline

# Manage pipelines with Azure CLI

[This is optional, please see this link](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/manage-pipelines-with-azure-cli?view=azure-devops)

# Configure pipeline to support work tracking

1. report pipeline status
2. copy the syntax for status badges
    - it's able to copy a Markdown snippet and use it in wiki page, and that snippet will be rendered as a image, and will be updated when pipeline status changes
3. setup automatic linking of work items to build and releases

There are several settings to make these things work, [visit here for more info](https://learn.microsoft.com/en-us/azure/devops/pipelines/integrations/configure-pipelines-work-tracking?view=azure-devops&tabs=yaml).

# Repositories

YAML Pipeline only not supporting Azure Repos TFVC and Subversion

## Azure Repos Git

Create a pipeline by selecting repository and a YAML file in that repo, the repo contains the YAML file is the `self` repos to the YAML file.

You can also checkout multiple repos.

If you need to access repos from different project, you need [Job Access Token](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens?view=azure-devops&tabs=yaml).


By default, YAML pipeline is configured with a CI trigger on all branches. If you turn on the Disable implied YAML CI trigger at project or organization level, unless you have a `trigger` section in YAML file, CI trigger will not be enabled.

```yaml
trigger:
- main
- releases/* # Wildcards 
```

If you want to trigger pipeline when change is pushed to main, or any releases branch, but not releases starts with old.

```yaml
# specific branch build
trigger:
  branches:
    include:
    - main
    - releases/*
    exclude:
    - releases/old*
```

If you want to trigger pipeline by using tags:

```yaml
trigger:
  branches:
    include:
      - refs/tags/{tagname}
    exclude:
      - refs/tags/{othertagname}
```

So if Disable impliled YAML CI trigger is not enabled and you don't have a trigger section, then the YAML file will work as this snippet was added:

```yaml
trigger:
  branches:
    include:
    - '*'  # must quote since "*" is a YAML reserved character; we want a string
```

So if you have lots of teamates and pushes on the trigger branch is busy, you can use batch build

```yaml
# specific branch build with batching
trigger:
  batch: true
  branches:
    include:
    - main
```

You can specify files or folders to trigger the pipeline:
```yaml
# specific path build
trigger:
  branches:
    include:
    - main
    - releases/*
  paths:
    include:
    - docs
    - src/app/**/myapp* # wildcards
    exclude:
    - docs/README.md
```
- Paths are always specified relative to the root folder of repos
- If you don't have path filter, it works as there is a wildcard "*" at root folder
- If you exludes `/tools`, you can only includes child folder like`/tools/trigger-runs-on-these`
- The order of path filter does not matter

- If you don't specify tag filter, it works like no tags trigger the pipeline.
- If you use tag filter and branch filter, it will trigger when branch filter satisfies OR tag trigger satisfies.
- When you push a change to a branch, the YAML file in that branch is evaluated to determine if a CI run should be started


These syntax is included in the message/ description of any of the commits, it won't trigger:

```
[skip ci]
[ci skip]
skip-checks: true
skip-checks:true
[skip azurepipelines]
[azurepipelines skip]
[skip azp]
[azp skip]
***NO_CI***
```

Add following condition to exclude it from PR trigger

`condition: and(succeeded(), ne(variables['Build.Reason'], 'PullRequest'))`

- PR trigger will trigger when PR is created, or push is made to that PR

- Merge will always run even if there are special syntax
- Changes on the PR will not run if special syntax is included.
- Draft pull request will not trigger pr trigger

### Authorization

If 
1. your repo and pipeline are in different projects
2. and **Limit job authorization scope** settings is enabled

then,
you must grant permission to build service identity of your pipeline to the second project, plesae see the [link for more info](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens?view=azure-devops&tabs=yaml#manage-build-service-account-permissions)

#### Protect access to repository in YAML pipelines
Without **Protect access to repositories in YAML pipelines** is enabled, pipelines are able to access any repos.

Organization/Project settings could configure this, and this setting is enabled by default.

To use repos code, you need to have `checkout` step first.

- If no checkout step is specified, then `checkout: self` is implicitly included.
- If only read-only operations needs to be operated, you don't need checkout step
- If script has PAT, no checkout step needed

default checkout step is actually executing following:
```bash
git -c fetch --force --tags --prune --prune-tags --progress --no-recurse-submodules origin --depth=1
```

### Preffered version of Git
For Windows agent, the git comes with agent default tool set. If you have other version to use:

set `System.PreferGitFromPath` to `true`,

For Windows-less agent, this setting is always true

#### Checkout path

By default your checked out content will put in `s` folder, `$(Agent.BuildDirectory)\s`, if multiple repos named tools and code, then `$(Agent.BuildDirectory)\s\tools` and `$(Agent.BuildDirectory)\s\code`

You can customized this by `path` property in `checkout`.

# Specify jobs in your pipeline

User can use conditions and dependencies to manage priority of jobs.

In smallest case, a pipeline has a single job. So that it is not necessary to use job in your YAML file, but specify steps directly.

```yaml
pool:
    vmImage: 'ubuntu-latest'
steps:
- bash: echo 'Hello world'
```

The full syntax of job:

```yaml
- job: string  # name of the job, A-Z, a-z, 0-9, and underscore
  displayName: string  # friendly name to display in the UI
  dependsOn: string | [ string ]
  condition: string
  strategy:
    parallel: # parallel strategy
    matrix: # matrix strategy
    maxParallel: number # maximum number simultaneous matrix legs to run
    # note: `parallel` and `matrix` are mutually exclusive
    # you may specify one or the other; including both is an error
    # `maxParallel` is only valid with `matrix`
  continueOnError: boolean  # 'true' if future jobs should run even if this job fails; defaults to 'false'
  pool: pool # agent pool
  workspace:
    clean: outputs | resources | all # what to clean up before the job runs
  container: containerReference # container to run this job inside
  timeoutInMinutes: number # how long to run the job before automatically cancelling
  cancelTimeoutInMinutes: number # how much time to give 'run always even if cancelled tasks' before killing them
  variables: ### { string: string } | [ variable | variableReference ] 
  steps: [ script | bash | pwsh | powershell | checkout | task | templateReference ]
  services: { string: string | container } # container resources to run as a service container
  uses: # Any resources (repos or pools) required by this job that are not already referenced
    repositories: [ string ] # Repository references to Azure Git repositories
    pools: [ string ] # Pool names, typically when using a matrix strategy for the job
```

If primary intent of your job is to deploy, u can use special type of job called deployment job

```yaml
- deployment: string        # instead of job keyword, use deployment keyword
  pool:
    name: string
    demands: string | [ string ]
  environment: string
  strategy:
    runOnce:
      deploy:
        steps:
        - script: echo Hi!

```

## Types of jobs
1. Agent pool jobs
2. Server jobs
3. Container jobs

### Agent pool jobs

- When you are using Micorosft-hosted agents, each job has a fresh agent
- When you are using self-hosted agents, you can use demands to specify capabilities an agent must have

```yaml
# demo of demands and capabilities
pool:
  name: myPrivateAgents    # your job runs on an agent in this pool
  demands: 
  - agent.os -equals Windows_NT    # the agent must have this capability to run the job
  - anotherCapability -equals somethingElse
steps:
- script: echo hello world
```

### Agentless jobs (server job) supported tasks

- Delay task
- Invoke REST API task
- Invoke Azure Function task
- Manual Validation task
- Publish to Azure Service Bus task
- Query Azure Monitor Alrerts task
- Query Work Items task

The full syntax to specify a server job:
```yaml
jobs:
- job: string
  timeoutInMinutes: number
  cancelTimeoutInMinutes: number
  strategy:
    maxParallel: number
    matrix: { string: { string: string } }

  pool: server # note: the value 'server' is a reserved keyword which indicates this is an agentless job
```

## Dependencies
Pipeline must contain at least one job with no dependencies, by default, the pipelines should run in parallel unless the `dependsOn` value is set

```yaml
jobs:
- job: string
  dependsOn: string
  condition: string
```

Sequential sample:
```yaml
jobs:
- job: Debug
  steps:
  - script: echo hello from the Debug build
- job: Release
  dependsOn: Debug
  steps:
  - script: echo hello from the Release build

```

## Conditions

```yaml
jobs:
- job: A
  steps:
  - script: exit 1

- job: B
  dependsOn: A
  condition: failed()
  steps:
  - script: echo this will run when A fails

- job: C
  dependsOn:
  - A
  - B
  condition: succeeded('B')
  steps:
  - script: echo this will run when B runs and succeeds
```

sample of using output of dependency job:
```yaml
jobs:
- job: A
  steps:
  - script: "echo '##vso[task.setvariable variable=skipsubsequent;isOutput=true]false'" # set variable skipsubsequent to true, and isOutput = true give this variable, skipsubsequent, ability to be read in subsequent jobs.
    name: printvar # job A has a name of printvar

- job: B
  condition: and(succeeded(), ne(dependencies.A.outputs['printvar.skipsubsequent'], 'true')) # make sure A run succeeded and A's output variable printvar.skipsubsequent is not true. We can only use output variable by jobname.variablename
  dependsOn: A
  steps:
  - script: echo hello from B
```

## Timeouts
By default:
- Self-hosted agent run forever
- Microsoft-hosted agent run 360 mins for public repos and project
- Microsoft-hosted agent run 60 mins for private repos or private project

```yaml
jobs:
- job: Test
  timeoutInMinutes: 10 # how long to run the job before automatically cancelling
  cancelTimeoutInMinutes: 2 # how much time to give 'run always even if cancelled tasks' before stopping them
```


## Multi-job configuration
