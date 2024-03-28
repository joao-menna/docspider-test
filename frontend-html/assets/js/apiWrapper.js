/**
 * Busca a lista de documentos
 * @returns {Promise<ListEntry[]>}
 */
async function getList() {
  // return [
  //   {
  //     id: 1,
  //     title: 'minha foto',
  //     description: 'minha foto',
  //     fileName: 'minhafoto.png',
  //     createdAt: '2024-03-25T17:40:00.000Z'
  //   },
  //   {
  //     id: 2,
  //     title: 'foto do gato',
  //     description: 'foto do gato',
  //     fileName: 'fotogato.png',
  //     createdAt: '2024-03-25T17:40:00.000Z'
  //   },
  //   {
  //     id: 3,
  //     title: 'foto do cachorro',
  //     description: 'foto do cachorro',
  //     fileName: 'fotocachorro.png',
  //     createdAt: '2024-03-25T17:40:00.000Z'
  //   }
  // ]

  const req = await fetch(`${BASE_URL}/documents`)
  const json = await req.json()
  return json
}

/**
 * Insere uma entrada nos documentos
 * @param {ListEntry} object 
 * @returns {Promise<ListEntry>}
 */
async function insertEntry(object) {
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
