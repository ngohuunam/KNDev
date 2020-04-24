export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  icon: { header: {}, row: {}, cell: {} },
  new: null,
  labels: [
    { label: 'Product Name:', inputType: 'text', key: 'name' },
    { label: 'Type:', inputType: 'dropdown', key: 'type', options: ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other'] },
    { label: 'End at:', inputType: 'calendar', key: 'endAt', dateFormat: 'dd/mm/yy', showTime: true },
    { label: 'Process:', inputType: 'dropdown', key: 'process', options: [] },
  ],
  converted: null,
  messages: [],
}
