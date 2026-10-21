# Maestro UI test suite

This repository contains end-to-end UI flows for the WebdriverIO Native Demo App (`com.wdiodemoapp`). The suite is written for Maestro and targets Android.

## Set up

1. Install Java 17 or newer and set `JAVA_HOME`.
2. Install the [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli), then make sure `maestro` is available on your `PATH`.
3. Install Node.js with npm (Node.js 18 or newer).
4. Install Android Studio, Android SDK Platform Tools, and create or connect an Android emulator/device.
5. Download the Android APK from the [WebdriverIO Native Demo App releases](https://github.com/webdriverio/native-demo-app/releases) and install it on the target device. For example, in PowerShell:

	```powershell
	adb install .\path\to\native-demo-app.apk
	```

	The installed app must have the application ID `com.wdiodemoapp`. The Android Settings smoke flow uses the Settings app already included with Android.
6. From the repository root, verify the tools and target are available:

	```powershell
	java -version
	maestro --version
	maestro list-devices
	```

## Run the tests

Run the complete suite from the repository root through the npm script:

```sh
npm test
```

The script invokes Maestro's standard `maestro test Flows` command. You can also call it directly:

```sh
maestro test Flows
```

Run one flow through npm by passing its path after `--`:

```sh
npm run test:flow -- Flows/login-success.yaml
```

Pass Maestro CLI options directly when needed, such as selecting a device:

```sh
maestro test --device=DEVICE_ID Flows
```

In VS Code, use **Tasks: Run Task** > **Maestro: Run flows**. The task invokes the `test:flow` npm script and prompts for a flow or directory, defaulting to `Flows`.

## Tool choice

The tests use [Maestro](https://maestro.dev/) because it is designed for native mobile UI automation, runs against a real emulator/device, and expresses scenarios as short, readable YAML flows without requiring changes to the app under test. Maestro's UI commands and assertions wait for matching elements/conditions instead of relying on fixed-duration sleeps. Selectors use visible labels and the app's accessibility descriptions rather than screen coordinates.

## Project structure

- `Flows/` — independent YAML scenarios for login, sign-up, forms, and an Android Settings smoke check. App flows clear app state before each scenario.
- `package.json` — npm scripts for the full suite and an individual flow; no npm dependencies are required.
- `.vscode/tasks.json` — a VS Code task that invokes the npm flow script for the suite or a selected flow.
- `README.md` — the single project guide, including setup, usage, and test scope.

## Scenarios and expectations

| Flow | Expected result |
| --- | --- |
| `login-success.yaml` | Valid credentials display the success alert and its confirmation text. |
| `login-invalid-email.yaml` | Invalid email does not produce a success alert; the login form remains visible. |
| `login-short-password.yaml` | A password shorter than eight characters does not produce a success alert; the login form remains visible. |
| `signup-success.yaml` | Matching valid details display the sign-up success alert and confirmation text. |
| `signup-invalid-email.yaml` | Invalid email does not produce the sign-up success alert; the sign-up form remains visible. |
| `signup-mismatched-passwords.yaml` | Mismatched passwords do not produce the sign-up success alert; the sign-up form remains visible. |
| `forms-echo-switch-alert.yaml` | Text is echoed, the switch changes state, and the active-button alert appears. |
| `android-settings.yaml` | Android Settings launches and a screenshot is captured. |
| `wdio-demo-app.yaml` | The demo app launches and a screenshot is captured. |

Negative form flows currently verify rejection by checking that the success alert is absent and the relevant submit button remains available. They do not assert exact validation-message wording; adding stable, app-specific validation feedback assertions is a follow-up.

## Next steps

With more time, I would capture and assert the app's exact validation feedback for every rejected submission, prefer stable accessibility/resource identifiers wherever the app exposes them, and run the suite in CI against a documented emulator image. I would also add an iOS simulator run after checking which flows and selectors are portable across platforms.

## AI assistance

GitHub Copilot was used to help draft and refine the Maestro flows and this documentation, and to assist with debugging selectors against the running app. The scenarios were exercised with the Maestro CLI on an Android emulator; AI assistance did not replace execution-based validation.