const puppeteer = require("puppeteer");
const xlsx = require("xlsx");
const chromium = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const { ipcRenderer } = require("electron");
const esperarPorTempo = require("./esperarUmTempo.js");
const sendMessageToWhatsApp = require("./sendMessage.js");

let localArquivo = document.getElementsByName("File")[0];
let botaoIniciar = document.querySelector(".btn");
let sucessos = document.getElementById("enviosBemSucedidos");
let falhas = document.getElementById("enviosMalSucedidos");
let mensagem = document.getElementById("mensagem");
const messageTextArea = document.getElementById("mensagem");

let messages = [];

botaoIniciar.addEventListener("click", () => {
  const messageText = messageTextArea.value;
  messages.push(messageText);
  let caminhoArquivo = "";
  if (localArquivo && localArquivo.files && localArquivo.files[0]) {
    caminhoArquivo = localArquivo.files[0].path;

    const workbook = xlsx.readFile(caminhoArquivo, {
      type: "binary",
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const range = xlsx.utils.decode_range(sheet["!ref"]);
    const cells = [];
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const nameCell = sheet[xlsx.utils.encode_cell({ r: row, c: 0 })];
      const numberCell = sheet[xlsx.utils.encode_cell({ r: row, c: 1 })];
      if (nameCell && numberCell) {
        const name = nameCell.v;
        const number = numberCell.v;
        cells.push({ name, number });
      }
    }

    const tamanhoCells = cells.length;

    ipcRenderer.send("oi", `Há ${tamanhoCells} nesta planilha.`);

    const iniciarNavegador = async (cells) => {
      console.log(cells);
      const browser = await puppeteer.launch({
        executablePath: chromium,
        headless: false,
      });
      const page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 720 });

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0"
      );

      await page.goto("https://web.whatsapp.com/");
      await page.waitForSelector(
        "#app > div > div > div.landing-window > div.landing-main > div > div > div._3AjBo > div.landing-title._2K09Y"
      );

      await page.waitForSelector(
        "#app > div > div > div.landing-window > div.landing-main > div > div > div._2I5ox > div > canvas"
      );

      const dataRefValue = await page.$eval(
        "#app > div > div > div.landing-window > div.landing-main > div > div > div._2I5ox > div",
        (el) => el.getAttribute("data-ref")
      );

      var condition = 0;

      while (condition == 0) {
        await esperarPorTempo(5000);
        try {
          await page.waitForSelector(
            "#side > div._3gYev > div > div > div._2vDPL",
            { timeout: 30000 }
          );
          await esperarPorTempo(5000);
          var condition = 1;
        } catch (error) {
          console.log("Aguardando o scan do QR code.");
          var condition = 0;
        }
      }

      mensagem.setAttribute("readonly", true);

      let acertos = 0;
      let erros = 0;


      for (let i = 0; i < cells.length; i++) {
        const name = cells[i].name;
        const number = cells[i].number;

        const firstName = name.split(" ")[0];

        const frasesApresentacao = ["Olá", "Oi", "Oii", "Oi!", "Oii!"];

        const message =
          frasesApresentacao[Math.floor(Math.random() * 4)] +
          ` ${firstName}, ` +
          messages[Math.floor(Math.random() * (messages.length - 1))];

        console.log(message);

        console.log(`Enviando mensagem ao ${name}`);

        if (!name || !number) {
          console.log("Valores do cliente está nulo.");
        } else {
          try {
            await sendMessageToWhatsApp(page, number, message)
            await esperarPorTempo(5000);
            acertos++;
            sucessos.innerHTML = acertos;
            console.log(`Mensagem enviada para ${number}.`);
          } catch (error) {
            console.log(error)
            erros++;
            try {
              const listaFalhaEnvios = document.getElementById('lista-falha-envios');
              const novoItemLista = document.createElement('li');
              novoItemLista.textContent = name + ' - ' + number;
              listaFalhaEnvios.appendChild(novoItemLista);
            } catch (error) {
              console.log(error)
            }

            falhas.innerHTML = erros;
          }
        }
      }
      page.close();
      browser.close();
    };

    iniciarNavegador(cells);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const modalBtn = document.getElementById("modal-btn");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementsByClassName("close")[0];
  const addMessageBtn = document.getElementById("add-message-btn");
  const messageInput = document.getElementById("message-input");
  const messagesContainer = document.getElementById("messages-container");
  const fileInput = document.getElementById("file-upload");
  const errorMessage = document.getElementById("error-message");
  const fileUpload = document.getElementById("file-upload");
  const textBtn = document.getElementById("nameFile");
  const spanElement = document.getElementById("span-element");
  const modalNegatives = document.getElementById("modalNegatives");
  const modalNegativecloseBtn = document.querySelector(".modalNegativecloseBtn");

  function showModalNegatives() {
    modalNegatives.style.display = "block";
  }

  function hideModalNegatives() {
    modalNegatives.style.display = "none";
  }

  spanElement.addEventListener("click", showModalNegatives);
  modalNegativecloseBtn.addEventListener("click", hideModalNegatives);

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    const fileType = file.type;
    const validFileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validFileTypes.includes(fileType)) {
      errorMessage.textContent = !validFileTypes.includes(fileType)
        ? `Por favor insira um arquivo de planilha (xlsx ou csv).`
        : "";
      textBtn.innerText = !validFileTypes.includes(fileType)
        ? "Insira a sua planilha."
        : `${fileUpload.files[0].name}`;
    } else {
      errorMessage.textContent = "";
      var fileName = fileUpload.files[0].name.split("\\").pop();
      textBtn.innerText = fileName;
    }
  });

  function showModal() {
    modal.style.display = "block";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function addMessage() {
    const message = messageInput.value;
    if (message !== "") {
      messages.push(message);
      messageInput.value = "";
      updateMessages();
      console.log(messages);
    }
  }

  function updateMessages() {
    messagesContainer.innerHTML = "";
    for (var i = 0; i < messages.length; i++) {
      const message = messages[i];
      const messageElement = document.createElement("p");
      messageElement.textContent = message;
      messagesContainer.appendChild(messageElement);
    }
  }

  modalBtn.addEventListener("click", showModal);
  closeBtn.addEventListener("click", hideModal);

  addMessageBtn.addEventListener("click", addMessage);
});
