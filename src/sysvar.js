import { Plugin } from 'ckeditor5/src/core';

import SysvarEditing from './sysvarediting';
import SysvarUI from './sysvarui';

export default class Sysvar extends Plugin {
	static get requires() {
		return [ SysvarEditing, SysvarUI ];
	}
}
