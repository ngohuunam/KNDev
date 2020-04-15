export const tableList = ({ list, table }) => {
  console.log(table)
  const res = list.filter(item => table.includes(item.orderId))
  console.log(res)
  return res
}
