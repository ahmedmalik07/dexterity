param([string]$OutputFile)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$dexteritySynth=New-Object System.Speech.Synthesis.SpeechSynthesizer
$dexterityFormat=New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000,[System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,[System.Speech.AudioFormat.AudioChannel]::Mono)
try {$dexteritySynth.SetOutputToWaveFile($OutputFile,$dexterityFormat);$dexteritySynth.Speak('Teach me how to use these buttons on my screen.');$dexteritySynth.SetOutputToNull()}finally{$dexteritySynth.Dispose()}
