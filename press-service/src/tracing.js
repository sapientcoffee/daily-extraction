const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');

// Initialize OpenTelemetry with Google Cloud Exporter
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new TraceExporter(),
  instrumentations: [getNodeAutoInstrumentations({
    // Disable fs instrumentation to reduce noise in logs
    '@opentelemetry/instrumentation-fs': {
      enabled: false,
    },
  })],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
