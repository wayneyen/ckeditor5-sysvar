import { Plugin } from 'ckeditor5/src/core';
import {
	createDropdown,
	addListToDropdown,
	Model,
	Widget
} from 'ckeditor5/src/ui';
import { Collection, Command } from 'ckeditor5/src/utils';

export default class Dropdown extends Plugin {
	static get pluginName() {
		return 'dropdown';
	}

	init() {
		const editor = this.editor;

		const t = editor.t;
		const model = editor.model;
		const options = editor.config._config.sysVarOptions || [];

		editor.ui.componentFactory.add( 'dropdown', locale => {
			const dropdown = createDropdown( locale );

			dropdown.buttonView.set( {
				label: t( '系統欄位' ),
				withText: true
			} );

			const items = new Collection();

			options.forEach( option => {
				items.add( {
					type: 'button',
					model: new Model( {
						withText: true,
						class: option.key,
						label: option.value
					} )
				} );
			} );

			addListToDropdown( dropdown, items );

			this.listenTo( dropdown, 'execute', event => {
				const key = event.source.class;
				const value = event.source.label;
				const widget = `
                    <span class="ck-widget"
                        data-th-text="${ key }"
                        contenteditable="false">
                        ${ value }
                    </span>
                `;

				model.change( writer => {
					// const textNode = writer.createText( widget );
					const widgetElement = writer.createElement( 'span', {
						class: 'ck-widget',
						'data-th-text': key,
						contenteditable: 'false'
					} );

					model.insertContent( widgetElement );
				} );

				editor.editing.view.focus();
			} );

			return dropdown;
		} );
	}
}

class DropdownCommand extends Command {
	execute( { value } ) {
		const editor = this.editor;
		const selection = editor.model.document.selection;

		editor.model.change( writer => {
			// Create a <placeholder> elment with the "name" attribute (and all the selection attributes)...
			const placeholder = writer.createElement( 'placeholder', {
				...Object.fromEntries( selection.getAttributes() ),
				name: value
			} );

			// ... and insert it into the document.
			editor.model.insertContent( placeholder );

			// Put the selection on the inserted element.
			writer.setSelection( placeholder, 'on' );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const isAllowed = model.schema.checkChild(
			selection.focus.parent,
			'placeholder'
		);

		this.isEnabled = isAllowed;
	}
}
