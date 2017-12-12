class ConnectionManager {
  constructor(tetrisManager) {
    this.conn = null;
    this.peers = new Map; // keep a list of all peers

    this.tetrisManager = tetrisManager;
    this.localTetris = [...tetrisManager.instances][0]; // this is how to access local player, ean instance Set object.
  }

  connect(address) {
    this.conn = new WebSocket(address);
    // addEventListener gets called once connection is established
    this.conn.addEventListener('open', () => {
      console.log("connection established (client)");
      this.initSession(); // init session when connection is established
      this.watchEvents(); // once connection is established, watchEventss
    });

    this.conn.addEventListener('message', e => {
      console.log('Message received (client): ', e.data);
      this.receive(e.data);
    });
  }

  // check to see if session already exists, if not create new session
  initSession() {
    const sessionId = window.location.hash.split("#")[1]; // get everything after hash
    if (sessionId) {
      this.send({
        type: 'join-session',
        id: sessionId,
      })
    } else {
      this.send({ // send request from client-side to create a room/session in server
        type: 'create-session',
      });
    }
  }

  // sets up event listeners in the player and board class
  watchEvents() {
    const local = this.localTetris;
    const player = local.player;

    ['pos', 'matrix', 'score'].forEach(prop => {
      player.events.listen(prop, value => {
        this.send({
          type: 'state-update',
          fragment: 'player',
          player: [prop, value],
        });
      });
    });

    // player.events.listen('pos', pos => {
    //   console.log('player pos changed', pos);
    // })
    //
    // player.events.listen('matrix', matrix => {
    //   console.log('player matrix changed', matrix);
    // })
  }

  updateManager(peers) {
    const me = peers.you;
    const clients = peers.clients.filter(id => me !== id); // filters me out of peers while broadcasting session
    clients.forEach(id => {
      if (!this.peers.has(id)) { // if peers Map object does not have id, create a tetris player
        const tetris = this.tetrisManager.createPlayer();
        this.peers.set(id, tetris); // store player in peers Map obj, which stores all active players/session IDs
      }
    });

    [...this.peers.entries()].forEach(([id, tetris]) => {
      if (clients.indexOf(id) === -1) { // if clients array does not contain id, removePlayer and delete id from peers Map obj.
        this.tetrisManager.removePlayer(tetris);
        this.peers.delete(id);
      }
    })
  }

  receive(msg) {
    const data = JSON.parse(msg); // parse msg from server
    if (data.type === 'session-created') {
      window.location.hash = data.id;
    } else if (data.type === 'session-broadcast') {
      this.updateManager(data.peers);
    }
  }

  // send data to server 
  send(data) {
    const msg = JSON.stringify(data);
    console.log(`Sending message (from client): ${msg}`);
    this.conn.send(msg);
  }
}
