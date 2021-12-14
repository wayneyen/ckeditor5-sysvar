import { Plugin } from 'ckeditor5/src/core';

import SysvarEditing from './sysvarEditing';
import SysvarUI from './sysvarUI';

export default class Sysvar extends Plugin {
	static get requires() {
		return [ SysvarEditing, SysvarUI ];
	}
}
