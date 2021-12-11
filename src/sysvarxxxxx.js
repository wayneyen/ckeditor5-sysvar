import { Plugin, Command } from 'ckeditor5/src/core';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5/src/widget';
import { Model, createDropdown, addListToDropdown } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';

export default class Sysvar extends Plugin {
	static get requires() {
		return [ SysvarUI ];
	}
}

// 插入系統欄位命令
class SysvarCommand extends Command {
	execute( { value } ) {
		const editor = this.editor;
		const selection = editor.model.document.selection;

		editor.model.change( writer => {
			const sysvar = writer.createElement( 'sysvar', {
				...Object.fromEntries( selection.getAttributes() ),
				name: value
			} );

			// 插入文件
			editor.model.insertContent( sysvar );

			// 選取該元件 (可不選取)
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

class SysvarUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;
		const sysVarOptions = editor.config.get( 'sysVarOptions' );

		editor.ui.componentFactory.add( 'sysvar', locale => {
			const dropdownView = createDropdown( locale );

			// Populate the list in the dropdown with items.
			addListToDropdown(
				dropdownView,
				getDropdownItemsDefinitions( sysVarOptions )
			);

			dropdownView.buttonView.set( {
				label: t( '系統欄位' ),
				tooltip: true,
				withText: true
			} );

			// // Disable the placeholder button when the command is disabled.
			// const command = editor.commands.get( 'sysvar' );
			// dropdownView.bind( 'isEnabled' ).to( command );

			// // Execute the command when the dropdown item is clicked (executed).
			// this.listenTo( dropdownView, 'execute', evt => {
			// 	editor.execute( 'sysvar', {
			// 		value: evt.source.commandParam
			// 	} );
			// 	editor.editing.view.focus();
			// } );

			return dropdownView;
		} );
	}
}

function getDropdownItemsDefinitions( options ) {
	const itemDefinitions = new Collection();

	for ( const option of options ) {
		const definition = {
			type: 'button',
			model: new Model( {
				label: option.value,
				withText: true
			} )
		};

		itemDefinitions.add( definition );
	}

	return itemDefinitions;
}
