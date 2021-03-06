import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

export default class SysvarUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;
		const options = editor.config.get( 'sysvar.options' );

		editor.ui.componentFactory.add( 'sysvar', locale => {
			const dropdownView = createDropdown( locale );

			addListToDropdown( dropdownView, getDropdownItemsDefinitions( options ) );

			dropdownView.buttonView.set( {
				label: t( '系統變數' ),
				withText: true
			} );

			const command = editor.commands.get( 'sysvar' );
			dropdownView.bind( 'isEnabled' ).to( command );

			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( 'sysvar', {
					code: evt.source.code,
					label: evt.source.label
				} );
				editor.editing.view.focus();
			} );

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
				code: option.code,
				label: option.label,
				withText: true
			} )
		};

		itemDefinitions.add( definition );
	}

	return itemDefinitions;
}
