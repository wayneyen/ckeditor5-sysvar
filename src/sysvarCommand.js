import { Command } from 'ckeditor5/src/core';

export default class SysvarCommand extends Command {
	execute( { code, label } ) {
		const editor = this.editor;
		const selection = editor.model.document.selection;

		editor.model.change( writer => {
			const sysvar = writer.createElement( 'sysvar', {
				...Object.fromEntries( selection.getAttributes() ),
				code,
				label
			} );

			editor.model.insertContent( sysvar );
			writer.setSelection( sysvar, 'on' );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const isAllowed = model.schema.checkChild( selection.focus.parent, 'sysvar' );

		this.isEnabled = isAllowed;
	}
}
