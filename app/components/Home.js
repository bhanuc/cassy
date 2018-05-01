import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import CloseIcon from 'material-ui-icons/Close';
import AddIcon from 'material-ui-icons/Add';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';


import { observer } from 'mobx-react';

import databaseStore from './store';
import Table2 from './table';

const drawerWidth = 240;


function Transition(props) {
  return <Slide direction="up" {...props} />;
}
const getValue = (val) => {
  switch (typeof val) {
    case 'string':
      return val;
    default:
      return JSON.stringify(val);
  }
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '97%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  tablePaper: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '60vh',
  },
  table: {
    minWidth: 1020,
  }
});

@observer
class Home extends React.Component {
  state = {
    open: false,
    anchor: 'left',
    host: '',
    name: '',
    query: ''
  };

  toggleDialog = () => {
    databaseStore.toggleDialog();
  };

  checkConnection = () => {
    databaseStore.addDB(this.state.host);
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  updateQuery = () => event => {
    databaseStore.updateQuery(event.target.value);
  };
  executeQuery = () => {
    databaseStore.executeQuery(this.state.query);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { anchor, open } = this.state;

    const keyspaces = (databaseStore.keyspaces.length > 0 &&
            databaseStore.keyspaces.map(tile => (
              <ListItem button key={tile.keyspace_name} onClick={databaseStore.setActiveKeyNameSpace.bind(null, tile.keyspace_name)}>
                <ListItemText primary={tile.keyspace_name} />
              </ListItem>
            ))
    );

    const tables = (databaseStore.activeTables.length > 0 &&
    <span>
      <ListItem button onClick={databaseStore.toggleTableViews}>
        <ListItemIcon>
          <ArrowBackIcon />
        </ListItemIcon>
        <ListItemText
          primary="Go Back"
          classes={{ primary: classes.text }}
        />
      </ListItem>
      {databaseStore.activeTables.map(tile => (
        <ListItem button key={tile.table_name} onClick={databaseStore.setActiveTable.bind(null, tile.table_name)}>
          <ListItemText primary={tile.table_name} />
        </ListItem>
            ))}
    </span>
    );
    const items = databaseStore.tableViews ? tables : keyspaces;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <ListItem button onClick={this.toggleDialog}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            primary="Add new DB"
            classes={{ primary: classes.text }}
          />
        </ListItem>
        <Divider />
        {items}
        <Divider />
      </Drawer>
    );

    return (
      <div className={classes.root}>
        <AppBar
          className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Cassy
            </Typography>
          </Toolbar>
        </AppBar>
        {drawer}
        <main
          className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
        >
          <div className={classes.drawerHeader} />
          <Grid
            container
            spacing={8}
            alignItems="stretch"
            direction="column"
            justify="space-between"
          >
            <Grid item>
              <textarea style={{ width: '100%', height: '100%', minHeight: '20vh' }} id="query" label="Query" className={classes.textField} defaultValue={this.state.query} onChange={this.handleChange('query')} />
              <Button variant="raised" onClick={this.executeQuery}>
                Execute
              </Button>
            </Grid>
            <Grid item>
              <Paper
                className={classes.tablePaper}
              >
                <Table2 data={databaseStore.activeResult} />
              </Paper>
            </Grid>
          </Grid>
        </main>
        <Dialog
          fullScreen
          open={databaseStore.newDialog}
          onClose={this.toggleDialog}
          transition={Transition}
        >
          <AppBar >
            <Toolbar>
              <IconButton color="inherit" onClick={this.toggleDialog} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Add a Connection
              </Typography>
            </Toolbar>
          </AppBar>
          <form className={classes.container} noValidate autoComplete="off" style={{ padding: 100 }}>
            <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal" />
            <br />
            <TextField id="Contact Points" label="Contact Points" className={classes.textField} value={this.state.host} onChange={this.handleChange('host')} margin="normal" />
            <br />
            <br />
            <Button variant="raised" color="primary" onClick={this.checkConnection}>
                Connect
            </Button>
            <br />
            <br />
            <span style={{ color: 'red' }}>Status: {databaseStore.snackbar.message}</span>
          </form>

        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={databaseStore.snackbar.state}
          onClose={databaseStore.closeSnackbar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{databaseStore.snackbar.message} </span>}
        />
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Home);
