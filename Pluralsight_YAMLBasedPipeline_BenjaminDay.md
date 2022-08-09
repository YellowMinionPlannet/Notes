# Building and Deploying with Azure DevOps YAML Pipeline
## Stages, Jobs, and Steps in YAML

Structure of a Pipeline:

**Pipeline**
- Stages
    * Jobs
        1. step1
        2. step2

Pipeline contains:
* Top level item
* Name of the pipeline
* Global variables
* Agent pool
* Triggers
    * manual only: "none"
    * Branches
    * File paths
    * Tags
* Pull request triggers
* Collections of stages

Stage contains:
* Display name
* Conditions
* Variables
* Collections of Jobs
    * Collections of Steps (each step is a Command line call)
    * Each step run in isolated process, so if one step updates environment variable, other steps can't get updated value by default.(unless you do something)

https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops