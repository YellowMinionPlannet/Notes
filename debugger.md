Array Insert
||i|arr|dIndex|duplicate|
|-|-|-|-|-|
|Init|undefined|[1,0,2,3,0,4,5,0]|0|[1,0,2,3,0,4,5,0]|
||0|[1,0,2,3,0,4,5,0]|1|[1,0,2,3,0,4,5,0]|
||2|[1,0,0,3,0,4,5,0]|2|[1,0,2,3,0,4,5,0]|
|||[1,0,0,2,0,4,5,0]|3|[1,0,2,3,0,4,5,0]|
|||[1,0,0,2,0,4,5,0]|3|[1,0,2,3,0,4,5,0]|
||4|[1,0,0,2,3,4,5,0]|3|[]|


Pipeline - Release Buddy
```yaml
# API-UNIFIEDVISIONSEERVICE/.pipelines/yaml/API-UnifiedVisionService-Release-Buddy.yml
parameters:
- name: devX
  displayName: 'Dev-X environment'
  type: string
  default: 'X'

- name: devRegion
  displayName: Dev deployment region
  default: centralus
  values:
    - centralus

- name: servicesNamespace
  displayName: 'Services Namespace separated by comma'
  type: string
  default: ''

- name: functionalTestFilter
  displayName: 'Filter for Functional Test. If no filter, use filter ""'
  type: string
  default: '--filter "TestRequirement!=BatchImageRetrieval&TestRequirement!=FaceGrouping&TestRequirement!=VideoAnalysis"'

- name: enableVisionBatchFaceGroupingTest
  displayName: 'Enable Vision Batch Face Grouping Test'
  type: boolean
  default: false

variables:
  - name: LinuxContainerImage
    value: 'mcr.microsoft.com/onebranch/azurelinux/build:3.0'
  - name: WindowsContainerImage
    value: onebranch.azurecr.io/windows/ltsc2019/vse2022:latest

  - name: Service.Ev2
    value: Cognitive Services Ev2 endpoint # This is a service connection of Cognitive Service DevOps project. ref: https://msazure.visualstudio.com/Cognitive%20Services/_settings/adminservices?resourceId=7c168067-2f3b-4cd2-82ad-811e4a285c10
  - name: devX
    value: ${{parameters.devX}}
  - name: namespacesFormatted
    value: ${{ replace(parameters.servicesNamespace, '-', '') }}
    
  - name: AgentPoolWindows
    value: 'Iris-1ES-WindowsAgentPool'
  - name: AgentPoolLinux
    value: 'Iris-1ES-LinuxAgentPool'
  - template: templates/vars_cvapi.yml
# API-UNIFIEDVISIONSERVICE/templates/vars_cvapi.yml
variables:
  - group: CVAPI Secrets
  - name: visionParityCheckBaseline
    value: 20241112-sanity-nightly-20241112.2-devcore-centralus_dev_1
  - name: uvsParityCheckBaseline
    value: 20240402-uvs-sanity-20240402.1-dev-uvs-2
  - name: batchSanityTargetTests
    value: sanity,imageretrieval/sanity-i2v-medical
  - name: batchNightlySanityCheckTargetTests
    value: sanity,sanity-notification-webhook,sanity-outputperfile,sanity-storagequeue,sanity-webhook,sanity-inputcontainer,sanity-resultaggregation,sanity-servicebus,sanity--encrypt
  - name: batchNightlyExtendedTestsTargetTests
    value: multichunk-10,pri-low,pri-normal,pri-high,webhook-errorinput,webhook-errorresponse
  - name: batchNightlyImageRetrievalTestsTargetTests
    value: imageretrieval/sanity-i2v,imageretrieval/sanity-i2v-medical,multiple/imageretrieval-image
  - name: batchDocumentSnaityTests
    value: document/custom-generative,document/custom-neural,document/custom-template,document/prebuilt-invoice,document/prebuilt-layout,document/prebuilt-read
  - name: vdiBatchE2ETests
    value: vdi-batch/prebuilt-read_2024-02-29-preview,vdi-batch/gen1_2024-07-31-preview
  - name: vdiBatchTestsApimSubscriptionId
    value: '7f917a6a0a3449b18735ec61dd0ae572'

# GovernedTemplates/v2/OneBranch.NonOfficial.CrossPlat.yml@templates
parameters:
- name: stages
  type: stageList
  default: []
- name: versioning
  type: object
  default: {}
- name: reddog
  type: object
  default: {}
- name: cloudvault
  type: object
  default: {}
- name: nugetPublishing
  type: object
  default: {}
- name: upackPublishing
  type: object
  default: {}
- name: globalSdl
  type: object
  default: {}
- name: git
  type: object
  default: {}
- name: onebranchToolsetTag
  type: string
  default: ''
- name: useTestSdlExtension
  type: boolean
  default: false
- name: retryWatcher
  type: object
  default: {}
- name: featureFlags
  type: object
  default: {}
- name: ev2ManagedSdpRolloutConfig
  type: object
  default: {}
- name: release
  type: object
  default: {}
- name: customTags
  type: string
  default: ''
- name: platform
  type: object
  default:
    name: onebranch
- name: containers
  type: object
  default:
  - container: windows_build_container
    image: $(WindowsContainerImage)
    type: Windows
  - container: windows_build_container2
    image: $(WindowsContainerImage2)
    type: Windows
  - container: linux_build_container
    image: $(LinuxContainerImage)
    type: Linux
  - container: linux_build_container2
    image: $(LinuxContainerImage2)
    type: Linux

# GovernedTemplates/v2/Core.Template.yml
parameters:
- name: containers
  type: object
  default:
  - container: windows_build_container
    image: $(WindowsContainerImage)
    type: Windows
  - container: windows_build_container2
    image: $(WindowsContainerImage2)
    type: Windows
  - container: linux_build_container
    image: $(LinuxContainerImage)
    type: Linux
  - container: linux_build_container2
    image: $(LinuxContainerImage2)
    type: Linux
- name: isOfficial
  type: boolean
- name: stages
  type: stageList
  default: []
- name: versioning
  type: object
  default: {}
- name: reddog
  type: object
  default: {}
- name: cloudvault
  type: object
  default: {}
- name: nugetPublishing
  type: object
  default: {}
- name: upackPublishing
  type: object
  default: {}
- name: globalSdl
  type: object
  default: {}
- name: git
  type: object
  default: {}
- name: onebranchToolsetTag
  type: string
  default: ''
- name: useTestSdlExtension
  type: boolean
  default: false
- name: retryWatcher
  type: object
  default: {}
- name: featureFlags
  type: object
  default: {}
- name: customTags
  type: string
  default: ''
- name: obDialtone
  type: object
  default: {}
- name: ev2ManagedSdpRolloutConfig
  type: object
  default: {}
- name: release
  type: object
  default: {}
- name: platform
  type: object
- name: mainPool
  type: object
resources:
  repositories:
  - repository: 1escoretemplates
    type: git
    name: '1ESPipelineTemplates/1ESPipelineTemplates'
    ref: 'refs/tags/stable'
  - repository: obcoretemplates
    type: git
    name: 'OneBranch.Pipelines/GovernedTemplates'
    ref: 'refs/heads/main'
# variables:
#  - name: LinuxContainerImage
#    value: 'mcr.microsoft.com/onebranch/azurelinux/build:3.0'
#  - name: WindowsContainerImage
#    value: onebranch.azurecr.io/windows/ltsc2019/vse2022:latest
# parameters:
# - name: containers
#  type: object
#  default:
#  - container: windows_build_container
#    image: $(WindowsContainerImage)
#    type: Windows
#  - container: windows_build_container2
#    image: $(WindowsContainerImage2)
#    type: Windows
#  - container: linux_build_container
#    image: $(LinuxContainerImage)
#    type: Linux
#  - container: linux_build_container2
#    image: $(LinuxContainerImage2)
#    type: Linux
  containers:
  - ${{ each container in parameters.containers }}:
    - ${{ if and(eq(parameters.platform.name, 'windows_undocked'),ne(container.endpoint, '')) }}:
      - 'Custom Image container is not allowed in window undocked platform container builds, see https://aka.ms/obpipelines/containers for a list of trusted containers': error
    - ${{ if ne(container.image, '') }}:
      - container: ${{ container.container }}
        image: ${{ container.image }}
        ${{ if ne(container.endpoint, '') }}:
          endpoint: ${{ container.endpoint }}
        ${{ if and(eq(parameters.featureFlags.useLocalImageOnly, true),eq(container.endpoint, '')) }}:
          localImage: true
        ${{ elseif or(eq(container.image, 'onebranch.azurecr.io/windows/ltsc2019/vse2019:latest'),eq(container.image, 'onebranch.azurecr.io/windows/ltsc2019/vse2022:latest'),eq(container.image, 'onebranch.azurecr.io/windows/ltsc2022/vse2022:latest'),eq(container.image, 'onebranch.azurecr.io/linux/ubuntu-2204:latest'),eq(container.image, 'onebranch.azurecr.io/linux/ubuntu-2004:latest'),eq(container.image, 'onebranch.azurecr.io/linux/ubuntu-2004-arm64:latest'),eq(container.image, 'onebranch.azurecr.io/linux/debianlinux:latest'),eq(container.image, 'onebranch.azurecr.io/linux/rockylinux:latest')) }}:
          localImage: true
        ${{ else }}:
          localImage: false
        ${{ if notIn(variables['System.DefinitionId'],338085,248320,248319,341685,294196,294024,331850,247755,247756,290666,248225,248226,328433,247988,247987,302564,247746,247747,330687,295642,248214,319908,247948,247947) }}:
          mapDockerSocket: false
        ${{ if eq(container.type, 'Windows') }}:
          ${{ if eq(parameters.featureFlags.WindowsHostVersion, '1ESWindows') }}:
            options: '--cpu-count 16 --memory 64g'
          ${{ if eq(parameters.featureFlags.WindowsHostVersion, '1ESWindows-D32') }}:
            options: '--cpu-count 32 --memory 128g'
          ${{ if eq(parameters.featureFlags.WindowsHostVersion.Version, '2022HV') }}:
            options: '--cpu-count 8 --memory 24g'
          ${{ if and(eq(parameters.featureFlags.WindowsHostVersion.Disk, 'Large'),eq(parameters.featureFlags.allocateContainerSize, true)) }}:
            options: '--storage-opt size=400GB'
          ${{ if and(eq(parameters.featureFlags.WindowsHostVersion.Disk, 'ExtraLarge'),eq(parameters.featureFlags.allocateContainerSize, true)) }}:
            options: '--storage-opt size=800GB'
          mountReadOnly:
            externals: true
          volumes:
          - c:\obtools_host:c:\obtools_container:ro
          - ${{ if or(eq(coalesce(parameters.globalSdl.prefast.enabled,false), true),eq(parameters.platform.name, 'windows_undocked')) }}:
            - c:\ob_gdn\gdn:c:\__w\_gdn\gdn:rw
            - c:\ob_gdn\packages:c:\__w\_gdn\packages:rw
          env:
            Use_Isolation: true
        ${{ if eq(container.type, 'Linux') }}:
          mountReadOnly:
            externals: true
          volumes:
          - $(Agent.WorkFolder)/telemetry:/__w/telemetry:rw
          - /cache/obtools_host:/cache/obtools_container:ro
          - ${{ if eq(parameters.featureFlags.mariner.extraMounts, true) }}:
            - ${{ each number in parameters.featureFlags.mariner.chrootSuffixes }}:
              - /dev:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/dev:ro
              - /proc:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/proc:ro
              - devpts:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/dev/pts:ro
              - sysfs:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/sys:ro
              - $(Agent.WorkFolder)/mariner/out/RPMS/noarch:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/localrpms/noarch:rw
              - $(Agent.WorkFolder)/mariner/out/RPMS/x86_64:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/localrpms/x86_64:rw
              - $(Agent.WorkFolder)/mariner/out/RPMS/aarch64:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/localrpms/aarch64:rw
              - $(Agent.WorkFolder)/mariner/build/rpm_cache/cache:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/upstream-cached-rpms:rw
              - ${{ if eq(parameters.featureFlags.mariner.extraToolchainMounts, true) }}:
                - $(Agent.WorkFolder)/mariner/build/toolchain_rpms/noarch:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/toolchainrpms/noarch:rw
                - $(Agent.WorkFolder)/mariner/build/toolchain_rpms/x86_64:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/toolchainrpms/x86_64:rw
                - $(Agent.WorkFolder)/mariner/build/toolchain_rpms/aarch64:${{ parameters.featureFlags.mariner.chroot }}${{ number }}/toolchainrpms/aarch64:rw
              - $(Agent.WorkFolder)/mariner:/tmp/mariner:rw
  - ${{ if ne(parameters.featureFlags.runOnHost, true) }}:
    - ${{ if and(eq(parameters.obDialtone.enabled, true),eq(parameters.obDialtone.phase, 'DTONPREM')) }}:
      - container: windows_dialtone
        ${{ if eq(parameters.featureFlags.dialtonePoolType, 'DTV3-containers') }}:
          image: 'official/onebranch/windows/ltsc2022/vse2022:latest'
        ${{ else }}:
          image: 'onebranch.azurecr.io/windows/ltsc2022/vse2022:latest'
        localImage: true
        ${{ if eq(parameters.featureFlags.dialtoneLargeDisk, true) }}:
          options: '--storage-opt size=1500GB'
    - container: windows_onebranch_container
      ${{ if eq(parameters.featureFlags.Windows_SDL_Container_Version, 'vprev') }}:
        image: 'onebranch.azurecr.io/windows/ltsc/sdl:vprev'
      ${{ else }}:
        image: 'onebranch.azurecr.io/windows/ltsc/sdl:latest'
      ${{ if eq(parameters.featureFlags.WindowsHostVersion, '1ESWindows') }}:
        options: '--cpu-count 16 --memory 16g'
      ${{ if eq(parameters.featureFlags.WindowsHostVersion, '1ESWindows-D32') }}:
        options: '--cpu-count 32 --memory 32g'
      volumes:
      - c:\obtools_host:c:\obtools_container:rw
      - c:\ob_dotnet:c:\__t\dotnet:rw
      - c:\ob_gdn\gdn:c:\__w\_gdn\gdn:rw
      - c:\ob_gdn\packages:c:\__w\_gdn\packages:rw
      env:
        Use_Isolation: true
    - container: windows_onebranch_container_signing
      ${{ if eq(parameters.featureFlags.Windows_Signing_Container_Version, 'vprev') }}:
        image: 'onebranch.azurecr.io/windows/ltsc/sdl:vprev'
      ${{ else }}:
        image: 'onebranch.azurecr.io/windows/ltsc/sdl:latest'
      ${{ if eq(parameters.featureFlags.WindowsHostVersion, '1ESWindows') }}:
        options: '--cpu-count 16 --memory 16g'
      ${{ if eq(parameters.featureFlags.WindowsHostVersion, '1ESWindows-D32') }}:
        options: '--cpu-count 32 --memory 32g'
      volumes:
      - c:\obtools_host:c:\obtools_container:rw
      - c:\ob_dotnet:c:\__t\dotnet:rw
      - c:\ob_gdn\gdn:c:\__w\_gdn\gdn:rw
      - c:\ob_gdn\packages:c:\__w\_gdn\packages:rw
      env:
        Use_Isolation: true
    - container: linux_onebranch_container
      ${{ if eq(parameters.featureFlags.Linux_SDL_Container_Version, 'vprev') }}:
        image: 'mcr.microsoft.com/onebranch/cbl-mariner/build:2.0'
      ${{ else }}:
        image: 'mcr.microsoft.com/onebranch/azurelinux/build:3.0'
      volumes:
      - $(Agent.WorkFolder)/telemetry:/__w/telemetry:rw
      - /cache/obtools_host:/cache/obtools_container:rw
    - container: linux_onebranch_signing_container
      ${{ if eq(parameters.featureFlags.Linux_Signing_Container_Version, 'vprev') }}:
        image: 'mcr.microsoft.com/onebranch/cbl-mariner/build:2.0'
      ${{ else }}:
        image: 'mcr.microsoft.com/onebranch/azurelinux/build:3.0'
      ${{ if eq(parameters.featureFlags.Linux_Signing_Container_Increased_Memory, true) }}:
        options: '--memory 8g'
      ${{ if eq(parameters.featureFlags.Linux_Signing_Container_Increased_Memory, 1) }}:
        options: '--memory 8g'
      ${{ if eq(parameters.featureFlags.Linux_Signing_Container_Increased_Memory, 2) }}:
        options: '--memory 12g'
      ${{ if eq(parameters.featureFlags.Linux_Signing_Container_Increased_Memory, 3) }}:
        options: '--memory 16g'
      volumes:
      - $(Agent.WorkFolder)/telemetry:/__w/telemetry:rw
      - /cache/obtools_host:/cache/obtools_container:rw
    - container: linux_arm64_onebranch_container
      ${{ if eq(parameters.featureFlags.Linux_arm64_SDL_Container_Version, 'vprev') }}:
        image: 'onebranch.azurecr.io/linux/ubuntu-2004-arm64:latest'
      ${{ else }}:
        image: 'mcr.microsoft.com/onebranch/azurelinux/build:3.0'
      volumes:
      - $(Agent.WorkFolder)/telemetry:/__w/telemetry:rw
      - /cache/obtools_host:/cache/obtools_container:rw
    - container: linux_arm64_onebranch_signing_container
      ${{ if eq(parameters.featureFlags.Linux_arm64_Signing_Container_Version, 'vprev') }}:
        image: 'onebranch.azurecr.io/linux/ubuntu-2004-arm64:latest'
      ${{ else }}:
        image: 'mcr.microsoft.com/onebranch/azurelinux/build:3.0'
      volumes:
      - $(Agent.WorkFolder)/telemetry:/__w/telemetry:rw
      - /cache/obtools_host:/cache/obtools_container:rw

```

