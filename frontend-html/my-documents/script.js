/**
 * @typedef {ListEntry}
 * @property {number?} id
 * @property {string} title
 * @property {string} description
 * @property {string} fileName
 * @property {string} createdAt
 */

let isEditing = false
let editing = {}
let invalidFile = false
const BASE_URL = 'http://localhost:8080'

/**
 * Delete entry before serve para deletar e atualizar
 * @param {number} id
 */
async function deleteEntryAction(id) {
  await deleteEntry(id)
  showList()
}

/**
 * Mostra a tela de lista
 */
async function showList() {
  let start = `
    <h4>Meus documentos</h4>
    <div>
      <button class="btn btn-primary" onclick="showCadastro()">Criar novo</button>
    </div>
    <div class="cards">
    <!-- <table>
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
      <tbody> -->
  `

  const documentList = await getList()

  let list = ''
  for (const entry of documentList) {
    // modo tabela
    // list += `
    //     <!-- <tr>
    //       <td>${entry.id}</td>
    //       <td>${entry.title}</td>
    //       <td>${entry.description}</td>
    //       <td>${entry.fileName}</td>
    //       <td>${formatDate(entry.dateTime)}</td>
    //       <td class="botoes">
    //         <i class="bi bi-pencil button" name="showCadastro" data-arg1='${JSON.stringify(entry)}'></i>
    //         <i class="bi bi-trash button" name="deleteEntryAction" data-arg1='${entry.id}'></i>
    //       </td>
    //     </tr> -->
    // `
    // modo card
    list += `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${entry.title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${entry.fileName}</h6>
          <p class="card-text">${entry.description}</p>
          <p class="createdAt">Criado em: ${formatDate(entry.createdAt)}</p>
          <button class="btn button" name="downloadFile" data-arg1='${entry.fileName}'>
            <i class="bi bi-download" name="downloadFile" data-arg1='${entry.fileName}'></i>
          </button>
          <button class="btn button" name="showCadastro" data-arg1='${JSON.stringify(entry)}'>
            <i class="bi bi-pencil" name="showCadastro" data-arg1='${JSON.stringify(entry)}'></i>
          </button>
          <button class="btn button" name="deleteEntryAction" data-arg1='${entry.id}'>
            <i class="bi bi-trash" name="deleteEntryAction" data-arg1='${entry.id}'></i>
          </button>
        </div>
      </div>
    `
  }

  let end = `
      <!-- </tbody>
    </table> -->
    </div>
  `

  const text = `
    ${start}
    ${list}
    ${end}
  `

  document.querySelector('.content').innerHTML = text

  document.querySelectorAll('.button').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation()
      buttonInvoke(ev)
    })
  })
}

/**
 * Baixar arquivo
 * @param {ListEntry} entry
 */
function downloadFile(entryFileName) {
  const a = document.createElement('a')
  a.href = `${BASE_URL}/static/${entryFileName}`
  a.download = entryFileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * Função para quando clicar no botão
 * @param {*} event Evento de clicar no botão
 */
function buttonInvoke(event) {
  let nameOfFunction = this[event.target.getAttribute('name')]
  let arg1 = event.target.getAttribute('data-arg1')

  nameOfFunction(arg1)
}

/**
 * Mostra a tela de cadastro, se tem parametro entryStr, ele vira tela de edição
 * @param {string} entryStr
 */
async function showCadastro(entryStr) {
  if (entryStr) {
    isEditing = true
    editing = JSON.parse(entryStr)
  }

  let text = `
    <h4>Adicionar anexo</h4>
    <button class="btn btn-secondary" onclick="showList()">Voltar</button>
    ${invalidFile ? '<p class="invalidFile">Arquivo inválido detectado!</p>' : ''}
    <form onsubmit="submitForm">
      <div class="container-title">
        <div class="title">
          <label>Título</label>
          <input id="title" type="text" value="${editing.title || ''}" required />
        </div>

        <div class="fileName">
          <label>Nome do arquivo</label>
          <input id="fileName" type="text" value="${editing.fileName || ''}" required />
        </div>
      </div>

      <div class="description">
        <label>Descrição</label>
        <textarea id="description" required>${editing.description || ''}</textarea>
      </div>

      ${!editing.title ? '<div class="file-input"><input id="file-input" type="file" required /></div>' : ''}

      <div class="button-wrapper">
        <button class="btn btn-primary" type="submit">Enviar</button>
      </div>
    </form>
  `

  setTimeout(() => {
    invalidFile = false
    document.querySelector('.invalidFile').remove()
  }, 2000)
  document.querySelector('.content').innerHTML = text
  document.querySelector('#file-input').addEventListener('change', (ev) => {
    onFileChange(ev)
  })
}

/**
 * Esta função ocorre quando é trocado o arquivo
 * @param {*} event Evento de trocar file
 */
function onFileChange(event) {
  if (event.target.files.length === 0) {
    return
  }

  const file = event.target.files[0]
  if (['exe', 'zip', 'bat'].includes(file.name.split('.')[file.name.split('.').length - 1])) {
    event.target.value = ''
    invalidFile = true
    showCadastro()
    return
  }

  const input = document.querySelector('#fileName')
  input.value = file.name
}

/**
 * Função para quando o form for enviado
 * @param {*} event Evento de enviar form
 */
function submitForm(event) {
  event.preventDefault()
  event.stopPropagation()
  showList()
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
      createdAt: '2024-03-25T17:40:00.000Z'
    },
    {
      id: 2,
      title: 'foto do gato',
      description: 'foto do gato',
      fileName: 'fotogato.png',
      createdAt: '2024-03-25T17:40:00.000Z'
    },
    {
      id: 3,
      title: 'foto do cachorro',
      description: 'foto do cachorro',
      fileName: 'fotocachorro.png',
      createdAt: '2024-03-25T17:40:00.000Z'
    }
  ]

  const req = await fetch(`${BASE_URL}/documents`)
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

  const req = await fetch(`${BASE_URL}/documents`, {
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
  const req = await fetch(`${BASE_URL}/documents/${id}`, {
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
  const req = await fetch(`${BASE_URL}/documents/${id}`, {
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
