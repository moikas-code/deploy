import { NextWebVitalsMetric } from 'next/app';
import clsMetrics from './clsMetrics';
import lcpMetrics from './lcpMetrics';
import fidMetrics from './fidMetrics';
import fcpMetrics from './fcpMetrics';
import ttfbMetrics from './ttfbMetrics';

export default function metrics(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      // handle FCP results
      fcpMetrics(metric);
      break;
    case 'LCP':
      // handle LCP results
      lcpMetrics(metric);
      break;
    case 'CLS':
      // handle CLS results
      return clsMetrics(metric);

    case 'FID':
      // handle FID results
      fidMetrics(metric);
      break;
    case 'TTFB':
      // handle TTFB results
      ttfbMetrics(metric);
      break;
    case 'Next.js-hydration':
      // handle hydration results
      console.log(metric.name, ':', metric.value / 1000);
      break;
    case 'Next.js-route-change-to-render':
      // handle route-change to render results
      console.log(metric.name, ':', metric.value / 1000);
      break;
    case 'Next.js-render':
      // handle render results
      console.log(metric.name, ':', metric.value / 1000);
      break;
    default:
      break;
  }
}
