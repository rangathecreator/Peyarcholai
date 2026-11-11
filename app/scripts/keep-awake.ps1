# Keeps the machine (and display) awake while this process runs. Stop it by killing the process.
Add-Type -Namespace Win -Name Power -MemberDefinition '[System.Runtime.InteropServices.DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags);'
$ES_CONTINUOUS = [uint32]2147483648; $ES_SYSTEM = [uint32]1; $ES_DISPLAY = [uint32]2
while ($true) {
  [void][Win.Power]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM -bor $ES_DISPLAY)
  Start-Sleep -Seconds 30
}

