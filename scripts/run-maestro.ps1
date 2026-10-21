param(
    [Parameter(Position = 0)]
    [string]$FlowPath = "Flows",

    [string[]]$MaestroArgs = @()
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command maestro -ErrorAction SilentlyContinue)) {
    Write-Error "Maestro CLI was not found. Install it and ensure 'maestro' is on PATH."
    exit 1
}

if (-not (Test-Path -LiteralPath $FlowPath)) {
    Write-Error "Flow path does not exist: $FlowPath"
    exit 1
}

$resolvedFlowPath = (Resolve-Path -LiteralPath $FlowPath).Path
& maestro test @MaestroArgs $resolvedFlowPath
exit $LASTEXITCODE