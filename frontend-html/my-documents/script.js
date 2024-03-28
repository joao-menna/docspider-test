/**
 * Tipo da entrada da lista
 * @typedef {ListEntry}
 * @property {number?} id
 * @property {string} title
 * @property {string} description
 * @property {string} fileName
 * @property {string} createdAt
 */

// Variáveis compartilhadas
let isEditing = false
let editing = {}
let invalidFile = false

// Selecionar o back-end
// Fastify
// const BASE_URL = 'http://localhost:8080'
// ASP.NET
const BASE_URL = 'https://localhost:7091'

/**
 * Mostra a tela de lista
 * @param {boolean?} renderOnlyList Renderizar apenas a lista, usado para filtros
 */
async function showList(renderOnlyList) {
  let start
  if (!renderOnlyList) {
    start = `
      <h4>Meus documentos</h4>
      <div class="top-actions">
        <div class="filters">
          <h5>Filtros</h5>
          <div class="inner-filters">
            <div class="filter">
              <label>Título</label>
              <input id="filterTitle" type="text" />
            </div>
            <div class="filter">
              <label>Nome do arquivo</label>
              <input id="filterFileName" type="text" />
            </div>
            <div class="filter">
              <label>Ordernar por</label>
              <select id="orderList">
                <option value="title" selected>Título</option>
                <option value="fileName">Nome do arquivo</option>
                <option value="dateTime">Data e hora da criação</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <button class="btn btn-primary" onclick="showCadastro()">Criar novo</button>
        </div>
      </div>
      <div class="cards">
    `
  }

  /**
   * @type {ListEntry[]}
   */
  let documentList = []

  try {
    documentList = await getList()
  } catch (err) {
    const text = '<p>Algum erro ocorreu tentando pegar a lista!</p>'

    document.querySelector('.content').innerHTML = text
    return
  }

  const filterTitle = document.querySelector('#filterTitle')
  const filterFileName = document.querySelector('#filterFileName')
  const orderList = document.querySelector('#orderList')

  documentList.sort((a, b) => (
    a.title.localeCompare(b.title)
  ))

  if (orderList) {
    if (orderList.value === 'title') {
      documentList.sort((a, b) => (
        a.title.localeCompare(b.title)
      ))
    }

    if (orderList.value === 'fileName') {
      documentList.sort((a, b) => (
        a.fileName.localeCompare(b.fileName)
      ))
    }

    if (orderList.value === 'dateTime') {
      documentList.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)

        return dateA.getTime() - dateB.getTime()
      })
    }
  }

  let list = ''
  for (const entry of documentList) {
    if (filterTitle && filterFileName) {
      if (filterTitle.value) {
        if (!entry.title.includes(filterTitle.value)) {
          continue
        }
      }

      if (filterFileName.value) {
        if (!entry.fileName.includes(filterFileName.value)) {
          continue
        }
      }
    }

    list += `
      <div class="card" id="card-entry-${entry.id}">
        <div class="card-body">
          <h5 class="card-title">${entry.title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${entry.fileName}</h6>
          <p class="card-text">${entry.description}</p>
          <p class="createdAt">Criado em: ${entry.createdAt ? formatDate(entry.createdAt) : ''}</p>
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

  if (!renderOnlyList) {
    let end = `
      </div>
    `

    const text = `
      ${start}
      ${list}
      ${end}
    `

    document.querySelector('.content').innerHTML = text

    document.querySelector('#filterTitle').addEventListener('input', () => {
      showList(true)
    })

    document.querySelector('#filterFileName').addEventListener('input', () => {
      showList(true)
    })

    document.querySelector('#orderList').addEventListener('change', () => {
      showList(true)
    })
  } else {
    document.querySelector('.cards').innerHTML = list
  }

  document.querySelectorAll('.button').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation()
      buttonInvoke(ev)
    })
  })
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
    <button class="btn btn-secondary" onclick="isEditing = false; editing = {}; showList()">Voltar</button>
    ${invalidFile ? '<p class="invalidFile">Arquivo inválido detectado!</p>' : ''}
    <p class="alertError" style="display: none;">Não é possível criar títulos duplicados!</p>
    <form>
      <div class="container-title">
        <div class="title">
          <label>Título</label>
          <input id="title" type="text" maxlength="100" value="${editing.title || ''}" required />
        </div>

        <div class="fileName">
          <label>Nome do arquivo</label>
          <input id="fileName" type="text" value="${editing.fileName || ''}" required />
        </div>
      </div>

      <div class="description">
        <label>Descrição</label>
        <textarea id="description" maxlength="2000" required>${editing.description || ''}</textarea>
      </div>

      ${!isEditing ? '<div class="file-input"><input id="file-input" type="file" required /></div>' : ''}

      ${isEditing ? `
        <div class="editing-actions">
          <button type="button" class="btn button" name="downloadFile" data-arg1='${editing.fileName}'>
            <i class="bi bi-download" name="downloadFile" data-arg1='${editing.fileName}'></i>
          </button>
          <button type="button" class="btn button" name="deleteEntryAction" data-arg1='${editing.id}' data-arg2="true">
            <i class="bi bi-trash" name="deleteEntryAction" data-arg1='${editing.id}' data-arg2="true"></i>
          </button>
        </div>
      ` : ''}

      <div class="button-wrapper">
        <button class="btn btn-primary" type="submit">Enviar</button>
      </div>
    </form>
  `

  if (invalidFile) {
    setTimeout(() => {
      invalidFile = false
      document.querySelector('.invalidFile').remove()
    }, 2000)
  }

  document.querySelector('.content').innerHTML = text

  document.querySelectorAll('.button').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation()
      buttonInvoke(ev)
    })
  })

  if (document.querySelector('#file-input')) {
    document.querySelector('#file-input').addEventListener('change', (ev) => {
      onFileChange(ev)
    })
  }

  document.querySelector('form').addEventListener('submit', (ev) => {
    ev.preventDefault()
    submitForm()
  })
}

