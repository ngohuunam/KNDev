export const findProcessTopLevel = process => {
  const keys = Object.keys(process)
  const len = keys.length
  for (let i = 0; i < len; ++i) {
    const key = keys[i]
    if (process[key].level === 0) return process[key]
  }
}

const fillProps = ['source', 'target', 'description', 'start', 'end', 'color']
const assginProps = ['main', 'support']

export const isProcessFullfilled = process => fillProps.every(prop => !!process[prop]) && ['types'].every(prop => process[prop].length > 0)

export const isProcessAssigned = process => assginProps.every(prop => !!process[prop])

export const isProcessValid = process => isProcessFullfilled(process) && isProcessAssigned(process)

export const getProcessStatus = process => (isProcessFullfilled(process) ? (isProcessAssigned(process) ? process.status : 'Need to assign') : 'Need to filled')
