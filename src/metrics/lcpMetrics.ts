import { NextWebVitalsMetric } from 'next/app';

export default function lcpMetrics(metric: NextWebVitalsMetric) {
  if (metric.value / 1000 <= 2.5) {
    console.log(metric.name, 'Result: ', metric.value / 1000, 'GOOD');
  } else if (metric.value / 1000 >= 2.5 && metric.value / 1000 <= 4.0) {
    console.log(
      metric.name,
      'Result: ',
      metric.value / 1000,
      'Needs Improvement',
      'Visit https://web.dev/lcp/'
    );
  } else {
    console.log(
      metric.name,
      'Result: ',
      metric.value / 1000,
      'POOR',
      'Visit https://web.dev/lcp/'
    );
  }
}