/**
 * Delete entry action serve para deletar e atualizar
 * @param {number} id ID do registro para apagar
 * @param {boolean?} isInEditScreen Determina se está na tela de edição
 */
async function deleteEntryAction(id, isInEditScreen) {
  await deleteEntry(id)

  if (isInEditScreen) {
    isEditing = false
    editing = {}
  }

  showList()
}

/**
 * Baixar arquivo
 * @param {ListEntry} entry
 */
function downloadFile(entryFileName) {
  const a = document.createElement('a')
  a.href = `${BASE_URL}/static/${entryFileName}`
  a.download = entryFileName
  a.setAttribute('target', '_blank')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}


// -------- EVENTOS --------


/**
 * Função para quando clicar no botão
 * @param {*} event Evento de clicar no botão
 */
function buttonInvoke(event) {
  let nameOfFunction = this[event.target.getAttribute('name')]
  let arg1 = event.target.getAttribute('data-arg1')
  let arg2 = event.target.getAttribute('data-arg2')

  if (!arg2) {
    nameOfFunction(arg1)
  } else {
    nameOfFunction(arg1, arg2)
  }
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
 */
async function submitForm() {
  try {
    if (!isEditing) {
      await insertEntry({
        File: document.querySelector('#file-input').files[0],
        Title: document.querySelector('#title').value,
        Description: document.querySelector('#description').value,
        FileName: document.querySelector('#fileName').value
      })
    } else {
      await updateEntry(editing.id, {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        fileName: document.querySelector('#fileName').value
      })
    }

    editing = {}
    isEditing = false
    showList()
  } catch (err) {
    document.querySelector('.alertError').style.display = 'block'
    setTimeout(() => {
      document.querySelector('.alertError').style.display = 'none'
    }, 2000)
  }
}

showList()
