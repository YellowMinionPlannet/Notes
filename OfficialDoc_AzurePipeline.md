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

Following syntax will dispatch 3 jobs, and 2 of them will run concurrently.
```yaml
jobs:
- job: Test
  strategy:
    maxParallel: 2
    matrix: 
      US_IE:
        Location: US
        Browser: IE
      US_Chrome:
        Location: US
        Browser: Chrome
      Europe_Chrome:
        Location: Europe
        Browser: Chrome
```

for this matrix, it's also achievable through output variable, with a stringified JSON object format.

```yaml
jobs:
- job: generator
  steps:
  - bash: echo "##vso[task.setVariable variable=legs;isOutput=true]{'a':{'myvar':'A'}, 'b':{'myvar':'B'}}"
    name: mtrx
  # This expands to the matrix
  #   a:
  #     myvar: A
  #   b:
  #     myvar: B
- job: runner
  dependsOn: generator
  strategy:
    matrix: $[ dependencies.generator.outputs['mtrx.legs'] ]
  steps:
  - script: echo $(myvar) # echos A or B depending on which leg is running

```

## Slicing

## Job variables
Here is the sample of how to reference variables.

```yaml
variables:
  mySimpleVar: simple var value
  "my.dotted.var": dotted var value
  "my var with spaces": var with spaces value

steps:
- script: echo Input macro = $(mySimpleVar). Env var = %MYSIMPLEVAR%
  condition: eq(variables['agent.os'], 'Windows_NT')
- script: echo Input macro = $(mySimpleVar). Env var = $MYSIMPLEVAR
  condition: in(variables['agent.os'], 'Darwin', 'Linux')
- bash: echo Input macro = $(my.dotted.var). Env var = $MY_DOTTED_VAR
- powershell: Write-Host "Input macro = $(my var with spaces). Env var = $env:MY_VAR_WITH_SPACES"
```

## Workspace
In agent job, here is the well-known variables:

- `Pipeline.Workspace` to reference pipeline workspace.
- `Build.SourceDirectory` tasks download the application's source code
- `Build.ArtifactStagingDirectory` tasks download artifacts needed / upload artifacts before they're published
- `Build.BinariesDirectory` tasks write their output
- `Common.TestResultsDirectory` upload their test results

`Build.ArtifactStagingDirectory` and `Common.TestResultsDirectory` are always deleted and recreated before every build. These directories even is cleaned in self-hosted agent.

Jobs are always run on a new agent with Microsoft-hosted agents



```yaml
- job: myJob
  workspace:
    clean: outputs | resources | all # what to clean up before the job runs

    # outputs, Delete `Build.BinariesDirectory` before running a new job
    # resources, Delete `Build.SourcesDirectory` before running a new job
    # all, Delete `Pipeline.Workspace` before running a new job
```

## Artifact download
```yaml
# test and upload my code as an artifact named Website
jobs:
- job: Build
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - script: npm test
  - task: PublishPipelineArtifact@1
    inputs:
      artifactName: Website
      targetPath: '$(System.DefaultWorkingDirectory)'

# download the artifact and deploy it only if the build job succeeded
- job: Deploy
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - checkout: none #skip checking out the default repository resource
  - task: DownloadPipelineArtifact@2
    displayName: 'Download Pipeline Artifact'
    inputs:
      artifactName: Website
      targetPath: '$(Pipeline.Workspace)'
  dependsOn: Build
  condition: succeeded()
```

## Access to OAuth token
```yaml
steps:
- powershell: |
    $url = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis/build/definitions/$($env:SYSTEM_DEFINITIONID)?api-version=4.1-preview"
    Write-Host "URL: $url"
    $pipeline = Invoke-RestMethod -Uri $url -Headers @{
      Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"
    }
    Write-Host "Pipeline = $($pipeline | ConvertTo-Json -Depth 100)"
  env:
    SYSTEM_ACCESSTOKEN: $(system.accesstoken)

```

# Define container jobs

For container jobs, steps is executed in container by default, you can customize this behavior using step targets, to choose container or host for the current step.

To define a windows host container job:
```yaml
pool:
  vmImage: 'windows-2019'

container: mcr.microsoft.com/windows/servercore:ltsc2019

steps:
- script: set
```
To define a Linux host container job:
```yaml
pool:
  vmImage: 'ubuntu-latest'

container: ubuntu:18.04

steps:
- script: printenv
```

Use matrix strategy to run same step in different containers
```yaml
pool:
  vmImage: 'ubuntu-latest'

strategy:
  matrix:
    ubuntu16:
      containerImage: ubuntu:16.04
    ubuntu18:
      containerImage: ubuntu:18.04
    ubuntu20:
      containerImage: ubuntu:20.04

container: $[ variables['containerImage'] ]

steps:
- script: printenv
```

## Multiple jobs on a single agent host
Because jobs run in parallel, each job might sign out Docker configuration file at end of the job, so u will encounter deny if multiple jobs are pulling images and sign out. The solution is to set a `DOCKER_CONFIG` enviroment variable for each agent pool.

```bash
export DOCKER_CONFIG=./.docker
```
## Startup options
You can use `options` property to specify options for contanier startup
```yaml
container:
  image: ubuntu:18.04
  options: --hostname container-test --ip 192.168.0.1

steps:
- script: echo hello
```
***resources.containers.container*** for definition of schema
***docker container create*** for command reference of `options`


put image in to resources, to make them reusable.
```yaml
resources:
  containers:
  - container: u16
    image: ubuntu:16.04

  - container: u18
    image: ubuntu:18.04

  - container: u20
    image: ubuntu:20.04

jobs:
- job: RunInContainer
  pool:
    vmImage: 'ubuntu-latest'

  strategy:
    matrix:
      ubuntu16:
        containerResource: u16
      ubuntu18:
        containerResource: u18
      ubuntu20:
        containerResource: u20

  container: $[ variables['containerResource'] ]

  steps:
  - script: printenv
```

Use `endpoint` to specify private docker hub registry
```yaml
# Docker HUB Private
container:
  image: registry:ubuntu1804
  endpoint: private_dockerhub_connection

# ACR
container:
  image: myprivate.azurecr.io/windowsservercore:1803
  endpoint: my_acr_connection
```

