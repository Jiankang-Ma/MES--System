param(
    [string]$NodePath = "",
    [string]$VueRoot = ""
)

$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not $VueRoot) {
    $VueRoot = Get-ChildItem -LiteralPath $repoRoot -Directory |
        ForEach-Object { Join-Path $_.FullName "iMES.Vue3" } |
        Where-Object { Test-Path -LiteralPath (Join-Path $_ "package.json") } |
        Select-Object -First 1
}
$cliPath = Join-Path $VueRoot "node_modules\@vue\cli-service\bin\vue-cli-service.js"

if (-not (Test-Path -LiteralPath $VueRoot)) {
    throw "Vue project directory was not found: $VueRoot"
}

if (-not (Test-Path -LiteralPath $cliPath)) {
    throw "Frontend dependencies are missing. Run npm ci in: $VueRoot"
}

if (-not $NodePath) {
    $nodeCommand = Get-Command node -ErrorAction Stop
    $NodePath = $nodeCommand.Source
}

$nodeVersion = & $NodePath -p "process.versions.node"
$nodeMajor = [int]($nodeVersion.Split(".")[0])
if ($nodeMajor -ge 17) {
    $env:NODE_OPTIONS = "--openssl-legacy-provider"
}

$specPattern = Join-Path $PSScriptRoot "*.spec.js"

Push-Location $VueRoot
try {
    & $NodePath $cliPath test:unit $specPattern --reporter spec
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
