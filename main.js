"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields(); //limpar campos
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("dbClient")) ?? []; //se não for valido ret array vazio
const setLocalStorage = (dbClient) =>
  localStorage.setItem("dbClient", JSON.stringify(dbClient));

// Delete

const deleteClient = (index) => {
  //index p achar posição client
  const dbClient = readClient(); //para ler todos client
  dbClient.splice(index, 1); //cortar 1 posição do array
  setLocalStorage(dbClient); //enviar dados atualizados
};

//Update

const updateClient = (index, client) => {
  const dbClient = readClient(); // arm todos os cliente
  dbClient[index] = client; // var posição indice recebe dados client atualizados
  setLocalStorage(dbClient); //mandar p banco a atualização
};

// Read

const readClient = () => getLocalStorage();

//Create

const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};

const isValidFields = () => {
  return document.querySelector(".modal-form").reportValidity(); //retorna se tds as regras do form forem cumpridas
};

// Interação com layout:

const clearFields = () => {
  //limpar campos
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = "")); //deixar valor de cada campo vazio
};

const saveClient = () => {
  if (isValidFields()) {
    //se form for valido criar objeto:
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      celular: document.getElementById("celular").value,
      cidade: document.getElementById("cidade").value,
    };
    const index = document.getElementById("nome").dataset.index; //diferênciar salvar de editar:

    //usando data:
    if (index == "new") {
      createClient(client); //cadastrar no banco
      updateTable(); //atualizar table
      closeModal(); //fechar modal
    } else {
      updateClient(index, client);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (client, index) => {
  //rec client
  const newRow = document.createElement("tr"); //arm nova linha
  newRow.innerHTML = ` 
            <td>${client.nome}</td>
            <td>${client.email}</td>
            <td>${client.celular}</td>
            <td>${client.cidade}</td>
            <td>
              <button type="button" class="button green" id='edit-${index}'>Editar</button>
              <button type="button" class="button red" id='delete-${index}'>Excluir</button>
            </td>  
  `; //preencher cada linha

  document.querySelector("#tableClient>tbody").appendChild(newRow); //criar linha. add filho nova linha
};

const clearTable = () => {
  const row = document.querySelectorAll("#tableClient>tbody tr"); //arm linha da tableta
  row.forEach((row) => row.parentNode.removeChild(row)); //verf linhas remover elm filho do o pai(apagar a proria linha)
};

const updateTable = () => {
  const dbClient = readClient(); //ler e armaz clientes
  clearTable();
  dbClient.forEach(createRow); //verif cada item
};

const fillFields = (client) => {
  //função preencher campos:
  document.getElementById("nome").value = client.nome;
  document.getElementById("email").value = client.email;
  document.getElementById("celular").value = client.celular;
  document.getElementById("cidade").value = client.cidade;
  document.getElementById("nome").dataset.index = client.index; //para editar cliente
};

const editClient = (index) => {
  //pelo index
  const client = readClient()[index]; //ler e arm client pelo index
  client.index = index; //informar o index para editar client
  fillFields(client); //preecher campo
  openModal(); //abrir modal
};

const editDelete = (event) => {
  //selc apenas os botões:
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-"); //separa tds os buttons

    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index]; //pegar index do nome para excluir
      const response = confirm(`Deseja realmente excluir ${client.nome}`); //criar alert confirmação

      //se response for vdd exclui, senão nada:
      if (response) {
        deleteClient(index); //del pelo index
        updateTable();
      }
    }
  }
};

updateTable();

//Events
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document
  .querySelector("#tableClient>tbody")
  .addEventListener("click", editDelete);
