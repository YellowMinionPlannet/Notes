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
