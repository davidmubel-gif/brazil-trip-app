# A tiny web server for trying the app on this computer: http://localhost:8080
# It only answers this computer (not the network). Stop it with Ctrl+C.
param([int]$Port = 8080)

$root = $PSScriptRoot
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'; '.json' = 'application/json'
  '.webmanifest' = 'application/manifest+json'; '.png' = 'image/png'; '.woff2' = 'font/woff2'
  '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'; '.md' = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContextAsync()
    while (-not $ctx.AsyncWaitHandle.WaitOne(500)) {}  # lets Ctrl+C work
    $ctx = $ctx.Result
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = [IO.Path]::GetFullPath((Join-Path $root $path))
    $res = $ctx.Response
    if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf) -and $path -notmatch '(^|/)\.') {
      $bytes = [IO.File]::ReadAllBytes($file)
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $res.ContentType = if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' }
      $res.Headers.Add('Cache-Control', 'no-cache')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $code = 200
    } else {
      $res.StatusCode = 404; $code = 404
    }
    $res.Close()
    Write-Host "$code /$path"
  }
} finally {
  $listener.Stop()
}
