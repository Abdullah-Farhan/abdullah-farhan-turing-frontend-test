// formatting time to X minutes Y seconds 

export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${
    secs !== 1 ? "s" : ""
  }`;
}
