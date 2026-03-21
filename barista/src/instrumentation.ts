import { registerOTel } from '@vercel/otel';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
    
    registerOTel({
      serviceName: 'barista-frontend',
      traceExporter: new TraceExporter(),
    });
  }
}