For using non-standar Node.js Runtime (other than `glibc`), [see here](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#software)

For customized packages in node container, build image with sample snippet
```dockerfile
FROM node:18-alpine

RUN apk add --no-cache --virtual .pipeline-deps readline linux-pam \
  && apk add bash sudo shadow \
  && apk del .pipeline-deps

LABEL "com.azure.dev.pipelines.agent.handler.node.path"="/usr/local/bin/node"
# LABEL only add descriptive meta data
CMD [ "node" ]
```

# Use service containers
Following script shows how a job container and service container work together:
```yaml
resources:
  containers:
  - container: my_container
    image: buildpack-deps:focal
  - container: nginx
    image: nginx
# pre-declared container and image, 

pool:
  vmImage: 'ubuntu-latest'
# define host agent, which is VM running ubuntu system, where docker is pre-installed

container: my_container
# define job container which is my_container with iamge of buildpack-deps:focal
services:
  nginx: nginx
# define service container which is nginx, lef nginx is host service name, right nginx is the pre-defined nginx container

steps:
- script: |
    curl nginx
  displayName: Show that nginx is running
# these steps run in the job container, form my_container curl nginx.
```

Following snippet illustrate noncontainer job:
```yaml
resources:
  containers:
  - container: nginx
    image: nginx
    ports:
    - 8080:80
    # hostport: containerport
    env:
      NGINX_PORT: 80
    # make sure docker has config of NGINX_PORT = 80
  - container: redis
    image: redis
    ports:
    - 6379
    # route a random host port to container port 6379

pool:
  vmImage: 'ubuntu-latest'

services:
  nginx: nginx
  redis: redis

steps:
- script: |
    curl localhost:8080
    echo $AGENT_SERVICES_REDIS_PORTS_6379

# $AGENT_SERVICES_REDIS_PORTS_6379 is a reserved variable format of $AGENT_SERVICES_<SERVCIENAME>_PORTS_<PORTNUMBER>, it will print the random host port assign to this container port.
```

Use Matrix:

```yaml
resources:
  containers:
  - container: my_container
    image: ubuntu:22.04
  - container: pg15
    image: postgres:15
  - container: pg14
    image: postgres:14

pool:
  vmImage: 'ubuntu-latest'

strategy:
  matrix:
    postgres15:
      postgresService: pg15
    postgres14:
      postgresService: pg14

container: my_container

services:
  postgres: $[ variables['postgresService'] ]
steps:
- script: printenv
```

## Volumes
```yaml
services:
  my_service:
    image: myservice:latest
    volumes:
    - mydockervolume:/data/dir
    # named volume
    - /data/dir
    # anonymous volume
    - /src/dir:/dst/dir
    # bind mounts
```

Final sample:
```yaml
resources:
  containers:
    - container: db
      image: postgres
      volumes:
          - '/data/db:/var/lib/postgresql/data'
      env:
        POSTGRES_DB: postgres
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
    - container: mysql
      image: 'mysql:5.7'
      ports:
         - '3306:3306'
      env:
        MYSQL_DATABASE: users
        MYSQL_USER: mysql
        MYSQL_PASSWORD: mysql
        MYSQL_ROOT_PASSWORD: mysql
    - container: web
      image: python
      volumes:
      - '/code'
      ports:
        - '8000:8000'

pool:
  vmImage: 'ubuntu-latest'

container: web
services:
  db: db
  mysql: mysql

steps:
    - script: |
        pip install django
        pip install psycopg2
        pip install mysqlclient
      displayName: set up django
    - script: |
          python /__w/1/s/manage.py test
```

# Add stages, dependencies, and conditions
By default stages run in sequence.

If only one stage, there is no need to specify stages keyword.

Following sample shows parallel stages by using dependsOn keyword.
```yaml
stages:
- stage: FunctionalTest
  displayName: "Functional Test Stage"
  jobs:
  - job: FunctionalTestJob
    steps:
    - script: echo "Running functional tests"
      displayName: "Run Functional Tests"

- stage: AcceptanceTest
  displayName: "Acceptance Test Stage"
  dependsOn: [] # Runs in parallel with FunctionalTest
  jobs:
  - job: AcceptanceTestJob
    steps:
    - script: echo "Running acceptance tests"
      displayName: "Run Acceptance Tests"
```

Also, please notice the order of following stages:
```yaml
stages:
- stage: Test

- stage: DeployUS1
  dependsOn: Test    #  stage runs after Test

- stage: DeployUS2
  dependsOn: Test    # stage runs in parallel with DeployUS1, after Test

- stage: DeployEurope
  dependsOn:         # stage runs after DeployUS1 and DeployUS2
  - DeployUS1
  - DeployUS2

```

You can manually control when a stage to run by **Approvals**, also you can add a manual trigger to a stage, so that the specified stage won't run automatically.

```yaml
stages:
- stage: Development
  displayName: Deploy to development
  jobs:
  - job: DeployJob
    steps:
    - script: echo 'hello, world'
      displayName: 'Run script'
- stage: Production
  displayName: Deploy to production
  trigger: manual
  jobs:
  - job: DeployJob
    steps:
    - script: echo 'hello, world'
      displayName: 'Run script'
```

You can mark a stage that is unskipable by using `isSkippable: false`
```yaml
- stage: malware_detection
  displayName: Malware detection
  isSkippable: false
  jobs:
  - job: check_job
    ...
```
this way, this stage cannot be check off in the configuration panel.


# Deployment jobs

Deployment job's step is executed in sequence, by default, the source code is not checked out, you can check out source code by using `checkout: self`.

To achieve following deployment results:
- Enable Initialization
- Deploy the update version of application
- Route traffic to the updated version of application
- Test the updated version of application using routed traffic
- Revert to the last known version if fail

Deployment job has lifecyle hooks.

`preDeploy`: Used to run steps that initialize resources before deployment 
`deploy`: Used to run steps that deploy your application. Download artifact task is auto injected in deploy hook, to stop this, use `- download: none`
`routeTraffic`: Used to run steps that serve the traffic to the updated version
`postRouteTraffic`: Used to run steps after the traffic is routed. Monitor the health of updated version of application
`on: failure`/`on: success`: Used to run steps for rollback actions or clean-up

There are also strategy to combine these hooks:
1. RunONce deployment strategy
```yaml
strategy: 
    runOnce:
      preDeploy:        
        pool: [ server | pool ] # See pool schema.        
        steps:
        - script: [ script | bash | pwsh | powershell | checkout | task | templateReference ]
      deploy:          
        pool: [ server | pool ] # See pool schema.        
        steps:
        ...
      routeTraffic:         
        pool: [ server | pool ]         
        steps:
        ...        
      postRouteTraffic:          
        pool: [ server | pool ]        
        steps:
        ...
      on:
        failure:         
          pool: [ server | pool ]           
          steps:
          ...
        success:          
          pool: [ server | pool ]           
          steps:
          ...

```

Remember to clean your deployment workspace:
```yaml
jobs:
  - deployment: MyDeploy
    pool:
      vmImage: 'ubuntu-latest'
    workspace:
      clean: all
    environment: staging
```


## Rolling deployment strategy

runOnce normally work with single server and execute single time. Rolling is targeting batch of servers/VMs, it parallely execute batch by batch, can significantly reduce downtime.

`preDeploy`, `deploy`, `routeTraffic`, `postRouteTraffic` are executed once per batch size defined by maxParallel. Then either success or fail.

```yaml
strategy:
  rolling:
    maxParallel: [ number or percentage as x% ]
    preDeploy:        
      steps:
      - script: [ script | bash | pwsh | powershell | checkout | task | templateReference ]
    deploy:          
      steps:
      ...
    routeTraffic:         
      steps:
      ...        
    postRouteTraffic:          
      steps:
      ...
    on:
      failure:         
        steps:
        ...
      success:          
        steps:
        ...
```

## Canary deployment strategy

`predeploy` run once, and iterates with the `deploy`, `routeTraffic`, and `postRouteTraffic` hooks, then success or fails.

It has increment number to increase deployment count when you are confidence about previous deployment.

```yaml
jobs:
  - deployment: 
      environment: smarthotel-dev.bookings
      pool: 
        name: smarthotel-devPool
      strategy:                  
        canary:      
          increments: [10, 20]  
          preDeploy:                                     
            steps:           
              - script: initialize, cleanup....
          deploy:             
            steps: 
              - script: echo deploy updates...
              - task: KubernetesManifest@1
                inputs:
                  action: $(strategy.action)
                  namespace: 'default'
                  strategy: $(strategy.name)
                  percentage: $(strategy.increment)
                  manifests: 'manifest.yml'
          postRouteTraffic: 
            pool: server 
            steps:           
              - script: echo monitor application health...
          on: 
            failure: 
              steps: 
                - script: echo clean-up, rollback...
            success: 
              steps: 
                - script: echo checks passed, notify...
```


# Author a custom pipeline decorator

Pipeline decorators let you add steps to the beginning and end of every job. It applies to all pipelines in an organization.

> Here we need to be familiar with concept of **Contribution model**, so from here we inject notes from [Contribution model page](https://learn.microsoft.com/en-us/azure/devops/extend/develop/contributions-overview?view=azure-devops).

A contribution type defined the properties and rules that contributions of that type must follow. A contribution type can extend another contribution type, inheriting its properties.

Common contirbution types:
`hub`, `action`, `build-task`

A property definition includes:
- property type, string or boolean
- whether the property is required
- an optional default value

So, a contribution type sample:
```json
{
  "contributionTypes": [
    {
      "id": "hub",
      "name": "Web Access Hub",
      "description": "A hub that appears in the hubs menu at the top of web pages.",
      "properties": {
        "name": {
          "description": "The text to display for the hub",
          "type": "string",
          "required": true
        },
        "uri": {
          "description": "URI of the contents of the hub page",
          "type": "string",
          "required": true
        },
        "order": {
          "description": "Optional ordering value indicating the hub's position within the hub group",
          "type": "integer"
        }
      }
    }
  ]
}
```

So once we have definition of contribution type, we can have a contribution instance, which looks like:
```json
{
    "contributions": [
        {
            "id": "build-explorer-hub",
            "type": "ms.vss-web.hub",
            "targets": [
                ".build-hub-group"
            ],
            "properties": {
                "name": "Explorer",
                "uri": "/_build",
                "order": 22
            }
        }
    ]
}
```

Target contributions, means contribution can bind target on one or more other contributions, following example shows a `hub` contribution targeting a `hub-group` contribution. So when hub group renders, the runtime will query for all hub contributions that targeting hub group to know which hub to render.

```json
{
    "id": "build-explorer-hub",
    "type": "ms.vss-web.hub",
    "targets": [
        ".build-hub-group"
    ]
}
```

The identity of contribution type, is seperated by `.`, and `ms.vss-web.hub` means:
- Publisher ID, `ms`
- Extension ID, `vss-web`
- Contribution/type ID, `hub`

> Back to our decorator notes

Oud decorator is an instance of `ms.azure-pipelines.pipeline-decorator` contribution type.

```json

{
    "manifestVersion": 1,
    "contributions": [
        {
            "id": "my-required-task",
            "type": "ms.azure-pipelines.pipeline-decorator",
            "targets": [
                "ms.azure-pipelines-agent-job.post-job-tasks"
            ],
            "properties": {
                "template": "my-decorator.yml"
            }
        }
    ],
    "files": [
        {
            "path": "my-decorator.yml",
            "addressable": true,
            "contentType": "text/plain"
        }
    ]
}
```

So it declares this decorator is targeting all post-job-tasks. As definition requires a `my-decorator.yml`, here it is:
```yaml
steps:
- task: CmdLine@2
  displayName: 'Run my script (injected from decorator)'
  inputs:
    script: dir
```

In order to make pipeline decorators take effect on every pipeline in Org, Org Admin needs to intall the extension, and you can check which extension is installed at Org level, Org settings.

# Pipeline decorator context

This part introduces how to make your customized decorator interact with current task, this is optional material, please read [here](https://learn.microsoft.com/en-us/azure/devops/extend/develop/pipeline-decorator-context?toc=%2Fazure%2Fdevops%2Fpipelines%2Ftoc.json&view=azure-devops)


# Specify conditions
***Importance***
job, stage will run:
1. no dependOn settings
2. or, all its dependencies completed or succeeded

step will run:
1. nothing fail in its job
2. and, preceeding step is completed

Common conditions:
- Succeeded: Run only all previous dependencies succeed, `condition: succeeded()`
- Succeeded or failed: Run even fails, but don't run when canceled, `condition: succeededOrFailed()`
- Always: Run even canceled, `condition: always()`
- Failed: Run only when previous dependencies fails, `condition: failed()`

Variables are all treated as string, so empty string is `null`.

```yaml
variables:
  isMain: $[eq(variables['Build.SourceBranch'], 'refs/heads/main')]

stages:
- stage: A
  jobs:
  - job: A1
    steps:
      - script: echo Hello Stage A!
- stage: B
  condition: and(succeeded(), eq(variables.isMain, true))
  jobs:
  - job: B1
    steps:
      - script: echo Hello Stage B!
      - script: echo $(isMain)

variables:
- name: testEmpty
  value: ''

jobs:
  - job: A
    steps:
    - script: echo testEmpty is blank
    condition: eq(variables.testEmpty, '')
```

To make a output variable that can be used by other jobs in same stage:

```yaml
jobs:
- job: A
  steps:
  - bash: |
      echo "This is job A."
      echo "##vso[task.setvariable variable=doThing;isOutput=true]Yes" #set variable doThing to Yes
    name: DetermineResult
- job: B
  dependsOn: A
  condition: eq(dependencies.A.outputs['DetermineResult.doThing'], 'Yes') #map doThing and check the value
  steps:
  - script: echo "Job A ran and doThing is Yes."
```

Variables created by steps:
- Scoped to the steps in same job
- Available by subsequent steps as Environment variables
- Can't be used in step where created

```yaml
steps:

# This step creates a new pipeline variable: doThing. This variable is available to subsequent steps.
- bash: |
    echo "##vso[task.setvariable variable=doThing]Yes"
  displayName: Step 1

# This step uses doThing in its condition
- script: |
    # Access the variable from Step 1 as an environment variable.
    echo "Value of doThing (as DOTHING env var): $DOTHING."
  displayName: Step 2
  condition: and(succeeded(), eq(variables['doThing'], 'Yes')) # or and(succeeded(), eq(variables.doThing, 'Yes'))
```

Parameters need to use syntax `${{ parameters.name}}` to evaluate

```yaml
parameters:
- name: doThing
  default: true
  type: boolean

steps:
- script: echo I did a thing
  condition: and(succeeded(), ${{ eq(parameters.doThing, true) }})
```

# Specify demands
Demand is able to check for agent pool specification.
```yaml
pool:
  name: MyPool
  demands: Agent.Version -equals 2.144.0 # equals check for Agent.Version 2.144.0
```

Agent variables that can be checked:
- Agent.Name
- Agent.Version
- Agent.ComputerName
- Agent.HomeDirectory
- Agent.OS
- Agent.OSArchitecture
- Agent.OSVersion

# Expressions

***Importance***
This is really good reference about function we can use in YAML, [see details](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/expressions?view=azure-devops).

# Task index

***Importance***
Please take a look at all available task list [here](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/?view=azure-pipelines&viewFallbackFrom=azure-devops).


# Task types and usage

A step could be one of these, a task or a script.

A task is a predefined script or procedure. Please see schema ***step.task***.

Steps in a job by default run in sequence. Use target to exchange context of the step, and use strategy to make steps execute concurrently.

Predefined special tasks towards a Organization are pre-installed at organization-level. If Marketplace tasks(Common task) and built-in task(Org's special task) are all disabled in Organizaiton Settings, then there won't be anything to use other than Node CLI tasks.

Custom tasks, will be overriden if the custom task name collide with built-in task name. BUilt-in task will be executed when you call, unless you emphasis custom task with GUID when you create.

Task Version needs to be specified when using task. 

In YAML, you use @ version number to express
```yaml
- task: onebranch.pipeline.nugetpush@1
```

Conditions can specify if task need to run, by default, a step runs if nothing in this job fails. You can customize condtion by using **expression**.

`continueOnError` property tells the task should continue running, and downstream steps also treat previous dependency as succeeded.

`retryCountOnTaskFailure` retry task if it fails.
- max of this property is 10
- wait time will increase for each increment retry
- round of retry is not provided to the current retry step
- Failure of retried task will be warning

## Environment variables
`env` under step could used with script or task to set environment variables. Using syntax `$ENV_VARIABLE_NAME` to reference environment variables.

```yaml
- task: Bash@3
  inputs:
    script: echo "This is " $ENV_VARIABLE_NAME
  env:
    ENV_VARIABLE_NAME: value
  displayName: 'echo environment variable'
```

# Run a PowerShell script
powershell script in Azure Pipeline could access resources in **Azure DevOps REST API**.

## PowerShell script task
PowerShell script task could be achieved through inline or file. The script task also has access to current code repos branch defined in pipeline settings.

```yaml
# inline mode
steps:
- task: PowerShell@2
  inputs:
    targetType: 'inline'
    script: Write-Host "Hello world!"

# file mode
steps:
- task: PowerShell@2
  inputs:
    targetType: 'filePath'
    filePath: 'test.ps1'
```

Shortcut version:

```yaml
steps:
- pwsh: test.ps1

steps:
- pwsh: Write-Host Hello
```

# Run Git commands in pipeline scripts


# Cross-platform scripts
```yaml
steps:
# Linux
- bash: |
    export IPADDR=$(ip addr | grep 'state UP' -A2 | tail -n1 | awk '{print $2}' | cut -f1  -d'/')
    echo "##vso[task.setvariable variable=IP_ADDR]$IPADDR"
  condition: eq( variables['Agent.OS'], 'Linux' )
  displayName: Get IP on Linux
# macOS
- bash: |
    export IPADDR=$(ifconfig | grep 'en0' -A3 | grep inet | tail -n1 | awk '{print $2}')
    echo "##vso[task.setvariable variable=IP_ADDR]$IPADDR"
  condition: eq( variables['Agent.OS'], 'Darwin' )
  displayName: Get IP on macOS
# Windows
- powershell: |
    Set-Variable -Name IPADDR -Value ((Get-NetIPAddress | ?{ $_.AddressFamily -eq "IPv4" -and !($_.IPAddress -match "169") -and !($_.IPaddress -match "127") } | Select-Object -First 1).IPAddress)
    Write-Host "##vso[task.setvariable variable=IP_ADDR]$IPADDR"
  condition: eq( variables['Agent.OS'], 'Windows_NT' )
  displayName: Get IP on Windows

# use the value
- script: |
    echo The IP address is $(IP_ADDR)
```

# Logging commands
This is a reference of `echo '##vso[]'`. [link](https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash)

# File matching patterns
This is a reference of wildcards. [link](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/file-matching-patterns?view=azure-devops)

# Cache NuGet Packages
This is a way to cache NuGet packages to shorten process of restore before build.

# Templates, parameters, & expressions

Templates will able you re-usable content, logic, and parameters in YAML pipelines. 

There are two main types of templates:
- Includes templates, if only include contents, just like include directive  
- Extends templates, if aim to control and define a schema for what is allowed in a pipeline. It defines logic and structure a pipeline must follow. This is useful for enforcing security, compliance, or organizational standards.

There are two main tools/features to make templates work as expected:
- template expression
- template parameters

Example of Include template, reuse steps across multiple jobs:
```yaml
# File: templates/insert-npm-steps.yml

steps:
- script: npm install
- script: yarn install
- script: npm run compile


# File: azure-pipelines.yml

jobs:
- job: Linux
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - template: templates/insert-npm-steps.yml  # Template reference

- job: macOS
  pool:
    vmImage: 'macOS-latest'
  steps:
  - template: templates/insert-npm-steps.yml  # Template reference

- job: Windows
  pool:
    vmImage: 'windows-latest'
  steps:
  - script: echo This script runs before the template's steps, only on Windows.
  - template: templates/insert-npm-steps.yml  # Template reference
  - script: echo This step runs after the template's steps.
```

Reuse jobs across multiple templates:
```yaml
# File: templates/insert-jobs.yml
jobs:
- job: Ubuntu
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - bash: echo "Hello Ubuntu"

- job: Windows
  pool:
    vmImage: 'windows-latest'
  steps:
  - bash: echo "Hello Windows"


# File: azure-pipelines.yml
jobs:
- template: templates/insert-jobs.yml  # Template reference
```

Reuse stages across multiple templates:
```yaml
# File: templates/insert-stage1.yml
stages:
- stage: Angular
  jobs:
  - job: angularinstall
    steps:
    - script: npm install angular

# File: templates/insert-stage2.yml
stages:
- stage: Build
  jobs:
  - job: build
    steps:
    - script: npm run build

# File: azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: Install
  jobs: 
  - job: npminstall
    steps:
    - task: Npm@1
      inputs:
        command: 'install'
- template: templates/insert-stage1.yml # Template reference
- template: templates/insert-stage2.yml # Template reference
```

Add parameters to job, stage, and stemp templates
```yaml
# File: templates/npm-with-params.yml

parameters:
- name: name  # defaults for any parameters that aren't specified
  default: ''
- name: vmImage
  default: ''

jobs:
- job: ${{ parameters.name }}
  pool: 
    vmImage: ${{ parameters.vmImage }}
  steps:
  - script: npm install
  - script: npm test

# File: azure-pipelines.yml

jobs:
- template: templates/npm-with-params.yml  # Template reference
  parameters:
    name: Linux
    vmImage: 'ubuntu-latest'

- template: templates/npm-with-params.yml  # Template reference
  parameters:
    name: macOS
    vmImage: 'macOS-latest'

- template: templates/npm-with-params.yml  # Template reference
  parameters:
    name: Windows
    vmImage: 'windows-latest'
```

With parameters
```yaml
# stage-template.yml

parameters:
  - name: stageName
    type: string
  - name: jobName
    type: string
  - name: vmImage
    type: string
  - name: scriptPath
    type: string

stages:
  - stage: ${{ parameters.stageName }}
    jobs:
      - job: ${{ parameters.jobName }}
        pool:
          vmImage: ${{ parameters.vmImage }}
        steps:
          - script: ./${{ parameters.scriptPath }}

# azure-pipelines.yml
trigger:
- main

stages:
- template: stage-template.yml
  parameters:
    stageName: 'BuildStage'
    jobName: 'BuildJob'
    scriptPath: 'build-script.sh' # replace with script in your repository
    vmImage: 'ubuntu-latest'
```

```yaml
# azure-pipelines.yml
jobs:
- template: process.yml
  parameters:
    pool:   # this parameter is called `pool`
      vmImage: ubuntu-latest  # and it's a mapping rather than a string

# process.yml
parameters:
- name: 'pool'
  type: object
  default: {}

jobs:
- job: build
  pool: ${{ parameters.pool }}
```

## Variable reuse
```yaml
# File: insert-vars.yml
variables:
  favoriteVeggie: 'brussels sprouts'

# File: azure-pipelines.yml

variables:
- template: insert-vars.yml  # Template reference

steps:
- script: echo My favorite vegetable is ${{ variables.favoriteVeggie }}.
```

```yaml
# File: templates/package-release-with-params.yml

parameters:
- name: DIRECTORY 
  type: string
  default: "." # defaults for any parameters that specified with "." (current directory)

variables:
- name: RELEASE_COMMAND
  value: grep version ${{ parameters.DIRECTORY }}/package.json | awk -F \" '{print $4}'

# File: azure-pipelines.yml

variables: # Global variables
  - template: package-release-with-params.yml # Template reference
    parameters:
      DIRECTORY: "azure/checker"

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: Release_Stage 
  displayName: Release Version
  variables: # Stage variables
  - template: package-release-with-params.yml  # Template reference
    parameters:
      DIRECTORY: "azure/todo-list"
  jobs: 
  - job: A
    steps: 
    - bash: $(RELEASE_COMMAND) #output release command
```

## Extend from a template and use an include template with variables

A common scenario is to share variables in differnt stages, like dev, test, production.

```yaml
# variables-template.yml

variables:
- name: devVmImage
  value: 'ubuntu-latest'
- name: testVmImage
  value: 'ubuntu-latest'
- name: prodVmImage
  value: 'ubuntu-latest'

# stage-template.yml
parameters:
- name: name
  type: string
  default: ''
- name: vmImage
  type: string
  default: ''
- name: steps
  type: stepList
  default: []

stages:
- stage: ${{ parameters.name }}
  jobs:
  - job: Build
    pool:
      vmImage: ${{ parameters.vmImage }}
    steps: ${{ parameters.steps }}

# azure-pipelines.yml
trigger:
- main

variables:
- template: variables-template.yml

stages:
- template: stage-template.yml
  parameters:
    name: Dev
    vmImage: ${{ variables.devVmImage }}
    steps:
      - script: echo "Building in Dev"
- template: stage-template.yml
  parameters:
    name: Test
    vmImage: ${{ variables.testVmImage }}
    steps:
      - script: echo "Testing in Test"
- template: stage-template.yml
  parameters:
    name: Prod
    vmImage: ${{ variables.prodVmImage }}
    steps:
      - script: echo "Deploying to Prod"
        env:
          SYSTEM_ACCESSTOKEN: $(System.AccessToken)
```

## reference template paths

Sometimes the project get complicated in file structure. Here is relative path sample:

```
|
+-- fileA.yml
|
+-- dir1/
     |
     +-- fileB.yml
     |
     +-- dir2/
          |
          +-- fileC.yml
```

```yaml
# fileA.yml

steps:
- template: dir1/fileB.yml
- template: dir1/dir2/fileC.yml

# fileC.yml

steps:
- template: ../../fileA.yml
- template: ../fileB.yml

# fileB.yml
steps:
- template: ../fileA.yml
- template: dir2/fileC.yml

# fileB.yml relative path
steps:
- template: /fileA.yml
- template: /dir1/dir2/fileC.yml
```

## Store templates in other repositories

Share the template across repos,

```yaml
# Repo: Contoso/BuildTemplates
# File: common.yml
parameters:
- name: 'vmImage'
  default: 'ubuntu-22.04'
  type: string

jobs:
- job: Build
  pool:
    vmImage: ${{ parameters.vmImage }}
  steps:
  - script: npm install
  - script: npm test

# Repo: Contoso/LinuxProduct
# File: azure-pipelines.yml
resources:
  repositories:
    - repository: templates
      type: github
      name: Contoso/BuildTemplates

jobs:
- template: common.yml@templates  # Template reference


# Repo: Contoso/WindowsProduct
# File: azure-pipelines.yml
resources:
  repositories:
    - repository: templates
      type: github
      name: Contoso/BuildTemplates
      ref: refs/tags/v1.0 # optional ref to pin to

jobs:
- template: common.yml@templates  # Template reference
  parameters:
    vmImage: 'windows-latest'
```

If the project is in seperate Azure DevOps organization, you need to configure a service connetion.
```yaml
resources:
  repositories:
  - repository: templates
    name: Contoso/BuildTemplates
    endpoint: myServiceConnection # Azure DevOps service connection
jobs:
- template: common.yml@templates
```

The template in other repo, if you want to use a specific version, remember to specify `ref`. Where default value is `refs/heads/main`.

```yaml
resources:
  repositories:
    - repository: templates
      type: git
      name: Contoso/BuildTemplates
      ref: 1234567890abcdef1234567890abcdef12345678

```

Use `@self` to specify the template locate at current default repos rather than shared template from other repos.

```yaml
# Repo: Contoso/Central
# File: template.yml
jobs:
- job: PreBuild
  steps: []

  # Template reference to the repo where this template was
  # included from - consumers of the template are expected
  # to provide a "BuildJobs.yml"
- template: BuildJobs.yml@self

- job: PostBuild
  steps: []

# Repo: Contoso/MyProduct
# File: azure-pipelines.yml
resources:
  repositories:
    - repository: templates
      type: git
      name: Contoso/Central

extends:
  template: template.yml@templates

# Repo: Contoso/MyProduct
# File: BuildJobs.yml
jobs:
- job: Build
  steps: []
```

Use `extends` keyword to include template

```yaml
# File: start-extends-template.yml
parameters:
- name: buildSteps # the name of the parameter is buildSteps
  type: stepList # data type is StepList
  default: [] # default value of buildSteps
stages:
- stage: secure_buildstage
  pool:
    vmImage: windows-latest
  jobs:
  - job: secure_buildjob
    steps:
    - script: echo This happens before code 
      displayName: 'Base: Pre-build'
    - script: echo Building
      displayName: 'Base: Build'

    - ${{ each step in parameters.buildSteps }}:
      - ${{ each pair in step }}:
          ${{ if ne(pair.value, 'CmdLine@2') }}:
            ${{ pair.key }}: ${{ pair.value }}       
          ${{ if eq(pair.value, 'CmdLine@2') }}: 
            # Step is rejected by raising a YAML syntax error: Unexpected value 'CmdLine@2'
            '${{ pair.value }}': error         

    - script: echo This happens after code
      displayName: 'Base: Signing'


# File: azure-pipelines.yml
trigger:
- main

extends:
  template: start-extends-template.yml
  parameters:
    buildSteps:  
      - bash: echo Test #Passes
        displayName: succeed
      - bash: echo "Test"
        displayName: succeed
      # Step is rejected by raising a YAML syntax error: Unexpected value 'CmdLine@2'
      - task: CmdLine@2
        inputs:
          script: echo "Script Test"
      # Step is rejected by raising a YAML syntax error: Unexpected value 'CmdLine@2'
      - script: echo "Script Test"

```

# Template parameters

Normal Parameters:

```yaml
# File: simple-param.yml
parameters:
- name: yesNo # name of the parameter; required
  type: boolean # data type of the parameter; required
  default: false

steps:
- script: echo ${{ parameters.yesNo }}

# File: azure-pipelines.yml
trigger:
- main

extends:
  template: simple-param.yml
  parameters:
      yesNo: false # set to a non-boolean value to have the build fail
```
When using JobList for example, job only accept property that is defined within the schema, but templateContext accept anything.
`templateContext` keyword sample:
```yaml
#testing-template.yml

parameters: 
- name: testSet
  type: jobList

jobs:
- ${{ each testJob in parameters.testSet }}:  # Iterate over each job in the 'testSet' parameter
  - ${{ if eq(testJob.templateContext.expectedHTTPResponseCode, 200) }}: # Check if the HTTP response is 200
    - job:
      steps: 
      - powershell: 'Invoke-RestMethod -Uri https://blogs.msdn.microsoft.com/powershell/feed/ | Format-Table -Property Title, pubDate'
      - ${{ testJob.steps }}    
  - ${{ if eq(testJob.templateContext.expectedHTTPResponseCode, 500) }}: # Check if the HTTP response is 500
    - job:
      steps:
      - powershell: 'Get-ChildItem -Path Env:\' # Run a PowerShell script to list environment variables
      - ${{ testJob.steps }} # Include additional steps from the 'testJob' object

#azure-pipeline.yml

trigger: none

pool:
  vmImage: ubuntu-latest

extends:
  template: testing-template.yml 
  parameters:
    testSet:  # Define the 'testSet' parameter to pass to the template
    - job: positive_test # Define a job named 'positive_test'
      templateContext:
        expectedHTTPResponseCode: 200 # Set the expected HTTP response code to 200 for this job
      steps:
      - script: echo "Run positive test" 
    - job: negative_test # Define a job named 'negative_test'
      templateContext:
        expectedHTTPResponseCode: 500 # Set the expected HTTP response code to 500 for this job
      steps:
      - script: echo "Run negative test"
```

Different data types that allowed for parameters:
```yaml
parameters:
- name: myString  # Define a parameter named 'myString'
  type: string  # The parameter type is string
  default: a string  # Default value is 'a string'

- name: myMultiString  # Define a parameter named 'myMultiString'
  type: string  # The parameter type is string
  default: default  # Default value is 'default', only one default
  values:  # Allowed values for 'myMultiString'
  - default  
  - ubuntu  

- name: myStringlist # Define a parameter named 'myStringlist'
  type: stringList # The parameter type is stringList
  displayName: Regions
  values: # Allowed values for 'myStringlist'
    - WUS
    - CUS
    - EUS
  default: # Default values
    - WUS
    - CUS
    
- name: myNumber  # Define a parameter named 'myNumber'
  type: number  # The parameter type is number
  default: 2  # Default value is 2
  values:  # Allowed values for 'myNumber'
  - 1  
  - 2  
  - 4  
  - 8  
  - 16  

- name: myBoolean  # Define a parameter named 'myBoolean'
  type: boolean  # The parameter type is boolean
  default: true  # Default value is true

- name: myObject  # Define a parameter named 'myObject'
  type: object  # The parameter type is object
  default:  # Default value is an object with nested properties
    foo: FOO  # Property 'foo' with value 'FOO'
    bar: BAR  # Property 'bar' with value 'BAR'
    things:  # Property 'things' is a list
    - one  
    - two  
    - three  
    nested:  # Property 'nested' is an object
      one: apple  # Property 'one' with value 'apple'
      two: pear  # Property 'two' with value 'pear'
      count: 3  # Property 'count' with value 3

- name: myStep  # Define a parameter named 'myStep'
  type: step  # The parameter type is step
  default:  # Default value is a step
    script: echo my step 

- name: mySteplist  # Define a parameter named 'mySteplist'
  type: stepList  # The parameter type is stepList
  default:  # Default value is a list of steps
    - script: echo step one  
    - script: echo step two  
    
trigger: none  

jobs: 
- job: stepList  # Define a job named 'stepList'
  steps: ${{ parameters.mySteplist }}  # Use the steps from the 'mySteplist' parameter

- job: myStep  # Define a job named 'myStep'
  steps:
    - ${{ parameters.myStep }}  # Use the step from the 'myStep' parameter

- job: stringList  # Define a job named 'stringList'
  steps:
  - ${{ each region in parameters.myStringlist }}:
      - script: echo ${{region}}

```

Iterate through parameters itself:

```yaml
# start.yaml
parameters:
- name: myStringName
  type: string
  default: a string value
- name: myNumber
  type: number
  default: 2
- name: myBoolean
  type: boolean
  default: true

steps: 
- ${{ each parameter in parameters }}:
  - script: echo ${{ parameter.Key }} 
  - script: echo ${{ parameter.Value }}
```

Iterate through object type:
```yaml
# object-keys-template.yml

parameters:
  - name: myObject
    type: object
    default:
      key1: 'value1'
      key2: 'value2'
      key3: 'value3'

jobs:
- job: ExampleJob
  displayName: 'Example object parameter job'
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - script: |
      echo "Keys in myObject:"
      echo "Key1: ${{ parameters.myObject.key1 }}"
      echo "Key2: ${{ parameters.myObject.key2 }}"
      echo "Key3: ${{ parameters.myObject.key3 }}"
    displayName: 'Display object keys and values'

# azure-pipelines.yml

trigger:
- main

extends:
  template: object-keys-template.yml
  parameters:
    myObject:
      key1: 'customValue1'
      key2: 'customValue2'
      key3: 'customValue3'
```

Iterate through nested object:
```yaml

# File: nested-objects-template.yml

parameters:
- name: listOfFruits
  type: object
  default:
  - fruitName: 'apple'
    colors: ['red', 'green']
  - fruitName: 'lemon'
    colors: ['yellow']

steps:
- ${{ each fruit in parameters.listOfFruits }}: # Iterate over each fruit in the 'listOfFruits'
  - ${{ each fruitColor in fruit.colors }}: # Iterate over each color in the current fruit's colors
    - script: echo ${{ fruit.fruitName }} ${{ fruitColor }} # Echo the current fruit's name and color


# File: azure-pipelines.yml

trigger:
- main

extends:
  template: nested-objects-template.yml
  parameters:
    listOfFruits:
    - fruitName: 'banana'
      colors: ['yellow']
    - fruitName: 'grape'
      colors: ['purple', 'green']
```

Using stepList parameter:

```yaml
#azure-pipelines.yml

trigger:
- main

jobs:
  - job: build
    displayName: 'Build .NET Core Application'
    pool:
      vmImage: 'ubuntu-latest'

    steps:
      - checkout: self

      - template: build.yml
        parameters:
          build_tasks:
            - task: DotNetCoreCLI@2
              displayName: 'Restore'
              inputs:
                command: 'restore'
                projects: '**/*.csproj'  

            - task: DotNetCoreCLI@2
              displayName: 'Build'
              inputs:
                command: 'build'
                arguments: '--no-restore'
                projects: '**/*.csproj' 

  - job: deploy
    displayName: 'Pack for Azure App Service deployment'
    dependsOn: build
    pool:
      vmImage: 'ubuntu-latest'
    steps:
      - download: current
        artifact: drop

#build.yml

parameters:
  - name: build_tasks
    type: stepList
    default: []

steps:
  - task: UseDotNet@2
    displayName: 'Use .NET Core SDK'
    inputs:
      packageType: 'sdk'
      version: '8.x'

  - ${{ each step in parameters.build_tasks }}:
      - ${{ step }}

  - task: DotNetCoreCLI@2
    displayName: 'Publish'
    inputs:
      command: 'publish'
      arguments: '--configuration Release --output $(Build.ArtifactStagingDirectory)'
      projects: '**/*.csproj'

  - task: PublishBuildArtifacts@1
    displayName: 'Publish Artifact'
    inputs:
      PathtoPublish: '$(Build.ArtifactStagingDirectory)'
      ArtifactName: 'drop'
```

# Template expression

Expression cannot be evaluated in trigger or a resource, for example, repositories. That's because trigger and resource is processed at early stage of pipeline, without knowing the trigger or repo, the pipeline will not know how to work.

## Context
the syntax `${{}}` has context of parameters and variables, but runtime variables and predefined variables are excluded, because when pipeline evaluate at early stage, these things do not exist yet.

## Notice
The pipeline editor and pipeline pane, will behave differently for `coalecs()`
function, for empty string `''`, Editor will treat `''` null and allow for fallback to next value. But pane will treat `''` as a value, so prevent fallback to next value.

## Insertion
- For array, it will flatten the inserted automatically
```yaml
# File: .vsts.ci.yml

jobs:
- template: jobs/build.yml
  parameters:
    preBuild:
    - script: echo hello from pre-build
    preTest:
    - script: echo hello from pre-test

# File: jobs/build.yml

parameters:
- name: 'preBuild'
  type: stepList
  default: []
- name: 'preTest'
  type: stepList
  default: []
- name: 'preSign'
  type: stepList
  default: []

jobs:
- job: Build
  pool:
    vmImage: 'windows-latest'
  steps:
  - script: cred-scan
  - ${{ parameters.preBuild }}
  - task: VSBuild@1
  - ${{ parameters.preTest }}
  - task: VSTest@3
  - ${{ parameters.preSign }}
  - script: sign
```

- For Object, you need to use insert keyword
```yaml
jobs:
- template: jobs/build.yml
  parameters:
    additionalVariables:
      TEST_SUITE: L0,L1
# Default values
parameters:
- name: 'additionalVariables'
  type: object
  default: {}

jobs:
- job: build
  variables:
    configuration: debug
    arch: x86
    ${{ insert }}: ${{ parameters.additionalVariables }}
  steps:
  - task: VSBuild@1
  - task: VSTest@3

```

Some good examples:

```yaml
# File: steps/build.yml

parameters:
- name: 'toolset'
  default: vsbuild
  type: string
  values:
  - vsbuild
  - dotnet

steps:
# msbuild
- ${{ if eq(parameters.toolset, 'msbuild') }}:
  - task: VSBuild@1
  - task: VSTest@3

# dotnet
- ${{ if eq(parameters.toolset, 'dotnet') }}:
  - task: UseDotNet@2
    inputs:
      command: build
  - task: UseDotNet@2
    inputs:
      command: test

# File: azure-pipelines.yml

steps:
- template: steps/build.yml
  parameters:
    toolset: dotnet
```
```yaml
# File: steps/build.yml

parameters:
- name: 'debug'
  type: boolean
  default: false

steps:
- script: tool
  env:
    ${{ if eq(parameters.debug, true) }}:
      TOOL_DEBUG: true
      TOOL_DEBUG_DIR: _dbg

steps:
- template: steps/build.yml
  parameters:
    debug: true

```

```yaml
trigger:
- main

pool: 
   vmImage: 'ubuntu-latest' 

variables:
  - name: myVar
    value: 'baz'

  - name: conditionalVar
    ${{ if eq(variables['myVar'], 'foo') }}:
      value: 'bar'
    ${{ elseif eq(variables['myVar'], 'baz') }}:
      value: 'qux'
    ${{ else }}:
      value: 'default'

steps:
- script: echo "start" # always runs
- ${{ if eq(variables.conditionalVar, 'bar') }}:
  - script: echo "the value of myVar is set in the if condition" # runs when myVar=foo
- ${{ if eq(variables.conditionalVar, 'qux') }}:
  - script: echo "the value of myVar is set in the elseif condition" # runs when myVar=baz
```

Iterative example:

```yaml
# job.yml
parameters:
- name: 'jobs'
  type: jobList
  default: []

jobs:
- ${{ each job in parameters.jobs }}: # Each job
  - ${{ each pair in job }}:          # Insert all properties other than "steps"
      ${{ if ne(pair.key, 'steps') }}:
        ${{ pair.key }}: ${{ pair.value }}
    steps:                            # Wrap the steps
    - task: SetupMyBuildTools@1       # Pre steps
    - ${{ job.steps }}                # Users steps
    - task: PublishMyTelemetry@1      # Post steps
      condition: always()

# azure-pipelines.yml
jobs:
- template: job.yml
  parameters:
    jobs:
    - job: A
      steps:
      - script: echo This will get sandwiched between SetupMyBuildTools and PublishMyTelemetry.
    - job: B
      steps:
      - script: echo So will this!
```

```yaml
parameters:
- name: regions
  type: stringList
  displayName: Regions
  values:
    - WUS
    - CUS
    - EUS
  default: 
    - WUS
    - EUS 

stages:
- ${{ each stage in parameters.regions}}:
  - stage: ${{stage}}
    displayName: Deploy to ${{stage}}
    jobs:
    - job:
      steps:
      - script: ./deploy ${{stage}}
```

```yaml
# job.yml
parameters:
- name: 'jobs'
  type: jobList
  default: []

jobs:
- job: SomeSpecialTool                # Run your special tool in its own job first
  steps:
  - task: RunSpecialTool@1
- ${{ each job in parameters.jobs }}: # Then do each job
  - ${{ each pair in job }}:          # Insert all properties other than "dependsOn"
      ${{ if ne(pair.key, 'dependsOn') }}:
        ${{ pair.key }}: ${{ pair.value }}
    dependsOn:                        # Inject dependency
    - SomeSpecialTool
    - ${{ if job.dependsOn }}:
      - ${{ job.dependsOn }}

# azure-pipelines.yml
jobs:
- template: job.yml
  parameters:
    jobs:
    - job: A
      steps:
      - script: echo This job depends on SomeSpecialTool, even though it's not explicitly shown here.
    - job: B
      dependsOn:
      - A
      steps:
      - script: echo This job depends on both Job A and on SomeSpecialTool.

```

Never use parameters to store secrets.

# Variables
Variables are all strings, and comparing to parameters which are all immutable, variables are mutable. The value of variable can be changed from run to run, job to job.

When evaluate the variables with same name, the most locally scoped variable wins. A variable set at root level can override variables set in UI.

Variables can be used with expressions. They can be written in a template and be used in multiple pipelines.

## User-defined multi-line variables

Make sure use OS supported format to multi-line variables. For example, the ending format.

## System variables

System variables in YAML pipeline are called predefined varaibles. They are read-only and they are set before the run.

## Environment variables
0
Environment variables are specific to the agent system.

# Understand variable syntax

- `${{variables.var}}` is called template expression. It is evaluated before runtime, at compile time. 
  - evaluated as empty string if not provided

- `$[variables.var]` is called runtime expression. It is evaluated at runtime.
  - interpret as empty string if not provided
  - cannot be keyname

- `$(var)` is called macro, it is evaluated before task run.
  - Evaluated after template expression, before task run. 
  - If no value is provided, `$(foo)` will not be changed into other things.
  - Macro syntax cannot use for keyname, for example: `key: $(value)` is valid, but `$(key): value` is not valid. If you need dynamic keyname, you use parameter: `${{parameters.varName}}: hello` 

sample of Environment Variables:
```yaml
variables:
  global_variable: value    # this is available to all jobs

jobs:
- job: job1
  pool:
    vmImage: 'ubuntu-latest'
  variables:
    job_variable1: value1    # this is only available in job1
  steps:
  - bash: echo $(global_variable)
  - bash: echo $(job_variable1)
  - bash: echo $JOB_VARIABLE1 # variables are available in the script environment too

- job: job2
  pool:
    vmImage: 'ubuntu-latest'
  variables:
    job_variable2: value2    # this is only available in job2
  steps:
  - bash: echo $(global_variable)
  - bash: echo $(job_variable2)
  - bash: echo $GLOBAL_VARIABLE
```

Use group variables and variables in a template:
```yaml
variables:
# a regular variable
- name: myvariable
  value: myvalue
# a variable group
- group: myvariablegroup
# a reference to a variable template
- template: myvariabletemplate.yml
```

## Access environment variables
- Batch script: `%VARIABLE_NAME%`
- PowerShell script: `$env:VARIABLE_NAME`
- Bash scipt 


## Set secret variables

This is a protection way to prevent secret are printed in the log or outputs. The best way of using secret is by storing secret in Azure Key Vault.

Variable Group is a group of variables that is defined using Pipeline WebUI, you can mark some of the variable in group as secret, so that they will be masked when print.

# Share variables across pipelines

## Use outputs in the same job

```yaml
steps:
- powershell: echo "##vso[task.setvariable variable=MyVar;isOutput=true]this is the value"
  name: ProduceVar # because we're going to depend on it, we need to name the step
- script: echo $(ProduceVar.MyVar) # this step uses the output variable
```

```yaml
jobs:
- job: A
  steps:
  # assume that MyTask generates an output variable called "MyVar"
  # (you would learn that from the task's documentation)
  - powershell: echo "##vso[task.setvariable variable=MyVar;isOutput=true]this is the value"
  name: ProduceVar # because we're going to depend on it, we need to name the step
- job: B
  dependsOn: A
  variables:
    # map the output variable from A into this job
    varFromA: $[ dependencies.A.outputs['ProduceVar.MyVar'] ]
  steps:
  - script: echo $(varFromA) # this step uses the mapped-in variable
```
```yaml
stages:
- stage: One
  jobs:
  - job: A
    steps:
    - task: MyTask@1  # this step generates the output variable
      name: ProduceVar  # because we're going to depend on it, we need to name the step

- stage: Two
  dependsOn:
  - One
  jobs:
  - job: B
    variables:
      # map the output variable from A into this job
      varFromA: $[ stageDependencies.One.A.outputs['ProduceVar.MyVar'] ]
    steps:
    - script: echo $(varFromA) # this step uses the mapped-in variable

- stage: Three
  dependsOn:
  - One
  - Two
  jobs:
  - job: C
    variables:
      # map the output variable from A into this job
      varFromA: $[ stageDependencies.One.A.outputs['ProduceVar.MyVar'] ]
    steps:
    - script: echo $(varFromA) # this step uses the mapped-in variable
```


```yaml
## azure-pipelines.yml
stages:

- stage: one
  jobs:
  - job: A
    steps:
    - task: Bash@3
      inputs:
          filePath: 'script-a.sh'
      name: setvar
    - bash: |
       echo "##vso[task.setvariable variable=skipsubsequent;isOutput=true]true"
      name: skipstep

- stage: two
  jobs:
  - job: B
    variables:
      - name: StageSauce
        value: $[ stageDependencies.one.A.outputs['setvar.sauce'] ]
      - name: skipMe
        value: $[ stageDependencies.one.A.outputs['skipstep.skipsubsequent'] ]
    steps:
    - task: Bash@3
      inputs:
        filePath: 'script-b.sh'
      name: fileversion
      env:
        StageSauce: $(StageSauce) # predefined in variables section
        skipMe: $(skipMe) # predefined in variables section
    - task: Bash@3
      inputs:
        targetType: 'inline'
        script: |
          echo 'Hello inline version'
          echo $(skipMe) 
          echo $(StageSauce)

```

outpus from previous
```
Hello inline version
true
crushed tomatoes
```

More snippets about how to set variables:

```yaml
steps:
# Create a variable
# Note that this does not update the environment of the current script.
- bash: |
    echo "##vso[task.setvariable variable=sauce]crushed tomatoes"

# An environment variable called `SAUCE` has been added to all downstream steps
- bash: |
    echo "my environment variable is $SAUCE"
- pwsh: |
    Write-Host "my environment variable is $env:SAUCE"
```
```yaml
jobs:
# Set an output variable from job A
- job: A
  pool:
    vmImage: 'windows-latest'
  steps:
  - powershell: echo "##vso[task.setvariable variable=myOutputVar;isOutput=true]this is the value"
    name: setvarStep
  - script: echo $(setvarStep.myOutputVar)
    name: echovar

# Map the variable into job B
- job: B
  dependsOn: A
  pool:
    vmImage: 'ubuntu-latest'
  variables:
    myVarFromJobA: $[ dependencies.A.outputs['setvarStep.myOutputVar'] ]  # map in the variable
                                                                          # remember, expressions require single quotes
  steps:
  - script: echo $(myVarFromJobA)
    name: echovar


# this is the value 
# this is the value
```

```yaml
stages:
- stage: A
  jobs:
  - job: A1
    steps:
     - bash: echo "##vso[task.setvariable variable=myStageOutputVar;isOutput=true]this is a stage output var"
       name: printvar

- stage: B
  dependsOn: A
  variables:
    myVarfromStageA: $[ stageDependencies.A.A1.outputs['printvar.myStageOutputVar'] ]
  jobs:
  - job: B1
    steps:
    - script: echo $(myVarfromStageA)
```

```yaml
jobs:

# Set an output variable from a job with a matrix
- job: A
  pool:
    vmImage: 'ubuntu-latest'
  strategy:
    maxParallel: 2
    matrix:
      debugJob:
        configuration: debug
        platform: x64
      releaseJob:
        configuration: release
        platform: x64
  steps:
  - bash: echo "##vso[task.setvariable variable=myOutputVar;isOutput=true]this is the $(configuration) value"
    name: setvarStep
  - bash: echo $(setvarStep.myOutputVar)
    name: echovar

# Map the variable from the debug job
- job: B
  dependsOn: A
  pool:
    vmImage: 'ubuntu-latest'
  variables:
    myVarFromJobADebug: $[ dependencies.A.outputs['debugJob.setvarStep.myOutputVar'] ]
  steps:
  - script: echo $(myVarFromJobADebug)
    name: echovar
```

```yaml
jobs:

# Set an output variable from a job with slicing
- job: A
  pool:
    vmImage: 'ubuntu-latest'
    parallel: 2 # Two slices
  steps:
  - bash: echo "##vso[task.setvariable variable=myOutputVar;isOutput=true]this is the slice $(system.jobPositionInPhase) value"
    name: setvarStep
  - script: echo $(setvarStep.myOutputVar)
    name: echovar

# Map the variable from the job for the first slice
- job: B
  dependsOn: A
  pool:
    vmImage: 'ubuntu-latest'
  variables:
    myVarFromJobsA1: $[ dependencies.A.outputs['job1.setvarStep.myOutputVar'] ]
  steps:
  - script: "echo $(myVarFromJobsA1)"
    name: echovar
```
```yaml
jobs:

# Set an output variable from a deployment
- deployment: A
  pool:
    vmImage: 'ubuntu-latest'
  environment: staging
  strategy:
    runOnce:
      deploy:
        steps:
        - bash: echo "##vso[task.setvariable variable=myOutputVar;isOutput=true]this is the deployment variable value"
          name: setvarStep
        - bash: echo $(setvarStep.myOutputVar)
          name: echovar

# Map the variable from the job for the first slice
- job: B
  dependsOn: A
  pool:
    vmImage: 'ubuntu-latest'
  variables:
    myVarFromDeploymentJob: $[ dependencies.A.outputs['A.setvarStep.myOutputVar'] ]
  steps:
  - bash: "echo $(myVarFromDeploymentJob)"
    name: echovar
```

## `settableVariables`, a property within a step
```yaml
steps:
- script: echo This is a step
  target:
    settableVariables: none
```
With this, you are not able to set variables.


## Recursive expansion
```yaml
variables:
  myInner: someValue
  myOuter: $(myInner)

steps:
- script: echo $(myOuter)  # prints "someValue"
  displayName: Variable is $(myOuter)  # display name is "Variable is someValue"
```

# Use predefined variables

This is an index of all predefined variables. [See detail](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml)

# Job access token

A job may access resources in Azure DevOps, and it has to perform such job by job access token. The permission of the token is derived from:
- The job authorization scope, set by admin
- The permission you set on project or collection build service account

## Job authorization scope
You can set scope  of job authorization to be collection or project:
- collection, let pipelines access all repos in the collection or Org
- project, let pipelines access repos within project

## Protect access to repositories in YAML pipelines

# Library, resource, & secure files

## Pipeline resources
A pipeline connects or consumes entities, which is resources. They include:
- Service connection
- Agent pool
- Environment
- Variable group
- Secure file
- Repositories
- Packages

### Share resources across pipelines
- use `resources` to access other pipeline's repositories, packages, and pipelines themselves.
- use pipeline UI to include secure file, variable groups, and service connections.

snippet of variable group:
```yaml
# before this, you need to set variable group in Pipelines > Library section

variables:
- group: my-variable-group
```

snippet of `resources`:
```yaml
resources:
  pipelines:
  - pipeline: SmartHotel-resource # identifier for the resource (used in pipeline resource variables)
    source: SmartHotel-CI # name of the pipeline that produces an artifact
```

snippet of download step:

```yaml
resources:
  pipelines:
  - pipeline: resources1
    source: otherPipeline

steps:
- download: resources1
  artifact: artifact1.txt
```
You can also set trigger within `resources`.


## Create and target Azure DevOps environments

An evironment is a goupf of resources. It provides following benefits:
- Deployment history
- Taceability of commits and work items
- Security
- Diagnostic resource health


Environment is where you want to deploy your artifact to, it is used in deployment job.
Deploy environemnt supports Kubernetes and virtual machine resources environments.

# Architectures

## CI/CD
publish artifact is end of CI
Dowload and deploy artifact is the process of CD

# Agents & pools

When you have pipeline runs, the system begins one or more jobs. An agent is the computing infrastructure with installed agent software that runs one job at a time.

Agent has a host machine, a VM that has a OS on it. The host machine can also run container on it. You can run jobs on host machine directly or within a container that is run by host machine.

Agent is registered within Org settings, Agent Pool section, you need to have Agent pool Administrator role.

## Microsft-hosted agents

You can use this within Azure DevOps, it means the agent always has the latest version of the VM image. 

Each time you run a pipeline, you get a fresh VM for each job in the pipeline. The VM is discarded after one job. Any change that a job makes to the virtual machine file system, such as checking out code, is unavailable on the next job.

## Self-hosted agents
You need to manage agent yourself, this feature is provided in Azure DevOps Service and Azure DevOps Server. The machine-level caches and configuration persists from run to run.


## Node.js runner versions

## Azure Virtural Machine Scale Sets agents

## Managed DevOps Pools agent

## Parallel jobs

# Communication

## Communication with Azure Piplines

This means the communicaiton between agent and azure pipeline/Azure DevOps Server. The communication is always initiated by agent. The protocal is HTTP/HTTPS.

The communication standard procedure between agent and server:

1. Agent is registered, and got `listener OAuth token`, and uses it to listen to the job queue by HTTP long poll.
2. When job is available, the agent download the job and got a `job-specific OAuth token`, it uses this token to access or modify resources on the pipeline.
3. Agent discards the job token, after job is completed, and check new ones.

Asymmetric encryption is used when communicate between the agent and server. Public key for server to encrypt, and private key for agent to decrypt.

## Communication to deploy to target servers
When deploying the artifact, if your resources run in Azure VN, you can get the Agent IP ranges to tell firewall to allow access by the agent.

When deploying to the on-premises, the on-premises needs to configure self-hosted agents on themselves, and those agents will connect to the Azure Pipeline, and deploy artifact to the on-premises.