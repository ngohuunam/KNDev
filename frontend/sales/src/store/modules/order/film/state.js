export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  icon: { header: {}, row: {}, cell: {} },
  new: null,
  labels: [
    { label: 'Foreign Title:', inputType: 'text', key: 'foreignTitle' },
    { label: 'Team:', inputType: 'dropdown', key: 'team', options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'] },
    { label: 'Premiere Date:', inputType: 'calendar', key: 'premiereDate' },
    { label: 'End Date:', inputType: 'calendar', showTime: true, key: 'endAt' },
    { label: 'Vietnamese Title:', inputType: 'text', key: 'vietnameseTitle' },
  ],
  converted: null,
  messages: [],
}
