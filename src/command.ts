import Transform from './index';

const Command = require('common-bin');

class MainCommand extends Command {
  private transform: Transform;
  constructor(rawArgv?) {
    super(rawArgv);
    this.transform = new Transform();
  }

  run(context) {
    this.transform.run();
  }
}

export default MainCommand;
