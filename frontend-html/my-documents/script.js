/**
 * @typedef {ListEntry}
 * @property {number?} id
 * @property {string} title
 * @property {string} description
 * @property {string} fileName
 * @property {string} dateTime
 */

let isEditing = false
let editing = {}

/**
 * Delete entry before serve para deletar e atualizar
 * @param {number} id
 */
async function deleteEntryBefore(id) {
  await deleteEntry(id)
  showList()
}

/**
 * Mostra a tela de lista
 */
async function showList() {
  let start = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Nome do Arquivo</th>
          <th>Dt. Criação</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `

  const documentList = await getList()

  let list = ''
  for (const entry of documentList) {
    list += `
        <tr>
          <td>${entry.id}</td>
          <td>${entry.title}</td>
          <td>${entry.description}</td>
          <td>${entry.fileName}</td>
          <td>${formatDate(entry.dateTime)}</td>
          <td class="botoes">
            <i class="bi bi-pencil edit" name="showCadastro" data-arg1='${JSON.stringify(entry)}' onclick="buttonInvoke"></i>
            <i class="bi bi-trash delete" name="deleteEntryBefore" data-arg1='${entry.id}' onclick="buttonInvoke"></i>
          </td>
        </tr>
    `
  }

  let end = `
      </tbody>
    </table>
  `

  const text = `
    ${start}
    ${list}
    ${end}
  `

  document.querySelector('.content').innerHTML = text
}

function buttonInvoke(event) {
  let nameOfFunction = this[event.target.name]
  let arg1 = event.target.getAttribute('data-arg1')

  window[nameOfFunction](arg1)
}

/**
 * Mostra a tela de cadastro, se tem parametro entryStr, ele vira tela de edição
 * @param {string} entryStr
 */
async function showCadastro(entryStr) {
  if (entry) {
    isEditing = true
    editing = JSON.parse(entryStr)
  }

  let text = `
    <form onsubmit="submitForm">
    </form>
  `

  console.log('abluble')
  document.querySelector('.content').innerHTML = text
}

/**
 * Busca a lista de documentos
 * @returns {Promise<ListEntry[]>}
 */
async function getList() {
  return [
    {
      id: 1,
      title: 'minha foto',
      description: 'minha foto',
      fileName: 'minhafoto.png',
      dateTime: '2024-03-25T17:40:00.000Z'
    },
    {
      id: 2,
      title: 'foto do gato',
      description: 'foto do gato',
      fileName: 'fotogato.png',
      dateTime: '2024-03-25T17:40:00.000Z'
    },
    {
      id: 3,
      title: 'foto do cachorro',
      description: 'foto do cachorro',
      fileName: 'fotocachorro.png',
      dateTime: '2024-03-25T17:40:00.000Z'
    }
  ]

  const req = await fetch('https://localhost:8080/documents')
  const json = await req.json()
  return json
}

/**
 * Insere uma entrada nos documentos
 * @param {ListEntry} object 
 * @returns {Promise<ListEntry>}
 */
async function insertList(object) {
  const body = new FormData()

  for (const key of Object.keys(object)) {
    body.append(key, object[key])
  }

  const req = await fetch('https://localhost:8080/documents', {
    method: 'POST',
    body
  })

  const json = await req.json()
  return json
}

/**
 * Atualiza uma entrada nos documentos
 * @param {number} id
 * @param {ListEntry} object 
 * @returns {Promise<ListEntry>}
 */
async function updateEntry(id, object) {
  const req = await fetch(`https://localhost:8080/documents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
  })

  const json = await req.json()
  return json
}

/**
 * Deleta uma entrada nos documentos
 * @param {number} id 
 * @returns {Promise<ListEntry>}
 */
async function deleteEntry(id) {
  const req = await fetch(`https://localhost:8080/documents/${id}`, {
    method: 'DELETE'
  })
  showList()
}

/**
 * Converte data para formato apresentável (dd/mm/yyyy hh:MM)
 * @param {string} dateTime dateTime em formato ISO 8601
 */
function formatDate(dateTime) {
  const [date, time] = dateTime.split('T')
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')

  const dateStr = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`

  return `${dateStr} ${timeStr}`
}

showList()
