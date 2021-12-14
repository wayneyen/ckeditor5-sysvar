import { Plugin } from 'ckeditor5/src/core';
import { toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5/src/widget';
import SysvarCommand from './sysvarCommand';
import '../theme/sysvar.css';

export default class SysvarEditing extends Plugin {
	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'sysvar', new SysvarCommand( this.editor ) );

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'sysvar' ) )
		);
	}

	// Widget規格
	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'sysvar', {
			allowWhere: '$text',
			isInline: true,
			isObject: true,
			allowAttributesOf: '$text',
			allowAttributes: [ 'code', 'label' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// 視圖轉換為模組
		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: [ 'sysvar' ]
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				const code = viewElement.getAttribute( 'data-th-text' );
				const label = viewElement.getChild( 0 ).data;
				return modelWriter.createElement( 'sysvar', { code, label } );
			}
		} );

		// edit mode
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'sysvar',
			view: ( modelItem, { writer: viewWriter } ) => {
				const widgetElement = createSysvarView( modelItem, viewWriter );

				return toWidget( widgetElement, viewWriter );
			}
		} );

		// data mode
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'sysvar',
			view: ( modelItem, { writer: viewWriter } ) => createSysvarView( modelItem, viewWriter )
		} );

		// 建立視圖
		function createSysvarView( modelItem, viewWriter ) {
			const code = modelItem.getAttribute( 'code' );
			const label = modelItem.getAttribute( 'label' );

			const sysvarView = viewWriter.createContainerElement( 'span', {
				class: 'sysvar',
				'data-th-text': code
			}, {
				isAllowedInsideAttributeElement: false
			} );

			const innerText = viewWriter.createText( label );
			viewWriter.insert( viewWriter.createPositionAt( sysvarView, 0 ), innerText );

			return sysvarView;
		}
	}
}
