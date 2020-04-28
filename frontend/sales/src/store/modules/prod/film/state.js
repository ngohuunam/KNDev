export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  icon: { header: {}, row: {}, cell: {} },
  new: null,
  labels: [
    { label: 'Product Name:', comp: 'InputText', key: 'name' },
    { label: 'Type:', comp: 'Dropdown', key: 'type', options: ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other'] },
    { label: 'End at:', comp: 'NewCalendar', key: 'endAt', showTime: false },
    { label: 'Process:', comp: 'Dropdown', key: 'process', options: [] },
  ],
  converted: null,
  messages: [],
}
