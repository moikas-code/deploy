import { NextWebVitalsMetric } from 'next/app';

export default function fidMetrics(metric: NextWebVitalsMetric) {
  if (metric.value <= 100) {
    console.log(metric.name, 'Result: ', metric.value, 'GOOD');
  } else if (metric.value >= 100 && metric.value <= 300) {
    console.log(
      metric.name,
      'Result: ',
      metric.value,
      'Needs Improvement',
      'Visit https://web.dev/fid/'
    );
  } else {
    console.log(
      metric.name,
      'Result: ',
      metric.value,
      'POOR',
      'Visit https://web.dev/fid/'
    );
  }
}
