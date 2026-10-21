# Maestro AI Framework

Run Maestro tests in the repository-root `Flows/` directory from PowerShell or VS Code (or pass a different Flow file or directory to the runner).

## Prerequisites

- Install [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli) and make sure `maestro` is on `PATH`.
- Install Java 17 or newer and set `JAVA_HOME`.
- Start a target device before running a test: an Android emulator/device, or an iOS simulator on macOS.
- Each Flow must target an app available on that device. Set its `appId` to the app's Android application ID or iOS bundle ID.

Check the setup with `maestro --version` and `maestro list-devices`.

## Run tests

Run all Flows in the `Flows/` directory:

```powershell
.\scripts\run-maestro.ps1
```

Run one Flow or another directory:

```powershell
 .\scripts\run-maestro.ps1 Flows\login-success.yaml
.\scripts\run-maestro.ps1 .\path\to\flows
```

You can also call the CLI directly, for example `maestro test Flows` or `maestro test Flows\login.yaml`.

In VS Code, run **Tasks: Run Task** and choose **Maestro: Run flows**. It prompts for a Flow file or directory and defaults to `Flows`. The task uses the repository's PowerShell runner.

To pass CLI options through the runner, use `-MaestroArgs`, for example:

```powershell
.\scripts\run-maestro.ps1 -FlowPath Flows -MaestroArgs @('--device=DEVICE_ID', '--include-tags=smoke')
```

## Add a Flow

Create a `.yaml` or `.yml` file under `Flows/`. The included [Android Settings sample](Flows/android-settings.yaml) launches the built-in Android Settings app and captures a screenshot. Run it with:

```powershell
.\scripts\run-maestro.ps1 Flows\android-settings.yaml
```

For your own app, set `appId` to its installed Android application ID or iOS bundle ID. A minimal Android Flow looks like:

```yaml
appId: com.example.app
---
- launchApp
```

Replace `com.example.app` with the app ID installed on your target device, then run the directory or that file. Maestro Flow syntax and commands are documented in the [Maestro Flows guide](https://docs.maestro.dev/maestro-flows).

## WDIO demo app scenarios

The `Flows/` directory includes signup success/validation, login success/validation, and Forms interaction scenarios for the installed `com.wdiodemoapp` sample app. Run all of them with:

```powershell
& "$env:LOCALAPPDATA\Programs\Maestro\bin\maestro.bat" test --device=127.0.0.1:5555 --test-output-dir "$env:TEMP\maestro-results" Flows
```

Maestro's MCP server is available via `maestro mcp`; configure it in the coding agent's MCP settings to author or run tests through MCP tools. The Flows can also be run directly with the CLI as above.