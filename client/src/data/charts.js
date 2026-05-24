export const generateIncidentFrequency = (days = 14) => {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      critical: Math.round(Math.random() * 2),
      high: Math.round(Math.random() * 3),
      medium: Math.round(Math.random() * 4 + 1),
    });
  }
  return data;
};

export const generateUptimeData = () => {
  return [
    { name: "Payment Gateway", uptime: 97.2 },
    { name: "Auth Service", uptime: 99.1 },
    { name: "User Profile", uptime: 99.97 },
    { name: "Notification", uptime: 99.88 },
    { name: "Inventory", uptime: 98.4 },
    { name: "Analytics", uptime: 99.99 },
  ];
};

export const generateRequestVolume = (hours = 24) => {
  return Array.from({ length: hours }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (hours - i));
    const base = 15000;
    const peak = i > 8 && i < 18 ? 1.8 : 1;
    return {
      time: hour.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      requests: Math.round((base + Math.random() * 5000) * peak),
      errors: Math.round(Math.random() * (i > 20 ? 800 : 150)),
    };
  });
};

export const latencyBucketsData = [
  { bucket: "<100ms", count: 4820 },
  { bucket: "100-300ms", count: 8940 },
  { bucket: "300-500ms", count: 3210 },
  { bucket: "500ms-1s", count: 1870 },
  { bucket: "1s-3s", count: 640 },
  { bucket: ">3s", count: 280 },
];
