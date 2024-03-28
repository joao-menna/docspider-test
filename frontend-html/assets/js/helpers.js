/**
 * Converte data para formato apresentável (dd/mm/yyyy hh:MM)
 * @param {string} dateTime dateTime em formato ISO 8601
 */
function formatDate(dateTime) {
  // Achei que vinha nesse formato (ISO 8601) sem timezone, mas vem com tal.
  // Caso seja necessário, é só descomentar
  // const [date, time] = dateTime.split('T')
  // const [year, month, day] = date.split('-')
  // const [hour, minute] = time.split(':')

  const date = new Date(dateTime)
  const day = date.getDate().toString()
  const month = date.getMonth().toString()
  const year = date.getFullYear()
  const hour = date.getHours().toString()
  const minute = date.getMinutes().toString()

  const dateStr = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`

  return `${dateStr} ${timeStr}`
}
