import os from 'os';

export function formatCPUInfo(cpus: os.CpuInfo[]) {
  const times = {
    user: 0,
    nice: 0,
    sys:  0,
    idle: 0,
    irq:  0,
  };

  const milliSecondsToPercentage = 10000000;
  cpus.forEach((cpu: os.CpuInfo) => {
    // Convert to percentage!
    times.user += cpu.times.user / milliSecondsToPercentage;
    times.nice += cpu.times.nice / milliSecondsToPercentage;
    times.sys  += cpu.times.sys  / milliSecondsToPercentage;
    times.idle += cpu.times.idle / milliSecondsToPercentage;
    times.irq  += cpu.times.irq  / milliSecondsToPercentage;
  });

  const cpuCount = cpus.length;
  times.user = Math.round(times.user / cpuCount);
  times.nice = Math.round(times.nice / cpuCount);
  times.sys  = Math.round(times.sys  / cpuCount);
  times.idle = Math.round(times.idle / cpuCount);
  times.irq  = Math.round(times.irq  / cpuCount);

  return Object.entries(times).map(([key, value]) => `${key}=${value}%`).join(' ');
}
