$results = @()

Get-ChildItem -Recurse -Filter 'Combined-Lesson.json' | ForEach-Object {
    $file = $_.FullName
    $raw = Get-Content $file -Raw
    $content = $raw | ConvertFrom-Json

    $parts = $file -split [regex]::Escape('\Modules\')
    if ($parts.Count -lt 2) { return }
    $subParts = $parts[1] -split [regex]::Escape('\')
    $moduleDir = $subParts[0]
    $lessonDir  = if ($subParts.Count -gt 1) { $subParts[1] } else { 'unknown' }

    function Find-Images($obj) {
        if ($null -eq $obj) { return }
        if ($obj -is [System.Array] -or $obj -is [System.Collections.ArrayList]) {
            foreach ($item in $obj) { Find-Images $item }
        } elseif ($obj -is [PSCustomObject]) {
            $propNames = $obj.PSObject.Properties.Name
            if ($propNames -contains 'type' -and $obj.type -eq 'image') {
                $src    = if ($propNames -contains 'src')       { $obj.src }       else { '' }
                $alt    = if ($propNames -contains 'alt')       { $obj.alt }       else { '' }
                $prompt = if ($propNames -contains 'aiPrompt')  { $obj.aiPrompt }  `
                     elseif ($propNames -contains 'notes')      { $obj.notes }     else { '' }
                $pos    = if ($propNames -contains 'position')  { $obj.position }  else { '' }
                $script:results += [PSCustomObject]@{
                    Module  = $moduleDir
                    Lesson  = $lessonDir
                    Src     = $src
                    Alt     = $alt
                    Prompt  = $prompt
                    Position = $pos
                }
            }
            foreach ($prop in $obj.PSObject.Properties) {
                Find-Images $prop.Value
            }
        }
    }

    Find-Images $content
}

$results | ForEach-Object {
    Write-Output "=== $($_.Module) / $($_.Lesson) ==="
    Write-Output "  Src:      $($_.Src)"
    Write-Output "  Alt:      $($_.Alt)"
    Write-Output "  Position: $($_.Position)"
    Write-Output "  Prompt:   $($_.Prompt)"
    Write-Output ""
}

Write-Output "TOTAL IMAGE ASSETS: $($results.Count)"
