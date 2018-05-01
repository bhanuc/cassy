import {
  observable,
  computed,
  configure,
  flow,
  action
} from 'mobx';
import 'whatwg-fetch';


const cassandra = require('cassandra-driver');


configure({
  enforceActions: true
});
// would normally go in src/stores/...
export class Databases {
  @observable dbs = {};
  @observable keyspaces = []
  @observable newDialog = false;
  @observable tableViews = false;
  @observable activeKeyspace = '';
  @observable activeTables = [];
  @observable activeTable = '';
  @observable activeResult = [];
  @observable currentQuery = '';
  @observable snackbar = { state: false, message: '' }


  @computed get activeColumns() {
    return (this.activeResult.length > 0 && Object.keys(this.activeResult[0])) || [];
  }

  @action
  setActiveKeyNameSpace = (keyspace) => {
    this.activeKeyspace = keyspace;
    this.getTables();
    this.tableViews = true;
  }
  @action
  setActiveTable = (tableName) => {
    this.activeTable = tableName;
    this.getTable();
  }
  @action
  toggleDialog() {
    this.newDialog = !this.newDialog;
  }

  @action
  updateQuery(val) {
    this.currentQuery = val;
  }
  @action
  toggleTableViews = () => {
    this.tableViews = !this.tableViews;
  }

  @action
  updateSnackbar = (state, message) => {
    console.log('updateSnackbar now');
    this.snackbar.state = state;
    this.snackbar.message = message;
  }

  @action
  closeSnackbar = () => {
    console.log('closing now');
    this.snackbar.state = false;
    this.snackbar.message = '';
  }

  executeQuery = flow(function* executeQuery(query) {
    try {
      const client = new cassandra.Client({
        contactPoints: this.db.contactpoints.split(','),
        keyspace: this.activeKeyspace
      });
      console.log(query);
      this.updateSnackbar(true, 'Executing Query');
      const output = yield client.execute(query || this.currentQuery)
        .then(result => result);
      this.activeResult = output.rows;
      console.log(output.rows);
    } catch (e) {
      this.updateSnackbar(true, e.message);
      console.log(e, 'caught in catch');
    }
  });


  addDB = flow(function* addDB(contactpoints) {
    try {
      const client = new cassandra.Client({
        contactPoints: contactpoints.split(',')
      });
      const query = 'SELECT * from system_schema.keyspaces;';
      const output = yield client.execute(query)
        .then(result => result);
      this.keyspaces = output.rows;
      this.newDialog = false;
      this.db = { contactpoints };
      this.updateQuery(query);
      this.updateSnackbar(true, 'DB added');
    } catch (e) {
      this.updateSnackbar(true, e.message);
      console.log(e, 'caught in catch');
    }
  });
  getTables = flow(function* getTables() {
    try {
      const client = new cassandra.Client({
        contactPoints: this.db.contactpoints.split(','),
        keyspace: this.activeKeyspace
      });
      const query = 'SELECT table_name FROM system_schema.tables WHERE keyspace_name = ?';
      const output = yield client.execute(query, [this.activeKeyspace])
        .then(result => result);
      this.activeTables = output.rows;
      this.updateQuery(query);
    } catch (e) {
      this.updateSnackbar(true, e.message);
      console.log(e, 'caught in catch');
    }
  });
  getTable = flow(function* getTable() {
    try {
      const client = new cassandra.Client({
        contactPoints: this.db.contactpoints.split(','),
        keyspace: this.activeKeyspace
      });
      const query = `SELECT * FROM ${this.activeTable} LIMIT 10;`;
      const output = yield client.execute(query)
        .then(result => result);
      if (output.rows.length === 0) {
        this.updateSnackbar(true, `${this.activeTable} appears to empty`);
      }
      this.activeResult = output.rows;
      this.updateQuery(query);
    } catch (e) {
      this.updateSnackbar(true, e.message);
      console.log(e, 'caught in catch');
    }
  });
}

const databaseStore = new Databases();

export default databaseStore;
