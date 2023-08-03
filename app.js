const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

// Objeto para armazenar o horário da última mudança de status
let lastStatusChangedTime = {};

app.post('/webhook', (req, res) => {
  const event = req.body.status;
  const ticket = req.body.ticketID;

  console.log(event);
  console.log(ticket);

  if (event === 'Resolvido') {
    console.log("a");
    lastStatusChangedTime[ticket] = Date.now();
  }

  res.sendStatus(200);
});

// Função que finaliza um ticket
async function finalizarTicket(ticketId) {
  try {
    console.log(`Finalizando ticket #${ticketId}`);
    const zendeskUrl = '';
    const zendeskEmail = '';
    const zendeskToken = '';
    const updateUrl = `${zendeskUrl}/api/v2/tickets/${ticketId}.json`;
    const data = { ticket: { status: 'closed' } };
    await axios.put(updateUrl, data, {
      auth: {
        username: `${zendeskEmail}/token`,
        password: zendeskToken
      }
    });

    // Remove o horário armazenado da última mudança de status
    delete lastStatusChangedTime[ticketId];
  } catch (error) {
    console.error(`Erro ao finalizar o ticket #${ticketId}: ${error.message}`);
  }
}

// Verifica periodicamente se já passou 5 minutos desde a última mudança de status
setInterval(() => {
  const ticketIds = Object.keys(lastStatusChangedTime);
  for (const ticketId of ticketIds) {
    const lastChangedTime = lastStatusChangedTime[ticketId];
    
    console.log(lastChangedTime);

    if (Date.now() - lastChangedTime >= 5 * 60 * 1000) {
      finalizarTicket(ticketId);
    }
  }
}, 120000);

app.listen(3001, () => {
  console.log('Servidor iniciado na porta 3001');
});
