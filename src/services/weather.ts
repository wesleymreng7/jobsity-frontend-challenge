type TimeBucket = 'morning' | 'afternoon' | 'evening' | 'night'

type MockWeatherRecord = {
  summary: string
  temperature: Record<TimeBucket, number>
}

const MOCK_WEATHER_DATA: Record<string, MockWeatherRecord> = {
  'new york': {
    summary: 'Partly cloudy',
    temperature: { morning: 12, afternoon: 19, evening: 15, night: 10 },
  },
  lisbon: {
    summary: 'Sunny spells',
    temperature: { morning: 16, afternoon: 23, evening: 20, night: 17 },
  },
  london: {
    summary: 'Light showers',
    temperature: { morning: 10, afternoon: 14, evening: 12, night: 9 },
  },
  tokyo: {
    summary: 'Humid breeze',
    temperature: { morning: 18, afternoon: 24, evening: 21, night: 19 },
  },
  madrid: {
    summary: 'Clear skies',
    temperature: { morning: 17, afternoon: 28, evening: 23, night: 19 },
  },
};

const DEFAULT_RECORD: MockWeatherRecord = {
  summary: 'Calm conditions',
  temperature: { morning: 14, afternoon: 21, evening: 17, night: 12 },
};

const toTitleCase = (value: string) =>
  value
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

const getTimeBucket = (time: string): TimeBucket => {
  const [hoursString] = time.split(':')
  const hours = Number(hoursString)

  if (Number.isNaN(hours)) return 'afternoon'

  if (hours >= 5 && hours < 12) return 'morning'
  if (hours >= 12 && hours < 17) return 'afternoon'
  if (hours >= 17 && hours < 21) return 'evening'
  return 'night'
}

const buildSummary = (record: MockWeatherRecord, bucket: TimeBucket) => {
  const summary = toTitleCase(record.summary)
  const temperature = record.temperature[bucket]
  return `${summary} • ${temperature}°C`
}

export async function fetchWeatherSummary(city: string, dateISO: string, time: string) {
  void dateISO

  const normalizedCity = city.trim().toLowerCase()
  const record = MOCK_WEATHER_DATA[normalizedCity] ?? DEFAULT_RECORD
  const bucket = getTimeBucket(time)

  return buildSummary(record, bucket)
}

