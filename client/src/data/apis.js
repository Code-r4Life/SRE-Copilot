export const apis = [
  {
    id: "api-1",
    name: "Payment Gateway",
    endpoint: "https://api.payments.io/v2/charge",
    status: "critical",
    avgLatency: 1840,
    uptime: 97.2,
    lastChecked: "2s ago",
    method: "POST",
    owner: "Payments Team",
    errorRate: 12.4,
    requestsPerMin: 1420,
    p95Latency: 3200,
    p99Latency: 5800,
    description: "Core payment processing endpoint handling Stripe, PayPal, and crypto charges.",
    tags: ["payments", "critical", "external"],
    incidents: ["inc-1", "inc-3"],
  },
  {
    id: "api-2",
    name: "Auth Service",
    endpoint: "https://api.auth.internal/v1/token",
    status: "warning",
    avgLatency: 340,
    uptime: 99.1,
    lastChecked: "5s ago",
    method: "POST",
    owner: "Platform Team",
    errorRate: 3.2,
    requestsPerMin: 8920,
    p95Latency: 620,
    p99Latency: 980,
    description: "JWT token issuance and validation for all internal services.",
    tags: ["auth", "internal", "high-traffic"],
    incidents: ["inc-2"],
  },
  {
    id: "api-3",
    name: "User Profile API",
    endpoint: "https://api.users.io/v3/profile",
    status: "healthy",
    avgLatency: 89,
    uptime: 99.97,
    lastChecked: "3s ago",
    method: "GET",
    owner: "User Team",
    errorRate: 0.1,
    requestsPerMin: 5640,
    p95Latency: 140,
    p99Latency: 210,
    description: "User profile read/write operations including preferences and metadata.",
    tags: ["users", "internal"],
    incidents: [],
  },
  {
    id: "api-4",
    name: "Notification Service",
    endpoint: "https://api.notify.io/v1/send",
    status: "healthy",
    avgLatency: 210,
    uptime: 99.88,
    lastChecked: "8s ago",
    method: "POST",
    owner: "Infra Team",
    errorRate: 0.4,
    requestsPerMin: 3200,
    p95Latency: 380,
    p99Latency: 540,
    description: "Push, email, and SMS notification dispatching.",
    tags: ["notifications", "external"],
    incidents: [],
  },
  {
    id: "api-5",
    name: "Inventory API",
    endpoint: "https://api.inventory.io/v2/stock",
    status: "warning",
    avgLatency: 780,
    uptime: 98.4,
    lastChecked: "12s ago",
    method: "GET",
    owner: "Commerce Team",
    errorRate: 5.7,
    requestsPerMin: 920,
    p95Latency: 1400,
    p99Latency: 2200,
    description: "Real-time inventory levels and reservation management.",
    tags: ["inventory", "commerce"],
    incidents: ["inc-4"],
  },
  {
    id: "api-6",
    name: "Analytics Ingest",
    endpoint: "https://api.analytics.io/v1/events",
    status: "healthy",
    avgLatency: 45,
    uptime: 99.99,
    lastChecked: "1s ago",
    method: "POST",
    owner: "Data Team",
    errorRate: 0.02,
    requestsPerMin: 42000,
    p95Latency: 80,
    p99Latency: 120,
    description: "High-throughput event ingestion pipeline for analytics.",
    tags: ["analytics", "internal", "high-throughput"],
    incidents: [],
  },
];

export const generateLatencyData = (apiId, hours = 24) => {
  const baseLatency = {
    "api-1": 900,
    "api-2": 180,
    "api-3": 85,
    "api-4": 190,
    "api-5": 420,
    "api-6": 40,
  }[apiId] || 200;

  return Array.from({ length: hours }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (hours - i));
    const spike = (apiId === "api-1" && i > 18) ? 2.8 : (apiId === "api-5" && i > 20) ? 1.8 : 1;
    const noise = (Math.random() - 0.5) * 0.3;
    return {
      time: hour.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      latency: Math.round(baseLatency * spike * (1 + noise)),
      p95: Math.round(baseLatency * spike * 1.8 * (1 + noise * 0.5)),
    };
  });
};

export const generateErrorRateData = (hours = 24) => {
  return Array.from({ length: hours }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (hours - i));
    const spike = i > 20 ? Math.random() * 15 + 5 : Math.random() * 2;
    return {
      time: hour.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      errorRate: parseFloat(spike.toFixed(2)),
      requests: Math.round(Math.random() * 2000 + 500),
    };
  });
};