Main Logic
```yaml
# API-UNIFIEDVISIONSERVICE/.pipelines/yaml/API-UnifiedVisionService-Release-Buddy.yml
extends:
  template: v2/OneBranch.NonOfficial.CrossPlat.yml@templates
  parameters:
    cloudvault:
      enabled: false

    globalSdl:
      tsa:
       enabled: false
      policheck:
        break: true

    stages:
    - stage: Validation
      jobs:
        - template: .pipelines/yaml/templates/job_rename_build.yml@self
          parameters:
            listOfNamespaces: ${{parameters.servicesNamespace}}

        - ${{ each namespace in split(parameters.servicesNamespace, ',') }}:
          - template: .pipelines/yaml/templates/job_image_validation.yml@self
            parameters:
              pdaArtifactName: pda-buddy
              buildType: buddy
              serviceNamespace: ${{namespace}}

    - stage: Replication
      dependsOn:
        - Validation
      jobs:
        - ${{ each namespace in split(parameters.servicesNamespace, ',') }}:
          - template: .pipelines/yaml/templates/job_acr_copy.yml@self
            parameters:
              buildType: buddy
              serviceNamespace: ${{namespace}}

    - stage: Deploy
      dependsOn:
        - Validation
      jobs:
        - ${{ each namespace in split(parameters.servicesNamespace, ',') }}:
          - ${{ if eq(namespace, 'uvs') }}:
            - template: .pipelines/yaml/templates/job_db_migration.yml@self
              parameters:
                region: 'eastus'
                rolloutFile: 'uvsdev-${{parameters.devX}}_RolloutSpec.json'
                environment: 'Test'
                namespace: ${{namespace}}
                uvsArtifactName: 'uvs-buddy'

          - template: .pipelines/yaml/templates/job_deploy.yml@self
            parameters:
              pdaArtifactName: pda-buddy
              buildType: buddy
              devX: ${{parameters.devX}}
              devRegion: ${{parameters.devRegion}}
              serviceNamespace: ${{namespace}}
              ${{ if eq(namespace, 'uvs') }}:
                extraDependencies: DBMigration_Test_${{namespace}}

    - stage: ApimDeploy
      dependsOn:
        - Deploy
      jobs:
        - ${{ each namespace in split(parameters.servicesNamespace, ',') }}:
          - template: .pipelines/yaml/templates/job_apim_deploy.yml@self
            parameters:
              devRegion: ${{parameters.devRegion}}
              uvsArtifactName: uvs-buddy
              buildType: buddy
              devX: ${{parameters.devX}}
              serviceNamespace: ${{namespace}}

    # Loop per namespace and apply the necessary tests, if applicable
    - ${{ each namespace in split(parameters.servicesNamespace, ',') }}:
      # Functional tests for retrieval
      - ${{ if eq(namespace, 'uvsretrieval') }}:
        - stage: Retrieval_FunctionalTests
          dependsOn:
            - ApimDeploy
          jobs:
            - template: .pipelines/yaml/templates/job_functional_test.yml@self
              parameters:
                uvsArtifactName: uvs-buddy
                buildType: buddy
                devX: ${{parameters.devX}}
                serviceNamespace: ${{namespace}}
                functionalTestFilter: ${{parameters.functionalTestFilter}}
                directoryToDownload: 'Retrieval'

            - ${{ if contains(parameters.servicesNamespace, 'vision-batch') }}:
              - template: .pipelines/yaml/templates/job_run_batch.yml@self
                parameters:
                  devX: ${{parameters.devX}}
                  devRegion: ${{parameters.devRegion}}
                  targetTests: 'searchmetadata|sanity'

      # Functional tests for uvs
      - ${{ if eq(namespace, 'uvs') }}:
        - stage: EndpointTest
          dependsOn:
            - ApimDeploy
          jobs:
            - template: .pipelines/yaml/templates/job_endpoint_test.yml@self
              parameters:
                devX: ${{parameters.devX}}

        - stage: Uvs_Tests_Operations
          dependsOn:
            - EndpointTest
          jobs:
            - template: .pipelines/yaml/templates/job_functional_test.yml@self
              parameters:
                uvsArtifactName: uvs-buddy
                buildType: buddy
                devX: ${{parameters.devX}}
                serviceNamespace: ${{namespace}}
                functionalTestFilter: ${{parameters.functionalTestFilter}}
                directoryToDownload: 'Operations'

        - stage: Uvs_Tests_Training
          dependsOn:
            - EndpointTest
          jobs:
            - job: waitTrainingTests
              displayName: Wait for approval to run Training tests
              pool:
                type: agentless
              timeoutInMinutes: 1440
              steps:
                - task: ManualValidation@0
                  displayName: Run Uvs Training tests
                  timeoutInMinutes: 1440
                  inputs:
                    notifyUsers: false
                    instructions: Run Uvs Training tests

            - template: .pipelines/yaml/templates/job_functional_test.yml@self
              parameters:
                uvsArtifactName: uvs-buddy
                buildType: buddy
                devX: ${{parameters.devX}}
                serviceNamespace: ${{namespace}}
                functionalTestFilter: ${{parameters.functionalTestFilter}}
                directoryToDownload: 'Training'
                extraDependencies: waitTrainingTests

        - stage: Uvs_Tests_VideoAnalysis
          dependsOn:
            - ApimDeploy
          jobs:
            - template: .pipelines/yaml/templates/job_functional_test.yml@self
              parameters:
                uvsArtifactName: uvs-buddy
                buildType: buddy
                devX: ${{parameters.devX}}
                serviceNamespace: ${{namespace}}
                functionalTestFilter: ${{parameters.functionalTestFilter}}
                directoryToDownload: 'VideoAnalysis'

      # Functional tests for gptv
      - ${{ if eq(namespace, 'gptv') }}:
        - stage: Gptv_FunctionalTests
          dependsOn:
            - ApimDeploy
          jobs:
            - template: .pipelines/yaml/templates/job_functional_test.yml@self
              parameters:
                uvsArtifactName: uvs-buddy
                buildType: buddy
                devX: ${{parameters.devX}}
                serviceNamespace: ${{namespace}}
                functionalTestFilter: ''
                directoryToDownload: 'Gptv'

      # Parity check for vision or uvs
      - ${{ if or(eq(namespace, 'vision'), eq(namespace, 'uvs')) }}:
        - stage: ParityCheck_${{namespace}}
          dependsOn:
            - ApimDeploy
          variables:
            ${{ if eq(namespace, 'vision') }}:
              parityTestSuiteName: 'sanity'
            ${{ else }}:
              parityTestSuiteName: 'uvs-sanity'
          jobs:
            - template: .pipelines/yaml/templates/job_parity_check.yml@self
              parameters:
                devX: ${{parameters.devX}}
                serviceNamespace: ${{namespace}}
                devRegion: ${{parameters.devRegion}}
                parityTestApiVersion: '3.2'
                parityTestSuiteName: $(parityTestSuiteName)

      # Tests for vision-batch
      - ${{ if eq(namespace, 'vision-batch') }}:
        - stage: BatchSanityCheck
          dependsOn:
            - ApimDeploy
          jobs:
            - ${{ each targetTest in split(variables.batchSanityTargetTests, ',') }}:
              - template: .pipelines/yaml/templates/job_run_batch.yml@self
                parameters:
                  devX: ${{parameters.devX}}
                  devRegion: ${{parameters.devRegion}}
                  targetTests: ${{targetTest}}

            - ${{ each targetTest in split(variables.batchDocumentSnaityTests, ',') }}:
              - template: .pipelines/yaml/templates/job_run_batch.yml@self
                parameters:
                  devX: ${{parameters.devX}}
                  devRegion: ${{parameters.devRegion}}
                  targetTests: ${{targetTest}}

        - ${{ if or(parameters.enableVisionBatchFaceGroupingTest, in(parameters.devX, '0', 'X', '1', '2', '6', '12')) }}:
          - stage: BatchFaceGroupingTest
            dependsOn:
              - BatchSanityCheck
            jobs:
              - template: .pipelines/yaml/templates/job_batch_facegroup_test.yml@self
                parameters:
                  devX: ${{parameters.devX}}
                  devRegion: ${{parameters.devRegion}}
# /GovernedTemplates/v2/OneBranch.NonOfiicial.CrossPlat.yml
extends:
  template: /v2/Core.Template.yml
  parameters:
    containers: ${{ parameters.containers }}
    isOfficial: false
    ${{ if eq(parameters.platform.name, 'onebranch') }}:
      stages: ${{ parameters.stages }}
      versioning: ${{ parameters.versioning }}
      cloudvault: ${{ parameters.cloudvault }}
      globalSdl: ${{ parameters.globalSdl }}
      git: ${{ parameters.git }}
      onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
      useTestSdlExtension: ${{ parameters.useTestSdlExtension }}
      retryWatcher: ${{ parameters.retryWatcher }}
      featureFlags: ${{ parameters.featureFlags }}
      customTags: ${{ parameters.customTags }}
      nugetPublishing: ${{ parameters.nugetPublishing }}
      upackPublishing: ${{ parameters.upackPublishing }}
      ev2ManagedSdpRolloutConfig: ${{ parameters.ev2ManagedSdpRolloutConfig }}
      release: ${{ parameters.release }}
      reddog: {}
      platform: ${{ parameters.platform }}
      mainPool:
        ${{ if and(eq(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),eq(parameters.featureFlags.useValidationPool, true)) }}:
          name: 'OneBranchPipelines-V2-Validation'
        ${{ else }}:
          name: OneBranchPipelines
        ${{ if eq(parameters.featureFlags.useStandardSKU, false) }}:
          RepositoryId: ${{ parameters.featureFlags.skuRepositoryId }}
        ${{ if ne(parameters.featureFlags.WindowsHostVersion, '') }}:
          WindowsHostVersion: ${{ parameters.featureFlags.WindowsHostVersion }}
        ${{ if ne(parameters.featureFlags.LinuxHostVersion, '') }}:
          LinuxHostVersion: ${{ parameters.featureFlags.LinuxHostVersion }}
        ${{ if eq(parameters.featureFlags.useUbuntu2004, true) }}:
          HostVersion: Ubuntu2004
    ${{ elseif eq(parameters.platform.name, 'windows_undocked') }}:
      stages: ${{ parameters.stages }}
      versioning: ${{ parameters.versioning }}
      cloudvault: ${{ parameters.cloudvault }}
      globalSdl: ${{ parameters.globalSdl }}
      git: ${{ parameters.git }}
      onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
      useTestSdlExtension: ${{ parameters.useTestSdlExtension }}
      retryWatcher: ${{ parameters.retryWatcher }}
      featureFlags: ${{ parameters.featureFlags }}
      customTags: ${{ parameters.customTags }}
      nugetPublishing: ${{ parameters.nugetPublishing }}
      upackPublishing: ${{ parameters.upackPublishing }}
      reddog: {}
      platform: ${{ parameters.platform }}
      mainPool:
        ${{ if and(eq(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),eq(parameters.featureFlags.useValidationPool, true)) }}:
          name: 'OneBranchPipelines-V2-Validation'
        ${{ if or(ne(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),ne(parameters.featureFlags.useValidationPool, true)) }}:
          name: OneBranchPipelines
        ${{ if eq(parameters.featureFlags.useStandardSKU, false) }}:
          RepositoryId: ${{ parameters.featureFlags.skuRepositoryId }}
        ${{ if ne(parameters.featureFlags.WindowsHostVersion, '') }}:
          WindowsHostVersion: ${{ parameters.featureFlags.WindowsHostVersion }}
        ${{ if ne(parameters.featureFlags.LinuxHostVersion, '') }}:
          LinuxHostVersion: ${{ parameters.featureFlags.LinuxHostVersion }}
        ${{ if eq(parameters.featureFlags.useUbuntu2004, true) }}:
          HostVersion: Ubuntu2004
    ${{ elseif eq(parameters.platform.name, 'm365') }}:
      stages: ${{ parameters.stages }}
      platform: ${{ parameters.platform }}
      featureFlags: ${{ parameters.featureFlags }}
      mainPool:
        name: m365
    ${{ elseif eq(parameters.platform.name, 'microsoftit') }}:
      stages: ${{ parameters.stages }}
      platform: ${{ parameters.platform }}
      onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
      featureFlags: ${{ parameters.featureFlags }}
      globalSdl: ${{ parameters.globalSdl }}
      mainPool:
        name: OneBranchPipelines
    ${{ else }}:
      'Platform is not set. Possible values ''onebranch'', ''windows_undocked'', ''m365'', ''microsoftit''': error

# /GovernedTemplates/v2/Core.Template.yml
extends:
  ${{ if not(eq(coalesce(parameters.featureFlags.use1esentry,false), true)) }}:
    template: /v2/Core.Internal.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
  ${{ elseif eq(parameters.isOfficial, true) }}:
    template: /v1/1ES.Official.PipelineTemplate.yml@${{ replace(replace(eq(parameters.featureFlags.use1ESPTCanary, true), true, '1escoretemplatescanary'), false, '1escoretemplates') }}
  ${{ else }}:
    template: /v1/1ES.Unofficial.PipelineTemplate.yml@${{ replace(replace(eq(parameters.featureFlags.use1ESPTCanary, true), true, '1escoretemplatescanary'), false, '1escoretemplates') }}
  parameters:
    stages:
    - ${{ if eq(parameters.obDialtone.enabled, true) }}:
      - ${{ if and(contains(variables['System.CollectionId'], '41bf5486-7392-4b7a-a7e3-a735c767e3b3'),eq(parameters.obDialtone.phase, 'DTONPREM')) }}:
        - 'Error: "DTONPREM" are not valid options for Dialtone Hybrid Pipeline. Please update DialtoneBuildEnvironment and DialtoneBuildPhase to "DT" and "DTONLINE" parameters': error
    - ${{ if and(ne(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),ne(variables['System.TeamProjectId'], 'dc5b2fca-9be8-42fb-812e-78101e84b889'),eq(parameters.featureFlags.use1ESPTCanary, true)) }}:
      - 'use1ESPTCanary is not supported for the current instance': error
    - ${{ if and(ne(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),parameters.featureFlags.obcanary) }}:
      - 'obcanary is not supported for the current instance': error
    - ${{ if and(ne(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),ne(parameters.onebranchToolsetTag, '')) }}:
      - 'onebranchToolsetTag is not supported for the current instance': error
    - ${{ if and(ne(parameters.globalSdl.policy, ''),ne(parameters.globalSdl.policy, 'Microsoft'),ne(parameters.globalSdl.policy, 'M365'),ne(parameters.globalSdl.policy, 'OneBranch-Retail')) }}:
      - 'SDL Policy ${{ parameters.globalSdl.policy }} is not supported. Supported types: Microsoft, M365, OneBranch-Retail. Default is OneBranch-Retail': error
    - ${{ if and(contains(convertToJson(parameters.stages.*.jobs.*.steps.*.task), 'ArtifactReplication@1'),or(contains(convertToJson(parameters.stages.*.jobs.*.steps.*.task), 'ExpressV2Internal@1'),contains(convertToJson(parameters.stages.*.jobs.*.steps.*.task), 'Ev2RARollout@2'))) }}:
      - 'ArtifactReplication@1 task is not allowed to be used with ExpressV2Internal@1 or Ev2RARollout@2 tasks within a single pipeline': error
    - ${{ if and(eq(parameters.platform.name, 'onebranch'),eq(contains(convertToJson(parameters.stages.*.jobs.*.steps.*.task), 'Ev2RARollout@2'), true)) }}:
      - ${{ if eq(contains(convertToJson(parameters.stages.*.jobs.*.steps.*.task), 'ExpressV2Internal@1'), true) }}:
        - 'Pipeline can contain either Ev2 classic or Ev2 RA task but not both across stages': error
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'Production') }}:
                    - ${{ stage }}
          environment: Production
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'Fairfax') }}:
                    - ${{ stage }}
          environment: Fairfax
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'Mooncake') }}:
                    - ${{ stage }}
          environment: Mooncake
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'USSec') }}:
                    - ${{ stage }}
          environment: USSec
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'USNat') }}:
                    - ${{ stage }}
          environment: USNat
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'Bleu') }}:
                    - ${{ stage }}
          environment: Bleu
      - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          ev2_ra_rollout_stages:
          - ${{ each stage in parameters.stages }}:
            - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
              - ${{ each v in stage.variables }}:
                - ${{ if eq(v.name, 'ob_release_environment') }}:
                  - ${{ if eq(v.value, 'Delos') }}:
                    - ${{ stage }}
          environment: Delos
      - ${{ if eq(parameters.isOfficial, true) }}:
        - template: /v2/Jobs/ReleaseValidations/Release.MultipleStages.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
          parameters:
            ev2_ra_rollout_stages:
            - ${{ each stage in parameters.stages }}:
              - ${{ if eq(contains(convertToJson(stage.jobs.*.steps.*.task), 'Ev2RARollout@2'), true) }}:
                - ${{ each v in stage.variables }}:
                  - ${{ if eq(v.name, 'ob_release_environment') }}:
                    - ${{ if eq(v.value, 'PPE') }}:
                      - ${{ stage }}
            environment: PPE
    - ${{ if and(eq(parameters.obDialtone.enabled, true),eq(parameters.obDialtone.phase, 'DTONPREM')) }}:
      - template: /v2/Stages/Dialtone.DTEnvBuild.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
        parameters:
          isOfficial: ${{ parameters.isOfficial }}
          stages: ${{ parameters.stages }}
          isDTEvent: ${{ coalesce(parameters.obDialtone.isDTEvent,false) }}
          enableNetworkIsolation: ${{ coalesce(parameters.obDialtone.enableNetworkIsolation,true) }}
          featureFlags: ${{ parameters.featureFlags }}
          globalSdl: ${{ parameters.globalSdl }}
          git: ${{ parameters.git }}
          enableUseDotNet: ${{ coalesce(parameters.obDialtone.enableUseDotNet,false) }}
          cloudvault: ${{ parameters.cloudvault }}
          onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
          enableSigningOnLargeRepo: ${{ coalesce(parameters.obDialtone.enableSigningOnLargeRepo,false) }}
          enableVhdOnLargeRepo: ${{ coalesce(parameters.obDialtone.enableVhdOnLargeRepo,false) }}
          publishLogsOnly: ${{ coalesce(parameters.obDialtone.publishLogsOnly,parameters.obDialtone.syncAndQueueOnly,false) }}
          skipDTV3PipelineArtifactUpload: ${{ coalesce(parameters.obDialtone.skipDTV3PipelineArtifactUpload,false) }}
    - ${{ else }}:
      - ${{ if not(eq(coalesce(parameters.featureFlags.use1esentry,false), true)) }}:
        - ${{ if or(eq(length(parameters.stages), 0),eq(containsValue(parameters.stages.*.jobs.*.pool.type, 'windows'), true),eq(containsValue(parameters.stages.*.jobs.*.pool.type, 'linux'), true),eq(containsValue(parameters.stages.*.jobs.*.pool.type, 'docker'), true),eq(containsValue(parameters.stages.*.jobs.*.pool.type, 'gitPushVersion'), true)) }}:
          - ${{ if eq(parameters.platform.name, 'm365') }}:
            - 'As part of MOBR release pipelines we only support job type as "release" or "server"': error
          - ${{ if or(parameters.isOfficial,eq(coalesce(parameters.globalSdl.sourcesAnalysisStage.enabled,true), true)) }}:
            - template: /v2/Stages/SDL.SourceAnalysis.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
              parameters:
                stages: ${{ parameters.stages }}
                globalSdl: ${{ parameters.globalSdl }}
                git: ${{ parameters.git }}
                onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                useTestSdlExtension: ${{ parameters.useTestSdlExtension }}
                featureFlags: ${{ parameters.featureFlags }}
                isOfficial: ${{ parameters.isOfficial }}
                platform: ${{ parameters.platform }}
                mainPool: ${{ parameters.mainPool }}
                targets:
                  ${{ if or(eq(coalesce(parameters.featureFlags.runHostSDL,true), true),eq(parameters.featureFlags.runOnHost, true)) }}:
                    generic: host
                  ${{ else }}:
                    generic: windows_onebranch_container
      - ${{ if and(eq(parameters.obDialtone.phase, 'DTONLINE'),eq(parameters.obDialtone.build_env, 'DT')) }}:
        - ${{ each stage in parameters.stages }}:
          - ${{ if eq(stage.templateContext.dialtonePrebuild, true) }}:
            - stage: ${{ stage.stage }}
              ${{ if ne(stage.displayName, '') }}:
                displayName: ${{ stage.displayName }}
              ${{ if ne(join(stage.dependsOn, ','), '') }}:
                dependsOn: ${{ stage.dependsOn }}
              ${{ if ne(stage.condition, '') }}:
                condition: ${{ stage.condition }}
              ${{ if ne(stage.variables, '') }}:
                variables: ${{ stage.variables }}
              ${{ if ne(stage.isSkippable, '') }}:
                isSkippable: ${{ stage.isSkippable }}
              ${{ if ne(stage.lockBehavior, '') }}:
                lockBehavior: ${{ stage.lockBehavior }}
              jobs:
              - ${{ if or(eq(parameters.isOfficial, true),eq(parameters.featureFlags.policyValidation, true)) }}:
                - template: /v2/Jobs/PolicyValidation.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                    featureFlags: ${{ parameters.featureFlags }}
              - ${{ each job in stage.jobs }}:
                - ${{ if and(ne(job.pool.type, 'windows'),ne(job.pool.type, 'linux'),ne(job.pool.type, 'cloudTestAgentless'),ne(job.pool.type, 'agentless'),ne(job.pool.type, 'docker'),ne(job.pool.type, 'gitPushVersion'),ne(job.pool.type, 'release')) }}:
                  - 'Job type pool type ${{ job.pool.type }} is not supported. Supported types: windows, linux, cloudTestAgentless, agentless, docker, gitPushVersion, release': error
                - ${{ if eq(job.pool.type, 'windows') }}:
                  - ${{ if and(eq(coalesce(parameters.featureFlags.use1esentry,false), true),or(eq(parameters.isOfficial, true),eq(job.pool.isCustom, true))) }}:
                    - 'windows official/custom jobs are not supported with new 1ES PT entry in official pipelines.': error
                  - ${{ if and(eq(coalesce(parameters.featureFlags.use1esentry,false), true),or(eq(parameters.isOfficial, true),eq(parameters.platform.name, 'windows_undocked'))) }}:
                    - 'windows_undocked jobs are not supported with new 1ES PT entry in official pipelines.': error
                  - ${{ if eq(job.pool.isCustom, true) }}:
                      template: /v2/Jobs/Windows.Custom.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                    ${{ elseif eq(parameters.isOfficial, true) }}:
                      template: /v2/Jobs/Windows.Official.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                    ${{ else }}:
                      template: /v2/Jobs/Windows.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                    parameters:
                      parentStage: ${{ stage.stage }}
                      job: ${{ job }}
                      git: ${{ parameters.git }}
                      versioning: ${{ parameters.versioning }}
                      reddog: ${{ parameters.reddog }}
                      cloudvault: ${{ parameters.cloudvault }}
                      nugetPublishing: ${{ parameters.nugetPublishing }}
                      upackPublishing: ${{ parameters.upackPublishing }}
                      globalSdl: ${{ parameters.globalSdl }}
                      featureFlags: ${{ parameters.featureFlags }}
                      ${{ if ne(parameters.useTestSdlExtension, true) }}:
                        sdlExtensionPrefix: 'securedevelopmentteam.vss-secure-development-tools'
                      ${{ else }}:
                        sdlExtensionPrefix: 'ms-secdevops-test.vss-secure-development-tools-test'
                      onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                      customTags: ${{ parameters.customTags }}
                      mainPool: ${{ parameters.mainPool }}
                      containers: ${{ parameters.containers }}
                      platform: ${{ parameters.platform }}
                      obDialtone: ${{ parameters.obDialtone }}
                      use1esEntry: ${{ eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}
                      isOfficial: ${{ parameters.isOfficial }}
                      runOnHost: ${{ coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false) }}
                      targets:
                        ${{ if or(eq(coalesce(parameters.featureFlags.runHostSDL,true), true),eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          generic: host
                        ${{ if and(ne(coalesce(parameters.featureFlags.runHostSDL,true), true),ne(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          generic: windows_onebranch_container
                        ${{ if or(eq(coalesce(parameters.featureFlags.runHostSigningSetup,true), true),eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          signing: host
                        ${{ else }}:
                          signing: windows_onebranch_container_signing
                - ${{ if eq(job.pool.type, 'gitPushVersion') }}:
                  - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
                    - 'Git push version job is not suported with new 1ES PT entry.': error
                  - template: /v2/Jobs/Windows.GitPushVersion.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                    parameters:
                      versioning: ${{ parameters.versioning }}
                      job: ${{ job }}
                      onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                      featureFlags: ${{ parameters.featureFlags }}
                      ${{ if eq(parameters.isOfficial, true) }}:
                        buildType: Official
                      ${{ if ne(parameters.isOfficial, true) }}:
                        buildType: Buddy
                      containers: ${{ parameters.containers }}
                      globalSdl: ${{ parameters.globalSdl }}
                      isOfficial: ${{ parameters.isOfficial }}
        - template: /v2/Stages/Dialtone.StartDTEnvBuild.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
          parameters:
            isOfficial: ${{ parameters.isOfficial }}
            stages: ${{ parameters.stages }}
            platform: ${{ parameters.platform }}
            reddog: ${{ parameters.reddog }}
            mainPool: ${{ parameters.mainPool }}
            main_container: windows_build_container
            onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
            customTags: ${{ parameters.customTags }}
            featureFlags: ${{ parameters.featureFlags }}
            obDialtone: ${{ parameters.obDialtone }}
            versioning: ${{ parameters.versioning }}
            git: ${{ parameters.git }}
            hasDialtoneStage:
            - ${{ each stage in parameters.stages }}:
              - ${{ each userJob in stage.jobs }}:
                - ${{ if and(eq(userJob.templateContext.dialtoneEnabled, true),eq(stage.templateContext.dialtoneEnabled, true)) }}:
                    value: true
            hasPrebuildStage:
            - ${{ each stage in parameters.stages }}:
              - ${{ if eq(stage.templateContext.dialtonePrebuild, true) }}:
                  value: true
      - ${{ each stage in parameters.stages }}:
        - ${{ if and(eq(containsValue(stage.jobs.*.pool.type, 'release'), false),eq(containsValue(stage.jobs.*.pool.type, 'server'), false),ne(stage.templateContext.dialtonePrebuild, true)) }}:
          - ${{ if eq(parameters.platform.name, 'm365') }}:
            - 'You cannot use the features of composite pipelines with M365 Platform': error
          - stage: ${{ stage.stage }}
            ${{ each property in stage }}:
              ${{ if in(property.key,'displayName','condition','variables','isSkippable','lockBehavior') }}:
                ${{ property.key }}: ${{ property.value }}
              ${{ elseif notIn(property.key,'stage','jobs','dependsOn','templateContext') }}:
                'Stage ''${{ property.key }}'' is not allowed, please remove this.': error
            ${{ if and(eq(parameters.obDialtone.enabled, true),eq(parameters.obDialtone.phase, 'DTONLINE'),eq(parameters.obDialtone.build_env, 'DT'),eq(stage.templateContext.dialtoneEnabled, true)) }}:
              ${{ if and(ne(stage.dependsOn, ''),ne(join(stage.dependsOn, ','), '')) }}:
                dependsOn:
                - ${{ stage.dependsOn }}
                - DialtoneEnvironmentBuild
              ${{ else }}:
                dependsOn:
                - DialtoneEnvironmentBuild
            ${{ elseif ne(join(stage.dependsOn, ','), '') }}:
              dependsOn: ${{ stage.dependsOn }}
            jobs:
            - ${{ if or(eq(parameters.isOfficial, true),eq(parameters.featureFlags.policyValidation, true)) }}:
              - template: /v2/Jobs/PolicyValidation.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                parameters:
                  onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                  featureFlags: ${{ parameters.featureFlags }}
            - ${{ each job in stage.jobs }}:
              - ${{ if eq(job.pool.type, 'windows') }}:
                - ${{ if and(eq(coalesce(parameters.featureFlags.use1esentry,false), true),or(eq(parameters.isOfficial, true),eq(job.pool.isCustom, true))) }}:
                  - 'windows official/custom jobs are not supported with new 1ES PT entry in official pipelines.': error
                - ${{ if and(eq(coalesce(parameters.featureFlags.use1esentry,false), true),or(eq(parameters.isOfficial, true),eq(parameters.platform.name, 'windows_undocked'))) }}:
                  - 'windows_undocked jobs are not supported with new 1ES PT entry in official pipelines.': error
                - ${{ if eq(job.pool.isCustom, true) }}:
                    template: /v2/Jobs/Windows.Custom.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  ${{ elseif eq(parameters.isOfficial, true) }}:
                    template: /v2/Jobs/Windows.Official.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  ${{ else }}:
                    template: /v2/Jobs/Windows.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    parentStage: ${{ stage.stage }}
                    ${{ if and(eq(parameters.obDialtone.enabled, true),eq(parameters.obDialtone.phase, 'DTONLINE'),eq(parameters.obDialtone.build_env, 'DT'),eq(stage.templateContext.dialtoneEnabled, true),eq(job.templateContext.dialtoneEnabled, true)) }}:
                      job:
                        job: ${{ job.job }}
                        displayName: 'Dialtone Build Drop Download'
                        variables:
                        - name: dialtoneDropPath
                          value: $[ stageDependencies.DialtoneEnvironmentBuild.ExecuteInDialtoneEnvironment.outputs['DTV3BuildTriggerTask.${{ stage.stage }}-${{ job.job }}'] ]
                        - name: dialtoneTestResultsPath
                          value: $[ stageDependencies.DialtoneEnvironmentBuild.ExecuteInDialtoneEnvironment.outputs['DTV3BuildTriggerTask.${{ stage.stage }}-${{ job.job }}-TestResults'] ]
                        - name: dialtoneDropServiceUri
                          value: $[ stageDependencies.DialtoneEnvironmentBuild.ExecuteInDialtoneEnvironment.outputs['DTV3BuildTriggerTask.dialtoneDropServiceUri'] ]
                        - ${{ if ne(job.variables, '') }}:
                          - ${{ each v in job.variables }}:
                            - ${{ if ne(v.key, '') }}:
                              - name: ${{ v.key }}
                                value: ${{ v.value }}
                            - ${{ else }}:
                              - ${{ insert }}: ${{ v }}
                        steps:
                        - template: /v2/Steps/Dialtone/Dialtone.DropDownload.Step.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                        - template: /v2/Steps/Dialtone/Dialtone.PublishTestResults.Step.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                          parameters:
                            TestResultsDropPath: coalesce(variables.dialtoneTestResultsPath, '')
                        - template: /v2/Steps/Dialtone/Dialtone.OnlineSigning.Steps.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                          parameters:
                            job: ${{ job }}
                            main_container: windows_build_container
                    ${{ else }}:
                      job: ${{ job }}
                    git: ${{ parameters.git }}
                    versioning: ${{ parameters.versioning }}
                    reddog: ${{ parameters.reddog }}
                    cloudvault: ${{ parameters.cloudvault }}
                    nugetPublishing: ${{ parameters.nugetPublishing }}
                    upackPublishing: ${{ parameters.upackPublishing }}
                    globalSdl: ${{ parameters.globalSdl }}
                    featureFlags: ${{ parameters.featureFlags }}
                    ${{ if ne(parameters.useTestSdlExtension, true) }}:
                      sdlExtensionPrefix: 'securedevelopmentteam.vss-secure-development-tools'
                    ${{ else }}:
                      sdlExtensionPrefix: 'ms-secdevops-test.vss-secure-development-tools-test'
                    onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                    customTags: ${{ parameters.customTags }}
                    mainPool: ${{ parameters.mainPool }}
                    containers: ${{ parameters.containers }}
                    platform: ${{ parameters.platform }}
                    obDialtone: ${{ parameters.obDialtone }}
                    use1esEntry: ${{ eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}
                    isOfficial: ${{ parameters.isOfficial }}
                    runOnHost: ${{ coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false) }}
                    targets:
                      ${{ if or(eq(coalesce(parameters.featureFlags.runHostSDL,true), true),eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                        generic: host
                      ${{ if and(ne(coalesce(parameters.featureFlags.runHostSDL,true), true),ne(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                        generic: windows_onebranch_container
                      ${{ if or(eq(coalesce(parameters.featureFlags.runHostSigningSetup,true), true),eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                        signing: host
                      ${{ else }}:
                        signing: windows_onebranch_container_signing
              - ${{ if eq(job.pool.type, 'gitPushVersion') }}:
                - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
                  - 'Git push version job is not suported with new 1ES PT entry.': error
                - template: /v2/Jobs/Windows.GitPushVersion.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    versioning: ${{ parameters.versioning }}
                    job: ${{ job }}
                    onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                    featureFlags: ${{ parameters.featureFlags }}
                    ${{ if eq(parameters.isOfficial, true) }}:
                      buildType: Official
                    ${{ if ne(parameters.isOfficial, true) }}:
                      buildType: Buddy
                    containers: ${{ parameters.containers }}
                    globalSdl: ${{ parameters.globalSdl }}
                    isOfficial: ${{ parameters.isOfficial }}
              - ${{ if eq(job.pool.type, 'linux') }}:
                - ${{ if eq(job.pool.isCustom, true) }}:
                    template: /v2/Jobs/Linux.Custom.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  ${{ else }}:
                    template: /v2/Jobs/Linux.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    parentStage: ${{ stage.stage }}
                    job: ${{ job }}
                    git: ${{ parameters.git }}
                    globalSdl: ${{ parameters.globalSdl }}
                    onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                    featureFlags: ${{ parameters.featureFlags }}
                    reddog: ${{ parameters.reddog }}
                    ${{ if ne(parameters.useTestSdlExtension, true) }}:
                      sdlExtensionPrefix: 'securedevelopmentteam.vss-secure-development-tools'
                    ${{ else }}:
                      sdlExtensionPrefix: 'ms-secdevops-test.vss-secure-development-tools-test'
                    customTags: ${{ parameters.customTags }}
                    mainPool: ${{ parameters.mainPool }}
                    containers: ${{ parameters.containers }}
                    isOfficial: ${{ parameters.isOfficial }}
                    runOnHost: ${{ coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false) }}
                    targets:
                      ${{ if eq(job.pool.hostArchitecture, 'arm64') }}:
                        ${{ if or(eq(coalesce(parameters.featureFlags.runHostSDL,true), true),eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          generic: host
                        ${{ if and(ne(coalesce(parameters.featureFlags.runHostSDL,true), true),ne(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          generic: linux_arm64_onebranch_container
                        ${{ if eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true) }}:
                          signing: host
                        ${{ else }}:
                          signing: linux_arm64_onebranch_signing_container
                      ${{ else }}:
                        ${{ if or(eq(coalesce(parameters.featureFlags.runHostSDL,true), true),eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          generic: host
                        ${{ if and(ne(coalesce(parameters.featureFlags.runHostSDL,true), true),ne(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true)) }}:
                          generic: linux_onebranch_container
                        ${{ if eq(coalesce(parameters.featureFlags.runOnHost,job.pool.runOnHost,false), true) }}:
                          signing: host
                        ${{ else }}:
                          signing: linux_onebranch_signing_container
                    use1esEntry: ${{ eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}
              - ${{ if eq(job.pool.type, 'cloudtestagentless') }}:
                - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
                  - 'Cloudtest agentless job is not suported with new 1ES PT entry.': error
                - template: /v2/Jobs/CloudTest.Agentless.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    cloudtestagentlessjob: ${{ job }}
              - ${{ if eq(job.pool.type, 'agentless') }}:
                - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
                  - 'Agentless job is not suported with new 1ES PT entry.': error
                - template: /v2/Jobs/Server.Agentless.Build.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    serverjob: ${{ job }}
                    featureFlags: ${{ parameters.featureFlags }}
              - ${{ if eq(job.pool.type, 'docker') }}:
                - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
                  - 'Docker job is not suported with new 1ES PT entry.': error
                - template: /v2/Jobs/Docker.Job.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                  parameters:
                    parentStage: ${{ stage.stage }}
                    jobInfo: ${{ job }}
                    cloudvault: ${{ parameters.cloudvault }}
                    isOfficial: ${{ parameters.isOfficial }}
                    ${{ if eq(parameters.isOfficial, true) }}:
                      buildType: Official
                    ${{ else }}:
                      buildType: Buddy
                    onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                    globalSdl: ${{ parameters.globalSdl }}
                    containers: ${{ parameters.containers }}
                    git: ${{ parameters.git }}
                    featureFlags: ${{ parameters.featureFlags }}
                    mainPool: ${{ parameters.mainPool }}
                    ${{ if ne(parameters.useTestSdlExtension, true) }}:
                      sdlExtensionPrefix: 'securedevelopmentteam.vss-secure-development-tools'
                    ${{ else }}:
                      sdlExtensionPrefix: 'ms-secdevops-test.vss-secure-development-tools-test'
                    ${{ if eq(job.pool.os, 'linux') }}:
                      isLinux: true
                      ${{ if eq(job.pool.hostArchitecture, 'arm64') }}:
                        targets:
                          ${{ if eq(coalesce(parameters.featureFlags.runHostSDL,true), true) }}:
                            generic: host
                          ${{ else }}:
                            generic: linux_arm64_onebranch_container
                          signing: linux_arm64_onebranch_signing_container
                      ${{ else }}:
                        targets:
                          ${{ if eq(coalesce(parameters.featureFlags.runHostSDL,true), true) }}:
                            generic: host
                          ${{ else }}:
                            generic: linux_onebranch_container
                          signing: linux_onebranch_signing_container
                    ${{ else }}:
                      targets:
                        ${{ if eq(coalesce(parameters.featureFlags.runHostSDL,true), true) }}:
                          generic: host
                        ${{ else }}:
                          generic: windows_onebranch_container
                        ${{ if eq(coalesce(parameters.featureFlags.runHostSigningSetup,true), true) }}:
                          signing: host
                        ${{ else }}:
                          signing: windows_onebranch_container_signing
      - ${{ each stage in parameters.stages }}:
        - ${{ if or(containsValue(stage.jobs.*.pool.type, 'release'),containsValue(stage.jobs.*.pool.type, 'server')) }}:
          - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
            - 'Release job is not suported with new 1ES PT entry.': error
          - ${{ if eq(parameters.isOfficial, true) }}:
              template: /v2/Stages/Release.Prod.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
            ${{ if ne(parameters.isOfficial, true) }}:
              template: /v2/Stages/Release.NonProd.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
            parameters:
              stage: ${{ stage }}
              featureFlags: ${{ parameters.featureFlags }}
              customTags: ${{ parameters.customTags }}
              platform: ${{ parameters.platform }}
              onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
              release: ${{ parameters.release }}
              ${{ if and(eq(parameters.platform.name, 'onebranch'),eq(contains(convertToJson(parameters.stages.*.jobs.*.steps.*.task), 'Ev2RARollout@2'), true)) }}:
                ev2ManagedSdpRolloutConfig: ${{ parameters.ev2ManagedSdpRolloutConfig }}
                ev2ManagedSdpPipeline: true
              containers: ${{ parameters.containers }}
      - ${{ if eq(coalesce(parameters.globalSdl.runmode,'buildtime'), 'stage') }}:
        - ${{ each stage in parameters.stages }}:
          - ${{ if and(eq(parameters.isOfficial, true),containsValue(coalesce(parameters.globalSdl.skipSdlStageForUserStages,''), stage.stage)) }}:
            - 'Parameter skipSdlStageForUserStages cannot be used in an official build.': error
          - ${{ if or(eq(parameters.isOfficial, true),not(containsValue(coalesce(parameters.globalSdl.skipSdlStageForUserStages,''), stage.stage))) }}:
            - ${{ if or(containsValue(stage.jobs.*.pool.type, 'windows'),containsValue(stage.jobs.*.pool.type, 'linux')) }}:
              - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
                - 'Binary analysis stage is not suported with new 1ES PT entry.': error
              - template: /v2/Stages/SDL.BinaryAnalysis.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
                parameters:
                  stage: ${{ stage }}
                  globalSdl: ${{ parameters.globalSdl }}
                  git: ${{ parameters.git }}
                  onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
                  useTestSdlExtension: ${{ parameters.useTestSdlExtension }}
                  featureFlags: ${{ parameters.featureFlags }}
                  isOfficial: ${{ parameters.isOfficial }}
                  platform: ${{ parameters.platform }}
                  mainPool: ${{ parameters.mainPool }}
      - ${{ if and(eq(parameters.reddog.enabled, true),eq(coalesce(parameters.reddog.runmode,'buildtime'), 'stage')) }}:
        - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
          - 'Reddog upload stage is not suported with new 1ES PT entry.': error
        - template: /v2/Stages/ReddogUpload.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
          parameters:
            stages: ${{ parameters.stages }}
            featureFlags: ${{ parameters.featureFlags }}
            reddog: ${{ parameters.reddog }}
            onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
            isOfficial: ${{ parameters.isOfficial }}
            platform: ${{ parameters.platform }}
            mainPool: ${{ parameters.mainPool }}
      - ${{ if and(eq(parameters.cloudvault.enabled, true),eq(coalesce(parameters.cloudvault.runmode,'buildtime'), 'stage')) }}:
        - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
          - 'Cloudvault upload stage is not suported with new 1ES PT entry.': error
        - template: /v2/Stages/CloudVaultUpload.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
          parameters:
            stages: ${{ parameters.stages }}
            featureFlags: ${{ parameters.featureFlags }}
            globalSdl: ${{ parameters.globalSdl }}
            cloudvault: ${{ parameters.cloudvault }}
            onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
            isOfficial: ${{ parameters.isOfficial }}
            platform: ${{ parameters.platform }}
            mainPool: ${{ parameters.mainPool }}
      - ${{ if eq(parameters.retryWatcher.enabled, true) }}:
        - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
          - 'Retry watcher is not suported with new 1ES PT entry.': error
        - template: /v2/Stages/RetryWatcher.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
          parameters:
            isOfficial: ${{ parameters.isOfficial }}
            retryWatcher: ${{ parameters.retryWatcher }}
            ${{ if eq(parameters.isOfficial, true) }}:
              buildType: Official
            ${{ if ne(parameters.isOfficial, true) }}:
              buildType: Buddy
            onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
            featureFlags: ${{ parameters.featureFlags }}
      - ${{ if eq(coalesce(parameters.globalSdl.policy,'Microsoft'), 'M365') }}:
        - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
          - 'M365 post build stage is not suported with new 1ES PT entry.': error
        - template: /v2/Stages/M365.AfterBuild.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
          parameters:
            isOfficial: ${{ parameters.isOfficial }}
            stages: ${{ parameters.stages }}
            ${{ if eq(parameters.isOfficial, true) }}:
              buildType: Official
            ${{ if ne(parameters.isOfficial, true) }}:
              buildType: Buddy
            onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
            featureFlags: ${{ parameters.featureFlags }}
            globalSdl: ${{ parameters.globalSdl }}
      - ${{ if and(eq(parameters.platform.name, 'windows_undocked'),eq(parameters.isOfficial, true)) }}:
        - ${{ if or(eq(coalesce(parameters.globalSdl.evidence.enabled,true), true),eq(coalesce(parameters.globalSdl.evidenceV2.enabled,true), true)) }}:
          - ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
            - 'Undocker post build stage is not suported with new 1ES PT entry.': error
          - template: /v2/Stages/PackageES/WindowsUndocked.EvidenceCollectionV2.PostBuild.Stage.yml@${{ coalesce(parameters.featureFlags.obcanary,'obcoretemplates') }}
            parameters:
              useTestSdlExtension: ${{ parameters.useTestSdlExtension }}
              onebranchToolsetTag: ${{ parameters.onebranchToolsetTag }}
              globalSdl: ${{ parameters.globalSdl }}
              featureFlags: ${{ parameters.featureFlags }}
              isOfficial: ${{ parameters.isOfficial }}
    ${{ if eq(coalesce(parameters.featureFlags.use1esentry,false), true) }}:
      featureFlags:
        ${{ each property in parameters.featureFlags }}:
          ${{ if in(property.key,'enableNuGetAuthenticate','EnableClamd','EnableDefenderForLinux','autoBaseline') }}:
            'featureFlags ''${{ property.key }}'' is not allowed, please remove this.': error
          ${{ else }}:
            ${{ property.key }}: ${{ property.value }}
        enableNuGetAuthenticate: false
        autoBaseline: false
        EnableClamd: false
        EnableDefenderForLinux: false
      sdl:
        ${{ each property in parameters.globalSdl }}:
          ${{ if in(property.key,'sourceAnalysisPool','sdlExtensionPrefix','postValidationJobAnalysisPool','sourceAnalysisVariablesToReset','customCheckout','customBuildTags','enableAllTools','enableProductionSDL','sourceAnalysisTimeoutInMinutes','sourceAnalysisPostSteps','binaryAnalysisPostSteps','sourceAnalysisPipelineDefinitionId','applyOfficialBreakToolPolicyWithTsaEnabled','autobaseline','binaryAnalysisCaching','sourceAnalysisCaching','sourceAnalysis') }}:
            'globalSdl ''${{ property.key }}'' is not allowed, please remove this.': error
          ${{ elseif notIn(property.key,'sourceRepositoriesToScan','git','gitCheckout_all_repos','policy','severity','sdlPolicy','sdlSeverity') }}:
            ${{ property.key }}: ${{ property.value }}
        sourceAnalysisPool:
          ${{ if and(eq(variables['System.TeamProjectId'], 'c978ac10-fc79-4879-9a73-42adb531be5f'),eq(parameters.featureFlags.useValidationPool, true)) }}:
            name: OneBranchPipelines-V2-Validation
          ${{ else }}:
            name: OneBranchPipelinesV2
          Host: windows
          SDLHostVersion:
            SKU: D4
        ${{ if parameters.globalSdl.sourceRepositoriesToScan }}:
          sourceRepositoriesToScan: ${{ parameters.globalSdl.sourceRepositoriesToScan }}
        ${{ else }}:
          sourceRepositoriesToScan:
            exclude:
            - ${{ each step in parameters.stages.*.jobs.*.steps.* }}:
              - ${{ if startsWith(step.task, '6d15af64-176c-496d-b583-fd2ae21d4df4@') }}:
                - ${{ if and(not(eq(step.inputs.repository, 'self')),not(eq(step.inputs.repository, 'none'))) }}:
                  - ${{ if ne(step.inputs.repository, format('git://{0}/{1}@$(Build.SourceBranch)',variables['System.TeamProject'],variables['Build.Repository.Name'])) }}:
                    - repository: ${{ step.inputs.repository }}
        ${{ if parameters.globalSdl.git }}:
          git: ${{ parameters.globalSdl.git }}
        ${{ else }}:
          git: ${{ parameters.git }}
        ${{ if parameters.globalSdl.gitCheckout_all_repos }}:
          gitCheckout_all_repos: ${{ parameters.globalSdl.gitCheckout_all_repos }}
        ${{ else }}:
          gitCheckout_all_repos: ${{ coalesce(parameters.globalSdl.perStage.sdl_sources.checkout_all_repos,false) }}
        ${{ if parameters.globalSdl.sdlPolicy }}:
          sdlPolicy: ${{ parameters.globalSdl.sdlPolicy }}
        ${{ else }}:
          sdlPolicy: ${{ coalesce(parameters.globalSdl.policy,'OneBranch-Retail') }}
        ${{ if parameters.globalSdl.sdlSeverity }}:
          sdlSeverity: ${{ parameters.globalSdl.sdlSeverity }}
        ${{ else }}:
          sdlSeverity: ${{ coalesce(parameters.globalSdl.severity,'Error') }}
        ${{ if ne(parameters.useTestSdlExtension, true) }}:
          sdlExtensionPrefix: 'securedevelopmentteam.vss-secure-development-tools'
        ${{ else }}:
          sdlExtensionPrefix: 'ms-secdevops-test.vss-secure-development-tools-test'
      settings:
        onebranch:
          toolsetTag: ${{ parameters.onebranchToolsetTag }}
          tsaConfigFilePath: ${{ coalesce(variables.ob_sdl_tsa_configFile,parameters.globalSdl.perStage.sdl_sources.tsa.configFile,parameters.globalSdl.tsa.configFile,'$(Build.SourcesDirectory)\.config\tsaoptions.json') }}
          appendSourceBranchName: ${{ coalesce(variables.ob_sdl_tsa_appendSourceBranchName,parameters.globalSdl.perStage.sdl_sources.tsa.appendSourceBranchName,parameters.globalSdl.tsa.appendSourceBranchName,false) }}
          useDynamicRouting: ${{ coalesce(parameters.globalSdl.tsa.useDynamicRouting,and(eq(parameters.platform.name, 'windows_undocked'),eq(parameters.isOfficial, true))) }}

```