import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';
import { observer } from 'mobx-react';

import databaseStore from './store';

const styles = (theme) => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@observer
class FullScreenDialog extends React.Component {
  state = {
    name: '',
    host: ''
  };

  handleClickOpen = () => {
    databaseStore.toggle();
  };

  handleClose = () => {
    databaseStore.toggle();
  };
  checkConnection = () => {
    databaseStore.addDB(this.state.host);
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Connect to Cassandra</Button>
        <Dialog
          fullScreen
          open={databaseStore.addNew}
          onClose={this.handleClose}
          transition={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Add a Connection
              </Typography>
              <Button color="inherit" onClick={this.checkConnection}>
                check
              </Button>
              <Button color="inherit" onClick={this.saveConnection}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal" />
            <TextField id="Contact Points" label="Contact Points" className={classes.textField} value={this.state.host} onChange={this.handleChange('host')} margin="normal" />
          </form>
        </Dialog>
      </div>
    );
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullScreenDialog);
