const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
extended: true
}));
app.use(fileUpload({
debug: true
}));

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'bot-zdg' }),
  puppeteer: { headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ] }
});

client.initialize();

io.on('connection', function(socket) {
  socket.emit('message', 'Conectando...');

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'BOT-ZDG QRCode recebido, aponte a câmera  seu celular!');
    });
});

client.on('ready', () => {
    socket.emit('ready', 'BOT-ZDG Dispositivo pronto!');
    socket.emit('message', 'BOT-ZDG Dispositivo pronto!');	
    console.log('BOT-ZDG Dispositivo pronto');
});

client.on('authenticated', () => {
    socket.emit('authenticated', 'BOT-ZDG Autenticado!');
    socket.emit('message', 'BOT-ZDG Autenticado!');
    console.log('BOT-ZDG Autenticado');
});

client.on('auth_failure', function() {
    socket.emit('message', 'BOT-ZDG Falha na autenticação, reiniciando...');
    console.error('BOT-ZDG Falha na autenticação');
});

client.on('change_state', state => {
  console.log('BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
  socket.emit('message', 'BOT-ZDG Cliente desconectado!');
  console.log('BOT-ZDG Cliente desconectado', reason);
  client.initialize();
});
});

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = req.body.number + '@c.us';
  const message = req.body.message;


  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

client.on('message', async msg => {

  const nomeContato = msg._data.notifyName;

  if (msg.type.toLowerCase() == "e2e_notification") return null;
  
  if (msg.body == "") return null;


  // OPÇÃO 1 '1️⃣- MATERIAL DIGITAL - Conjuntos' 

  if (msg.body !== null && msg.body === "1") {

    msg.reply("Ótimo, Aqui esta alguns materiais selecionados pelo Professor *Bruno* \r\n _Bons Estudos!_😉\r\n▶️ Como aprender matemática.👉 https://rebrand.ly/aprender-mat.\r\n▶️ Conjuntos numericos no dia a dia.👉 https://rebrand.ly/Conjuntos-numéricos-dia-a-dia. \r\n▶️ Play List Vídeos - Conjuntos Numéricos. 👉 https://rebrand.ly/livros-apostilas-conjuntos  \r\n📝 Livros e Apostilas Conjuntos 👉 https://rebrand.ly/livros-apostilas-conjuntos \r\n📝 Resumos - Conjuntos 👉 https://rebrand.ly/resumos-conjuntos \r\n📝 Mapas Mentais - Conjuntos 👉 https://rebrand.ly/mapas-mentais-conjuntos");
  } 
  

// OPÇÃO 2 '- Funções'

  else if (msg.body !== null && msg.body === "2") {
    msg.reply("Ótimo, Aqui esta alguns materiais selecionados pelo Professor *Bruno* \r\n _Bons Estudos!_😉\r\n▶️ Boas Vindas Funções.👉 https://rebrand.ly/apresentação_funções \r\n▶️ Funções no Cotidiano👉 https://rebrand.ly/Conjuntos-numéricos-dia-a-dia. \r\n▶️ Play List Vídeos de Funções. 👉 ***  \r\n📝 Livros e Apostilas Funções \n👉 https://rebrand.ly/livros-apostilas-funções ");
  } 
  
  // OPÇÃO 3 - FUNÇÕES AFIM
  else if (msg.body !== null && msg.body === "3") {
    msg.reply("Ótimo, Aqui esta alguns materiais selecionados pelo Professor *Bruno* \r\n _Bons Estudos!_😉\r\n▶️ Play List Vídeos de Função Afim. 👉 https://rebrand.ly/funcao_afim ");
  } 
   
   // OPÇÃO 4 - LISTAS
  else if (msg.body !== null && msg.body === "4") {
    msg.reply("Ótimo, Aqui esta alguns materiais selecionados pelo Professor *Bruno* \r\n _Bons Estudos!_😉\r\n📝 LISTAS - ESTUDOS DE FUNÇÕES REAIS 👉 https://rebrand.ly/listas_estudos_funcoes_reais ");
  }   
  
    // OPÇÃO 5 - POTENCIAÇÃO
  else if (msg.body !== null && msg.body === "5") {
    msg.reply("Ótimo, Aqui esta alguns materiais selecionados pelo Professor *Bruno* \r\n _Bons Estudos!_😉\r\n▶️ Play List Vídeos de Potenciação. 👉 https://www.youtube.com/playlist?list=PLGqEam6YizIo_MkEjSUDz7FnQBcpKW6CN \r\n▶️ Funções no Cotidiano👉 https://rebrand.ly/Conjuntos-numéricos-dia-a-dia. \r\n▶️ Play List Vídeos de Logaritimo. 👉 https://www.youtube.com/playlist?list=PLGqEam6YizIpzERifVH6SqLhlQonY4baa  \r\n📝 Livros e Apostilas 👉 https://rebrand.ly/potenciacao_log ");
  } 
  
 // OPÇÃO 6 - Entre em Contato do Desenvolvedor

  else if (msg.body !== null && msg.body === "6") {

    const contact = await msg.getContact();
    setTimeout(function() {
        msg.reply(`@${contact.number}` + ' Envie uma mensagem para *Alessandro*');  
        client.sendMessage('5573982084000@c.us','Contato ZDG. https://wa.me/' + `${contact.number}`);
      },1000 + Math.floor(Math.random() * 1000));}    

  
	 else if (msg.body !== null || msg.body === "0") {
    const saudacaoes = ['Olá ' + nomeContato + ', tudo bem?', 'Oi ' + nomeContato + ', como vai você?', 'Opa ' + nomeContato + ', tudo certo?'] ;
    const saudacao = saudacaoes[Math.floor(Math.random() * saudacaoes.length)];
    msg.reply(saudacao + "seja bem vindo(a)!, eu sou *ZAREK*, um chatbot e estou aqui para auxiliar você na disciplina de *Estudos de Funções Reais!*😉.\r\n\r\n *Escolha uma das opções abaixo para iniciarmos a nossa conversa:* \r\n\r\n1️⃣- *CONJUNTOS NUMÉRIOS.* \r\n2️⃣- *FUNÇÕES.* \r\n3️⃣- *FUNÇÕES AFIM.*  \r\n4️⃣- *LISTA DE EXERCÍCIOS.* \r\n5️⃣- *POTENCIAÇÃO.* \r\n6️⃣- ```Entre em Contato do Desenvolvedor.``` ");
	}
});
    
server.listen(port, function() {
        console.log('App running on *: ' + port);
});
