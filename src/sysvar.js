import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SysvarEditing from './sysvarEditing';
import SysvarUI from './sysvarUI';

export default class Sysvar extends Plugin {
	static get requires() {
		return [ SysvarEditing, SysvarUI ];
	}

	static get pluginName() {
		return 'Sysvar';
	}
}
