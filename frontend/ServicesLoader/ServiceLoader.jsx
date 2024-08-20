export async function loadService(serviceName) {
  switch (serviceName) {
    case 'frontend':
      return (await import('../src/Trends.jsx')).default;
    default:
      throw new Error(`Unknown service: ${serviceName}`);
  }
}
