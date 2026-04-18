import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";

export function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
    });
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(err, {
      extra: {
        path: request.path,
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
      },
    });
  }
};
