const winston = require('winston');
const { context, trace } = require('@opentelemetry/api');

// Create a custom format to inject GCP specific trace fields
const gcpFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const { traceId, spanId } = span.spanContext();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    if (projectId) {
      info['logging.googleapis.com/trace'] = `projects/${projectId}/traces/${traceId}`;
      info['logging.googleapis.com/spanId'] = spanId;
      info['logging.googleapis.com/trace_sampled'] = span.spanContext().traceFlags === 1;
    }
  }
  
  // Map standard log levels to GCP severity
  const severityMap = {
    silly: 'DEFAULT',
    verbose: 'DEBUG',
    info: 'INFO',
    http: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
  };
  info.severity = severityMap[info.level] || 'DEFAULT';

  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    gcpFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;
