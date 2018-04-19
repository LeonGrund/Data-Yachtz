/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.16/e-1.7.3/af-2.2.2/b-1.5.1/b-flash-1.5.1/b-print-1.5.1/sc-1.4.4/sl-1.2.5
 *
 * Included libraries:
 *   DataTables 1.10.16, Editor 1.7.3, AutoFill 2.2.2, Buttons 1.5.1, Flash export 1.5.1, Print view 1.5.1, Scroller 1.4.4, Select 1.2.5
 */

/*! DataTables 1.10.16
 * ©2008-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.16
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
				{
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			if ( oInit.oLanguage )
			{
				_fnLanguageCompat( oInit.oLanguage );
			}
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		var defaults = DataTable.defaults.oLanguage;
		var zeroRecords = lang.sZeroRecords;
	
		/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
		 * sZeroRecords - assuming that is given.
		 */
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}
	
		/* Likewise with loading records */
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}
	
		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}
	
		var decimal = lang.sDecimal;
		if ( decimal ) {
			_addNumericSort( decimal );
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = $.isFunction( ajaxData ) ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = $.isFunction( ajaxData ) && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( $.isFunction( ajax ) )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+footerContent[i]+'</div>';
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		}
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					n.blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			a = search == 'none' ?
				displayMaster.slice() :                      // no search
				search == 'applied' ?
					displayFiltered.slice() :                // applied search
					$.map( displayMaster, function (el, i) { // removed search
						return $.inArray( el, displayFiltered ) === -1 ? el : null;
					} );
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	
	
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = settings.aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - node
			if ( sel.nodeName ) {
				if ( sel._DT_RowIndex !== undefined ) {
					return [ sel._DT_RowIndex ]; // Property added by DT for fast lookup
				}
				else if ( sel._DT_CellIndex ) {
					return [ sel._DT_CellIndex.row ];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		ctx[0].aoData[ this[0] ]._aData = data;
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				return [s];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector, opts );
		var rows = this.rows( rowSelector, opts );
		var a, i, ien, j, jen;
	
		var cells = this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.16";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "platform.details.0" },
		 *          { "data": "platform.details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.10.16/e-1.7.3/af-2.2.2/b-1.5.1/b-flash-1.5.1/b-print-1.5.1/sc-1.4.4/sl-1.2.5",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! $.isNumeric( data.substring(1) ) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			return Date.parse( d ) || -Infinity;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.7.3
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2018 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */
T499.v87="ery";T499.y0=function (){return typeof T499.m0.R==='function'?T499.m0.R.apply(T499.m0,arguments):T499.m0.R;};T499.K57="e";T499.Q57='function';T499.B87="f";T499.j0=function (){return typeof T499.m0.R==='function'?T499.m0.R.apply(T499.m0,arguments):T499.m0.R;};T499.j87="en";T499.W57="t";T499.I87="j";T499.f87="ble";T499.V57="a";T499.l57="c";T499.t57="m";T499.m0=function(I3,V){function n3(C3){var P0=2;while(P0!==15){switch(P0){case 14:P0=!L3--?13:12;break;case 5:r3=H3[V[4]];P0=4;break;case 4:P0=!L3--?3:9;break;case 19:return o3;break;case 3:M3=31;P0=9;break;case 12:P0=!L3--?11:10;break;case 20:o3=C3-S3>M3&&m3-C3>M3;P0=19;break;case 11:S3=(y3||y3===0)&&r3(y3,M3);P0=10;break;case 13:y3=V[7];P0=12;break;case 16:o3=m3-C3>M3;P0=19;break;case 1:P0=!L3--?5:4;break;case 6:m3=j3&&r3(j3,M3);P0=14;break;case 7:P0=!L3--?6:14;break;case 10:P0=S3>=0&&m3>=0?20:18;break;case 9:P0=!L3--?8:7;break;case 18:P0=S3>=0?17:16;break;case 8:j3=V[6];P0=7;break;case 2:var o3,M3,j3,m3,y3,S3,r3;P0=1;break;case 17:o3=C3-S3>M3;P0=19;break;}}}var s0=2;while(s0!==10){switch(s0){case 5:H3=V.filter.constructor(I3)();s0=4;break;case 2:var H3,e3,v3,L3;s0=1;break;case 4:s0=!L3--?3:9;break;case 9:var s3='fromCharCode',P3='RegExp';s0=8;break;case 6:s0=!L3--?14:13;break;case 3:e3=typeof I3;s0=9;break;case 14:V=V.map(function(d3){var M0=2;while(M0!==13){switch(M0){case 1:M0=!L3--?5:4;break;case 2:var f3;M0=1;break;case 3:M0=B3<d3.length?9:7;break;case 8:B3++;M0=3;break;case 9:f3+=H3[v3][s3](d3[B3]+106);M0=8;break;case 5:f3='';M0=4;break;case 14:return f3;break;case 4:var B3=0;M0=3;break;case 7:M0=!f3?6:14;break;case 6:return;break;}}});s0=13;break;case 1:s0=!L3--?5:4;break;case 8:s0=!L3--?7:6;break;case 11:return{R:function(Z3,g3){var S0=2;while(S0!==16){switch(S0){case 14:a3++;S0=3;break;case 19:(function(){var C0=2;while(C0!==76){switch(C0){case 43:i3+=h3;i3+=A3;i3+=p3;C0=40;break;case 15:var l3="_";C0=27;break;case 33:b3=7;C0=1;break;case 38:var z3=E3;z3+=h3;z3+=A3;C0=54;break;case 7:var E3="u";C0=6;break;case 6:b3=25;C0=1;break;case 35:var U3="p";var J3="a";C0=33;break;case 20:b3=12;C0=1;break;case 13:var x3="l";C0=12;break;case 25:var I0="g";C0=24;break;case 2:var b3=2;C0=1;break;case 40:b3=44;C0=1;break;case 50:var u3="f";C0=49;break;case 53:C0=b3===19?52:45;break;case 26:C0=b3===2?25:32;break;case 46:b3=26;C0=1;break;case 24:var H0="W";var Q3="r";var n0="x";var L0="t";C0=35;break;case 4:z3+=A3;var i3=E3;C0=9;break;case 44:C0=b3===30?43:39;break;case 59:C0=b3===44?58:1;break;case 8:C0=b3===26?7:14;break;case 19:C0=b3===12?18:26;break;case 39:C0=b3===25?38:53;break;case 18:var D3="V";var K3="5";var F3="S";C0=15;break;case 45:C0=b3===22?65:59;break;case 5:C0=b3===32?4:8;break;case 77:b3=40;C0=1;break;case 52:var e0=null;var G3="i";C0=50;break;case 58:i3+=u3;i3+=G3;i3+=h3;i3+=p3;C0=77;break;case 12:var t3="o";var V3="H";var W3="X";C0=20;break;case 1:C0=b3!==37?5:76;break;case 31:i3+=A3;var R3=typeof window!==i3?window:typeof global!==z3?global:e0;try{var o0=2;while(o0!==74){switch(o0){case 77:X3+=E3;X3+=W3;o0=75;break;case 38:q3=36;o0=1;break;case 1:o0=q3!==36?5:74;break;case 25:o0=q3===23?24:31;break;case 19:o0=q3===15?18:25;break;case 46:o0=q3===11?45:64;break;case 47:q3=14;o0=1;break;case 36:O3+=J3;O3+=Q3;O3+=h3;o0=52;break;case 59:o0=q3===2?58:1;break;case 65:q3=10;o0=1;break;case 3:o0=q3===31?9:13;break;case 37:o0=q3===44?36:51;break;case 45:X3+=L0;o0=65;break;case 24:Y3+=J3;Y3+=U3;Y3+=L0;var O3=p3;O3+=n0;O3+=U3;O3+=G3;o0=32;break;case 2:var q3=2;o0=1;break;case 4:q3=!R3[X3]?20:36;o0=1;break;case 41:o0=q3===38?40:37;break;case 75:q3=8;o0=1;break;case 31:o0=q3===20?30:41;break;case 42:q3=15;o0=1;break;case 63:X3+=x3;X3+=J3;X3+=U3;o0=60;break;case 9:O3+=Q3;O3+=p3;O3+=A3;O3+=H0;o0=14;break;case 52:q3=41;o0=1;break;case 60:q3=11;o0=1;break;case 18:Y3+=W3;Y3+=G3;Y3+=V3;Y3+=t3;Y3+=x3;o0=26;break;case 30:var Y3=l3;Y3+=F3;Y3+=K3;o0=44;break;case 13:o0=q3===41?12:19;break;case 50:X3+=G3;X3+=V3;X3+=t3;o0=47;break;case 44:Y3+=D3;Y3+=E3;o0=42;break;case 64:o0=q3===14?63:59;break;case 12:O3+=G3;O3+=h3;O3+=I0;o0=20;break;case 51:o0=q3===8?50:46;break;case 32:q3=31;o0=1;break;case 26:q3=23;o0=1;break;case 40:window[O3]();R3[Y3]=function(){};o0=38;break;case 58:var X3=l3;X3+=F3;X3+=K3;X3+=D3;o0=77;break;case 20:q3=38;o0=1;break;case 14:q3=44;o0=1;break;case 5:o0=q3===10?4:3;break;}}}catch(v0){}C0=28;break;case 32:C0=b3===40?31:44;break;case 14:C0=b3===7?13:19;break;case 27:b3=19;C0=1;break;case 60:b3=32;C0=1;break;case 49:var p3="e";var A3="d";var h3="n";C0=46;break;case 65:z3+=p3;z3+=u3;z3+=G3;C0=62;break;case 62:z3+=h3;z3+=p3;C0=60;break;case 9:b3=30;C0=1;break;case 54:b3=22;C0=1;break;case 28:b3=37;C0=1;break;}}}());S0=18;break;case 4:var N3=n3;S0=3;break;case 11:var w3=2;S0=10;break;case 1:g3=H3[V[4]];S0=5;break;case 12:S0=!N3?11:17;break;case 6:c3=T3;S0=14;break;case 7:S0=a3===0?6:13;break;case 9:var k3=g3(Z3[V[2]](a3),16)[V[3]](2);var T3=k3[V[2]](k3[V[5]]-1);S0=7;break;case 17:return c3?N3:!N3;break;case 3:S0=a3<Z3[V[5]]?9:12;break;case 10:S0=w3!==1?20:17;break;case 13:c3=c3^T3;S0=14;break;case 20:S0=w3===2?19:10;break;case 5:var c3,a3=0;S0=4;break;case 2:S0=!L3--?1:5;break;case 18:w3=1;S0=10;break;}}}};break;case 13:s0=!L3--?12:11;break;case 7:v3=e3.replace(new H3[P3]("^['-|]"),'S');s0=6;break;case 12:n3=n3(new H3[V[0]]()[V[1]]());s0=11;break;}}}('return this',[[-38,-9,10,-5],[-3,-5,10,-22,-1,3,-5],[-7,-2,-9,8,-41,10],[10,5,-23,10,8,-1,4,-3],[6,-9,8,9,-5,-33,4,10],[2,-5,4,-3,10,-2],[-57,5,-6,7,-56,10,-51,-6,-53],[-57,5,-57,4,8,-55,7,-9,-53]]);function T499(){}T499.N87="$";T499.x57="d";T499.L87="";T499.o87="s";T499.c87="5";T499.d87="n";T499.I3n=function(n3n){if(T499)return T499.y0(n3n);};T499.N1=function(c1){if(T499&&c1)return T499.j0(c1);};T499.E6=function(A6){if(T499&&A6)return T499.y0(A6);};T499.I6=function(n6){if(T499&&n6)return T499.j0(n6);};T499.a7=function(d7){if(T499&&d7)return T499.j0(d7);};T499.d8=function(B8){if(T499&&B8)return T499.j0(B8);};T499.h5=function(i5){if(T499&&i5)return T499.j0(i5);};T499.p2=function(h2){if(T499)return T499.j0(h2);};T499.Q0=function(u0){if(T499&&u0)return T499.j0(u0);};(function(factory){var d9V=T499;var m87="fdff";var C87="xpor";var S87="ee5f";var M87='datatables.net';var P87="3";var s87="163";var e87="qu";var n87="af7";var H87="86dd";var u57="be62";var R57="obj";var F3n=R57;F3n+=d9V.K57;F3n+=d9V.l57;F3n+=d9V.W57;var E3n=d9V.V57;E3n+=d9V.t57;E3n+=d9V.x57;d9V.Q9=function(u9){if(d9V)return d9V.j0(u9);};d9V.B9=function(f9){if(d9V&&f9)return d9V.y0(f9);};if(typeof define===(d9V.Q0(u57)?d9V.Q57:d9V.L87)&&define[d9V.p2(H87)?d9V.L87:E3n]){var D3n=n87;D3n+=d9V.x57;var J3n=d9V.I87;J3n+=e87;J3n+=d9V.v87;var U3n=s87;U3n+=P87;define([d9V.B9(U3n)?J3n:d9V.L87,d9V.Q9(D3n)?M87:d9V.L87],function($){return factory($,window,document);});}else if(typeof exports===(d9V.h5(S87)?d9V.L87:F3n)){var R3n=d9V.K57;R3n+=C87;R3n+=d9V.W57;R3n+=d9V.o87;module[d9V.d8(m87)?d9V.L87:R3n]=function(root,$){var a87="d51";var r87="dataT";var y87="docu";var V3n=y87;V3n+=d9V.t57;V3n+=d9V.j87;V3n+=d9V.W57;var W3n=r87;W3n+=d9V.V57;W3n+=d9V.f87;var l3n=d9V.B87;l3n+=d9V.d87;var K3n=a87;K3n+=d9V.c87;d9V.n4=function(H4){if(d9V)return d9V.y0(H4);};if(!root){root=window;}if(!$||!$[d9V.n4(K3n)?d9V.L87:l3n][W3n]){$=require('datatables.net')(root,$)[d9V.N87];}return factory($,root,root[V3n]);};}else{factory(jQuery,window,document);}}(function($,window,document,undefined){var a9V=T499;var S9V="version";var M9V="Editor";var P9V="CLASS";var s9V="editorFields";var S6q="DateTime";var h7q="_optionSet";var b7q="getUT";var B7q="ear";var n7q='option:selected';var H7q="fin";var Q4q='</option>';var k4q="ft";var L4q="firs";var J8q='disabled';var p8q="disa";var a8q='keydown.';var d8q="namespace";var r8q="ick";var j8q="_pad";var n8q="getUTCFullYear";var H8q="onth";var l5q="_h";var K5q='month';var R5q='year';var U5q="change";var G5q="opti";var h5q="sel";var z5q="aren";var Z5q="getUTCMonth";var T5q="setUTCMonth";var k5q='-iconLeft';var N5q="abled";var o5q="setSeconds";var M5q="setUTCMinutes";var v5q="setUTCHours";var D9q="utes";var J9q="put";var E9q="_p";var q9q="hours12";var T9q="div.";var w9q="parts";var c9q="classPrefix";var B9q="ption";var f9q="_o";var j9q="_options";var n9q="ainer";var Q2q="_setTitle";var u2q="setUTCDate";var x2q="_dateToUtc";var t2q="_writeOutput";var W2q="momentStrict";var h2q="ntai";var z2q="_s";var b2q="_setCalander";var Y2q="_optionsTitle";var Z2q="datetime";var w2q="date";var r2q='ampm';var j2q='seconds';var y2q='hours';var I2q='</button>';var K0q="format";var X0q="=";var d0q="-";var r0q="-t";var S0q="ime";var v0q="_i";var R3q="bu";var U3q="ength";var G3q='selected';var y3q="select";var o3q="tor";var P3q="18";var V1O="selected";var K1O="DTE_Bubble_Triangle";var R1O="DTE_Bubble_Liner";var F1O="DTE DTE_Bubble";var D1O="DTE_Action_Edit";var J1O="DTE_Action_Create";var U1O="multi-noEdit";var E1O="multi-restore";var A1O="multi-info";var G1O="DTE_Label_Info";var p1O="DTE_Field_Input";var h1O="DTE_Field_Name_";var i1O="DTE_Field_Type_";var z1O="btn";var b1O="DTE_Form_Buttons";var Y1O="DTE_Form_Info";var X1O="DTE_Form_Content";var S1O="labe";var e1O="ttr";var Q6O="filter";var x6O="dito";var O6O="any";var N6O="columns";var P6O="exten";var s6O="indexes";var v6O="cells";var p7O="Ty";var z7O='am';var b7O='Thu';var Y7O='Wed';var X7O='Tue';var q7O='Sun';var O7O='December';var g7O='October';var Z7O='August';var T7O='June';var k7O='April';var w7O='March';var N7O='Previous';var c7O="This input can be edited individually, but not part of a group.";var a7O="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.";var d7O="Multiple values";var B7O="Delete";var f7O="Update";var r7O="Create new entry";var j7O='DT_RowId';var C7O="subm";var u4O="_dat";var Y4O='postSubmit';var X4O="editOpts";var w4O="mit";var N4O="_submitSuccess";var c4O="ield";var d4O="oAp";var r4O="_submitTable";var S4O='submitComplete';var M4O="onComplete";var s4O='changed';var H4O="mData";var l8O="_processing";var D8O="Dat";var E8O="_eve";var o8O="_multiInfo";var M8O="tml";var P8O="splay";var L8O="options";var l5O="_legacyAjax";var R5O="cu";var Y5O="activeElement";var j5O="ete";var S5O="plete";var L5O="seIc";var Q9O="setFocus";var V9O="indexOf";var R9O="_fieldFromNode";var F9O="toLowerCase";var U9O="match";var E9O="_eventName";var i9O="triggerHandler";var X9O="rray";var Z9O="displayFields";var T9O='row';var k9O="dat";var w9O="ope";var e9O="_weakInArray";var L9O="childr";var Q2O="vent";var t2O="orm";var W2O="closeIcb";var l2O="closeCb";var R2O="clos";var D2O="ev";var J2O="mi";var U2O="ub";var E2O='submit';var h2O="_blur";var i2O="bodyContent";var g2O="pa";var Z2O="ur";var N2O="da";var d2O="plet";var f2O="exOf";var j2O="split";var m2O="dex";var o2O="ep";var C2O="ajaxUrl";var x0O="eText";var R0O="TE";var A0O="remov";var G0O="Class";var p0O="act";var Y0O="dis";var O0O="_optionsUpdate";var Z0O="tab";var T0O="editor";var w0O='processing';var c0O="edito";var f0O="TableTools";var j0O="fn";var I0O="idSrc";var n0O="defaults";var H0O="exte";var F3O="8n";var O3O="err";var m3O="sub";var S3O="il";var M3O="status";var P3O="rs";var x1X="al";var t1X="xe";var F1X="upload";var E1X="cal";var h1X="str";var X1X="upl";var T1X="aj";var c1X="ad";var S1X="<i";var M1X="oad";var s1X="safeId";var v1X="lue";var e1X="tr";var I1X='value';var V6X='file()';var F6X='cell().edit()';var D6X='remove';var U6X='rows().edit()';var E6X='edit';var A6X='row().edit()';var G6X='row.create()';var i6X="confirm";var z6X="em";var Y6X="tle";var N6X="ntent";var a6X="template";var d6X="_submit";var B6X="ngt";var f6X="processing";var C6X="_event";var e6X="lass";var I6X="ve";var n6X="mo";var t7X="ts";var V7X="editOp";var l7X='-';var K7X="join";var J7X="jo";var U7X="xt";var E7X="der";var p7X="pen";var X7X="open";var q7X="one";var g7X="am";var k7X="_even";var N7X="Array";var m7X="ion";var o7X="ctio";var S7X="message";var M7X="_focus";var v7X="addBack";var n7X="rge";var H7X="_clearDynamicInfo";var L7X='div.';var x4X="ace";var t4X='.';var V4X="find";var W4X='"/>';var R4X="attach";var G4X="rce";var z4X="div.D";var O4X="nts";var Z4X="co";var T4X="tac";var a4X="/d";var B4X="ut";var f4X="iv.";var r4X="ner";var m4X="butt";var o4X="focu";var S4X=':visible';var P4X="lengt";var s4X="inError";var I4X="ea";var n4X="isA";var H4X="files";var Q8X="_message";var x8X="for";var V8X="_dataSource";var R8X="_ass";var J8X="displayController";var U8X="map";var E8X="displayed";var A8X='open';var G8X="ispla";var p8X="disable";var h8X="unique";var Y8X="yed";var Z8X="ajax";var T8X="url";var k8X="ten";var w8X="ext";var N8X="rows";var c8X="ar";var d8X="event";var B8X="node";var y8X="eac";var v8X='change';var u5X="set";var t5X="modifier";var V5X='main';var W5X="_crudArgs";var l5X="ds";var K5X="editFields";var D5X="crea";var J5X="_actionC";var U5X="even";var G5X="create";var h5X="clear";var i5X="_fieldNames";var z5X="includeFields";var Y5X="ray";var Z5X="preventDefault";var N5X="keyCode";var a5X="attr";var B5X="button";var f5X="label";var r5X="io";var j5X="ct";var m5X="<but";var o5X="las";var P5X="ndex";var I5X="ke";var n5X="ndTo";var H5X="appe";var L5X="ons";var Q9X="utt";var u9X="8";var x9X="acti";var W9X="mp";var J9X="outerWidth";var A9X="left";var G9X="get";var z9X="engt";var X9X="len";var q9X="_postopen";var O9X="_close";var g9X="cInfo";var N9X="_closeReg";var c9X="buttons";var a9X="header";var d9X="title";var B9X="formInfo";var j9X="eq";var y9X="appendTo";var v9X='bubble';var e9X="_preopen";var I9X="_formOptions";var n9X="_edit";var H9X='individual';var L9X="_tidy";var x2X="tion";var l2X="odes";var F2X="as";var D2X="<div cl";var U2X="ass=\"";var E2X="<div c";var G2X="iv>";var p2X="=\"";var h2X="<div cla";var i2X="ter";var Y2X="div";var g2X="bub";var Z2X="cus";var w2X="bubble";var N2X="submit";var c2X="blur";var f2X="ed";var r2X="ction";var y2X="bm";var m2X="su";var o2X="_displayReorder";var C2X="splice";var S2X="inArray";var M2X="order";var v2X="fields";var e2X="multiSet";var I2X="valFromData";var H2X="elds";var L2X="classes";var W0X="lds";var K0X="ataSo";var D0X="gth";var p0X="action";var b0X="DataTable";var Y0X="table";var g0X="rm";var a0X="un";var j0X="dren";var I0X="clo";var n0X="ma";var u3X="ff";var x3X="top";var t3X="offsetHeight";var V3X="offset";var K3X="offsetWidth";var F3X="height";var E3X="no";var i3X="op";var k3X="cr";var o3X="ic";var P3X="style";var s3X="body";var H3X="ppen";var t1B="hi";var W1B="ch";var l1B="show";var R1B="lay";var F1B="isp";var D1B="mod";var b1B="div>";var X1B="dataTable";var k1B="detach";var c1B="conf";var a1B="animate";var d1B="stop";var B1B="scrollTop";var f1B="remove";var j1B="pendTo";var P1B="wra";var v1B="imate";var L1B="click";var Q6B="ra";var u6B='maxHeight';var x6B="outerHeight";var t6B='div.DTE_Footer';var V6B='div.DTE_Header';var W6B="windowPadding";var J6B="ou";var A6B="div.DTE";var p6B='body';var q6B="app";var T6B="ig";var k6B="he";var N6B="bind";var c6B="target";var a6B="ss";var d6B="Cla";var B6B="ha";var m6B="groun";var o6B="ck";var C6B="ba";var S6B="close";var M6B="_dte";var I6B="_heightCalc";var n6B='auto';var Q7B="dy";var u7B="bo";var x7B="ati";var W7B="off";var l7B="end";var F7B="ppe";var U7B="an";var G7B="lose";var i7B="clic";var z7B="nd";var b7B="bi";var q7B="rapper";var g7B="ody";var T7B="scroll";var k7B='opacity';var w7B="background";var c7B="_dom";var a7B="_ready";var d7B="nt";var B7B="conte";var f7B="_d";var j7B="wrapper";var y7B="hide";var o7B="append";var C7B="children";var S7B="content";var P7B="_init";var s7B="ightbox";var I7B="displayCo";var n7B="\">";var L7B="<";var V4B="</di";var W4B="</d";var K4B='close';var R4B="formOptions";var F4B="fieldType";var D4B="text";var J4B="pp";var U4B="unshift";var E4B="shift";var A4B="slice";var G4B="toggleClass";var z4B="inpu";var O4B="cs";var k4B="ispl";var a4B="parent";var d4B="ta";var B4B="ml";var f4B="ht";var m4B="ti";var o4B="mul";var C4B='block';var e4B="et";var n4B="oc";var H4B="bl";var L4B="slideDown";var Q8B="displa";var u8B="th";var x8B="leng";var t8B="isArray";var K8B='&';var D8B="replace";var J8B='string';var U8B="ac";var E8B="pl";var G8B="re";var i8B="pt";var X8B="opt";var q8B="_multiValueCheck";var O8B="each";var g8B="isPlainObject";var Z8B="push";var w8B="ue";var d8B="val";var B8B="isMultiValue";var f8B="ngth";var r8B="multiValues";var j8B="Ids";var y8B="sage";var o8B="html";var M8B="display";var P8B="host";var e8B="is";var H8B='focus';var L8B="focus";var Q5B="pu";var V5B="error";var W5B="asClass";var l5B="lasses";var K5B="multiIds";var R5B="alue";var D5B="ul";var J5B="_msg";var U5B="fo";var A5B="fieldError";var G5B="rr";var p5B="container";var h5B="do";var i5B="add";var z5B="rro";var b5B="ses";var q5B="ssa";var k5B="ass";var a5B='enable';var d5B="removeClass";var B5B="om";var r5B="con";var y5B="led";var m5B="ab";var S5B='none';var M5B="css";var P5B="parents";var v5B="bod";var e5B="ay";var I5B="disp";var n5B="_typeFn";var H5B="disabled";var L5B="addClass";var Q9B="iner";var u9B="cont";var x9B="sses";var t9B="cla";var V9B="isable";var W9B="isFunction";var l9B="def";var R9B="opts";var F9B="prototype";var D9B="call";var J9B="if";var A9B="ap";var G9B="on";var p9B="ncti";var h9B="fu";var z9B="mult";var b9B='click';var Y9B="multiReturn";var X9B="va";var q9B='readonly';var O9B="hasClass";var g9B="pts";var Z9B="Edit";var T9B="lti";var w9B="dom";var B9B='label';var f9B="models";var r9B="extend";var j9B='display';var m9B="pend";var o9B=null;var C9B='create';var P9B='</span>';var s9B="multiValue";var v9B="inputControl";var I9B="input";var n9B='</label>';var H9B='</div>';var L9B="labelInfo";var Q2B='">';var u2B="id";var V2B=' ';var W2B='<div class="';var l2B="_fnSetObjectDataFn";var D2B="tD";var U2B="oApi";var A2B="data";var h2B="name";var i2B="settings";var b2B="fieldTypes";var Y2B="Field";var X2B="i18n";var q2B="xte";var g2B="Fi";var T2B="ld";var k2B="fie";var N2B="valFro";var c2B="per";var a2B="wrap";var j2B="me";var P2B="-labe";var L2B="titl";var Q0B="s=\"";var W0B="multi";var K0B="error\" class=\"";var F0B="/";var A0B="age";var G0B="mess";var i0B="info";var Y0B=">";var q0B="field";var O0B="v>";var g0B="</";var Z0B="Fn";var T0B="_t";var c0B="ult";var a0B="lt";var d0B="k";var B0B="li";var f0B="ach";var r0B=true;var j0B="ec";var m0B=false;var o0B="length";var C0B='object';var P0B="gt";var s0B="sh";var v0B="u";var L0B="fi";var Q3B="es";var u3B="fil";var t3B=" ";var V3B="le";var l3B="us";var R3B="]";var F3B="\"";var U3B='Editor requires DataTables 1.10.7 or newer';var E3B='1.10.7';var A3B="versionCheck";var h3B='s';var i3B='';var a3B="ri";var j3B="ceil";var C3B="ing";var P3B="ex";var s3B="able";var v3B="ataT";var e3B="dit";var I3B="taTable";var n3B="Da";var H3B="di";var L3B="eld";var Q17="model";var u17="ayController";var x17="odels";var t17="utton";var V17="ubm";var W17="blu";var l17="los";var K17="ataTabl";var R17="otyp";var F17="lu";var D17="b";var J17="tio";var U17="bubblePosi";var E17="butto";var A17="clea";var G17="os";var p17="cl";var h17="ent";var i17="depend";var z17="de";var b17="yNo";var Y17="displ";var X17="na";var q17="rot";var O17="fiel";var g17="g";var Z17="ide";var T17="h";var k17="ne";var w17="nli";var N17="od";var c17="ie";var a17="modi";var d17="tiGet";var B17="totype";var f17="rd";var r17="ove";var j17="rem";var y17="yp";var m17="la";var o17="temp";var C17="pi";var S17="A";var M17="st";var P17="regi";var s17="r(";var v17="edit";var e17=").delete(";var I17="(";var n17="row";var H17="().delete()";var L17=")";var Q67="edit(";var u67=").";var x67="cells(";var t67="s()";var V67="file";var W67="dt";var l67="xhr.";var K67="pai";var R67="lo";var F67="up";var D67="nstruct";var J67="_co";var U67="nClas";var E67="_actio";var A67="ja";var G67="in";var p67="ssembleMa";var h67="_a";var i67="ot";var z67="ose";var b67="ototype";var Y67="Reg";var X67="_clo";var q67="gs";var O67="_crudAr";var g67="protot";var Z67="rototype";var T67="it";var k67="_e";var w67="_ev";var N67="prototyp";var c67="otot";var a67="prot";var d67="otype";var B67="ro";var f67="typ";var r67="ototyp";var j67="posto";var y67="_proce";var m67="totyp";var o67="pro";var C67="prototy";var S67="type";var M67="ror";var P67="submitEr";var s67="_";var v67="ototy";var e67="ype";var I67="oto";var n67="pr";var H67="ults";var L67="defa";var Q77="ox";var u77="lightb";var x77="w";var t77="ate";var V77="C";var W77="try";var l77="t en";var K77="Ed";var R77="te";var F77="el";var D77="Del";var J77=" delete %d rows?";var U77="Are you sure you wish to";var E77="lete 1 row?";var A77="Are you sure you wish to de";var G77="rred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>).";var p77="A system error has occu";var h77="ndo changes";var i77="U";var z77="ary";var b77="Janu";var Y77="uar";var X77="br";var q77="Fe";var O77="y";var g77="ly";var Z77="Ju";var T77="mb";var k77="Sept";var w77="ember";var N77="ov";var c77="N";var a77="M";var d77="F";var B77="S";var f77="xtend";var r77="sic";var j77="_b";var y77="ng";var m77="cha";var o77="ls";var C77="mode";var S77="ode";var M77="ns";var P77="ptio";var s77="O";var v77="form";var e77="E";var I77="T";var n77="ssing_Indicator";var H77="DTE_Proce";var L77="ssing";var Q47="proce";var u47="TE_Header";var x47="tent";var t47="Con";var V47="r_";var W47="DTE_Heade";var l47="_Content";var K47="DTE_Body";var R47="er";var F47="Foot";var D47="r_Conten";var J47="_Foote";var U47="or";var E47="r";var A47="orm_Er";var G47="DTE_F";var p47="iel";var h47="TE_F";var i47="l";var z47="be";var b47="E_La";var Y47="ol";var X47="tContr";var q47="npu";var O47="DTE_Field_I";var g47="rror";var Z47="DTE_Field_StateE";var T47="Error";var k47="d_";var w47="E_Fiel";var N47="ge";var c47="eld_Messa";var a47="_Fi";var d47="d_Info";var B47="DTE_Fiel";var f47="lti-value";var r47="mu";var j47="v";var y47="Action_Remo";var m47="Inline";var o47="TE DTE_";var C47="E_Inline_Field";var S47="DT";var M47="nline_Buttons";var P47="_I";var s47="DTE";var v47="_Table";var e47="ubble";var I47="B";var n47="DTE_";var H47="se";var L47="o";var Q87="con cl";var u87="i";var x87="bble_Background";var t87="DTE_Bu";var V87="Time";var W87="Date";var l87="tend";var K87="x";var R87="eTime";var F87="at";var D87="D";var J87="pe";var U87="ty";var E87="proto";var A87="ce";var G87="_insta";var p87="time";var h87="itor-date";var i87="-DD";var z87="YYY-MM";var b87="Y";var Y87="rFields";var X87="to";var q87="edi";var O87="rototyp";var g87="p";var Z87=".3";var T87="7";var k87=".";var w87="1";var p57=500;var h57=400;var z57=100;var b57=60;var g57=31;var w57=27;var c57=24;var d57=20;var r57=13;var j57=12;var y57=11;var m57=10;var o57=9;var C57=7;var S57=4;var M57=3;var P57=2;var s57=1;var v57=0;var e57=w87;e57+=k87;e57+=T87;e57+=Z87;var I57=g87;I57+=O87;I57+=a9V.K57;var L57=q87;L57+=X87;L57+=Y87;var u7p=a9V.K57;u7p+=a9V.d87;var x7p=b87;x7p+=z87;x7p+=i87;var t7p=a9V.K57;t7p+=a9V.x57;t7p+=h87;t7p+=p87;var V7p=G87;V7p+=a9V.d87;V7p+=A87;var Y2p=E87;Y2p+=U87;Y2p+=J87;var X2p=D87;X2p+=F87;X2p+=R87;var q2p=a9V.K57;q2p+=K87;q2p+=l87;var w0p=W87;w0p+=V87;var l1J=t87;l1J+=x87;var K1J=u87;K1J+=Q87;K1J+=L47;K1J+=H47;var R1J=n47;R1J+=I47;R1J+=e47;R1J+=v47;var F1J=s47;F1J+=P47;F1J+=M47;var D1J=S47;D1J+=C47;var J1J=D87;J1J+=o47;J1J+=m47;var U1J=n47;U1J+=y47;U1J+=j47;U1J+=a9V.K57;var E1J=r47;E1J+=f47;var A1J=B47;A1J+=d47;var G1J=s47;G1J+=a47;G1J+=c47;G1J+=N47;var p1J=S47;p1J+=w47;p1J+=k47;p1J+=T47;var h1J=Z47;h1J+=g47;var i1J=O47;i1J+=q47;i1J+=X47;i1J+=Y47;var z1J=S47;z1J+=b47;z1J+=z47;z1J+=i47;var b1J=D87;b1J+=h47;b1J+=p47;b1J+=a9V.x57;var Y1J=G47;Y1J+=A47;Y1J+=E47;Y1J+=U47;var X1J=D87;X1J+=h47;X1J+=U47;X1J+=a9V.t57;var q1J=s47;q1J+=J47;q1J+=D47;q1J+=a9V.W57;var O1J=n47;O1J+=F47;O1J+=R47;var g1J=K47;g1J+=l47;var Z1J=W47;Z1J+=V47;Z1J+=t47;Z1J+=x47;var T1J=D87;T1J+=u47;var k1J=Q47;k1J+=L77;var w1J=H77;w1J+=n77;var N1J=D87;N1J+=I77;N1J+=e77;var K4J=v77;K4J+=s77;K4J+=P77;K4J+=M77;var R4J=a9V.t57;R4J+=S77;R4J+=i47;R4J+=a9V.o87;var F4J=C77;F4J+=o77;var D4J=m77;D4J+=y77;D4J+=a9V.K57;D4J+=a9V.x57;var J4J=j77;J4J+=a9V.V57;J4J+=r77;var U4J=a9V.K57;U4J+=f77;var E4J=g87;E4J+=a9V.t57;var A4J=B77;A4J+=a9V.V57;A4J+=a9V.W57;var G4J=d77;G4J+=E47;G4J+=u87;var p4J=a77;p4J+=L47;p4J+=a9V.d87;var h4J=c77;h4J+=N77;h4J+=w77;var i4J=k77;i4J+=a9V.K57;i4J+=T77;i4J+=R47;var z4J=Z77;z4J+=g77;var b4J=a77;b4J+=a9V.V57;b4J+=O77;var Y4J=q77;Y4J+=X77;Y4J+=Y77;Y4J+=O77;var X4J=b77;X4J+=z77;var q4J=c77;q4J+=a9V.K57;q4J+=K87;q4J+=a9V.W57;var O4J=i77;O4J+=h77;var g4J=p77;g4J+=G77;var Z4J=A77;Z4J+=E77;var T4J=U77;T4J+=J77;var k4J=D77;k4J+=a9V.K57;k4J+=a9V.W57;k4J+=a9V.K57;var w4J=D87;w4J+=F77;w4J+=a9V.K57;w4J+=R77;var N4J=K77;N4J+=u87;N4J+=l77;N4J+=W77;var c4J=V77;c4J+=E47;c4J+=a9V.K57;c4J+=t77;var a4J=c77;a4J+=a9V.K57;a4J+=x77;var d4J=u77;d4J+=Q77;var B4J=L67;B4J+=H67;var r4J=n67;r4J+=I67;r4J+=a9V.W57;r4J+=e67;var Q8J=g87;Q8J+=E47;Q8J+=v67;Q8J+=J87;var R8J=s67;R8J+=P67;R8J+=M67;var u5J=E87;u5J+=S67;var G5J=C67;G5J+=J87;var Q9J=o67;Q9J+=m67;Q9J+=a9V.K57;var V9J=y67;V9J+=L77;var a9J=s67;a9J+=j67;a9J+=g87;a9J+=a9V.j87;var r9J=C67;r9J+=J87;var L9J=g87;L9J+=E47;L9J+=r67;L9J+=a9V.K57;var t2J=o67;t2J+=X87;t2J+=f67;t2J+=a9V.K57;var J2J=g87;J2J+=B67;J2J+=a9V.W57;J2J+=d67;var x0J=a67;x0J+=d67;var K0J=n67;K0J+=c67;K0J+=e67;var D0J=E87;D0J+=S67;var E0J=N67;E0J+=a9V.K57;var i0J=w67;i0J+=a9V.K57;i0J+=a9V.d87;i0J+=a9V.W57;var z0J=N67;z0J+=a9V.K57;var o0J=k67;o0J+=a9V.x57;o0J+=T67;var V3J=g87;V3J+=Z67;var F3J=g67;F3J+=e67;var G3J=O67;G3J+=q67;var p3J=E87;p3J+=f67;p3J+=a9V.K57;var h3J=X67;h3J+=H47;h3J+=Y67;var i3J=g87;i3J+=E47;i3J+=b67;var T3J=s67;T3J+=a9V.l57;T3J+=i47;T3J+=z67;var k3J=a67;k3J+=i67;k3J+=e67;var P3J=h67;P3J+=p67;P3J+=G67;var s3J=o67;s3J+=X87;s3J+=U87;s3J+=J87;var B1z=h67;B1z+=A67;B1z+=K87;var P1z=E67;P1z+=U67;P1z+=a9V.o87;var s1z=g67;s1z+=e67;var h7z=J67;h7z+=D67;h7z+=U47;var T4z=F67;T4z+=R67;T4z+=a9V.V57;T4z+=a9V.x57;var B4z=K67;B4z+=E47;B4z+=a9V.o87;var m4z=l67;m4z+=W67;var o4z=V67;o4z+=t67;var S4z=x67;S4z+=u67;S4z+=Q67;S4z+=L17;var e4z=B67;e4z+=x77;e4z+=a9V.o87;e4z+=H17;var H4z=n17;H4z+=I17;H4z+=e17;H4z+=L17;var L4z=v17;L4z+=L47;L4z+=s17;L4z+=L17;var D8z=P17;D8z+=M17;D8z+=R47;var J8z=S17;J8z+=C17;var i8z=a67;i8z+=L47;i8z+=U87;i8z+=J87;var z8z=o17;z8z+=m17;z8z+=a9V.W57;z8z+=a9V.K57;var O8z=g67;O8z+=e67;var T8z=n67;T8z+=L47;T8z+=a9V.W57;T8z+=d67;var w8z=n67;w8z+=c67;w8z+=y17;w8z+=a9V.K57;var n8z=j17;n8z+=r17;var l5z=L47;l5z+=f17;l5z+=a9V.K57;l5z+=E47;var K5z=a67;K5z+=d67;var h5z=L47;h5z+=a9V.d87;h5z+=a9V.K57;var b5z=L47;b5z+=a9V.B87;b5z+=a9V.B87;var Y5z=g87;Y5z+=B67;Y5z+=B17;var Z5z=a9V.d87;Z5z+=L47;Z5z+=a9V.x57;Z5z+=a9V.K57;var f5z=r47;f5z+=i47;f5z+=d17;var j5z=a17;j5z+=a9V.B87;j5z+=c17;j5z+=E47;var y5z=E87;y5z+=a9V.W57;y5z+=e67;var S5z=a9V.t57;S5z+=N17;S5z+=a9V.K57;var P5z=g87;P5z+=E47;P5z+=b67;var B9z=u87;B9z+=w17;B9z+=k17;var f9z=E87;f9z+=S67;var C9z=T17;C9z+=Z17;var S9z=a67;S9z+=d67;var v9z=g17;v9z+=a9V.K57;v9z+=a9V.W57;var e9z=n67;e9z+=b67;var I9z=a9V.B87;I9z+=u87;I9z+=i47;I9z+=a9V.K57;var H9z=O17;H9z+=a9V.x57;var L9z=g87;L9z+=q17;L9z+=d67;var x2z=R47;x2z+=B67;x2z+=E47;var t2z=a9V.K57;t2z+=X17;t2z+=a9V.f87;var D2z=n67;D2z+=r67;D2z+=a9V.K57;var J2z=Y17;J2z+=a9V.V57;J2z+=b17;J2z+=z17;var h2z=N67;h2z+=a9V.K57;var X2z=z17;X2z+=M17;X2z+=B67;X2z+=O77;var e2z=i17;e2z+=h17;var J0z=p17;J0z+=G17;J0z+=a9V.K57;var U0z=E87;U0z+=S67;var h0z=A17;h0z+=E47;var P0z=E17;P0z+=M77;var s0z=E87;s0z+=S67;var A3z=U17;A3z+=J17;A3z+=a9V.d87;var R1n=D17;R1n+=F17;R1n+=E47;var F1n=E87;F1n+=S67;var A1n=n67;A1n+=i67;A1n+=L47;A1n+=S67;var w1n=a9V.V57;w1n+=a9V.x57;w1n+=a9V.x57;var N1n=g87;N1n+=q17;N1n+=R17;N1n+=a9V.K57;var c1n=a9V.x57;c1n+=K17;c1n+=a9V.K57;var a1n=a9V.B87;a1n+=a9V.d87;var l4n=a9V.B87;l4n+=a9V.d87;var B8n=E47;B8n+=L47;B8n+=x77;var f8n=a9V.V57;f8n+=i47;f8n+=i47;var r8n=a9V.l57;r8n+=l17;r8n+=a9V.K57;var j8n=W17;j8n+=E47;var y8n=a9V.l57;y8n+=l17;y8n+=a9V.K57;var m8n=a9V.o87;m8n+=V17;m8n+=T67;var o8n=D17;o8n+=t17;var C8n=a9V.t57;C8n+=x17;var S8n=Y17;S8n+=u17;var M8n=Q17;M8n+=a9V.o87;var P8n=a9V.t57;P8n+=N17;P8n+=a9V.K57;P8n+=o77;var s8n=d77;s8n+=u87;s8n+=L3B;var v8n=a9V.t57;v8n+=S77;v8n+=i47;v8n+=a9V.o87;var e8n=L67;e8n+=H67;var T0n=d77;T0n+=u87;T0n+=L3B;var C0n=e77;C0n+=H3B;C0n+=a9V.W57;C0n+=U47;var S0n=n3B;S0n+=I3B;var M0n=a9V.B87;M0n+=a9V.d87;var P0n=e77;P0n+=e3B;P0n+=L47;P0n+=E47;var s0n=a9V.x57;s0n+=v3B;s0n+=s3B;var v0n=a9V.B87;v0n+=a9V.d87;'use strict';a9V.G4=function(p4){if(a9V&&p4)return a9V.j0(p4);};(function(){var p3B=' remaining';var z3B=' day';var b3B="og";var Y3B="- ";var X3B="trial info ";var q3B="DataTables Editor ";var O3B="6acb";var g3B='for Editor, please see https://editor.datatables.net/purchase';var Z3B='Thank you for trying DataTables Editor\n\n';var T3B="94";var k3B="ase a license ";var w3B=" expired. To purch";var N3B="Your trial has now";var c3B="al expired";var d3B="ditor - T";var B3B="f718";var f3B="getTime";var r3B="1ea1";var y3B="9a3";var m3B="673";var o3B="6";var S3B="edWarn";var M3B="pir";var F57=1525478400;var J57=9515;var U57=5365;var E57=1000;var e0n=P3B;e0n+=M3B;e0n+=S3B;e0n+=C3B;var u3n=o3B;u3n+=D17;u3n+=a9V.c87;u3n+=o3B;var x3n=m3B;x3n+=T87;var t3n=a9V.K57;t3n+=y3B;a9V.A3n=function(G3n){if(a9V)return a9V.j0(G3n);};var remaining=Math[a9V.G4(t3n)?a9V.L87:j3B]((new Date(F57*(a9V.a7(r3B)?J57:E57))[f3B]()-new Date()[f3B]())/((a9V.I6(x3n)?E57:U57)*(a9V.E6(u3n)?g57:b57)*b57*c57));if(remaining<=(a9V.N1(B3B)?v57:o57)){var H0n=e77;H0n+=d3B;H0n+=a3B;H0n+=c3B;var L0n=N3B;L0n+=w3B;L0n+=k3B;var Q3n=a9V.l57;Q3n+=a9V.V57;Q3n+=T3B;alert(Z3B+(a9V.I3n(Q3n)?L0n:a9V.L87)+g3B);throw a9V.A3n(O3B)?H0n:a9V.L87;}else if(remaining<=C57){var I0n=q3B;I0n+=X3B;I0n+=Y3B;var n0n=i47;n0n+=b3B;console[n0n](I0n+remaining+z3B+(remaining===s57?i3B:h3B)+p3B);}window[e0n]=function(){var G3B='Your trial has now expired. To purchase a license ';alert(Z3B+G3B+g3B);};}());var DataTable=$[v0n][s0n];if(!DataTable||!DataTable[A3B]||!DataTable[A3B](E3B)){throw U3B;}var Editor=function(opts){var D3B="_constructor";var J3B="DataTables Editor must be initialised as a 'new' instance'";if(!(this instanceof Editor)){alert(J3B);}this[D3B](opts);};DataTable[P0n]=Editor;$[M0n][S0n][C0n]=Editor;var _editor_el=function(dis,ctx){var K3B='*[data-dte-e="';var o0n=F3B;o0n+=R3B;if(ctx===undefined){ctx=document;}return $(K3B+dis+o0n,ctx);};var __inlineCounter=v57;var _pluck=function(a,prop){var m0n=a9V.K57;m0n+=a9V.V57;m0n+=a9V.l57;m0n+=T17;var out=[];$[m0n](a,function(idx,el){var y0n=g87;y0n+=l3B;y0n+=T17;out[y0n](el[prop]);});return out;};var _api_file=function(name,id){var x3B='Unknown file id ';var W3B=" in ta";var j0n=V67;j0n+=a9V.o87;var table=this[j0n](name);var file=table[id];if(!file){var r0n=W3B;r0n+=D17;r0n+=V3B;r0n+=t3B;throw x3B+id+r0n+name;}return table[id];};var _api_files=function(name){var n0B="known file table name: ";var H0B="Un";var B0n=u3B;B0n+=Q3B;if(!name){var f0n=L0B;f0n+=V3B;f0n+=a9V.o87;return Editor[f0n];}var table=Editor[B0n][name];if(!table){var d0n=H0B;d0n+=n0B;throw d0n+name;}return table;};var _objectKeys=function(o){var e0B="operty";var I0B="hasOwnPr";var out=[];for(var key in o){var a0n=I0B;a0n+=e0B;if(o[a0n](key)){var c0n=g87;c0n+=v0B;c0n+=s0B;out[c0n](key);}}return out;};var _deepCompare=function(o1,o2){var y0B="bj";var S0B="je";var M0B="ob";var w0n=i47;w0n+=a9V.j87;w0n+=P0B;w0n+=T17;var N0n=M0B;N0n+=S0B;N0n+=a9V.l57;N0n+=a9V.W57;if(typeof o1!==N0n||typeof o2!==C0B){return o1==o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[o0B]!==o2Props[w0n]){return m0B;}for(var i=v57,ien=o1Props[o0B];i<ien;i++){var k0n=L47;k0n+=y0B;k0n+=j0B;k0n+=a9V.W57;var propName=o1Props[i];if(typeof o1[propName]===k0n){if(!_deepCompare(o1[propName],o2[propName])){return m0B;}}else if(o1[propName]!=o2[propName]){return m0B;}}return r0B;};Editor[T0n]=function(opts,classes,host){var N9B='msg-multi';var c9B='multi-value';var a9B='msg-message';var d9B='msg-label';var y9B='input-control';var S9B="multiRestore";var M9B='<div data-dte-e="msg-multi" class="';var e9B='<div data-dte-e="input-control" class="';var x2B='" for="';var t2B='<label data-dte-e="label" class="';var K2B="valToData";var E2B="Prop";var G2B="dataProp";var p2B="_Field_";var z2B="Error adding field - unknown field type ";var O2B="fa";var Z2B="Type";var w2B="Data";var d2B="Prefix";var B2B="ix";var f2B="namePref";var r2B="nam";var y2B="assNa";var m2B="eId";var o2B="saf";var C2B="abe";var S2B="abel\" class=\"";var M2B="-dte-e=\"msg-l";var s2B="lass=";var v2B="\"input\" c";var e2B="<div data-dte-e=";var I2B="\" class=\"";var n2B="e=\"multi-value";var H2B="<div data-dte-";var u0B="info\" clas";var x0B="an data-dte-e=\"multi-";var t0B="<sp";var V0B="Info";var l0B="ore";var R0B="<div data-dte-e=\"msg-";var D0B="\"><";var J0B="-dte-e=\"msg-message\" class=\"";var U0B="<div data";var E0B="-message";var p0B="a-dte-e=\"msg-info\" class=\"";var h0B="<div dat";var z0B="g-";var b0B="ms";var X0B="Inf";var k0B="g-info";var w0B="msg-e";var N0B="i-info";var J2n=a9V.W57;J2n+=O77;J2n+=g87;J2n+=a9V.K57;var U2n=a9V.K57;U2n+=f0B;var A2n=L47;A2n+=a9V.d87;var z2n=a9V.l57;z2n+=B0B;z2n+=a9V.l57;z2n+=d0B;var b2n=L47;b2n+=a9V.d87;var Y2n=a9V.t57;Y2n+=v0B;Y2n+=a0B;Y2n+=u87;var X2n=a9V.t57;X2n+=c0B;X2n+=N0B;var q2n=w0B;q2n+=E47;q2n+=E47;q2n+=U47;var O2n=a9V.t57;O2n+=a9V.o87;O2n+=k0B;var g2n=a9V.x57;g2n+=L47;g2n+=a9V.t57;var Z2n=a9V.x57;Z2n+=L47;Z2n+=a9V.t57;var N2n=T0B;N2n+=e67;N2n+=Z0B;var c2n=g0B;c2n+=H3B;c2n+=O0B;var a2n=q0B;a2n+=X0B;a2n+=L47;var d2n=F3B;d2n+=Y0B;var B2n=b0B;B2n+=z0B;B2n+=i0B;var f2n=h0B;f2n+=p0B;var r2n=G0B;r2n+=A0B;var j2n=a9V.t57;j2n+=a9V.o87;j2n+=g17;j2n+=E0B;var y2n=U0B;y2n+=J0B;var m2n=D0B;m2n+=F0B;m2n+=H3B;m2n+=O0B;var o2n=w0B;o2n+=E47;o2n+=M67;var C2n=R0B;C2n+=K0B;var S2n=E47;S2n+=Q3B;S2n+=a9V.W57;S2n+=l0B;var M2n=u87;M2n+=a9V.d87;M2n+=a9V.B87;M2n+=L47;var P2n=W0B;P2n+=V0B;var s2n=t0B;s2n+=x0B;s2n+=u0B;s2n+=Q0B;var v2n=L2B;v2n+=a9V.K57;var e2n=F3B;e2n+=Y0B;var I2n=H2B;I2n+=n2B;I2n+=I2B;var n2n=F3B;n2n+=F0B;n2n+=Y0B;var H2n=F3B;H2n+=Y0B;var L2n=e2B;L2n+=v2B;L2n+=s2B;L2n+=F3B;var Q0n=F3B;Q0n+=Y0B;var u0n=b0B;u0n+=g17;u0n+=P2B;u0n+=i47;var x0n=U0B;x0n+=M2B;x0n+=S2B;var t0n=i47;t0n+=C2B;t0n+=i47;var V0n=o2B;V0n+=m2B;var W0n=m17;W0n+=D17;W0n+=F77;var l0n=F3B;l0n+=Y0B;var K0n=p17;K0n+=y2B;K0n+=j2B;var R0n=r2B;R0n+=a9V.K57;var F0n=f2B;F0n+=B2B;var D0n=a9V.W57;D0n+=O77;D0n+=g87;D0n+=a9V.K57;var J0n=S67;J0n+=d2B;var U0n=a2B;U0n+=c2B;var E0n=a9V.x57;E0n+=a9V.V57;E0n+=a9V.W57;E0n+=a9V.V57;var G0n=N2B;G0n+=a9V.t57;G0n+=w2B;var p0n=a9V.K57;p0n+=K87;p0n+=a9V.W57;var b0n=u87;b0n+=a9V.x57;var Y0n=k2B;Y0n+=T2B;Y0n+=Z2B;Y0n+=a9V.o87;var X0n=g2B;X0n+=a9V.K57;X0n+=T2B;var q0n=P3B;q0n+=R77;q0n+=a9V.d87;q0n+=a9V.x57;var O0n=a9V.x57;O0n+=a9V.K57;O0n+=O2B;O0n+=H67;var g0n=a9V.K57;g0n+=q2B;g0n+=a9V.d87;g0n+=a9V.x57;var Z0n=r47;Z0n+=a0B;Z0n+=u87;var that=this;var multiI18n=host[X2B][Z0n];opts=$[g0n](r0B,{},Editor[Y2B][O0n],opts);if(!Editor[b2B][opts[S67]]){throw z2B+opts[S67];}this[a9V.o87]=$[q0n]({},Editor[X0n][i2B],{type:Editor[Y0n][opts[S67]],name:opts[h2B],classes:classes,host:host,opts:opts,multiValue:m0B});if(!opts[b0n]){var i0n=S47;i0n+=e77;i0n+=p2B;var z0n=u87;z0n+=a9V.x57;opts[z0n]=i0n+opts[h2B];}if(opts[G2B]){var h0n=A2B;h0n+=E2B;opts[A2B]=opts[h0n];}if(opts[A2B]===i3B){opts[A2B]=opts[h2B];}var dtPrivateApi=DataTable[p0n][U2B];this[G0n]=function(d){var R2B='editor';var F2B="ataFn";var J2B="_fnGetObjec";var A0n=J2B;A0n+=D2B;A0n+=F2B;return dtPrivateApi[A0n](opts[A2B])(d,R2B);};this[K2B]=dtPrivateApi[l2B](opts[E0n]);var template=$(W2B+classes[U0n]+V2B+classes[J0n]+opts[D0n]+V2B+classes[F0n]+opts[R0n]+V2B+opts[K0n]+l0n+t2B+classes[W0n]+x2B+Editor[V0n](opts[u2B])+Q2B+opts[t0n]+x0n+classes[u0n]+Q0n+opts[L9B]+H9B+n9B+L2n+classes[I9B]+H2n+e9B+classes[v9B]+n2n+I2n+classes[s9B]+e2n+multiI18n[v2n]+s2n+classes[P2n]+Q2B+multiI18n[M2n]+P9B+H9B+M9B+classes[S9B]+Q2B+multiI18n[S2n]+H9B+C2n+classes[o2n]+m2n+y2n+classes[j2n]+Q2B+opts[r2n]+H9B+f2n+classes[B2n]+d2n+opts[a2n]+H9B+c2n+H9B);var input=this[N2n](C9B,opts);if(input!==o9B){var w2n=n67;w2n+=a9V.K57;w2n+=m9B;_editor_el(y9B,template)[w2n](input);}else{var T2n=a9V.d87;T2n+=L47;T2n+=a9V.d87;T2n+=a9V.K57;var k2n=a9V.l57;k2n+=a9V.o87;k2n+=a9V.o87;template[k2n](j9B,T2n);}this[Z2n]=$[r9B](r0B,{},Editor[Y2B][f9B][g2n],{container:template,inputControl:_editor_el(y9B,template),label:_editor_el(B9B,template),fieldInfo:_editor_el(O2n,template),labelInfo:_editor_el(d9B,template),fieldError:_editor_el(q2n,template),fieldMessage:_editor_el(a9B,template),multi:_editor_el(c9B,template),multiReturn:_editor_el(N9B,template),multiInfo:_editor_el(X2n,template)});this[w9B][Y2n][b2n](z2n,function(){var k9B="sable";var p2n=H3B;p2n+=k9B;p2n+=a9V.x57;var h2n=r47;h2n+=T9B;h2n+=Z9B;h2n+=s3B;var i2n=L47;i2n+=g9B;if(that[a9V.o87][i2n][h2n]&&!template[O9B](classes[p2n])&&opts[S67]!==q9B){var G2n=X9B;G2n+=i47;that[G2n](i3B);}});this[w9B][Y9B][A2n](b9B,function(){var i9B="iResto";var E2n=z9B;E2n+=i9B;E2n+=E47;E2n+=a9V.K57;that[E2n]();});$[U2n](this[a9V.o87][J2n],function(name,fn){var D2n=h9B;D2n+=p9B;D2n+=G9B;if(typeof fn===D2n&&that[name]===undefined){that[name]=function(){var U9B="unsh";var E9B="ypeFn";var W2n=A9B;W2n+=g87;W2n+=g77;var l2n=T0B;l2n+=E9B;var K2n=U9B;K2n+=J9B;K2n+=a9V.W57;var R2n=a9V.o87;R2n+=i47;R2n+=u87;R2n+=A87;var F2n=n67;F2n+=v67;F2n+=g87;F2n+=a9V.K57;var args=Array[F2n][R2n][D9B](arguments);args[K2n](name);var ret=that[l2n][W2n](that,args);return ret===undefined?that:ret;};}});};Editor[Y2B][F9B]={def:function(set){var K9B='default';var V2n=a9V.x57;V2n+=a9V.K57;V2n+=a9V.B87;var opts=this[a9V.o87][R9B];if(set===undefined){var def=opts[K9B]!==undefined?opts[K9B]:opts[l9B];return $[W9B](def)?def():def;}opts[V2n]=set;return this;},disable:function(){var Q2n=a9V.x57;Q2n+=V9B;var u2n=t9B;u2n+=x9B;var x2n=u9B;x2n+=a9V.V57;x2n+=Q9B;var t2n=a9V.x57;t2n+=L47;t2n+=a9V.t57;this[t2n][x2n][L5B](this[a9V.o87][u2n][H5B]);this[n5B](Q2n);return this;},displayed:function(){var s5B="containe";var n9n=I5B;n9n+=i47;n9n+=e5B;var H9n=v5B;H9n+=O77;var L9n=s5B;L9n+=E47;var container=this[w9B][L9n];return container[P5B](H9n)[o0B]&&container[M5B](n9n)!=S5B?r0B:m0B;},enable:function(){var f5B="aine";var j5B="asses";var o5B="eFn";var C5B="_typ";var P9n=C5B;P9n+=o5B;var s9n=H3B;s9n+=a9V.o87;s9n+=m5B;s9n+=y5B;var v9n=p17;v9n+=j5B;var e9n=r5B;e9n+=a9V.W57;e9n+=f5B;e9n+=E47;var I9n=a9V.x57;I9n+=B5B;this[I9n][e9n][d5B](this[a9V.o87][v9n][s9n]);this[P9n](a5B);return this;},enabled:function(){var T5B="onta";var w5B="hasCl";var N5B="class";var c5B="isabled";var m9n=a9V.x57;m9n+=c5B;var o9n=N5B;o9n+=Q3B;var C9n=w5B;C9n+=k5B;var S9n=a9V.l57;S9n+=T5B;S9n+=Q9B;var M9n=a9V.x57;M9n+=L47;M9n+=a9V.t57;return this[M9n][S9n][C9n](this[a9V.o87][o9n][m9n])===m0B;},error:function(msg,fn){var Y5B="eF";var X5B="_ty";var O5B="rMe";var g5B="erro";var Z5B="_ms";var N9n=a9V.x57;N9n+=L47;N9n+=a9V.t57;var c9n=Z5B;c9n+=g17;var a9n=g5B;a9n+=O5B;a9n+=q5B;a9n+=N47;var d9n=X5B;d9n+=g87;d9n+=Y5B;d9n+=a9V.d87;var y9n=t9B;y9n+=a9V.o87;y9n+=b5B;var classes=this[a9V.o87][y9n];if(msg){var f9n=a9V.K57;f9n+=z5B;f9n+=E47;var r9n=i5B;r9n+=V77;r9n+=i47;r9n+=k5B;var j9n=h5B;j9n+=a9V.t57;this[j9n][p5B][r9n](classes[f9n]);}else{var B9n=a9V.K57;B9n+=G5B;B9n+=U47;this[w9B][p5B][d5B](classes[B9n]);}this[d9n](a9n,msg);return this[c9n](this[N9n][A5B],msg,fn);},fieldInfo:function(msg){var E5B="ieldIn";var w9n=a9V.B87;w9n+=E5B;w9n+=U5B;return this[J5B](this[w9B][w9n],msg);},isMultiValue:function(){var F5B="tiV";var k9n=a9V.t57;k9n+=D5B;k9n+=F5B;k9n+=R5B;return this[a9V.o87][k9n]&&this[a9V.o87][K5B][o0B]!==s57;},inError:function(){var Z9n=a9V.l57;Z9n+=l5B;var T9n=T17;T9n+=W5B;return this[w9B][p5B][T9n](this[a9V.o87][Z9n][V5B]);},input:function(){var u5B="extarea";var x5B="lect, t";var t5B="input, se";var q9n=t5B;q9n+=x5B;q9n+=u5B;var O9n=u87;O9n+=a9V.d87;O9n+=Q5B;O9n+=a9V.W57;var g9n=G67;g9n+=Q5B;g9n+=a9V.W57;return this[a9V.o87][S67][g9n]?this[n5B](O9n):$(q9n,this[w9B][p5B]);},focus:function(){var n8B='input, select, textarea';if(this[a9V.o87][S67][L8B]){this[n5B](H8B);}else{var X9n=a9V.x57;X9n+=B5B;$(n8B,this[X9n][p5B])[L8B]();}return this;},get:function(){var s8B="iValue";var v8B="Mult";var I8B="typeF";var z9n=g17;z9n+=a9V.K57;z9n+=a9V.W57;var b9n=s67;b9n+=I8B;b9n+=a9V.d87;var Y9n=e8B;Y9n+=v8B;Y9n+=s8B;if(this[Y9n]()){return undefined;}var val=this[b9n](z9n);return val!==undefined?val:this[l9B]();},hide:function(animate){var S8B="slideUp";var el=this[w9B][p5B];if(animate===undefined){animate=r0B;}if(this[a9V.o87][P8B][M8B]()&&animate){el[S8B]();}else{var h9n=a9V.d87;h9n+=L47;h9n+=a9V.d87;h9n+=a9V.K57;var i9n=a9V.l57;i9n+=a9V.o87;i9n+=a9V.o87;el[i9n](j9B,h9n);}return this;},label:function(str){var C8B="tach";var E9n=A9B;E9n+=m9B;var A9n=z17;A9n+=C8B;var G9n=a9V.x57;G9n+=L47;G9n+=a9V.t57;var p9n=i47;p9n+=a9V.V57;p9n+=D17;p9n+=F77;var label=this[w9B][p9n];var labelInfo=this[G9n][L9B][A9n]();if(str===undefined){return label[o8B]();}label[o8B](str);label[E9n](labelInfo);return this;},labelInfo:function(msg){var U9n=a9V.x57;U9n+=L47;U9n+=a9V.t57;return this[J5B](this[U9n][L9B],msg);},message:function(msg,fn){var m8B="ieldMe";var D9n=a9V.B87;D9n+=m8B;D9n+=a9V.o87;D9n+=y8B;var J9n=a9V.x57;J9n+=L47;J9n+=a9V.t57;return this[J5B](this[J9n][D9n],msg,fn);},multiGet:function(id){var F9n=z9B;F9n+=u87;F9n+=j8B;var value;var multiValues=this[a9V.o87][r8B];var multiIds=this[a9V.o87][F9n];if(id===undefined){var R9n=V3B;R9n+=f8B;value={};for(var i=v57;i<multiIds[R9n];i++){var K9n=X9B;K9n+=i47;value[multiIds[i]]=this[B8B]()?multiValues[multiIds[i]]:this[K9n]();}}else if(this[B8B]()){value=multiValues[id];}else{value=this[d8B]();}return value;},multiRestore:function(){var c8B="heck";var a8B="_multiValue";var l9n=a8B;l9n+=V77;l9n+=c8B;this[a9V.o87][s9B]=r0B;this[l9n]();},multiSet:function(id,val){var k8B="iIds";var N8B="ltiVal";var t9n=r47;t9n+=N8B;t9n+=w8B;var W9n=r47;W9n+=i47;W9n+=a9V.W57;W9n+=k8B;var multiValues=this[a9V.o87][r8B];var multiIds=this[a9V.o87][W9n];if(val===undefined){val=id;id=undefined;}var set=function(idSrc,val){var T8B="Arra";var V9n=G67;V9n+=T8B;V9n+=O77;if($[V9n](multiIds)===-s57){multiIds[Z8B](idSrc);}multiValues[idSrc]=val;};if($[g8B](val)&&id===undefined){$[O8B](val,function(idSrc,innerVal){set(idSrc,innerVal);});}else if(id===undefined){$[O8B](multiIds,function(i,idSrc){set(idSrc,val);});}else{set(id,val);}this[a9V.o87][t9n]=r0B;this[q8B]();return this;},name:function(){var u9n=X17;u9n+=j2B;var x9n=X8B;x9n+=a9V.o87;return this[a9V.o87][x9n][u9n];},node:function(){var Y8B="conta";var Q9n=Y8B;Q9n+=Q9B;return this[w9B][Q9n][v57];},set:function(val,multiCheck){var p8B="alu";var h8B="iV";var z8B="tyDecode";var b8B="enti";var P5n=a9V.o87;P5n+=a9V.K57;P5n+=a9V.W57;var v5n=b8B;v5n+=z8B;var e5n=L47;e5n+=i8B;e5n+=a9V.o87;var I5n=z9B;I5n+=h8B;I5n+=p8B;I5n+=a9V.K57;var decodeFn=function(d){var V8B='\n';var W8B='\'';var l8B='"';var R8B='<';var F8B='>';var A8B="pla";var n5n=G8B;n5n+=A8B;n5n+=a9V.l57;n5n+=a9V.K57;var H5n=G8B;H5n+=g87;H5n+=m17;H5n+=A87;var L5n=G8B;L5n+=E8B;L5n+=U8B;L5n+=a9V.K57;return typeof d!==J8B?d:d[D8B](/&gt;/g,F8B)[L5n](/&lt;/g,R8B)[H5n](/&amp;/g,K8B)[n5n](/&quot;/g,l8B)[D8B](/&#39;/g,W8B)[D8B](/&#10;/g,V8B);};this[a9V.o87][I5n]=m0B;var decode=this[a9V.o87][e5n][v5n];if(decode===undefined||decode===r0B){if($[t8B](val)){var s5n=x8B;s5n+=u8B;for(var i=v57,ien=val[s5n];i<ien;i++){val[i]=decodeFn(val[i]);}}else{val=decodeFn(val);}}this[n5B](P5n,val);if(multiCheck===undefined||multiCheck===r0B){this[q8B]();}return this;},show:function(animate){var I4B="isplay";var S5n=Q8B;S5n+=O77;var M5n=T17;M5n+=L47;M5n+=a9V.o87;M5n+=a9V.W57;var el=this[w9B][p5B];if(animate===undefined){animate=r0B;}if(this[a9V.o87][M5n][S5n]()&&animate){el[L4B]();}else{var o5n=H4B;o5n+=n4B;o5n+=d0B;var C5n=a9V.x57;C5n+=I4B;el[M5B](C5n,o5n);}return this;},val:function(val){var y5n=a9V.o87;y5n+=e4B;var m5n=N47;m5n+=a9V.W57;return val===undefined?this[m5n]():this[y5n](val);},compare:function(value,original){var v4B="compa";var r5n=v4B;r5n+=E47;r5n+=a9V.K57;var j5n=L47;j5n+=i8B;j5n+=a9V.o87;var compare=this[a9V.o87][j5n][r5n]||_deepCompare;return compare(value,original);},dataSrc:function(){var f5n=L47;f5n+=g87;f5n+=a9V.W57;f5n+=a9V.o87;return this[a9V.o87][f5n][A2B];},destroy:function(){var s4B='destroy';var d5n=j17;d5n+=L47;d5n+=j47;d5n+=a9V.K57;var B5n=a9V.x57;B5n+=L47;B5n+=a9V.t57;this[B5n][p5B][d5n]();this[n5B](s4B);return this;},multiEditable:function(){var P4B="multiEditable";return this[a9V.o87][R9B][P4B];},multiIds:function(){var M4B="ltiIds";var a5n=r47;a5n+=M4B;return this[a9V.o87][a5n];},multiInfoShown:function(show){var S4B="multiIn";var N5n=S4B;N5n+=U5B;var c5n=a9V.x57;c5n+=L47;c5n+=a9V.t57;this[c5n][N5n][M5B]({display:show?C4B:S5B});},multiReset:function(){var w5n=o4B;w5n+=m4B;w5n+=j8B;this[a9V.o87][w5n]=[];this[a9V.o87][r8B]={};},valFromData:o9B,valToData:o9B,_errorNode:function(){var y4B="fieldEr";var T5n=y4B;T5n+=B67;T5n+=E47;var k5n=a9V.x57;k5n+=L47;k5n+=a9V.t57;return this[k5n][T5n];},_msg:function(el,msg,fn){var w4B="eUp";var N4B="slid";var c4B="tm";var r4B="sible";var j4B=":vi";var X5n=j4B;X5n+=r4B;if(msg===undefined){var Z5n=f4B;Z5n+=B4B;return el[Z5n]();}if(typeof msg===a9V.Q57){var q5n=d4B;q5n+=H4B;q5n+=a9V.K57;var O5n=S17;O5n+=g87;O5n+=u87;var g5n=T17;g5n+=L47;g5n+=a9V.o87;g5n+=a9V.W57;var editor=this[a9V.o87][g5n];msg=msg(editor,new DataTable[O5n](editor[a9V.o87][q5n]));}if(el[a4B]()[e8B](X5n)){var Y5n=T17;Y5n+=c4B;Y5n+=i47;el[Y5n](msg);if(msg){el[L4B](fn);}else{var b5n=N4B;b5n+=w4B;el[b5n](fn);}}else{var p5n=a9V.d87;p5n+=G9B;p5n+=a9V.K57;var h5n=D17;h5n+=R67;h5n+=a9V.l57;h5n+=d0B;var i5n=a9V.x57;i5n+=k4B;i5n+=a9V.V57;i5n+=O77;var z5n=T17;z5n+=a9V.W57;z5n+=a9V.t57;z5n+=i47;el[z5n](msg||i3B)[M5B](i5n,msg?h5n:p5n);if(fn){fn();}}return this;},_multiValueCheck:function(){var p4B="noMulti";var h4B="multiInfo";var i4B="ontrol";var b4B="loc";var Y4B="itab";var X4B="multiEd";var q4B="isMultiV";var g4B="iNoEdit";var Z4B="ultiI";var T4B="_m";var H8n=T4B;H8n+=Z4B;H8n+=a9V.d87;H8n+=U5B;var L8n=z9B;L8n+=g4B;var Q5n=a9V.l57;Q5n+=l5B;var u5n=f4B;u5n+=B4B;var x5n=a9V.d87;x5n+=L47;x5n+=a9V.d87;x5n+=a9V.K57;var t5n=H4B;t5n+=L47;t5n+=a9V.l57;t5n+=d0B;var V5n=i47;V5n+=a9V.K57;V5n+=y77;V5n+=u8B;var W5n=O4B;W5n+=a9V.o87;var l5n=h5B;l5n+=a9V.t57;var A5n=q4B;A5n+=R5B;var G5n=X4B;G5n+=Y4B;G5n+=V3B;var last;var ids=this[a9V.o87][K5B];var values=this[a9V.o87][r8B];var isMultiValue=this[a9V.o87][s9B];var isMultiEditable=this[a9V.o87][R9B][G5n];var val;var different=m0B;if(ids){for(var i=v57;i<ids[o0B];i++){val=values[ids[i]];if(i>v57&&!_deepCompare(val,last)){different=r0B;break;}last=val;}}if(different&&isMultiValue||!isMultiEditable&&this[A5n]()){var U5n=a9V.l57;U5n+=a9V.o87;U5n+=a9V.o87;var E5n=a9V.l57;E5n+=a9V.o87;E5n+=a9V.o87;this[w9B][v9B][E5n]({display:S5B});this[w9B][W0B][U5n]({display:C4B});}else{var R5n=a9V.d87;R5n+=L47;R5n+=k17;var F5n=h5B;F5n+=a9V.t57;var D5n=D17;D5n+=b4B;D5n+=d0B;var J5n=z4B;J5n+=a9V.W57;J5n+=V77;J5n+=i4B;this[w9B][J5n][M5B]({display:D5n});this[F5n][W0B][M5B]({display:R5n});if(isMultiValue&&!different){var K5n=a9V.o87;K5n+=a9V.K57;K5n+=a9V.W57;this[K5n](last,m0B);}}this[l5n][Y9B][W5n]({display:ids&&ids[V5n]>s57&&different&&!isMultiValue?t5n:x5n});var i18n=this[a9V.o87][P8B][X2B][W0B];this[w9B][h4B][u5n](isMultiEditable?i18n[i0B]:i18n[p4B]);this[w9B][W0B][G4B](this[a9V.o87][Q5n][L8n],!isMultiEditable);this[a9V.o87][P8B][H8n]();return r0B;},_typeFn:function(name){var n8n=E87;n8n+=U87;n8n+=J87;var args=Array[n8n][A4B][D9B](arguments);args[E4B]();args[U4B](this[a9V.o87][R9B]);var fn=this[a9V.o87][S67][name];if(fn){var I8n=a9V.V57;I8n+=J4B;I8n+=i47;I8n+=O77;return fn[I8n](this[a9V.o87][P8B],args);}}};Editor[Y2B][f9B]={};Editor[Y2B][e8n]={"className":a9V.L87,"data":a9V.L87,"def":a9V.L87,"fieldInfo":a9V.L87,"id":a9V.L87,"label":a9V.L87,"labelInfo":a9V.L87,"name":o9B,"type":D4B,"message":a9V.L87,"multiEditable":r0B};Editor[Y2B][v8n][i2B]={type:o9B,name:o9B,classes:o9B,opts:o9B,host:o9B};Editor[s8n][f9B][w9B]={container:o9B,label:o9B,labelInfo:o9B,fieldInfo:o9B,fieldError:o9B,fieldMessage:o9B};Editor[P8n]={};Editor[M8n][S8n]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[C8n][F4B]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[f9B][i2B]={"ajaxUrl":o9B,"ajax":o9B,"dataSource":o9B,"domTable":o9B,"opts":o9B,"displayController":o9B,"fields":{},"order":[],"id":-s57,"displayed":m0B,"processing":m0B,"modifier":o9B,"action":o9B,"idSrc":o9B,"unique":v57};Editor[f9B][o8n]={"label":o9B,"fn":o9B,"className":o9B};Editor[f9B][R4B]={onReturn:m8n,onBlur:y8n,onBackground:j8n,onComplete:K4B,onEsc:r8n,onFieldError:H8B,submit:f8n,focus:v57,buttons:r0B,title:r0B,message:r0B,drawType:m0B,scope:B8n};Editor[M8B]={};(function(window,document,$,DataTable){var q1B='<div class="DTED_Lightbox_Close"></div>';var O1B='<div class="DTED_Lightbox_Background"><div/></div>';var g1B='<div class="DTED_Lightbox_Content_Wrapper">';var Z1B='<div class="DTED DTED_Lightbox_Wrapper">';var g6B="_scrollTop";var w6B='resize.DTED_Lightbox';var j6B='click.DTED_Lightbox';var y6B='div.DTED_Lightbox_Content_Wrapper';var M7B="_shown";var v7B="ller";var e7B="ntro";var H7B="div class=\"DTED_Lightbox_Conta";var Q4B="Content\">";var u4B="ightbox_";var x4B="TED_L";var t4B="<div class=\"D";var l4B="ightb";var N57=25;var K4n=i47;K4n+=l4B;K4n+=L47;K4n+=K87;var R4n=I5B;R4n+=i47;R4n+=a9V.V57;R4n+=O77;var F4n=W4B;F4n+=u87;F4n+=O0B;var D4n=V4B;D4n+=O0B;var J4n=t4B;J4n+=x4B;J4n+=u4B;J4n+=Q4B;var U4n=L7B;U4n+=H7B;U4n+=Q9B;U4n+=n7B;var c8n=I7B;c8n+=e7B;c8n+=v7B;var a8n=a9V.t57;a8n+=S77;a8n+=i47;a8n+=a9V.o87;var d8n=i47;d8n+=s7B;var self;Editor[M8B][d8n]=$[r9B](r0B,{},Editor[a8n][c8n],{"init":function(dte){self[P7B]();return self;},"open":function(dte,append,callback){var m7B="_show";var g8n=p17;g8n+=G17;g8n+=a9V.K57;var Z8n=s67;Z8n+=h5B;Z8n+=a9V.t57;var T8n=A9B;T8n+=J87;T8n+=a9V.d87;T8n+=a9V.x57;var k8n=a9V.x57;k8n+=e4B;k8n+=f0B;var w8n=s67;w8n+=a9V.x57;w8n+=L47;w8n+=a9V.t57;var N8n=s67;N8n+=a9V.x57;N8n+=a9V.W57;N8n+=a9V.K57;if(self[M7B]){if(callback){callback();}return;}self[N8n]=dte;var content=self[w8n][S7B];content[C7B]()[k8n]();content[o7B](append)[T8n](self[Z8n][g8n]);self[M7B]=r0B;self[m7B](callback);},"close":function(dte,callback){var q8n=s67;q8n+=y7B;var O8n=s67;O8n+=a9V.x57;O8n+=a9V.W57;O8n+=a9V.K57;if(!self[M7B]){if(callback){callback();}return;}self[O8n]=dte;self[q8n](callback);self[M7B]=m0B;},node:function(dte){var X8n=s67;X8n+=a9V.x57;X8n+=B5B;return self[X8n][j7B][v57];},"_init":function(){var N7B='div.DTED_Lightbox_Content';var r7B="opaci";var i8n=a9V.l57;i8n+=a9V.o87;i8n+=a9V.o87;var z8n=r7B;z8n+=a9V.W57;z8n+=O77;var b8n=f7B;b8n+=L47;b8n+=a9V.t57;var Y8n=B7B;Y8n+=d7B;if(self[a7B]){return;}var dom=self[c7B];dom[Y8n]=$(N7B,self[b8n][j7B]);dom[j7B][M5B](z8n,v57);dom[w7B][i8n](k7B,v57);},"_show":function(callback){var G6B='<div class="DTED_Lightbox_Shown"/>';var h6B="not";var i6B="hildre";var z6B="x_Shown";var b6B="tbo";var Y6B="_Ligh";var X6B="div.DTED";var O6B="orientation";var H6B='height';var L6B='DTED_Lightbox_Mobile';var t7B="orient";var V7B="tAn";var K7B="und";var R7B="backgro";var D7B="wrappe";var J7B="ima";var E7B="sto";var A7B="animat";var p7B="TED_Lightbox";var h7B="k.D";var Y7B="Lightbox";var X7B="ick.DTED_";var O7B="bin";var Z7B="Top";var m4n=T7B;m4n+=Z7B;var o4n=D17;o4n+=g7B;var s4n=O7B;s4n+=a9V.x57;var v4n=x77;v4n+=q7B;var I4n=p17;I4n+=X7B;I4n+=Y7B;var n4n=b7B;n4n+=z7B;var H4n=i7B;H4n+=h7B;H4n+=p7B;var L4n=D17;L4n+=u87;L4n+=a9V.d87;L4n+=a9V.x57;var Q8n=a9V.l57;Q8n+=G7B;var V8n=A7B;V8n+=a9V.K57;var W8n=E7B;W8n+=g87;var l8n=U7B;l8n+=J7B;l8n+=R77;var K8n=E7B;K8n+=g87;var R8n=D7B;R8n+=E47;var F8n=a9V.V57;F8n+=F7B;F8n+=a9V.d87;F8n+=a9V.x57;var D8n=R7B;D8n+=K7B;var J8n=A9B;J8n+=g87;J8n+=l7B;var U8n=v5B;U8n+=O77;var E8n=W7B;E8n+=H47;E8n+=V7B;E8n+=u87;var A8n=a9V.l57;A8n+=L47;A8n+=a9V.d87;A8n+=a9V.B87;var G8n=a9V.l57;G8n+=L47;G8n+=a9V.d87;G8n+=x47;var h8n=t7B;h8n+=x7B;h8n+=L47;h8n+=a9V.d87;var that=this;var dom=self[c7B];if(window[h8n]!==undefined){var p8n=u7B;p8n+=Q7B;$(p8n)[L5B](L6B);}dom[G8n][M5B](H6B,n6B);dom[j7B][M5B]({top:-self[A8n][E8n]});$(U8n)[J8n](self[c7B][D8n])[F8n](self[c7B][j7B]);self[I6B]();dom[R8n][K8n]()[l8n]({opacity:s57,top:v57},callback);dom[w7B][W8n]()[V8n]({opacity:s57});setTimeout(function(){var P6B="oot";var s6B="div.DTE_F";var v6B="den";var e6B="text-in";var u8n=e6B;u8n+=v6B;u8n+=a9V.W57;var x8n=a9V.l57;x8n+=a9V.o87;x8n+=a9V.o87;var t8n=s6B;t8n+=P6B;t8n+=R47;$(t8n)[x8n](u8n,-s57);},m57);dom[Q8n][L4n](H4n,function(e){self[M6B][S6B]();});dom[w7B][n4n](I4n,function(e){var e4n=C6B;e4n+=o6B;e4n+=m6B;e4n+=a9V.x57;self[M6B][e4n]();});$(y6B,dom[v4n])[s4n](j6B,function(e){var f6B="nt_Wrapper";var r6B="DTED_Lightbox_Conte";var M4n=r6B;M4n+=f6B;var P4n=B6B;P4n+=a9V.o87;P4n+=d6B;P4n+=a6B;if($(e[c6B])[P4n](M4n)){var S4n=s67;S4n+=a9V.x57;S4n+=a9V.W57;S4n+=a9V.K57;self[S4n][w7B]();}});$(window)[N6B](w6B,function(){var Z6B="htCalc";var C4n=s67;C4n+=k6B;C4n+=T6B;C4n+=Z6B;self[C4n]();});self[g6B]=$(o4n)[m4n]();if(window[O6B]!==undefined){var B4n=q6B;B4n+=a9V.K57;B4n+=a9V.d87;B4n+=a9V.x57;var f4n=X6B;f4n+=Y6B;f4n+=b6B;f4n+=z6B;var r4n=a9V.d87;r4n+=L47;r4n+=a9V.W57;var j4n=a9V.l57;j4n+=i6B;j4n+=a9V.d87;var y4n=u7B;y4n+=Q7B;var kids=$(y4n)[j4n]()[h6B](dom[w7B])[r4n](dom[j7B]);$(p6B)[o7B](G6B);$(f4n)[B4n](kids);}},"_heightCalc":function(){var l6B="gh";var K6B="ei";var R6B="nf";var F6B="eig";var D6B="terH";var U6B="dy_Content";var E6B="_Bo";var T4n=a9V.l57;T4n+=a9V.o87;T4n+=a9V.o87;var k4n=A6B;k4n+=E6B;k4n+=U6B;var w4n=J6B;w4n+=D6B;w4n+=F6B;w4n+=f4B;var N4n=x77;N4n+=E47;N4n+=q6B;N4n+=R47;var c4n=a9V.l57;c4n+=L47;c4n+=R6B;var a4n=T17;a4n+=K6B;a4n+=l6B;a4n+=a9V.W57;var d4n=s67;d4n+=a9V.x57;d4n+=L47;d4n+=a9V.t57;var dom=self[d4n];var maxHeight=$(window)[a4n]()-self[c4n][W6B]*P57-$(V6B,dom[N4n])[w4n]()-$(t6B,dom[j7B])[x6B]();$(k4n,dom[j7B])[T4n](u6B,maxHeight);},"_hide":function(callback){var T1B="unbind";var N1B="offsetAni";var r1B='div.DTED_Lightbox_Shown';var y1B="ntation";var m1B="orie";var o1B="moveC";var C1B="ghtbox_Mobile";var S1B="Li";var M1B="DTED";var s1B="backgrou";var e1B="htbo";var I1B="click.DTED_Lig";var n1B="_Lightbox";var H1B=".DTED";var E4n=x77;E4n+=Q6B;E4n+=g87;E4n+=c2B;var A4n=L1B;A4n+=H1B;A4n+=n1B;var G4n=I1B;G4n+=e1B;G4n+=K87;var p4n=a9V.l57;p4n+=l17;p4n+=a9V.K57;var h4n=U7B;h4n+=v1B;var i4n=s1B;i4n+=z7B;var b4n=P1B;b4n+=F7B;b4n+=E47;var Y4n=M1B;Y4n+=s67;Y4n+=S1B;Y4n+=C1B;var X4n=G8B;X4n+=o1B;X4n+=m17;X4n+=a6B;var q4n=u7B;q4n+=a9V.x57;q4n+=O77;var Z4n=m1B;Z4n+=y1B;var dom=self[c7B];if(!callback){callback=function(){};}if(window[Z4n]!==undefined){var O4n=v5B;O4n+=O77;var g4n=a9V.V57;g4n+=g87;g4n+=j1B;var show=$(r1B);show[C7B]()[g4n](O4n);show[f1B]();}$(q4n)[X4n](Y4n)[B1B](self[g6B]);dom[b4n][d1B]()[a1B]({opacity:v57,top:self[c1B][N1B]},function(){var w1B="detac";var z4n=w1B;z4n+=T17;$(this)[z4n]();callback();});dom[i4n][d1B]()[h4n]({opacity:v57},function(){$(this)[k1B]();});dom[p4n][T1B](G4n);dom[w7B][T1B](A4n);$(y6B,dom[E4n])[T1B](j6B);$(window)[T1B](w6B);},"_dte":o9B,"_ready":m0B,"_shown":m0B,"_dom":{"wrapper":$(Z1B+U4n+g1B+J4n+H9B+D4n+F4n+H9B),"background":$(O1B),"close":$(q1B),"content":o9B}});self=Editor[R4n][K4n];self[c1B]={"offsetAni":N57,"windowPadding":N57};}(window,document,jQuery,jQuery[l4n][X1B]));(function(window,document,$,DataTable){var J0X='<div class="DTED_Envelope_Close">&times;</div>';var U0X='<div class="DTED_Envelope_Background"><div/></div>';var N3X="_do";var r3X="_Wrapper";var j3X="div.DTED_Lightbox_Content";var m3X="k.DTE";var S3X="_cssBackgroundOpacity";var Q1B="ound";var u1B="ckgr";var V1B="appendChild";var K1B="envelope";var J1B="playController";var U1B="=\"DTED DTED_Envelope_Wrapper\">";var E1B="<div class";var A1B="></div>";var G1B="hadow\"";var p1B="DTED_Envelope_S";var h1B="<div class=\"";var i1B="D_Envelope_Container\"></div>";var z1B="<div class=\"DTE";var Y1B="velope";var A57=600;var X57=50;var d1n=a9V.j87;d1n+=Y1B;var B1n=L7B;B1n+=F0B;B1n+=b1B;var f1n=z1B;f1n+=i1B;var r1n=h1B;r1n+=p1B;r1n+=G1B;r1n+=A1B;var j1n=E1B;j1n+=U1B;var x4n=a9V.x57;x4n+=u87;x4n+=a9V.o87;x4n+=J1B;var t4n=D1B;t4n+=F77;t4n+=a9V.o87;var V4n=P3B;V4n+=R77;V4n+=a9V.d87;V4n+=a9V.x57;var W4n=a9V.x57;W4n+=F1B;W4n+=R1B;var self;Editor[W4n][K1B]=$[V4n](r0B,{},Editor[t4n][x4n],{"init":function(dte){var u4n=s67;u4n+=W67;u4n+=a9V.K57;self[u4n]=dte;self[P7B]();return self;},"open":function(dte,append,callback){var v7n=s67;v7n+=l1B;var e7n=s67;e7n+=h5B;e7n+=a9V.t57;var I7n=s67;I7n+=a9V.x57;I7n+=L47;I7n+=a9V.t57;var n7n=z17;n7n+=a9V.W57;n7n+=a9V.V57;n7n+=W1B;var H7n=B7B;H7n+=d7B;var L7n=s67;L7n+=a9V.x57;L7n+=L47;L7n+=a9V.t57;var Q4n=s67;Q4n+=a9V.x57;Q4n+=a9V.W57;Q4n+=a9V.K57;self[Q4n]=dte;$(self[L7n][H7n])[C7B]()[n7n]();self[I7n][S7B][V1B](append);self[e7n][S7B][V1B](self[c7B][S6B]);self[v7n](callback);},"close":function(dte,callback){var P7n=s67;P7n+=t1B;P7n+=a9V.x57;P7n+=a9V.K57;var s7n=s67;s7n+=a9V.x57;s7n+=a9V.W57;s7n+=a9V.K57;self[s7n]=dte;self[P7n](callback);},node:function(dte){var x1B="rap";var S7n=x77;S7n+=x1B;S7n+=J87;S7n+=E47;var M7n=s67;M7n+=a9V.x57;M7n+=L47;M7n+=a9V.t57;return self[M7n][S7n][v57];},"_init":function(){var C3X='visible';var M3X="visbility";var v3X="nten";var e3X="Envelope_Container";var I3X="iv.DTED_";var n3X="dChil";var L3X="rappe";var g7n=f7B;g7n+=B5B;var Z7n=a9V.x57;Z7n+=F1B;Z7n+=i47;Z7n+=e5B;var T7n=M17;T7n+=O77;T7n+=V3B;var k7n=C6B;k7n+=u1B;k7n+=Q1B;var w7n=s67;w7n+=a9V.x57;w7n+=L47;w7n+=a9V.t57;var N7n=D17;N7n+=R67;N7n+=o6B;var c7n=a9V.x57;c7n+=F1B;c7n+=m17;c7n+=O77;var a7n=s67;a7n+=h5B;a7n+=a9V.t57;var d7n=T17;d7n+=u2B;d7n+=a9V.x57;d7n+=a9V.j87;var B7n=x77;B7n+=L3X;B7n+=E47;var f7n=s67;f7n+=a9V.x57;f7n+=L47;f7n+=a9V.t57;var r7n=a9V.V57;r7n+=H3X;r7n+=n3X;r7n+=a9V.x57;var j7n=s67;j7n+=a9V.x57;j7n+=L47;j7n+=a9V.t57;var y7n=u7B;y7n+=Q7B;var m7n=a9V.x57;m7n+=I3X;m7n+=e3X;var o7n=a9V.l57;o7n+=L47;o7n+=v3X;o7n+=a9V.W57;var C7n=s67;C7n+=a9V.x57;C7n+=B5B;if(self[a7B]){return;}self[C7n][o7n]=$(m7n,self[c7B][j7B])[v57];document[y7n][V1B](self[j7n][w7B]);document[s3X][r7n](self[f7n][B7n]);self[c7B][w7B][P3X][M3X]=d7n;self[a7n][w7B][P3X][c7n]=N7n;self[S3X]=$(self[c7B][w7B])[M5B](k7B);self[w7n][k7n][T7n][Z7n]=S5B;self[g7n][w7B][P3X][M3X]=C3X;},"_show":function(callback){var s0X='resize.DTED_Envelope';var H0X='html,body';var L0X="imat";var Q3X="setHeight";var W3X="marginLeft";var l3X="px";var R3X="opacity";var D3X="tyl";var J3X="dAttachRow";var U3X="_fi";var A3X="widt";var G3X="rapp";var p3X="styl";var h3X="wrapp";var z3X="sty";var b3X="ckground";var Y3X="kgr";var X3X="yle";var q3X="spl";var O3X="ormal";var g3X="In";var Z3X="fade";var T3X="oll";var w3X="windowS";var c3X="ick.DTED_Envelope";var a3X="back";var d3X="lope";var B3X="D_Enve";var f3X="click.DTE";var y3X="D_Envelope";var c6n=p17;c6n+=o3X;c6n+=m3X;c6n+=y3X;var a6n=b7B;a6n+=a9V.d87;a6n+=a9V.x57;var d6n=j3X;d6n+=r3X;var B6n=f3X;B6n+=B3X;B6n+=d3X;var f6n=a3X;f6n+=m6B;f6n+=a9V.x57;var j6n=a9V.l57;j6n+=i47;j6n+=c3X;var y6n=a9V.l57;y6n+=i47;y6n+=z67;var m6n=N3X;m6n+=a9V.t57;var v6n=w3X;v6n+=k3X;v6n+=T3X;var e6n=a9V.l57;e6n+=G9B;e6n+=a9V.B87;var I6n=Z3X;I6n+=g3X;var n6n=a9V.d87;n6n+=O3X;var H6n=U7B;H6n+=v1B;var L6n=H3B;L6n+=q3X;L6n+=e5B;var Q7n=M17;Q7n+=X3X;var u7n=C6B;u7n+=a9V.l57;u7n+=Y3X;u7n+=Q1B;var x7n=s67;x7n+=a9V.x57;x7n+=L47;x7n+=a9V.t57;var t7n=C6B;t7n+=b3X;var V7n=s67;V7n+=a9V.x57;V7n+=B5B;var W7n=g87;W7n+=K87;var l7n=z3X;l7n+=V3B;var K7n=g87;K7n+=K87;var R7n=a9V.W57;R7n+=L47;R7n+=g87;var F7n=a9V.W57;F7n+=i3X;var D7n=h3X;D7n+=a9V.K57;D7n+=E47;var J7n=g87;J7n+=K87;var U7n=p3X;U7n+=a9V.K57;var E7n=x77;E7n+=G3X;E7n+=R47;var A7n=A3X;A7n+=T17;var G7n=a9V.o87;G7n+=a9V.W57;G7n+=X3X;var p7n=a2B;p7n+=J87;p7n+=E47;var h7n=s67;h7n+=a9V.x57;h7n+=B5B;var i7n=E3X;i7n+=a9V.d87;i7n+=a9V.K57;var z7n=I5B;z7n+=m17;z7n+=O77;var b7n=U3X;b7n+=a9V.d87;b7n+=J3X;var Y7n=D17;Y7n+=R67;Y7n+=o6B;var X7n=a9V.o87;X7n+=D3X;X7n+=a9V.K57;var q7n=f7B;q7n+=B5B;var O7n=s67;O7n+=h5B;O7n+=a9V.t57;var that=this;var formHeight;if(!callback){callback=function(){};}self[O7n][S7B][P3X][F3X]=n6B;var style=self[q7n][j7B][X7n];style[R3X]=v57;style[M8B]=Y7n;var targetRow=self[b7n]();var height=self[I6B]();var width=targetRow[K3X];style[z7n]=i7n;style[R3X]=s57;self[h7n][p7n][G7n][A7n]=width+l3X;self[c7B][E7n][U7n][W3X]=-(width/P57)+J7n;self[c7B][D7n][P3X][F7n]=$(targetRow)[V3X]()[R7n]+targetRow[t3X]+K7n;self[c7B][S7B][l7n][x3X]=-s57*height-d57+W7n;self[V7n][t7n][P3X][R3X]=v57;self[x7n][u7n][Q7n][L6n]=C4B;$(self[c7B][w7B])[H6n]({'opacity':self[S3X]},n6n);$(self[c7B][j7B])[I6n]();if(self[e6n][v6n]){var S6n=L47;S6n+=u3X;S6n+=Q3X;var M6n=a9V.W57;M6n+=L47;M6n+=g87;var P6n=W7B;P6n+=a9V.o87;P6n+=e4B;var s6n=a9V.V57;s6n+=a9V.d87;s6n+=L0X;s6n+=a9V.K57;$(H0X)[s6n]({"scrollTop":$(targetRow)[P6n]()[M6n]+targetRow[S6n]-self[c1B][W6B]},function(){var o6n=U7B;o6n+=u87;o6n+=n0X;o6n+=R77;var C6n=r5B;C6n+=a9V.W57;C6n+=a9V.j87;C6n+=a9V.W57;$(self[c7B][C6n])[o6n]({"top":v57},A57,callback);});}else{$(self[c7B][S7B])[a1B]({"top":v57},A57,callback);}$(self[m6n][y6n])[N6B](j6n,function(e){var r6n=I0X;r6n+=a9V.o87;r6n+=a9V.K57;self[M6B][r6n]();});$(self[c7B][f6n])[N6B](B6n,function(e){self[M6B][w7B]();});$(d6n,self[c7B][j7B])[a6n](c6n,function(e){var v0X="Envelope_Content_W";var e0X="DTED_";var N6n=e0X;N6n+=v0X;N6n+=q7B;if($(e[c6B])[O9B](N6n)){var w6n=s67;w6n+=a9V.x57;w6n+=R77;self[w6n][w7B]();}});$(window)[N6B](s0X,function(){self[I6B]();});},"_heightCalc":function(){var r0X="heightCalc";var y0X="heigh";var m0X="ding";var o0X="windowPad";var C0X="Height";var S0X="outer";var M0X="Body_Cont";var P0X="div.DTE_";var p6n=a9V.x57;p6n+=L47;p6n+=a9V.t57;var h6n=s67;h6n+=a9V.x57;h6n+=R77;var i6n=s67;i6n+=a9V.x57;i6n+=L47;i6n+=a9V.t57;var z6n=P0X;z6n+=M0X;z6n+=a9V.K57;z6n+=d7B;var b6n=S0X;b6n+=C0X;var Y6n=f7B;Y6n+=L47;Y6n+=a9V.t57;var X6n=o0X;X6n+=m0X;var q6n=r5B;q6n+=a9V.B87;var O6n=y0X;O6n+=a9V.W57;var g6n=a9V.l57;g6n+=t1B;g6n+=i47;g6n+=j0X;var Z6n=r5B;Z6n+=R77;Z6n+=a9V.d87;Z6n+=a9V.W57;var T6n=s67;T6n+=h5B;T6n+=a9V.t57;var k6n=s67;k6n+=a9V.x57;k6n+=L47;k6n+=a9V.t57;var formHeight;formHeight=self[c1B][r0X]?self[c1B][r0X](self[k6n][j7B]):$(self[T6n][Z6n])[g6n]()[F3X]();var maxHeight=$(window)[O6n]()-self[q6n][X6n]*P57-$(V6B,self[Y6n][j7B])[x6B]()-$(t6B,self[c7B][j7B])[b6n]();$(z6n,self[i6n][j7B])[M5B](u6B,maxHeight);return $(self[h6n][p6n][j7B])[x6B]();},"_hide":function(callback){var Z0X="ontent";var T0X="click.DTED_L";var k0X="backgr";var w0X="ghtbox";var N0X="DTED_Li";var c0X="ick.";var d0X="nbin";var B0X="D_Lightbox";var f0X="size.DTE";var n1n=G8B;n1n+=f0X;n1n+=B0X;var H1n=v0B;H1n+=d0X;H1n+=a9V.x57;var L1n=i7B;L1n+=m3X;L1n+=B0X;var Q6n=a0X;Q6n+=D17;Q6n+=u87;Q6n+=z7B;var u6n=P1B;u6n+=J4B;u6n+=R47;var x6n=N3X;x6n+=a9V.t57;var t6n=j3X;t6n+=r3X;var V6n=p17;V6n+=c0X;V6n+=N0X;V6n+=w0X;var W6n=a0X;W6n+=b7B;W6n+=z7B;var l6n=k0X;l6n+=J6B;l6n+=z7B;var K6n=T0X;K6n+=s7B;var R6n=v0B;R6n+=d0X;R6n+=a9V.x57;var F6n=f7B;F6n+=B5B;var E6n=s67;E6n+=h5B;E6n+=a9V.t57;var A6n=a9V.l57;A6n+=Z0X;var G6n=N3X;G6n+=a9V.t57;if(!callback){callback=function(){};}$(self[G6n][A6n])[a1B]({"top":-(self[E6n][S7B][t3X]+X57)},A57,function(){var O0X="fadeOut";var D6n=E3X;D6n+=g0X;D6n+=a9V.V57;D6n+=i47;var J6n=C6B;J6n+=u1B;J6n+=Q1B;var U6n=s67;U6n+=a9V.x57;U6n+=B5B;$([self[U6n][j7B],self[c7B][J6n]])[O0X](D6n,callback);});$(self[F6n][S6B])[R6n](K6n);$(self[c7B][l6n])[W6n](V6n);$(t6n,self[x6n][u6n])[Q6n](L1n);$(window)[H1n](n1n);},"_findAttachRow":function(){var E0X="ier";var A0X="dif";var G0X="heade";var h0X="tabl";var i0X="ader";var z0X='head';var X0X="_dt";var q0X="creat";var S1n=q0X;S1n+=a9V.K57;var M1n=s67;M1n+=W67;M1n+=a9V.K57;var v1n=F87;v1n+=d4B;v1n+=W1B;var e1n=r5B;e1n+=a9V.B87;var I1n=X0X;I1n+=a9V.K57;var dt=$(self[I1n][a9V.o87][Y0X])[b0X]();if(self[e1n][v1n]===z0X){var P1n=k6B;P1n+=i0X;var s1n=h0X;s1n+=a9V.K57;return dt[s1n]()[P1n]();}else if(self[M1n][a9V.o87][p0X]===S1n){var o1n=G0X;o1n+=E47;var C1n=d4B;C1n+=D17;C1n+=i47;C1n+=a9V.K57;return dt[C1n]()[o1n]();}else{var y1n=a9V.d87;y1n+=L47;y1n+=a9V.x57;y1n+=a9V.K57;var m1n=a9V.t57;m1n+=L47;m1n+=A0X;m1n+=E0X;return dt[n17](self[M6B][a9V.o87][m1n])[y1n]();}},"_dte":o9B,"_ready":m0B,"_cssBackgroundOpacity":s57,"_dom":{"wrapper":$(j1n+r1n+f1n+B1n)[v57],"background":$(U0X)[v57],"close":$(J0X)[v57],"content":o9B}});self=Editor[M8B][d1n];self[c1B]={"windowPadding":X57,"heightCalc":o9B,"attach":n17,"windowScroll":r0B};}(window,document,jQuery,jQuery[a1n][c1n]));Editor[N1n][w1n]=function(cfg,after){var P2X="rder";var s2X="pus";var n2X="multiReset";var Q0X="'. A field already exists with this name";var u0X="d '";var x0X="g fiel";var t0X="Error addin";var V0X="Error adding field. The field requires a `name` option";var l0X="urce";var R0X="tFiel";var F0X="ni";if($[t8B](cfg)){var k1n=V3B;k1n+=a9V.d87;k1n+=D0X;for(var i=v57,iLen=cfg[k1n];i<iLen;i++){var T1n=a9V.V57;T1n+=a9V.x57;T1n+=a9V.x57;this[T1n](cfg[i]);}}else{var Y1n=D1B;Y1n+=a9V.K57;var X1n=u87;X1n+=F0X;X1n+=R0X;X1n+=a9V.x57;var q1n=f7B;q1n+=K0X;q1n+=l0X;var g1n=k2B;g1n+=W0X;var Z1n=a9V.d87;Z1n+=a9V.V57;Z1n+=a9V.t57;Z1n+=a9V.K57;var name=cfg[Z1n];if(name===undefined){throw V0X;}if(this[a9V.o87][g1n][name]){var O1n=t0X;O1n+=x0X;O1n+=u0X;throw O1n+name+Q0X;}this[q1n](X1n,cfg);var field=new Editor[Y2B](cfg,this[L2X][q0B],this);if(this[a9V.o87][Y1n]){var z1n=a9V.K57;z1n+=U8B;z1n+=T17;var b1n=v17;b1n+=g2B;b1n+=H2X;var editFields=this[a9V.o87][b1n];field[n2X]();$[z1n](editFields,function(idSrc,edit){var i1n=a9V.x57;i1n+=a9V.K57;i1n+=a9V.B87;var val;if(edit[A2B]){val=field[I2X](edit[A2B]);}field[e2X](idSrc,val!==undefined?val:field[i1n]());});}this[a9V.o87][v2X][name]=field;if(after===undefined){var p1n=s2X;p1n+=T17;var h1n=L47;h1n+=P2X;this[a9V.o87][h1n][p1n](name);}else if(after===o9B){this[a9V.o87][M2X][U4B](name);}else{var G1n=L47;G1n+=E47;G1n+=z17;G1n+=E47;var idx=$[S2X](after,this[a9V.o87][M2X]);this[a9V.o87][G1n][C2X](idx+s57,v57,name);}}this[o2X](this[M2X]());return this;};Editor[A1n][w7B]=function(){var a2X='blur';var d2X="onBackground";var B2X="itOpts";var j2X="fun";var D1n=m2X;D1n+=y2X;D1n+=T67;var J1n=a9V.l57;J1n+=i47;J1n+=L47;J1n+=H47;var U1n=j2X;U1n+=r2X;var E1n=f2X;E1n+=B2X;var onBackground=this[a9V.o87][E1n][d2X];if(typeof onBackground===U1n){onBackground(this);}else if(onBackground===a2X){this[c2X]();}else if(onBackground===J1n){this[S6B]();}else if(onBackground===D1n){this[N2X]();}return this;};Editor[F1n][R1n]=function(){var K1n=j77;K1n+=i47;K1n+=v0B;K1n+=E47;this[K1n]();return this;};Editor[F9B][w2X]=function(cells,fieldNames,show,opts){var f9X="epe";var r9X="prepend";var m9X="appendT";var o9X='<div class="DTE_Processing_Indicator"><span></div>';var C9X="bg";var S9X='attach';var s9X='resize.';var Q2X="isPlainObj";var u2X="boole";var t2X="formOp";var V2X="ource";var W2X="_dataS";var K2X="bubbleN";var R2X="bubb";var J2X="\"><div/></";var A2X=" /";var z2X="poin";var b2X=" />";var X2X="rmError";var q2X="ssag";var O2X="blePositi";var T2X="eFields";var k2X="clud";var G3z=G67;G3z+=k2X;G3z+=T2X;var p3z=s67;p3z+=a9V.B87;p3z+=L47;p3z+=Z2X;var h3z=g2X;h3z+=O2X;h3z+=G9B;var i3z=a9V.l57;i3z+=B0B;i3z+=a9V.l57;i3z+=d0B;var X3z=a9V.V57;X3z+=a9V.x57;X3z+=a9V.x57;var Z3z=j2B;Z3z+=q2X;Z3z+=a9V.K57;var T3z=a9V.B87;T3z+=L47;T3z+=E47;T3z+=a9V.t57;var k3z=h5B;k3z+=a9V.t57;var w3z=U5B;w3z+=X2X;var N3z=a9V.x57;N3z+=B5B;var d3z=L7B;d3z+=F0B;d3z+=Y2X;d3z+=Y0B;var B3z=F3B;B3z+=b2X;var f3z=z2X;f3z+=i2X;var r3z=h2X;r3z+=a6B;r3z+=p2X;var j3z=g0B;j3z+=a9V.x57;j3z+=G2X;var y3z=F3B;y3z+=A2X;y3z+=Y0B;var m3z=p17;m3z+=G17;m3z+=a9V.K57;var o3z=F3B;o3z+=Y0B;var C3z=E2X;C3z+=i47;C3z+=U2X;var S3z=B0B;S3z+=a9V.d87;S3z+=R47;var M3z=P1B;M3z+=g87;M3z+=g87;M3z+=R47;var P3z=J2X;P3z+=b1B;var s3z=D2X;s3z+=F2X;s3z+=a9V.o87;s3z+=p2X;var v3z=R2X;v3z+=V3B;var e3z=t9B;e3z+=a6B;e3z+=Q3B;var I3z=a9V.V57;I3z+=g87;I3z+=E8B;I3z+=O77;var n3z=a9V.l57;n3z+=G9B;n3z+=a9V.l57;n3z+=F87;var H3z=K2X;H3z+=l2X;var Q1n=L47;Q1n+=a9V.d87;var u1n=g2X;u1n+=D17;u1n+=V3B;var x1n=W2X;x1n+=V2X;var t1n=R2X;t1n+=V3B;var V1n=t2X;V1n+=x2X;V1n+=a9V.o87;var W1n=u2X;W1n+=U7B;var l1n=Q2X;l1n+=j0B;l1n+=a9V.W57;var that=this;if(this[L9X](function(){that[w2X](cells,fieldNames,opts);})){return this;}if($[l1n](fieldNames)){opts=fieldNames;fieldNames=undefined;show=r0B;}else if(typeof fieldNames===W1n){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[g8B](show)){opts=show;show=r0B;}if(show===undefined){show=r0B;}opts=$[r9B]({},this[a9V.o87][V1n][t1n],opts);var editFields=this[x1n](H9X,cells,fieldNames);this[n9X](cells,editFields,u1n,opts);var namespace=this[I9X](opts);var ret=this[e9X](v9X);if(!ret){return this;}$(window)[Q1n](s9X+namespace,function(){var M9X="ition";var P9X="Pos";var L3z=w2X;L3z+=P9X;L3z+=M9X;that[L3z]();});var nodes=[];this[a9V.o87][H3z]=nodes[n3z][I3z](nodes,_pluck(editFields,S9X));var classes=this[e3z][v3z];var background=$(s3z+classes[C9X]+P3z);var container=$(W2B+classes[M3z]+Q2B+W2B+classes[S3z]+Q2B+C3z+classes[Y0X]+o3z+W2B+classes[m3z]+y3z+o9X+H9B+j3z+r3z+classes[f3z]+B3z+d3z);if(show){var c3z=D17;c3z+=N17;c3z+=O77;var a3z=m9X;a3z+=L47;container[y9X](p6B);background[a3z](c3z);}var liner=container[C7B]()[j9X](v57);var table=liner[C7B]();var close=table[C7B]();liner[o7B](this[N3z][w3z]);table[r9X](this[k3z][T3z]);if(opts[Z3z]){var O3z=a9V.x57;O3z+=L47;O3z+=a9V.t57;var g3z=n67;g3z+=f9X;g3z+=a9V.d87;g3z+=a9V.x57;liner[g3z](this[O3z][B9X]);}if(opts[d9X]){var q3z=g87;q3z+=E47;q3z+=f9X;q3z+=z7B;liner[q3z](this[w9B][a9X]);}if(opts[c9X]){table[o7B](this[w9B][c9X]);}var pair=$()[i5B](container)[X3z](background);this[N9X](function(submitComplete){var w9X="ani";var Y3z=w9X;Y3z+=n0X;Y3z+=a9V.W57;Y3z+=a9V.K57;pair[Y3z]({opacity:v57},function(){var Z9X="nami";var T9X="Dy";var k9X="_clear";var z3z=k9X;z3z+=T9X;z3z+=Z9X;z3z+=g9X;var b3z=L47;b3z+=a9V.B87;b3z+=a9V.B87;pair[k1B]();$(window)[b3z](s9X+namespace);that[z3z]();});});background[i3z](function(){that[c2X]();});close[L1B](function(){that[O9X]();});this[h3z]();pair[a1B]({opacity:s57});this[p3z](this[a9V.o87][G3z],opts[L8B]);this[q9X](v9X);return this;};Editor[F9B][A3z]=function(){var l9X="eft";var K9X='left';var R9X='below';var F9X="ddClas";var D9X="elo";var U9X="right";var E9X="bottom";var p9X="bubbleNodes";var h9X='div.DTE_Bubble_Liner';var i9X='div.DTE_Bubble';var b9X="ef";var Y9X="tom";var B57=15;var Q3z=W7B;Q3z+=a9V.o87;Q3z+=e4B;var u3z=a9V.l57;u3z+=a9V.o87;u3z+=a9V.o87;var x3z=x77;x3z+=u2B;x3z+=a9V.W57;x3z+=T17;var t3z=X9X;t3z+=g17;t3z+=u8B;var V3z=u7B;V3z+=a9V.W57;V3z+=Y9X;var W3z=X9X;W3z+=D0X;var l3z=E47;l3z+=T6B;l3z+=T17;l3z+=a9V.W57;var K3z=i47;K3z+=a9V.j87;K3z+=g17;K3z+=u8B;var R3z=i47;R3z+=b9X;R3z+=a9V.W57;var F3z=i47;F3z+=z9X;F3z+=T17;var wrapper=$(i9X),liner=$(h9X),nodes=this[a9V.o87][p9X];var position={top:v57,left:v57,right:v57,bottom:v57};$[O8B](nodes,function(i,node){var D3z=a9V.W57;D3z+=L47;D3z+=g87;var J3z=a3B;J3z+=g17;J3z+=T17;J3z+=a9V.W57;var U3z=i47;U3z+=a9V.K57;U3z+=a9V.B87;U3z+=a9V.W57;var E3z=a9V.W57;E3z+=L47;E3z+=g87;var pos=$(node)[V3X]();node=$(node)[G9X](v57);position[E3z]+=pos[x3X];position[U3z]+=pos[A9X];position[J3z]+=pos[A9X]+node[K3X];position[E9X]+=pos[D3z]+node[t3X];});position[x3X]/=nodes[F3z];position[R3z]/=nodes[K3z];position[l3z]/=nodes[W3z];position[V3z]/=nodes[t3z];var top=position[x3X],left=(position[A9X]+position[U9X])/P57,width=liner[J9X](),visLeft=left-width/P57,visRight=visLeft+width,docWidth=$(window)[x3z](),padding=B57,classes=this[L2X][w2X];wrapper[u3z]({top:top,left:left});if(liner[o0B]&&liner[Q3z]()[x3X]<v57){var I0z=D17;I0z+=D9X;I0z+=x77;var n0z=a9V.V57;n0z+=F9X;n0z+=a9V.o87;var H0z=a9V.W57;H0z+=L47;H0z+=g87;var L0z=a9V.l57;L0z+=a6B;wrapper[L0z](H0z,position[E9X])[n0z](I0z);}else{wrapper[d5B](R9X);}if(visRight+padding>docWidth){var diff=visRight-docWidth;liner[M5B](K9X,visLeft<padding?-(visLeft-padding):-(diff+padding));}else{var v0z=i47;v0z+=l9X;var e0z=a9V.l57;e0z+=a9V.o87;e0z+=a9V.o87;liner[e0z](v0z,visLeft<padding?-(visLeft-padding):v57);}return this;};Editor[s0z][P0z]=function(buttons){var t9X='_basic';var V9X="sArr";var m0z=a9V.K57;m0z+=a9V.V57;m0z+=W1B;var o0z=a9V.K57;o0z+=W9X;o0z+=U87;var C0z=u87;C0z+=V9X;C0z+=a9V.V57;C0z+=O77;var that=this;if(buttons===t9X){var S0z=x9X;S0z+=L47;S0z+=a9V.d87;var M0z=u87;M0z+=w87;M0z+=u9X;M0z+=a9V.d87;buttons=[{text:this[M0z][this[a9V.o87][S0z]][N2X],action:function(){this[N2X]();}}];}else if(!$[C0z](buttons)){buttons=[buttons];}$(this[w9B][c9X])[o0z]();$[m0z](buttons,function(i,btn){var c5X="tabIndex";var d5X="className";var y5X="on/>";var C5X="assName";var S5X="functi";var M5X="index";var s5X="tabI";var v5X="yu";var e5X="ypress";var i0z=D17;i0z+=Q9X;i0z+=L5X;var z0z=a9V.x57;z0z+=L47;z0z+=a9V.t57;var b0z=H5X;b0z+=n5X;var Y0z=a9V.l57;Y0z+=B0B;Y0z+=o6B;var X0z=L47;X0z+=a9V.d87;var g0z=I5X;g0z+=e5X;var Z0z=L47;Z0z+=a9V.d87;var k0z=d0B;k0z+=a9V.K57;k0z+=v5X;k0z+=g87;var w0z=L47;w0z+=a9V.d87;var N0z=s5X;N0z+=P5X;var c0z=a9V.W57;c0z+=a9V.V57;c0z+=D17;c0z+=M5X;var a0z=S5X;a0z+=G9B;var d0z=a9V.l57;d0z+=i47;d0z+=C5X;var B0z=a9V.l57;B0z+=o5X;B0z+=b5B;var f0z=m5X;f0z+=a9V.W57;f0z+=y5X;var r0z=a9V.B87;r0z+=a9V.d87;var j0z=a9V.V57;j0z+=j5X;j0z+=r5X;j0z+=a9V.d87;var y0z=a9V.W57;y0z+=a9V.K57;y0z+=K87;y0z+=a9V.W57;if(typeof btn===J8B){btn={text:btn,action:function(){this[N2X]();}};}var text=btn[y0z]||btn[f5X];var action=btn[j0z]||btn[r0z];$(f0z,{'class':that[B0z][v77][B5X]+(btn[d0z]?V2B+btn[d5X]:i3B)})[o8B](typeof text===a0z?text(that):text||i3B)[a5X](c0z,btn[N0z]!==undefined?btn[c5X]:v57)[w0z](k0z,function(e){if(e[N5X]===r57&&action){var T0z=a9V.l57;T0z+=a9V.V57;T0z+=i47;T0z+=i47;action[T0z](that);}})[Z0z](g0z,function(e){var T5X="tDefa";var k5X="preven";var w5X="keyCod";var O0z=w5X;O0z+=a9V.K57;if(e[O0z]===r57){var q0z=k5X;q0z+=T5X;q0z+=c0B;e[q0z]();}})[X0z](Y0z,function(e){e[Z5X]();if(action){action[D9B](that);}})[b0z](that[z0z][i0z]);});return this;};Editor[F9B][h0z]=function(fieldName){var b5X="destroy";var X5X="nA";var q5X="Ar";var O5X="udeF";var g5X="incl";var that=this;var fields=this[a9V.o87][v2X];if(typeof fieldName===J8B){var E0z=g5X;E0z+=O5X;E0z+=u87;E0z+=H2X;var A0z=G67;A0z+=q5X;A0z+=Q6B;A0z+=O77;var G0z=L47;G0z+=E47;G0z+=z17;G0z+=E47;var p0z=u87;p0z+=X5X;p0z+=E47;p0z+=Y5X;that[q0B](fieldName)[b5X]();delete fields[fieldName];var orderIdx=$[p0z](fieldName,this[a9V.o87][G0z]);this[a9V.o87][M2X][C2X](orderIdx,s57);var includeIdx=$[A0z](fieldName,this[a9V.o87][E0z]);if(includeIdx!==-s57){this[a9V.o87][z5X][C2X](includeIdx,s57);}}else{$[O8B](this[i5X](fieldName),function(i,name){that[h5X](name);});}return this;};Editor[U0z][J0z]=function(){var p5X="_c";var D0z=p5X;D0z+=G7B;this[D0z](m0B);return this;};Editor[F9B][G5X]=function(arg1,arg2,arg3,arg4){var H8X="maybeOpen";var L8X="_assembleMain";var Q5X='initCreate';var R5X="tid";var F5X="numb";var E5X="Op";var A5X="_form";var I2z=A5X;I2z+=E5X;I2z+=m4B;I2z+=L5X;var n2z=s67;n2z+=U5X;n2z+=a9V.W57;var u0z=a9V.K57;u0z+=a9V.V57;u0z+=W1B;var x0z=J5X;x0z+=i47;x0z+=a9V.V57;x0z+=a6B;var t0z=H3B;t0z+=a9V.o87;t0z+=g87;t0z+=R1B;var V0z=a9V.x57;V0z+=L47;V0z+=a9V.t57;var W0z=D5X;W0z+=R77;var l0z=U8B;l0z+=m4B;l0z+=G9B;var R0z=F5X;R0z+=a9V.K57;R0z+=E47;var F0z=s67;F0z+=R5X;F0z+=O77;var that=this;var fields=this[a9V.o87][v2X];var count=s57;if(this[F0z](function(){that[G5X](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1===R0z){count=arg1;arg1=arg2;arg2=arg3;}this[a9V.o87][K5X]={};for(var i=v57;i<count;i++){var K0z=a9V.B87;K0z+=c17;K0z+=i47;K0z+=l5X;this[a9V.o87][K5X][i]={fields:this[a9V.o87][K0z]};}var argOpts=this[W5X](arg1,arg2,arg3,arg4);this[a9V.o87][C77]=V5X;this[a9V.o87][l0z]=W0z;this[a9V.o87][t5X]=o9B;this[V0z][v77][P3X][t0z]=C4B;this[x0z]();this[o2X](this[v2X]());$[u0z](fields,function(name,field){var x5X="Reset";var H2z=a9V.x57;H2z+=a9V.K57;H2z+=a9V.B87;var Q0z=z9B;Q0z+=u87;Q0z+=x5X;field[Q0z]();for(var i=v57;i<count;i++){var L2z=a9V.x57;L2z+=a9V.K57;L2z+=a9V.B87;field[e2X](i,field[L2z]());}field[u5X](field[H2z]());});this[n2z](Q5X);this[L8X]();this[I2z](argOpts[R9B]);argOpts[H8X]();return this;};Editor[F9B][e2z]=function(parent,url,opts){var e8X="pendent";var I8X="ST";var n8X="PO";var B2z=L47;B2z+=a9V.d87;var S2z=P3B;S2z+=R77;S2z+=a9V.d87;S2z+=a9V.x57;var M2z=a9V.I87;M2z+=a9V.o87;M2z+=L47;M2z+=a9V.d87;var P2z=n8X;P2z+=I8X;if($[t8B](parent)){var v2z=X9X;v2z+=g17;v2z+=u8B;for(var i=v57,ien=parent[v2z];i<ien;i++){var s2z=a9V.x57;s2z+=a9V.K57;s2z+=e8X;this[s2z](parent[i],url,opts);}return this;}var that=this;var field=this[q0B](parent);var ajaxOpts={type:P2z,dataType:M2z};opts=$[S2z]({event:v8X,data:o9B,preUpdate:o9B,postUpdate:o9B},opts);var update=function(json){var f8X="pdate";var r8X="postU";var j8X="postUpdate";var m8X='error';var o8X='message';var C8X='val';var S8X='update';var M8X="preUpdate";var P8X="eUpdate";var s8X="sho";var r2z=a9V.x57;r2z+=e8B;r2z+=m5B;r2z+=V3B;var j2z=s8X;j2z+=x77;var y2z=T17;y2z+=Z17;var o2z=a9V.K57;o2z+=U8B;o2z+=T17;var C2z=n67;C2z+=P8X;if(opts[C2z]){opts[M8X](json);}$[o2z]({labels:B9B,options:S8X,values:C8X,messages:o8X,errors:m8X},function(jsonProp,fieldFn){if(json[jsonProp]){var m2z=y8X;m2z+=T17;$[m2z](json[jsonProp],function(field,val){that[q0B](field)[fieldFn](val);});}});$[O8B]([y2z,j2z,a5B,r2z],function(i,key){if(json[key]){that[key](json[key]);}});if(opts[j8X]){var f2z=r8X;f2z+=f8X;opts[f2z](json);}};$(field[B8X]())[B2z](opts[d8X],function(e){var a8X="ues";var T2z=j47;T2z+=a9V.V57;T2z+=i47;var k2z=d8B;k2z+=a8X;var w2z=E47;w2z+=L47;w2z+=x77;var N2z=a9V.x57;N2z+=a9V.V57;N2z+=a9V.W57;N2z+=a9V.V57;var c2z=a9V.W57;c2z+=c8X;c2z+=g17;c2z+=e4B;var a2z=L0B;a2z+=z7B;var d2z=a9V.d87;d2z+=L47;d2z+=a9V.x57;d2z+=a9V.K57;if($(field[d2z]())[a2z](e[c2z])[o0B]===v57){return;}var data={};data[N8X]=that[a9V.o87][K5X]?_pluck(that[a9V.o87][K5X],N2z):o9B;data[w2z]=data[N8X]?data[N8X][v57]:o9B;data[k2z]=that[T2z]();if(opts[A2B]){var Z2z=a9V.x57;Z2z+=a9V.V57;Z2z+=a9V.W57;Z2z+=a9V.V57;var ret=opts[Z2z](data);if(ret){opts[A2B]=ret;}}if(typeof url===a9V.Q57){var g2z=X9B;g2z+=i47;var o=url(field[g2z](),data,update);if(o){update(o);}}else{var q2z=w8X;q2z+=a9V.K57;q2z+=a9V.d87;q2z+=a9V.x57;if($[g8B](url)){var O2z=a9V.K57;O2z+=K87;O2z+=k8X;O2z+=a9V.x57;$[O2z](ajaxOpts,url);}else{ajaxOpts[T8X]=url;}$[Z8X]($[q2z](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[F9B][X2z]=function(){var i8X='.dte';var z8X="roy";var b8X="dest";var X8X="troller";var q8X="yCo";var O8X="troy";var g8X="des";var z2z=g8X;z2z+=O8X;var b2z=Q8B;b2z+=q8X;b2z+=a9V.d87;b2z+=X8X;var Y2z=Q8B;Y2z+=Y8X;if(this[a9V.o87][Y2z]){this[S6B]();}this[h5X]();var controller=this[a9V.o87][b2z];if(controller[z2z]){var i2z=b8X;i2z+=z8X;controller[i2z](this);}$(document)[W7B](i8X+this[a9V.o87][h8X]);this[w9B]=o9B;this[a9V.o87]=o9B;};Editor[h2z][p8X]=function(name){var p2z=y8X;p2z+=T17;var that=this;$[p2z](this[i5X](name),function(i,n){var G2z=a9V.B87;G2z+=u87;G2z+=a9V.K57;G2z+=T2B;that[G2z](n)[p8X]();});return this;};Editor[F9B][M8B]=function(show){var E2z=p17;E2z+=L47;E2z+=a9V.o87;E2z+=a9V.K57;if(show===undefined){var A2z=a9V.x57;A2z+=G8X;A2z+=Y8X;return this[a9V.o87][A2z];}return this[show?A8X:E2z]();};Editor[F9B][E8X]=function(){var U2z=L0B;U2z+=L3B;U2z+=a9V.o87;return $[U8X](this[a9V.o87][U2z],function(field,name){return field[E8X]()?name:o9B;});};Editor[F9B][J2z]=function(){return this[a9V.o87][J8X][B8X](this);};Editor[D2z][v17]=function(items,arg1,arg2,arg3,arg4){var W8X="tidy";var l8X="Main";var K8X="emb";var F8X="eOpen";var D8X="ayb";var V2z=a9V.t57;V2z+=D8X;V2z+=F8X;var W2z=L47;W2z+=g87;W2z+=a9V.W57;W2z+=a9V.o87;var l2z=R8X;l2z+=K8X;l2z+=V3B;l2z+=l8X;var K2z=a9V.B87;K2z+=p47;K2z+=a9V.x57;K2z+=a9V.o87;var F2z=s67;F2z+=W8X;var that=this;if(this[F2z](function(){var R2z=a9V.K57;R2z+=a9V.x57;R2z+=T67;that[R2z](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[W5X](arg1,arg2,arg3,arg4);this[n9X](items,this[V8X](K2z,items),V5X,argOpts[R9B]);this[l2z]();this[I9X](argOpts[W2z]);argOpts[V2z]();return this;};Editor[F9B][t2z]=function(name){var that=this;$[O8B](this[i5X](name),function(i,n){var t8X="enable";that[q0B](n)[t8X]();});return this;};Editor[F9B][x2z]=function(name,msg){var u8X="mEr";if(msg===undefined){var Q2z=x8X;Q2z+=u8X;Q2z+=E47;Q2z+=U47;var u2z=a9V.x57;u2z+=L47;u2z+=a9V.t57;this[Q8X](this[u2z][Q2z],name);}else{this[q0B](name)[V5B](msg);}return this;};Editor[L9z][H9z]=function(name){var L4X='Unknown field name - ';var n9z=L0B;n9z+=F77;n9z+=a9V.x57;n9z+=a9V.o87;var fields=this[a9V.o87][n9z];if(!fields[name]){throw L4X+name;}return fields[name];};Editor[F9B][v2X]=function(){return $[U8X](this[a9V.o87][v2X],function(field,name){return name;});};Editor[F9B][I9z]=_api_file;Editor[F9B][H4X]=_api_files;Editor[e9z][v9z]=function(name){var s9z=n4X;s9z+=E47;s9z+=Q6B;s9z+=O77;var that=this;if(!name){name=this[v2X]();}if($[s9z](name)){var P9z=I4X;P9z+=W1B;var out={};$[P9z](name,function(i,n){var M9z=g17;M9z+=a9V.K57;M9z+=a9V.W57;out[n]=that[q0B](n)[M9z]();});return out;}return this[q0B](name)[G9X]();};Editor[S9z][C9z]=function(names,animate){var v4X="Names";var e4X="_field";var m9z=e4X;m9z+=v4X;var o9z=I4X;o9z+=W1B;var that=this;$[o9z](this[m9z](names),function(i,n){that[q0B](n)[y7B](animate);});return this;};Editor[F9B][s4X]=function(inNames){var C4X=':not(:empty)';var M4X="formEr";var r9z=P4X;r9z+=T17;var j9z=u87;j9z+=a9V.o87;var y9z=M4X;y9z+=M67;var formError=$(this[w9B][y9z]);if(formError[e8B](S4X)&&formError[j9z](C4X)){return r0B;}var names=this[i5X](inNames);for(var i=v57,ien=names[r9z];i<ien;i++){if(this[q0B](names[i])[s4X]()){return r0B;}}return m0B;};Editor[f9z][B9z]=function(cell,fieldName,opts){var Q4X="ton";var u4X="but";var l4X='inline';var E4X="inline";var A4X="ormOption";var p4X="dataSou";var h4X="nl";var i4X="TE_Field";var b4X="Optio";var Y4X="_fo";var X4X="preop";var q4X="inl";var g4X="nte";var k4X="ng_Indicator\"><span/></div>";var w4X="E_Processi";var N4X="ss=\"DT";var c4X="iv";var d4X="tons";var j4X="rep";var y4X="formE";var s5z=G67;s5z+=B0B;s5z+=a9V.d87;s5z+=a9V.K57;var v5z=o4X;v5z+=a9V.o87;var W9z=m4X;W9z+=G9B;W9z+=a9V.o87;var l9z=y4X;l9z+=g47;var K9z=a9V.x57;K9z+=L47;K9z+=a9V.t57;var R9z=a9V.d87;R9z+=L47;R9z+=a9V.x57;R9z+=a9V.K57;var F9z=a9V.V57;F9z+=H3X;F9z+=a9V.x57;var D9z=j4X;D9z+=m17;D9z+=a9V.l57;D9z+=a9V.K57;var J9z=B0B;J9z+=r4X;var U9z=a9V.x57;U9z+=f4X;var E9z=W4B;E9z+=G2X;var A9z=D17;A9z+=B4X;A9z+=d4X;var G9z=L7B;G9z+=a4X;G9z+=c4X;G9z+=Y0B;var p9z=h2X;p9z+=N4X;p9z+=w4X;p9z+=k4X;var h9z=i47;h9z+=u87;h9z+=r4X;var i9z=q6B;i9z+=l7B;var z9z=a9V.x57;z9z+=a9V.K57;z9z+=T4X;z9z+=T17;var b9z=Z4X;b9z+=g4X;b9z+=O4X;var Y9z=q4X;Y9z+=u87;Y9z+=a9V.d87;Y9z+=a9V.K57;var X9z=s67;X9z+=X4X;X9z+=a9V.K57;X9z+=a9V.d87;var q9z=Y4X;q9z+=g0X;q9z+=b4X;q9z+=M77;var O9z=T0B;O9z+=u2B;O9z+=O77;var g9z=V3B;g9z+=y77;g9z+=u8B;var Z9z=z4X;Z9z+=i4X;var N9z=u87;N9z+=h4X;N9z+=u87;N9z+=k17;var c9z=p17;c9z+=a9V.V57;c9z+=x9B;var a9z=s67;a9z+=p4X;a9z+=G4X;var d9z=a9V.B87;d9z+=A4X;d9z+=a9V.o87;var that=this;if($[g8B](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[r9B]({},this[a9V.o87][d9z][E4X],opts);var editFields=this[a9z](H9X,cell,fieldName);var node,field;var countOuter=v57,countInner;var closed=m0B;var classes=this[c9z][N9z];$[O8B](editFields,function(i,editField){var F4X="inline at a time";var D4X="than one row ";var J4X="Cannot edit more ";var U4X="yFields";var T9z=Q8B;T9z+=U4X;var k9z=I4X;k9z+=W1B;if(countOuter>v57){var w9z=J4X;w9z+=D4X;w9z+=F4X;throw w9z;}node=$(editField[R4X][v57]);countInner=v57;$[k9z](editField[T9z],function(j,f){var K4X='Cannot edit more than one field inline at a time';if(countInner>v57){throw K4X;}field=f;countInner++;});countOuter++;});if($(Z9z,node)[g9z]){return this;}if(this[O9z](function(){that[E4X](cell,fieldName,opts);})){return this;}this[n9X](cell,editFields,l4X,opts);var namespace=this[q9z](opts);var ret=this[X9z](Y9z);if(!ret){return this;}var children=node[b9z]()[z9z]();node[i9z]($(W2B+classes[j7B]+Q2B+W2B+classes[h9z]+Q2B+p9z+G9z+W2B+classes[A9z]+W4X+E9z));node[V4X](U9z+classes[J9z][D9z](/ /g,t4X))[F9z](field[R9z]())[o7B](this[K9z][l9z]);if(opts[W9z]){var x9z=a9V.x57;x9z+=L47;x9z+=a9V.t57;var t9z=j4X;t9z+=i47;t9z+=x4X;var V9z=u4X;V9z+=Q4X;V9z+=a9V.o87;node[V4X](L7X+classes[V9z][t9z](/ /g,t4X))[o7B](this[x9z][c9X]);}this[N9X](function(submitComplete){var u9z=L47;u9z+=a9V.B87;u9z+=a9V.B87;closed=r0B;$(document)[u9z](b9B+namespace);if(!submitComplete){var Q9z=r5B;Q9z+=a9V.W57;Q9z+=h17;Q9z+=a9V.o87;node[Q9z]()[k1B]();node[o7B](children);}that[H7X]();});setTimeout(function(){var L5z=L47;L5z+=a9V.d87;if(closed){return;}$(document)[L5z](b9B+namespace,function(e){var P7X='owns';var s7X='addBack';var e7X="elf";var I7X="_type";var e5z=d4B;e5z+=n7X;e5z+=a9V.W57;var I5z=I7X;I5z+=Z0B;var n5z=U7B;n5z+=a9V.x57;n5z+=B77;n5z+=e7X;var H5z=a9V.B87;H5z+=a9V.d87;var back=$[H5z][v7X]?s7X:n5z;if(!field[I5z](P7X,e[e5z])&&$[S2X](node[v57],$(e[c6B])[P5B]()[back]())===-s57){that[c2X]();}});},v57);this[M7X]([field],opts[v5z]);this[q9X](s5z);return this;};Editor[P5z][S7X]=function(name,msg){var C7X="mes";if(msg===undefined){this[Q8X](this[w9B][B9X],name);}else{var M5z=C7X;M5z+=y8B;this[q0B](name)[M5z](msg);}return this;};Editor[F9B][S5z]=function(mode){var j7X=" an editing mode";var y7X="Not currently in";var m5z=a9V.V57;m5z+=o7X;m5z+=a9V.d87;if(!mode){var C5z=U8B;C5z+=a9V.W57;C5z+=m7X;return this[a9V.o87][C5z];}if(!this[a9V.o87][p0X]){var o5z=y7X;o5z+=j7X;throw o5z;}this[a9V.o87][m5z]=mode;return this;};Editor[y5z][j5z]=function(){var r7X="odifier";var r5z=a9V.t57;r5z+=r7X;return this[a9V.o87][r5z];};Editor[F9B][f5z]=function(fieldNames){var B7X="multiGet";var f7X="isAr";var d5z=f7X;d5z+=Q6B;d5z+=O77;var that=this;if(fieldNames===undefined){var B5z=k2B;B5z+=T2B;B5z+=a9V.o87;fieldNames=this[B5z]();}if($[d5z](fieldNames)){var out={};$[O8B](fieldNames,function(i,name){var a5z=a9V.B87;a5z+=p47;a5z+=a9V.x57;out[name]=that[a5z](name)[B7X]();});return out;}return this[q0B](fieldNames)[B7X]();};Editor[F9B][e2X]=function(fieldNames,val){var a7X="inObject";var d7X="isPla";var c5z=d7X;c5z+=a7X;var that=this;if($[c5z](fieldNames)&&val===undefined){var N5z=a9V.K57;N5z+=a9V.V57;N5z+=a9V.l57;N5z+=T17;$[N5z](fieldNames,function(name,value){var c7X="Set";var k5z=W0B;k5z+=c7X;var w5z=a9V.B87;w5z+=u87;w5z+=a9V.K57;w5z+=T2B;that[w5z](name)[k5z](value);});}else{var T5z=a9V.B87;T5z+=u87;T5z+=F77;T5z+=a9V.x57;this[T5z](fieldNames)[e2X](val);}return this;};Editor[F9B][Z5z]=function(name){var w7X="ord";var X5z=L0B;X5z+=a9V.K57;X5z+=i47;X5z+=a9V.x57;var q5z=n0X;q5z+=g87;var O5z=e8B;O5z+=N7X;var that=this;if(!name){var g5z=w7X;g5z+=a9V.K57;g5z+=E47;name=this[g5z]();}return $[O5z](name)?$[q5z](name,function(n){return that[q0B](n)[B8X]();}):this[X5z](name)[B8X]();};Editor[Y5z][b5z]=function(name,fn){var T7X="tName";var z5z=k7X;z5z+=T7X;$(this)[W7B](this[z5z](name),fn);return this;};Editor[F9B][G9B]=function(name,fn){var Z7X="entN";var i5z=w67;i5z+=Z7X;i5z+=g7X;i5z+=a9V.K57;$(this)[G9B](this[i5z](name),fn);return this;};Editor[F9B][h5z]=function(name,fn){var O7X="_eventNam";var p5z=O7X;p5z+=a9V.K57;$(this)[q7X](this[p5z](name),fn);return this;};Editor[F9B][X7X]=function(){var h7X="eo";var i7X="_pr";var z7X="ain";var b7X="ditOpts";var Y7X="_post";var R5z=a9V.t57;R5z+=a9V.V57;R5z+=G67;var F5z=Y7X;F5z+=X7X;var D5z=a9V.K57;D5z+=b7X;var J5z=a9V.t57;J5z+=A9B;var U5z=a9V.t57;U5z+=z7X;var E5z=i7X;E5z+=h7X;E5z+=p7X;var that=this;this[o2X]();this[N9X](function(submitComplete){var A7X="ler";var G7X="isplayControl";var A5z=p17;A5z+=G17;A5z+=a9V.K57;var G5z=a9V.x57;G5z+=G7X;G5z+=A7X;that[a9V.o87][G5z][A5z](that,function(){that[H7X]();});});var ret=this[E5z](U5z);if(!ret){return this;}this[a9V.o87][J8X][X7X](this,this[w9B][j7B]);this[M7X]($[J5z](this[a9V.o87][M2X],function(name){return that[a9V.o87][v2X][name];}),this[a9V.o87][D5z][L8B]);this[F5z](R5z);return this;};Editor[K5z][l5z]=function(set){var W7X="All fields, and no additional fields, must be provided for ordering.";var R7X="sort";var F7X="sl";var D7X="ort";var H8z=L47;H8z+=E47;H8z+=E7X;var L8z=a9V.K57;L8z+=U7X;L8z+=a9V.K57;L8z+=z7B;var Q5z=J7X;Q5z+=u87;Q5z+=a9V.d87;var u5z=a9V.o87;u5z+=D7X;var x5z=a9V.o87;x5z+=i47;x5z+=o3X;x5z+=a9V.K57;var t5z=F7X;t5z+=o3X;t5z+=a9V.K57;var V5z=U47;V5z+=a9V.x57;V5z+=R47;if(!set){var W5z=L47;W5z+=f17;W5z+=a9V.K57;W5z+=E47;return this[a9V.o87][W5z];}if(arguments[o0B]&&!$[t8B](set)){set=Array[F9B][A4B][D9B](arguments);}if(this[a9V.o87][V5z][t5z]()[R7X]()[K7X](l7X)!==set[x5z]()[u5z]()[Q5z](l7X)){throw W7X;}$[L8z](this[a9V.o87][H8z],set);this[o2X]();return this;};Editor[F9B][n8z]=function(items,arg1,arg2,arg3,arg4){var m6X='data';var o6X='initRemove';var S6X='fields';var M6X="_dataSo";var P6X="difi";var s6X="tField";var v6X="tyle";var H6X="initMultiRe";var L6X="mbleMain";var Q7X="_formOption";var u7X="beOpen";var x7X="may";var d8z=V7X;d8z+=t7X;var B8z=x7X;B8z+=u7X;var f8z=L47;f8z+=g87;f8z+=a9V.W57;f8z+=a9V.o87;var r8z=Q7X;r8z+=a9V.o87;var j8z=R8X;j8z+=a9V.K57;j8z+=L6X;var y8z=H6X;y8z+=n6X;y8z+=I6X;var m8z=k67;m8z+=j47;m8z+=a9V.j87;m8z+=a9V.W57;var o8z=a9V.d87;o8z+=L47;o8z+=a9V.x57;o8z+=a9V.K57;var C8z=J5X;C8z+=e6X;var S8z=a9V.o87;S8z+=v6X;var M8z=q87;M8z+=s6X;M8z+=a9V.o87;var P8z=n6X;P8z+=P6X;P8z+=R47;var s8z=j17;s8z+=L47;s8z+=I6X;var v8z=M6X;v8z+=v0B;v8z+=G4X;var e8z=i47;e8z+=a9V.j87;e8z+=P0B;e8z+=T17;var I8z=T0B;I8z+=u87;I8z+=Q7B;var that=this;if(this[I8z](function(){that[f1B](items,arg1,arg2,arg3,arg4);})){return this;}if(items[e8z]===undefined){items=[items];}var argOpts=this[W5X](arg1,arg2,arg3,arg4);var editFields=this[v8z](S6X,items);this[a9V.o87][p0X]=s8z;this[a9V.o87][P8z]=items;this[a9V.o87][M8z]=editFields;this[w9B][v77][S8z][M8B]=S5B;this[C8z]();this[C6X](o6X,[_pluck(editFields,o8z),_pluck(editFields,m6X),items]);this[m8z](y8z,[editFields,items]);this[j8z]();this[r8z](argOpts[f8z]);argOpts[B8z]();var opts=this[a9V.o87][d8z];if(opts[L8B]!==o9B){var N8z=U5B;N8z+=a9V.l57;N8z+=v0B;N8z+=a9V.o87;var c8z=a9V.x57;c8z+=L47;c8z+=a9V.t57;var a8z=m4X;a8z+=L47;a8z+=a9V.d87;$(a8z,this[c8z][c9X])[j9X](opts[N8z])[L8B]();}return this;};Editor[w8z][u5X]=function(set,val){var j6X="ainObjec";var y6X="Pl";var k8z=e8B;k8z+=y6X;k8z+=j6X;k8z+=a9V.W57;var that=this;if(!$[k8z](set)){var o={};o[set]=val;set=o;}$[O8B](set,function(n,v){that[q0B](n)[u5X](v);});return this;};Editor[T8z][l1B]=function(names,animate){var that=this;$[O8B](this[i5X](names),function(i,n){var g8z=a9V.o87;g8z+=T17;g8z+=L47;g8z+=x77;var Z8z=L0B;Z8z+=F77;Z8z+=a9V.x57;that[Z8z](n)[g8z](animate);});return this;};Editor[O8z][N2X]=function(successCallback,errorCallback,formatdata,hide){var r6X="process";var b8z=R47;b8z+=E47;b8z+=U47;var X8z=s67;X8z+=r6X;X8z+=C3B;var q8z=x9X;q8z+=G9B;var that=this,fields=this[a9V.o87][v2X],errorFields=[],errorReady=v57,sent=m0B;if(this[a9V.o87][f6X]||!this[a9V.o87][q8z]){return this;}this[X8z](r0B);var send=function(){var Y8z=i47;Y8z+=a9V.K57;Y8z+=B6X;Y8z+=T17;if(errorFields[Y8z]!==errorReady||sent){return;}sent=r0B;that[d6X](successCallback,errorCallback,formatdata,hide);};this[b8z]();$[O8B](fields,function(name,field){if(field[s4X]()){errorFields[Z8B](name);}});$[O8B](errorFields,function(i,name){fields[name][V5B](i3B,function(){errorReady++;send();});});send();return this;};Editor[F9B][z8z]=function(set){if(set===undefined){return this[a9V.o87][a6X];}this[a9V.o87][a6X]=$(set);return this;};Editor[i8z][d9X]=function(title){var Z6X="Api";var T6X="ldren";var k6X="v.";var w6X="hea";var c6X="nction";var E8z=h9B;E8z+=c6X;var A8z=a9V.l57;A8z+=L47;A8z+=N6X;var G8z=w6X;G8z+=z17;G8z+=E47;var p8z=H3B;p8z+=k6X;var h8z=a9V.l57;h8z+=t1B;h8z+=T6X;var header=$(this[w9B][a9X])[h8z](p8z+this[L2X][G8z][A8z]);if(title===undefined){return header[o8B]();}if(typeof title===E8z){title=title(this,new DataTable[Z6X](this[a9V.o87][Y0X]));}header[o8B](title);return this;};Editor[F9B][d8B]=function(field,value){if(value!==undefined||$[g8B](field)){var U8z=a9V.o87;U8z+=a9V.K57;U8z+=a9V.W57;return this[U8z](field,value);}return this[G9X](field);};var apiRegister=DataTable[J8z][D8z];function __getInst(api){var X6X="_editor";var q6X="oInit";var O6X="onte";var g6X="ditor";var R8z=a9V.K57;R8z+=g6X;var F8z=a9V.l57;F8z+=O6X;F8z+=U7X;var ctx=api[F8z][v57];return ctx[q6X][R8z]||ctx[X6X];}function __setBasic(inst,opts,type,plural){var p6X='1';var h6X=/%d/;var b6X="asic";var t8z=j2B;t8z+=q5B;t8z+=g17;t8z+=a9V.K57;var l8z=a9V.W57;l8z+=u87;l8z+=Y6X;if(!opts){opts={};}if(opts[c9X]===undefined){var K8z=j77;K8z+=b6X;opts[c9X]=K8z;}if(opts[l8z]===undefined){var V8z=u87;V8z+=w87;V8z+=u9X;V8z+=a9V.d87;var W8z=L2B;W8z+=a9V.K57;opts[W8z]=inst[V8z][type][d9X];}if(opts[t8z]===undefined){var x8z=E47;x8z+=z6X;x8z+=L47;x8z+=I6X;if(type===x8z){var u8z=G8B;u8z+=E8B;u8z+=a9V.V57;u8z+=A87;var confirm=inst[X2B][type][i6X];opts[S7X]=plural!==s57?confirm[s67][u8z](h6X,plural):confirm[p6X];}else{var Q8z=G0B;Q8z+=A0B;opts[Q8z]=i3B;}}return opts;}apiRegister(L4z,function(){return __getInst(this);});apiRegister(G6X,function(opts){var inst=__getInst(this);inst[G5X](__setBasic(inst,opts,C9B));return this;});apiRegister(A6X,function(opts){var inst=__getInst(this);inst[v17](this[v57][v57],__setBasic(inst,opts,E6X));return this;});apiRegister(U6X,function(opts){var inst=__getInst(this);inst[v17](this[v57],__setBasic(inst,opts,E6X));return this;});apiRegister(H4z,function(opts){var J6X="emo";var I4z=E47;I4z+=J6X;I4z+=j47;I4z+=a9V.K57;var n4z=G8B;n4z+=n6X;n4z+=j47;n4z+=a9V.K57;var inst=__getInst(this);inst[n4z](this[v57][v57],__setBasic(inst,opts,I4z,s57));return this;});apiRegister(e4z,function(opts){var v4z=i47;v4z+=a9V.K57;v4z+=y77;v4z+=u8B;var inst=__getInst(this);inst[f1B](this[v57],__setBasic(inst,opts,D6X,this[v57][v4z]));return this;});apiRegister(F6X,function(type,opts){var l6X="ine";var K6X="Object";var R6X="isPlain";var P4z=R6X;P4z+=K6X;if(!type){var s4z=u87;s4z+=a9V.d87;s4z+=i47;s4z+=l6X;type=s4z;}else if($[P4z](type)){var M4z=G67;M4z+=B0B;M4z+=k17;opts=type;type=M4z;}__getInst(this)[type](this[v57][v57],opts);return this;});apiRegister(S4z,function(opts){var W6X="ubbl";var C4z=D17;C4z+=W6X;C4z+=a9V.K57;__getInst(this)[C4z](this[v57],opts);return this;});apiRegister(V6X,_api_file);apiRegister(o4z,_api_files);$(document)[G9B](m4z,function(e,ctx,json){var t6X="amesp";var j4z=a9V.x57;j4z+=a9V.W57;var y4z=a9V.d87;y4z+=t6X;y4z+=a9V.V57;y4z+=A87;if(e[y4z]!==j4z){return;}if(json&&json[H4X]){var r4z=a9V.K57;r4z+=a9V.V57;r4z+=a9V.l57;r4z+=T17;$[r4z](json[H4X],function(name,files){Editor[H4X][name]=files;});}});Editor[V5B]=function(msg,tn){var Q6X="fer to https://datatables.net/tn/";var u6X=" information, please re";var x6X=" For more";var f4z=x6X;f4z+=u6X;f4z+=Q6X;throw tn?msg+f4z+tn:msg;};Editor[B4z]=function(data,props,fn){var n1X="lab";var H1X="rra";var L1X="sA";var a4z=u87;a4z+=L1X;a4z+=H1X;a4z+=O77;var d4z=n1X;d4z+=F77;var i,ien,dataPoint;props=$[r9B]({label:d4z,value:I1X},props);if($[a4z](data)){for(i=v57,ien=data[o0B];i<ien;i++){dataPoint=data[i];if($[g8B](dataPoint)){var w4z=a9V.V57;w4z+=a9V.W57;w4z+=e1X;var N4z=X9B;N4z+=v1X;var c4z=d8B;c4z+=w8B;fn(dataPoint[props[c4z]]===undefined?dataPoint[props[f5X]]:dataPoint[props[N4z]],dataPoint[props[f5X]],i,dataPoint[w4z]);}else{fn(dataPoint,dataPoint,i);}}}else{var k4z=I4X;k4z+=W1B;i=v57;$[k4z](data,function(key,val){fn(val,key,i);i++;});}};Editor[s1X]=function(id){return id[D8B](/\./g,l7X);};Editor[T4z]=function(editor,conf,files,progressCallback,completeCallback){var C3O="readAsDataURL";var f1X="g the file";var r1X="le upload";var j1X="A server error occurred whi";var y1X="eadT";var m1X="fileR";var o1X="ng file</i>";var C1X=">Uploadi";var P1X="onl";var q4z=P1X;q4z+=M1X;var O4z=S1X;O4z+=C1X;O4z+=o1X;var g4z=m1X;g4z+=y1X;g4z+=P3B;g4z+=a9V.W57;var Z4z=a9V.K57;Z4z+=E47;Z4z+=E47;Z4z+=U47;var reader=new FileReader();var counter=v57;var ids=[];var generalError=j1X;generalError+=r1X;generalError+=G67;generalError+=f1X;editor[Z4z](conf[h2B],i3B);progressCallback(conf,conf[g4z]||O4z);reader[q4z]=function(e){var U1X='post';var A1X="ataURL";var G1X="readAsD";var p1X='preUpload';var i1X="for upload plug-";var z1X="ption specified ";var b1X="No Ajax o";var Y1X="uplo";var q1X="ajaxData";var O1X='upload';var g1X='action';var Z1X="ploadFie";var k1X="bject";var w1X="isPlainO";var N1X="ring";var a1X=".DTE_Upl";var d1X="preSubmit";var B1X="js";var H7z=B1X;H7z+=L47;H7z+=a9V.d87;var L7z=a9V.V57;L7z+=A67;L7z+=K87;var Q4z=d1X;Q4z+=a1X;Q4z+=L47;Q4z+=c1X;var V4z=a9V.d87;V4z+=g7X;V4z+=a9V.K57;var F4z=a9V.o87;F4z+=a9V.W57;F4z+=N1X;var G4z=w1X;G4z+=k1X;var h4z=T1X;h4z+=a9V.V57;h4z+=K87;var i4z=A9B;i4z+=J87;i4z+=a9V.d87;i4z+=a9V.x57;var z4z=a9V.d87;z4z+=a9V.V57;z4z+=a9V.t57;z4z+=a9V.K57;var b4z=v0B;b4z+=Z1X;b4z+=T2B;var Y4z=A9B;Y4z+=g87;Y4z+=a9V.j87;Y4z+=a9V.x57;var X4z=H5X;X4z+=a9V.d87;X4z+=a9V.x57;var data=new FormData();var ajax;data[X4z](g1X,O1X);data[Y4z](b4z,conf[z4z]);data[i4z](O1X,files[counter]);if(conf[q1X]){conf[q1X](data);}if(conf[h4z]){var p4z=a9V.V57;p4z+=a9V.I87;p4z+=a9V.V57;p4z+=K87;ajax=conf[p4z];}else if($[G4z](editor[a9V.o87][Z8X])){var D4z=T1X;D4z+=a9V.V57;D4z+=K87;var J4z=X1X;J4z+=L47;J4z+=a9V.V57;J4z+=a9V.x57;var U4z=a9V.V57;U4z+=a9V.I87;U4z+=a9V.V57;U4z+=K87;var E4z=Y1X;E4z+=c1X;var A4z=a9V.V57;A4z+=A67;A4z+=K87;ajax=editor[a9V.o87][A4z][E4z]?editor[a9V.o87][U4z][J4z]:editor[a9V.o87][D4z];}else if(typeof editor[a9V.o87][Z8X]===F4z){ajax=editor[a9V.o87][Z8X];}if(!ajax){var R4z=b1X;R4z+=z1X;R4z+=i1X;R4z+=G67;throw R4z;}if(typeof ajax===J8B){ajax={url:ajax};}if(typeof ajax[A2B]===a9V.Q57){var W4z=I4X;W4z+=W1B;var l4z=h1X;l4z+=C3B;var K4z=a9V.x57;K4z+=a9V.V57;K4z+=d4B;var d={};var ret=ajax[K4z](d);if(ret!==undefined&&typeof ret!==l4z){d=ret;}$[W4z](d,function(key,value){data[o7B](key,value);});}var preRet=editor[C6X](p1X,[conf[V4z],files[counter],data]);if(preRet===m0B){var t4z=V3B;t4z+=B6X;t4z+=T17;if(counter<files[t4z]-s57){var x4z=G1X;x4z+=A1X;counter++;reader[x4z](files[counter]);}else{var u4z=E1X;u4z+=i47;completeCallback[u4z](editor,ids);}return;}var submit=m0B;editor[G9B](Q4z,function(){submit=r0B;return m0B;});$[L7z]($[r9B]({},ajax,{type:U1X,data:data,dataType:H7z,contentType:m0B,processData:m0B,xhr:function(){var K1X="onprogress";var R1X="ploa";var D1X="xhr";var J1X="ajaxSet";var n7z=J1X;n7z+=a9V.W57;n7z+=C3B;n7z+=a9V.o87;var xhr=$[n7z][D1X]();if(xhr[F1X]){var M7z=P1X;M7z+=M1X;M7z+=a9V.K57;M7z+=z7B;var P7z=v0B;P7z+=R1X;P7z+=a9V.x57;var I7z=Y1X;I7z+=c1X;xhr[I7z][K1X]=function(e){var L3O=':';var Q1X="%";var u1X="loaded";var V1X="oFi";var W1X="putable";var l1X="Com";var e7z=V3B;e7z+=f8B;e7z+=l1X;e7z+=W1X;if(e[e7z]){var s7z=a9V.W57;s7z+=V1X;s7z+=t1X;s7z+=a9V.x57;var v7z=a9V.W57;v7z+=L47;v7z+=a9V.W57;v7z+=x1X;var percent=(e[u1X]/e[v7z]*z57)[s7z](v57)+Q1X;progressCallback(conf,files[o0B]===s57?percent:counter+L3O+files[o0B]+V2B+percent);}};xhr[P7z][M7z]=function(e){var n3O='Processing';var H3O="ssingTex";var S7z=Q47;S7z+=H3O;S7z+=a9V.W57;progressCallback(conf,conf[S7z]||n3O);};}return xhr;},success:function(json){var o3O="ca";var s3O="ieldEr";var v3O='preSubmit.DTE_Upload';var e3O="uploadXhrSuc";var I3O="dErrors";var N7z=u87;N7z+=a9V.x57;var c7z=Y1X;c7z+=a9V.V57;c7z+=a9V.x57;var r7z=L0B;r7z+=a9V.K57;r7z+=i47;r7z+=I3O;var j7z=A5B;j7z+=a9V.o87;var y7z=a9V.d87;y7z+=a9V.V57;y7z+=j2B;var m7z=e3O;m7z+=A87;m7z+=a6B;var o7z=k7X;o7z+=a9V.W57;var C7z=L47;C7z+=u3X;editor[C7z](v3O);editor[o7z](m7z,[conf[y7z],json]);if(json[j7z]&&json[r7z][o0B]){var B7z=V3B;B7z+=y77;B7z+=u8B;var f7z=a9V.B87;f7z+=s3O;f7z+=B67;f7z+=P3O;var errors=json[f7z];for(var i=v57,ien=errors[B7z];i<ien;i++){var d7z=R47;d7z+=E47;d7z+=U47;editor[d7z](errors[i][h2B],errors[i][M3O]);}}else if(json[V5B]){var a7z=a9V.K57;a7z+=G5B;a7z+=U47;editor[a7z](json[V5B]);}else if(!json[c7z]||!json[F1X][N7z]){var w7z=a9V.K57;w7z+=z5B;w7z+=E47;editor[w7z](conf[h2B],generalError);}else{var Y7z=u87;Y7z+=a9V.x57;var X7z=Y1X;X7z+=a9V.V57;X7z+=a9V.x57;var q7z=g87;q7z+=l3B;q7z+=T17;var k7z=u3B;k7z+=Q3B;if(json[k7z]){var T7z=a9V.B87;T7z+=S3O;T7z+=a9V.K57;T7z+=a9V.o87;$[O8B](json[T7z],function(table,files){var O7z=a9V.B87;O7z+=S3O;O7z+=a9V.K57;O7z+=a9V.o87;var g7z=a9V.K57;g7z+=q2B;g7z+=z7B;var Z7z=L0B;Z7z+=i47;Z7z+=Q3B;if(!Editor[Z7z][table]){Editor[H4X][table]={};}$[g7z](Editor[O7z][table],files);});}ids[q7z](json[X7z][Y7z]);if(counter<files[o0B]-s57){counter++;reader[C3O](files[counter]);}else{var b7z=o3O;b7z+=i47;b7z+=i47;completeCallback[b7z](editor,ids);if(submit){var z7z=m3O;z7z+=a9V.t57;z7z+=T67;editor[z7z]();}}}progressCallback(conf);},error:function(xhr){var y3O='uploadXhrError';var i7z=X17;i7z+=a9V.t57;i7z+=a9V.K57;editor[C6X](y3O,[conf[i7z],xhr]);editor[V5B](conf[h2B],generalError);progressCallback(conf);}}));};reader[C3O](files[v57]);};Editor[F9B][h7z]=function(init){var h0O='initComplete';var X0O="init";var q0O="ntroller";var B0O="BUTTONS";var r0O="dataTabl";var y0O='<div data-dte-e="form_buttons" class="';var m0O='"/></div>';var o0O='"><div class="';var C0O="tag";var S0O='<form data-dte-e="form" class="';var M0O="footer";var P0O='<div data-dte-e="foot" class="';var s0O='<div data-dte-e="body" class="';var v0O='"><span/></div>';var e0O='<div data-dte-e="processing" class="';var L0O="mTa";var Q3O="dbTa";var u3O="axUrl";var x3O="domTab";var t3O="aSource";var V3O="ourc";var W3O="dataS";var l3O="cyAjax";var K3O="lega";var R3O="mpl";var D3O="ngs";var J3O="sett";var U3O="iq";var E3O="lasse";var A3O="indicato";var G3O="_content\" class=\"";var p3O="<div data-dte-e=\"body";var h3O="ote";var i3O="content\" class=\"";var z3O="<div data-dte-e=\"form_";var b3O="rm>";var Y3O="</f";var X3O="orm_";var q3O="<div data-dte-e=\"f";var g3O="=\"form_info\" class=\"";var Z3O="=\"head\" class=\"";var T3O="<div data-dte-e";var k3O="leTo";var w3O="Tab";var N3O="ormContent";var c3O="form_con";var a3O="dyConte";var d3O="t.dt";var B3O="init.d";var f3O="nique";var r3O=".dt.dte";var j3O="xh";var x6z=j3O;x6z+=E47;x6z+=r3O;var l6z=v0B;l6z+=f3O;var K6z=B3O;K6z+=d3O;K6z+=a9V.K57;var R6z=L47;R6z+=a9V.d87;var D6z=s3X;D6z+=J67;D6z+=N6X;var J6z=u7B;J6z+=a3O;J6z+=d7B;var U6z=D17;U6z+=L47;U6z+=a9V.x57;U6z+=O77;var E6z=a9V.B87;E6z+=L47;E6z+=L47;E6z+=a9V.W57;var A6z=U5B;A6z+=g0X;var G6z=c3O;G6z+=x47;var p6z=a9V.B87;p6z+=N3O;var h6z=a9V.x57;h6z+=L47;h6z+=a9V.t57;var Y6z=U5X;Y6z+=t7X;var N6z=w3O;N6z+=k3O;N6z+=L47;N6z+=o77;var c6z=A2B;c6z+=I77;c6z+=s3B;var a6z=a9V.B87;a6z+=L47;a6z+=E47;a6z+=a9V.t57;var d6z=T3O;d6z+=Z3O;var B6z=u87;B6z+=a9V.d87;B6z+=a9V.B87;B6z+=L47;var f6z=x8X;f6z+=a9V.t57;var r6z=T3O;r6z+=g3O;var j6z=O3O;j6z+=L47;j6z+=E47;var y6z=a9V.B87;y6z+=L47;y6z+=g0X;var m6z=q3O;m6z+=X3O;m6z+=K0B;var o6z=Y3O;o6z+=L47;o6z+=b3O;var C6z=z3O;C6z+=i3O;var S6z=U5B;S6z+=g0X;var M6z=V4B;M6z+=j47;M6z+=Y0B;var P6z=F3B;P6z+=Y0B;var s6z=a9V.B87;s6z+=L47;s6z+=h3O;s6z+=E47;var v6z=Z4X;v6z+=a9V.d87;v6z+=k8X;v6z+=a9V.W57;var e6z=p3O;e6z+=G3O;var I6z=F3B;I6z+=Y0B;var n6z=P1B;n6z+=J4B;n6z+=R47;var H6z=u7B;H6z+=Q7B;var L6z=A3O;L6z+=E47;var Q7z=a9V.x57;Q7z+=B5B;var u7z=a9V.l57;u7z+=E3O;u7z+=a9V.o87;var x7z=a0X;x7z+=U3O;x7z+=v0B;x7z+=a9V.K57;var t7z=J3O;t7z+=u87;t7z+=D3O;var V7z=u87;V7z+=w87;V7z+=F3O;var W7z=p17;W7z+=a9V.V57;W7z+=x9B;var l7z=R77;l7z+=R3O;l7z+=t77;var K7z=K3O;K7z+=l3O;var R7z=T17;R7z+=a9V.W57;R7z+=a9V.t57;R7z+=i47;var F7z=W3O;F7z+=V3O;F7z+=Q3B;var D7z=a9V.x57;D7z+=F87;D7z+=t3O;D7z+=a9V.o87;var J7z=x3O;J7z+=V3B;var U7z=T1X;U7z+=u3O;var E7z=Q3O;E7z+=D17;E7z+=i47;E7z+=a9V.K57;var A7z=a9V.W57;A7z+=m5B;A7z+=i47;A7z+=a9V.K57;var G7z=h5B;G7z+=L0O;G7z+=D17;G7z+=V3B;var p7z=H0O;p7z+=a9V.d87;p7z+=a9V.x57;init=$[r9B](r0B,{},Editor[n0O],init);this[a9V.o87]=$[p7z](r0B,{},Editor[f9B][i2B],{table:init[G7z]||init[A7z],dbTable:init[E7z]||o9B,ajaxUrl:init[U7z],ajax:init[Z8X],idSrc:init[I0O],dataSource:init[J7z]||init[Y0X]?Editor[D7z][X1B]:Editor[F7z][R7z],formOptions:init[R4B],legacyAjax:init[K7z],template:init[l7z]?$(init[a6X])[k1B]():o9B});this[L2X]=$[r9B](r0B,{},Editor[W7z]);this[V7z]=init[X2B];Editor[f9B][t7z][x7z]++;var that=this;var classes=this[u7z];this[Q7z]={"wrapper":$(W2B+classes[j7B]+Q2B+e0O+classes[f6X][L6z]+v0O+s0O+classes[H6z][n6z]+I6z+e6z+classes[s3X][v6z]+W4X+H9B+P0O+classes[s6z][j7B]+P6z+W2B+classes[M0O][S7B]+W4X+H9B+M6z)[v57],"form":$(S0O+classes[S6z][C0O]+Q2B+C6z+classes[v77][S7B]+W4X+o6z)[v57],"formError":$(m6z+classes[y6z][j6z]+W4X)[v57],"formInfo":$(r6z+classes[f6z][B6z]+W4X)[v57],"header":$(d6z+classes[a9X][j7B]+o0O+classes[a9X][S7B]+m0O)[v57],"buttons":$(y0O+classes[a6z][c9X]+W4X)[v57]};if($[j0O][c6z][N6z]){var O6z=G8B;O6z+=a9V.t57;O6z+=N77;O6z+=a9V.K57;var g6z=k3X;g6z+=I4X;g6z+=a9V.W57;g6z+=a9V.K57;var Z6z=a9V.K57;Z6z+=a9V.V57;Z6z+=a9V.l57;Z6z+=T17;var T6z=u87;T6z+=w87;T6z+=u9X;T6z+=a9V.d87;var k6z=r0O;k6z+=a9V.K57;var w6z=a9V.B87;w6z+=a9V.d87;var ttButtons=$[w6z][k6z][f0O][B0O];var i18n=this[T6z];$[Z6z]([g6z,E6X,O6z],function(i,val){var a0O="tonT";var d0O="sB";var X6z=d0O;X6z+=B4X;X6z+=a0O;X6z+=w8X;var q6z=c0O;q6z+=E47;q6z+=s67;ttButtons[q6z+val][X6z]=i18n[val][B5X];});}$[O8B](init[Y6z],function(evt,fn){that[G9B](evt,function(){var N0O="ppl";var i6z=a9V.V57;i6z+=N0O;i6z+=O77;var z6z=E1X;z6z+=i47;var b6z=E87;b6z+=S67;var args=Array[b6z][A4B][z6z](arguments);args[E4B]();fn[i6z](that,args);});});var dom=this[h6z];var wrapper=dom[j7B];dom[p6z]=_editor_el(G6z,dom[A6z])[v57];dom[M0O]=_editor_el(E6z,wrapper)[v57];dom[U6z]=_editor_el(p6B,wrapper)[v57];dom[J6z]=_editor_el(D6z,wrapper)[v57];dom[f6X]=_editor_el(w0O,wrapper)[v57];if(init[v2X]){var F6z=q0B;F6z+=a9V.o87;this[i5B](init[F6z]);}$(document)[R6z](K6z+this[a9V.o87][l6z],function(e,settings,json){var k0O="nTabl";var V6z=a9V.W57;V6z+=s3B;var W6z=k0O;W6z+=a9V.K57;if(that[a9V.o87][Y0X]&&settings[W6z]===$(that[a9V.o87][V6z])[G9X](v57)){var t6z=s67;t6z+=T0O;settings[t6z]=that;}})[G9B](x6z+this[a9V.o87][h8X],function(e,settings,json){var g0O="nTable";var L1z=g17;L1z+=a9V.K57;L1z+=a9V.W57;var Q6z=d4B;Q6z+=a9V.f87;var u6z=Z0O;u6z+=V3B;if(json&&that[a9V.o87][u6z]&&settings[g0O]===$(that[a9V.o87][Q6z])[L1z](v57)){that[O0O](json);}});try{var I1z=I5B;I1z+=i47;I1z+=a9V.V57;I1z+=O77;var n1z=Q8B;n1z+=O77;var H1z=I7B;H1z+=q0O;this[a9V.o87][H1z]=Editor[n1z][init[I1z]][X0O](this);}catch(e){var i0O="troller ";var z0O="splay c";var b0O="Cannot find di";var v1z=Y0O;v1z+=E8B;v1z+=e5B;var e1z=b0O;e1z+=z0O;e1z+=G9B;e1z+=i0O;throw e1z+init[v1z];}this[C6X](h0O,[]);};Editor[s1z][P1z]=function(){var r1z=G8B;r1z+=a9V.t57;r1z+=r17;var y1z=f2X;y1z+=T67;var o1z=a9V.K57;o1z+=a9V.x57;o1z+=u87;o1z+=a9V.W57;var C1z=a9V.x57;C1z+=L47;C1z+=a9V.t57;var S1z=a9V.V57;S1z+=o7X;S1z+=a9V.d87;var M1z=p0O;M1z+=m7X;M1z+=a9V.o87;var classesActions=this[L2X][M1z];var action=this[a9V.o87][S1z];var wrapper=$(this[C1z][j7B]);wrapper[d5B]([classesActions[G5X],classesActions[o1z],classesActions[f1B]][K7X](V2B));if(action===G5X){var m1z=c1X;m1z+=a9V.x57;m1z+=G0O;wrapper[m1z](classesActions[G5X]);}else if(action===y1z){var j1z=f2X;j1z+=u87;j1z+=a9V.W57;wrapper[L5B](classesActions[j1z]);}else if(action===r1z){var f1z=A0O;f1z+=a9V.K57;wrapper[L5B](classesActions[f1z]);}};Editor[F9B][B1z]=function(data,success,error,submitParams){var O2O='?';var T2O="indexO";var k2O="isFunct";var w2O="Functi";var c2O="complete";var a2O="omplete";var B2O="com";var r2O=/_id_/;var y2O="jaxU";var S2O=',';var M2O='idSrc';var W0O='POST';var l0O="xUrl";var K0O="repl";var F0O="LE";var D0O="DE";var J0O="eBody";var U0O="ele";var E0O="leteBo";var L3J=z17;L3J+=E0O;L3J+=Q7B;var Q1z=a9V.x57;Q1z+=U0O;Q1z+=a9V.W57;Q1z+=J0O;var u1z=D0O;u1z+=F0O;u1z+=R0O;var x1z=a9V.W57;x1z+=e67;var t1z=a9V.x57;t1z+=a9V.V57;t1z+=a9V.W57;t1z+=a9V.V57;var F1z=K0O;F1z+=x4X;var D1z=v0B;D1z+=E47;D1z+=i47;var i1z=h1X;i1z+=u87;i1z+=a9V.d87;i1z+=g17;var q1z=j17;q1z+=L47;q1z+=I6X;var O1z=a9V.V57;O1z+=A67;O1z+=l0O;var g1z=a9V.V57;g1z+=a9V.I87;g1z+=a9V.V57;g1z+=K87;var d1z=a9V.I87;d1z+=a9V.o87;d1z+=L47;d1z+=a9V.d87;var that=this;var action=this[a9V.o87][p0X];var thrown;var opts={type:W0O,dataType:d1z,data:o9B,error:[function(xhr,text,err){thrown=err;}],success:[],complete:[function(xhr,text){var P2O="atu";var s2O="responseJSON";var v2O="eJSON";var e2O="respons";var I2O="SON";var n2O="J";var H2O="parse";var L2O="responseTe";var Q0O='null';var u0O="statu";var t0O="spon";var V0O="sArray";var i57=204;var T1z=u87;T1z+=V0O;var c1z=G8B;c1z+=t0O;c1z+=a9V.o87;c1z+=x0O;var a1z=u0O;a1z+=a9V.o87;var json=o9B;if(xhr[a1z]===i57||xhr[c1z]===Q0O){json={};}else{try{var k1z=L2O;k1z+=U7X;var w1z=H2O;w1z+=n2O;w1z+=I2O;var N1z=e2O;N1z+=v2O;json=xhr[s2O]?xhr[N1z]:$[w1z](xhr[k1z]);}catch(e){}}if($[g8B](json)||$[T1z](json)){var Z1z=M17;Z1z+=P2O;Z1z+=a9V.o87;success(json,xhr[Z1z]>=h57,xhr);}else{error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[a9V.o87][g1z]||this[a9V.o87][O1z];var id=action===E6X||action===q1z?_pluck(this[a9V.o87][K5X],M2O):o9B;if($[t8B](id)){var X1z=a9V.I87;X1z+=L47;X1z+=u87;X1z+=a9V.d87;id=id[X1z](S2O);}if($[g8B](ajaxSrc)&&ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if($[W9B](ajaxSrc)){var uri=o9B;var method=o9B;if(this[a9V.o87][C2O]){var z1z=E47;z1z+=o2O;z1z+=i47;z1z+=x4X;var b1z=G67;b1z+=m2O;b1z+=s77;b1z+=a9V.B87;var Y1z=a9V.V57;Y1z+=y2O;Y1z+=E47;Y1z+=i47;var url=this[a9V.o87][Y1z];if(url[G5X]){uri=url[action];}if(uri[b1z](V2B)!==-s57){a=uri[j2O](V2B);method=a[v57];uri=a[s57];}uri=uri[z1z](r2O,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc===i1z){var h1z=u87;h1z+=z7B;h1z+=f2O;if(ajaxSrc[h1z](V2B)!==-s57){var G1z=v0B;G1z+=E47;G1z+=i47;var p1z=U87;p1z+=g87;p1z+=a9V.K57;a=ajaxSrc[j2O](V2B);opts[p1z]=a[v57];opts[G1z]=a[s57];}else{var A1z=v0B;A1z+=E47;A1z+=i47;opts[A1z]=ajaxSrc;}}else{var E1z=B2O;E1z+=d2O;E1z+=a9V.K57;var optsCopy=$[r9B]({},ajaxSrc||{});if(optsCopy[E1z]){var U1z=a9V.l57;U1z+=a2O;opts[c2O][U4B](optsCopy[c2O]);delete optsCopy[U1z];}if(optsCopy[V5B]){var J1z=a9V.K57;J1z+=G5B;J1z+=L47;J1z+=E47;opts[V5B][U4B](optsCopy[J1z]);delete optsCopy[V5B];}opts=$[r9B]({},opts,optsCopy);}opts[T8X]=opts[D1z][F1z](r2O,id);if(opts[A2B]){var V1z=N2O;V1z+=d4B;var W1z=u87;W1z+=a9V.o87;W1z+=w2O;W1z+=G9B;var l1z=N2O;l1z+=a9V.W57;l1z+=a9V.V57;var K1z=a9V.x57;K1z+=a9V.V57;K1z+=a9V.W57;K1z+=a9V.V57;var R1z=k2O;R1z+=m7X;var newData=$[R1z](opts[K1z])?opts[A2B](data):opts[l1z];data=$[W1z](opts[V1z])&&newData?newData:$[r9B](r0B,data,newData);}opts[t1z]=data;if(opts[x1z]===u1z&&(opts[Q1z]===undefined||opts[L3J]===r0B)){var v3J=T2O;v3J+=a9V.B87;var e3J=Z2O;e3J+=i47;var I3J=v0B;I3J+=E47;I3J+=i47;var n3J=a9V.x57;n3J+=a9V.V57;n3J+=d4B;var H3J=g2O;H3J+=Q6B;H3J+=a9V.t57;var params=$[H3J](opts[n3J]);opts[I3J]+=opts[e3J][v3J](O2O)===-s57?O2O+params:K8B+params;delete opts[A2B];}$[Z8X](opts);};Editor[s3J][P3J]=function(){var z2O="formError";var b2O="pper";var Y2O="epen";var X2O="foo";var q2O="ormI";var j3J=a9V.B87;j3J+=q2O;j3J+=a9V.d87;j3J+=U5B;var y3J=a9V.V57;y3J+=g87;y3J+=p7X;y3J+=a9V.x57;var m3J=q6B;m3J+=a9V.j87;m3J+=a9V.x57;var o3J=X2O;o3J+=i2X;var C3J=T17;C3J+=a9V.K57;C3J+=c1X;C3J+=R47;var S3J=n67;S3J+=Y2O;S3J+=a9V.x57;var M3J=P1B;M3J+=b2O;var dom=this[w9B];$(dom[M3J])[S3J](dom[C3J]);$(dom[o3J])[o7B](dom[z2O])[m3J](dom[c9X]);$(dom[i2O])[y3J](dom[j3J])[o7B](dom[v77]);};Editor[F9B][h2O]=function(){var A2O='preBlur';var G2O="itOp";var p2O="nB";var d3J=a9V.l57;d3J+=i47;d3J+=L47;d3J+=H47;var f3J=L47;f3J+=p2O;f3J+=F17;f3J+=E47;var r3J=f2X;r3J+=G2O;r3J+=a9V.W57;r3J+=a9V.o87;var opts=this[a9V.o87][r3J];var onBlur=opts[f3J];if(this[C6X](A2O)===m0B){return;}if(typeof onBlur===a9V.Q57){onBlur(this);}else if(onBlur===E2O){var B3J=a9V.o87;B3J+=U2O;B3J+=J2O;B3J+=a9V.W57;this[B3J]();}else if(onBlur===d3J){this[O9X]();}};Editor[F9B][H7X]=function(){var c3J=O3O;c3J+=L47;c3J+=E47;var a3J=a9V.B87;a3J+=u87;a3J+=F77;a3J+=a9V.x57;if(!this[a9V.o87]){return;}var errorClass=this[L2X][a3J][c3J];var fields=this[a9V.o87][v2X];$(L7X+errorClass,this[w9B][j7B])[d5B](errorClass);$[O8B](fields,function(name,field){var w3J=j2B;w3J+=q5B;w3J+=g17;w3J+=a9V.K57;var N3J=O3O;N3J+=L47;N3J+=E47;field[N3J](i3B)[w3J](i3B);});this[V5B](i3B)[S7X](i3B);};Editor[k3J][T3J]=function(submitComplete){var V2O='focus.editor-focus';var K2O="eCb";var F2O='preClose';var z3J=a9V.l57;z3J+=i47;z3J+=z67;var b3J=s67;b3J+=D2O;b3J+=h17;var Y3J=a9V.x57;Y3J+=G8X;Y3J+=Y8X;var X3J=L47;X3J+=a9V.B87;X3J+=a9V.B87;var q3J=D17;q3J+=L47;q3J+=Q7B;var g3J=I0X;g3J+=H47;g3J+=V77;g3J+=D17;var Z3J=s67;Z3J+=d8X;if(this[Z3J](F2O)===m0B){return;}if(this[a9V.o87][g3J]){var O3J=R2O;O3J+=K2O;this[a9V.o87][O3J](submitComplete);this[a9V.o87][l2O]=o9B;}if(this[a9V.o87][W2O]){this[a9V.o87][W2O]();this[a9V.o87][W2O]=o9B;}$(q3J)[X3J](V2O);this[a9V.o87][Y3J]=m0B;this[b3J](z3J);};Editor[i3J][h3J]=function(fn){this[a9V.o87][l2O]=fn;};Editor[p3J][G3J]=function(arg1,arg2,arg3,arg4){var x2O="Options";var J3J=a9V.t57;J3J+=a9V.V57;J3J+=u87;J3J+=a9V.d87;var U3J=a9V.B87;U3J+=t2O;U3J+=x2O;var E3J=a9V.K57;E3J+=U7X;E3J+=l7B;var A3J=u7B;A3J+=Y47;A3J+=a9V.K57;A3J+=U7B;var that=this;var title;var buttons;var show;var opts;if($[g8B](arg1)){opts=arg1;}else if(typeof arg1===A3J){show=arg1;opts=arg2;}else{title=arg1;buttons=arg2;show=arg3;opts=arg4;}if(show===undefined){show=r0B;}if(title){that[d9X](title);}if(buttons){that[c9X](buttons);}return{opts:$[E3J]({},this[a9V.o87][U3J][J3J],opts),maybeOpen:function(){if(show){var D3J=L47;D3J+=J87;D3J+=a9V.d87;that[D3J]();}}};};Editor[F3J][V8X]=function(name){var u2O="urc";var l3J=a9V.x57;l3J+=K0X;l3J+=u2O;l3J+=a9V.K57;var K3J=a9V.o87;K3J+=T17;K3J+=J9B;K3J+=a9V.W57;var R3J=g67;R3J+=e67;var args=Array[R3J][A4B][D9B](arguments);args[K3J]();var fn=this[a9V.o87][l3J][name];if(fn){var W3J=q6B;W3J+=g77;return fn[W3J](this,args);}};Editor[V3J][o2X]=function(includeFields){var o9O='displayOrder';var I9O="Fields";var n9O="include";var H9O="formContent";var C0J=M8B;C0J+=a9V.K57;C0J+=a9V.x57;var S0J=s67;S0J+=a9V.K57;S0J+=Q2O;var L0J=L9O;L0J+=a9V.j87;var u3J=L47;u3J+=f17;u3J+=R47;var x3J=L0B;x3J+=H2X;var t3J=a9V.x57;t3J+=L47;t3J+=a9V.t57;var that=this;var formContent=$(this[t3J][H9O]);var fields=this[a9V.o87][x3J];var order=this[a9V.o87][u3J];var template=this[a9V.o87][a6X];var mode=this[a9V.o87][C77]||V5X;if(includeFields){this[a9V.o87][z5X]=includeFields;}else{var Q3J=n9O;Q3J+=I9O;includeFields=this[a9V.o87][Q3J];}formContent[L0J]()[k1B]();$[O8B](order,function(i,fieldOrName){var C9O='"]';var S9O="after";var M9O='editor-field[name="';var P9O="tor-template=\"";var s9O="ta-ed";var v9O="[da";var H0J=d77;H0J+=u87;H0J+=a9V.K57;H0J+=T2B;var name=fieldOrName instanceof Editor[H0J]?fieldOrName[h2B]():fieldOrName;if(that[e9O](name,includeFields)!==-s57){var n0J=a9V.t57;n0J+=a9V.V57;n0J+=u87;n0J+=a9V.d87;if(template&&mode===n0J){var M0J=a9V.V57;M0J+=J4B;M0J+=l7B;var P0J=v9O;P0J+=s9O;P0J+=u87;P0J+=P9O;var s0J=a9V.B87;s0J+=u87;s0J+=z7B;var v0J=E3X;v0J+=a9V.x57;v0J+=a9V.K57;var e0J=F3B;e0J+=R3B;var I0J=a9V.B87;I0J+=u87;I0J+=a9V.d87;I0J+=a9V.x57;template[I0J](M9O+name+e0J)[S9O](fields[name][v0J]());template[s0J](P0J+name+C9O)[M0J](fields[name][B8X]());}else{formContent[o7B](fields[name][B8X]());}}});if(template&&mode===V5X){template[y9X](formContent);}this[S0J](o9O,[this[a9V.o87][C0J],this[a9V.o87][p0X],formContent]);};Editor[F9B][o0J]=function(items,editFields,type,formOptions){var Y9O="toString";var q9O="inA";var c9O="editData";var a9O="modif";var d9O="_actionClas";var B9O="playReorder";var f9O="_dis";var r9O="itEdi";var j9O="ata";var y9O="tMultiEdit";var m9O="ini";var b0J=m9O;b0J+=y9O;var Y0J=s67;Y0J+=a9V.K57;Y0J+=Q2O;var X0J=a9V.x57;X0J+=j9O;var q0J=a9V.d87;q0J+=L47;q0J+=a9V.x57;q0J+=a9V.K57;var O0J=G67;O0J+=r9O;O0J+=a9V.W57;var g0J=f9O;g0J+=B9O;var f0J=d9O;f0J+=a9V.o87;var r0J=a9V.x57;r0J+=G8X;r0J+=O77;var j0J=a9V.o87;j0J+=U87;j0J+=V3B;var y0J=a9V.K57;y0J+=a9V.x57;y0J+=u87;y0J+=a9V.W57;var m0J=a9O;m0J+=c17;m0J+=E47;var that=this;var fields=this[a9V.o87][v2X];var usedFields=[];var includeInOrder;var editData={};this[a9V.o87][K5X]=editFields;this[a9V.o87][c9O]=editData;this[a9V.o87][m0J]=items;this[a9V.o87][p0X]=y0J;this[w9B][v77][j0J][r0J]=C4B;this[a9V.o87][C77]=type;this[f0J]();$[O8B](fields,function(name,field){var O9O="ush";var N9O="iReset";var k0J=X9X;k0J+=D0X;var d0J=a9V.K57;d0J+=U8B;d0J+=T17;var B0J=o4B;B0J+=a9V.W57;B0J+=N9O;field[B0J]();includeInOrder=m0B;editData[name]={};$[d0J](editFields,function(idSrc,edit){var g9O="iS";if(edit[v2X][name]){var c0J=a9V.o87;c0J+=a9V.l57;c0J+=w9O;var a0J=k9O;a0J+=a9V.V57;var val=field[I2X](edit[a0J]);editData[name][idSrc]=val===o9B?i3B:val;if(!formOptions||formOptions[c0J]===T9O){var N0J=a9V.x57;N0J+=a9V.K57;N0J+=a9V.B87;field[e2X](idSrc,val!==undefined?val:field[N0J]());if(!edit[Z9O]||edit[Z9O][name]){includeInOrder=r0B;}}else{if(!edit[Z9O]||edit[Z9O][name]){var w0J=a9V.t57;w0J+=c0B;w0J+=g9O;w0J+=e4B;field[w0J](idSrc,val!==undefined?val:field[l9B]());includeInOrder=r0B;}}}});if(field[K5B]()[k0J]!==v57&&includeInOrder){var T0J=g87;T0J+=O9O;usedFields[T0J](name);}});var currOrder=this[M2X]()[A4B]();for(var i=currOrder[o0B]-s57;i>=v57;i--){var Z0J=q9O;Z0J+=X9O;if($[Z0J](currOrder[i][Y9O](),usedFields)===-s57){currOrder[C2X](i,s57);}}this[g0J](currOrder);this[C6X](O0J,[_pluck(editFields,q0J)[v57],_pluck(editFields,X0J)[v57],items,type]);this[Y0J](b0J,[editFields,items,type]);};Editor[z0J][i0J]=function(trigger,args){var A9O="result";var G9O="elled";var p9O="Can";var h9O='pre';var z9O="Event";var b9O="resu";if(!args){args=[];}if($[t8B](trigger)){var h0J=x8B;h0J+=u8B;for(var i=v57,ien=trigger[h0J];i<ien;i++){this[C6X](trigger[i],args);}}else{var G0J=b9O;G0J+=i47;G0J+=a9V.W57;var p0J=G67;p0J+=a9V.x57;p0J+=f2O;var e=$[z9O](trigger);$(this)[i9O](e,args);if(trigger[p0J](h9O)===v57&&e[G0J]===m0B){var A0J=p9O;A0J+=a9V.l57;A0J+=G9O;$(this)[i9O]($[z9O](trigger+A0J),args);}return e[A9O];}};Editor[E0J][E9O]=function(input){var D9O="string";var J9O=/^on([A-Z])/;var J0J=J7X;J0J+=u87;J0J+=a9V.d87;var name;var names=input[j2O](V2B);for(var i=v57,ien=names[o0B];i<ien;i++){name=names[i];var onStyle=name[U9O](J9O);if(onStyle){var U0J=m3O;U0J+=D9O;name=onStyle[s57][F9O]()+name[U0J](M57);}names[i]=name;}return names[J0J](V2B);};Editor[D0J][R9O]=function(node){var foundField=o9B;$[O8B](this[a9V.o87][v2X],function(name,field){var F0J=a9V.B87;F0J+=u87;F0J+=a9V.d87;F0J+=a9V.x57;if($(field[B8X]())[F0J](node)[o0B]){foundField=field;}});return foundField;};Editor[F9B][i5X]=function(fieldNames){if(fieldNames===undefined){var R0J=a9V.B87;R0J+=p47;R0J+=l5X;return this[R0J]();}else if(!$[t8B](fieldNames)){return[fieldNames];}return fieldNames;};Editor[K0J][M7X]=function(fieldsIn,focus){var u9O=/^jq:/;var x9O="iv.DTE";var t9O='jq:';var W9O='number';var that=this;var field;var fields=$[U8X](fieldsIn,function(fieldOrName){var l9O="tring";var K9O="ields";var W0J=a9V.B87;W0J+=K9O;var l0J=a9V.o87;l0J+=l9O;return typeof fieldOrName===l0J?that[a9V.o87][W0J][fieldOrName]:fieldOrName;});if(typeof focus===W9O){field=fields[focus];}else if(focus){if(focus[V9O](t9O)===v57){var V0J=a9V.x57;V0J+=x9O;V0J+=t3B;field=$(V0J+focus[D8B](u9O,i3B));}else{field=this[a9V.o87][v2X][focus];}}this[a9V.o87][Q9O]=field;if(field){var t0J=a9V.B87;t0J+=n4B;t0J+=v0B;t0J+=a9V.o87;field[t0J]();}};Editor[x0J][I9X]=function(opts){var O5O='boolean';var g5O="editCount";var Z5O="nBackground";var T5O="blurOnBackgroun";var k5O="blurOnBackground";var w5O="urn";var N5O="nRe";var c5O="submi";var a5O="submitOnReturn";var d5O="onBlur";var B5O="lur";var f5O="itOnB";var r5O="onCom";var y5O="closeOnCo";var m5O="nline";var o5O="teI";var C5O=".d";var M5O="OnCom";var P5O="submitOnB";var s5O="rin";var v5O="func";var e5O="essage";var I5O="sag";var n5O="uttons";var H5O="key";var A2J=p17;A2J+=L47;A2J+=L5O;A2J+=D17;var c2J=H5O;c2J+=F67;var a2J=L47;a2J+=a9V.d87;var B2J=D17;B2J+=n5O;var r2J=j2B;r2J+=a9V.o87;r2J+=I5O;r2J+=a9V.K57;var j2J=a9V.t57;j2J+=e5O;var y2J=v5O;y2J+=x2X;var m2J=a9V.o87;m2J+=a9V.W57;m2J+=s5O;m2J+=g17;var o2J=m4B;o2J+=a9V.W57;o2J+=i47;o2J+=a9V.K57;var C2J=V7X;C2J+=t7X;var n2J=P5O;n2J+=i47;n2J+=Z2O;var Q0J=S6B;Q0J+=M5O;Q0J+=S5O;var u0J=C5O;u0J+=o5O;u0J+=m5O;var that=this;var inlineCount=__inlineCounter++;var namespace=u0J+inlineCount;if(opts[Q0J]!==undefined){var H2J=y5O;H2J+=a9V.t57;H2J+=E8B;H2J+=j5O;var L2J=r5O;L2J+=d2O;L2J+=a9V.K57;opts[L2J]=opts[H2J]?K4B:S5B;}if(opts[n2J]!==undefined){var e2J=R2O;e2J+=a9V.K57;var I2J=m2X;I2J+=y2X;I2J+=f5O;I2J+=B5O;opts[d5O]=opts[I2J]?E2O:e2J;}if(opts[a5O]!==undefined){var s2J=c5O;s2J+=a9V.W57;var v2J=L47;v2J+=N5O;v2J+=a9V.W57;v2J+=w5O;opts[v2J]=opts[a5O]?s2J:S5B;}if(opts[k5O]!==undefined){var S2J=H4B;S2J+=Z2O;var M2J=T5O;M2J+=a9V.x57;var P2J=L47;P2J+=Z5O;opts[P2J]=opts[M2J]?S2J:S5B;}this[a9V.o87][C2J]=opts;this[a9V.o87][g5O]=inlineCount;if(typeof opts[o2J]===m2J||typeof opts[d9X]===y2J){this[d9X](opts[d9X]);opts[d9X]=r0B;}if(typeof opts[j2J]===J8B||typeof opts[r2J]===a9V.Q57){var f2J=j2B;f2J+=a6B;f2J+=A0B;this[S7X](opts[f2J]);opts[S7X]=r0B;}if(typeof opts[B2J]!==O5O){var d2J=D17;d2J+=Q9X;d2J+=L5X;this[c9X](opts[d2J]);opts[c9X]=r0B;}$(document)[a2J](c2J+namespace,function(e){var K5O="next";var F5O='.DTE_Form_Buttons';var D5O="onEsc";var J5O="Es";var U5O="onReturn";var E5O="entDefault";var A5O="prev";var G5O="tu";var p5O="onRe";var h5O="turnSubmit";var i5O="canRe";var z5O="bmit";var b5O="canReturnSu";var X5O="keyCo";var q5O="yC";var q57=39;var O57=37;var i2J=X9X;i2J+=D0X;var q2J=I5X;q2J+=q5O;q2J+=S77;var w2J=a9V.x57;w2J+=G8X;w2J+=O77;w2J+=f2X;var N2J=X5O;N2J+=z17;var el=$(document[Y5O]);if(e[N2J]===r57&&that[a9V.o87][w2J]){var Z2J=b5O;Z2J+=z5O;var T2J=v5O;T2J+=J17;T2J+=a9V.d87;var k2J=i5O;k2J+=h5O;var field=that[R9O](el);if(field&&typeof field[k2J]===T2J&&field[Z2J](el)){var g2J=p5O;g2J+=G5O;g2J+=E47;g2J+=a9V.d87;if(opts[g2J]===E2O){var O2J=A5O;O2J+=E5O;e[O2J]();that[N2X]();}else if(typeof opts[U5O]===a9V.Q57){e[Z5X]();opts[U5O](that);}}}else if(e[q2J]===w57){var z2J=m3O;z2J+=J2O;z2J+=a9V.W57;var Y2J=L47;Y2J+=a9V.d87;Y2J+=J5O;Y2J+=a9V.l57;var X2J=D17;X2J+=i47;X2J+=v0B;X2J+=E47;e[Z5X]();if(typeof opts[D5O]===a9V.Q57){opts[D5O](that);}else if(opts[D5O]===X2J){that[c2X]();}else if(opts[Y2J]===K4B){var b2J=a9V.l57;b2J+=i47;b2J+=G17;b2J+=a9V.K57;that[b2J]();}else if(opts[D5O]===z2J){that[N2X]();}}else if(el[P5B](F5O)[i2J]){if(e[N5X]===O57){var p2J=U5B;p2J+=R5O;p2J+=a9V.o87;var h2J=D17;h2J+=Q9X;h2J+=L47;h2J+=a9V.d87;el[A5O](h2J)[p2J]();}else if(e[N5X]===q57){var G2J=m4X;G2J+=G9B;el[K5O](G2J)[L8B]();}}});this[a9V.o87][A2J]=function(){var U2J=I5X;U2J+=O77;U2J+=v0B;U2J+=g87;var E2J=L47;E2J+=a9V.B87;E2J+=a9V.B87;$(document)[E2J](U2J+namespace);};return namespace;};Editor[J2J][l5O]=function(direction,action,data){var V5O='send';var W5O="legacyAjax";if(!this[a9V.o87][W5O]||!data){return;}if(direction===V5O){var D2J=f2X;D2J+=u87;D2J+=a9V.W57;if(action===C9B||action===D2J){var K2J=a9V.K57;K2J+=e3B;var F2J=a9V.K57;F2J+=a9V.V57;F2J+=a9V.l57;F2J+=T17;var id;$[F2J](data[A2B],function(rowId,values){var Q5O=" format";var u5O=" Ajax data";var x5O="i-row editing is not supported by the legacy";var t5O="Editor: Mult";if(id!==undefined){var R2J=t5O;R2J+=x5O;R2J+=u5O;R2J+=Q5O;throw R2J;}id=rowId;});data[A2B]=data[A2B][id];if(action===K2J){data[u2B]=id;}}else{var W2J=a9V.x57;W2J+=a9V.V57;W2J+=a9V.W57;W2J+=a9V.V57;var l2J=a9V.x57;l2J+=a9V.V57;l2J+=a9V.W57;l2J+=a9V.V57;data[u2B]=$[U8X](data[l2J],function(values,id){return id;});delete data[W2J];}}else{var V2J=E47;V2J+=L47;V2J+=x77;if(!data[A2B]&&data[V2J]){data[A2B]=[data[n17]];}else if(!data[A2B]){data[A2B]=[];}}};Editor[t2J][O0O]=function(json){var that=this;if(json[L8O]){var x2J=L0B;x2J+=a9V.K57;x2J+=T2B;x2J+=a9V.o87;$[O8B](this[a9V.o87][x2J],function(name,field){var I8O="upd";var n8O="update";var H8O="tions";var u2J=L47;u2J+=g87;u2J+=H8O;if(json[u2J][name]!==undefined){var fieldInst=that[q0B](name);if(fieldInst&&fieldInst[n8O]){var Q2J=I8O;Q2J+=a9V.V57;Q2J+=a9V.W57;Q2J+=a9V.K57;fieldInst[Q2J](json[L8O][name]);}}});}};Editor[L9J][Q8X]=function(el,msg){var C8O="htm";var S8O="adeIn";var s8O="fadeOu";var v8O="Ap";var e8O="layed";var S9J=Y17;S9J+=a9V.V57;S9J+=Y8X;var I9J=I5B;I9J+=e8O;if(typeof msg===a9V.Q57){var n9J=Z0O;n9J+=V3B;var H9J=v8O;H9J+=u87;msg=msg(this,new DataTable[H9J](this[a9V.o87][n9J]));}el=$(el);if(!msg&&this[a9V.o87][I9J]){var e9J=s8O;e9J+=a9V.W57;el[d1B]()[e9J](function(){var v9J=T17;v9J+=a9V.W57;v9J+=a9V.t57;v9J+=i47;el[v9J](i3B);});}else if(!msg){var M9J=H3B;M9J+=P8O;var P9J=a9V.l57;P9J+=a9V.o87;P9J+=a9V.o87;var s9J=T17;s9J+=M8O;el[s9J](i3B)[P9J](M9J,S5B);}else if(this[a9V.o87][S9J]){var o9J=a9V.B87;o9J+=S8O;var C9J=C8O;C9J+=i47;el[d1B]()[C9J](msg)[o9J]();}else{var j9J=a9V.x57;j9J+=k4B;j9J+=a9V.V57;j9J+=O77;var y9J=a9V.l57;y9J+=a9V.o87;y9J+=a9V.o87;var m9J=f4B;m9J+=a9V.t57;m9J+=i47;el[m9J](msg)[y9J](j9J,C4B);}};Editor[r9J][o8O]=function(){var j8O="multiInfoShown";var y8O="multiE";var m8O="cludeFi";var B9J=x8B;B9J+=u8B;var f9J=G67;f9J+=m8O;f9J+=H2X;var fields=this[a9V.o87][v2X];var include=this[a9V.o87][f9J];var show=r0B;var state;if(!include){return;}for(var i=v57,ien=include[B9J];i<ien;i++){var d9J=y8O;d9J+=H3B;d9J+=Y0X;var field=fields[include[i]];var multiEditable=field[d9J]();if(field[B8B]()&&multiEditable&&show){state=r0B;show=m0B;}else if(field[B8B]()&&!multiEditable){state=r0B;}else{state=m0B;}fields[include[i]][j8O](state);}};Editor[F9B][a9J]=function(type){var N8O="itor-focus";var c8O="s.ed";var B8O='submit.editor-internal';var f8O="captureFocus";var r8O="ltiInfo";var G9J=U8B;G9J+=x2X;var p9J=w9O;p9J+=a9V.d87;var h9J=k67;h9J+=Q2O;var i9J=s67;i9J+=r47;i9J+=r8O;var w9J=L47;w9J+=a9V.d87;var N9J=x8X;N9J+=a9V.t57;var c9J=a9V.x57;c9J+=L47;c9J+=a9V.t57;var that=this;var focusCapture=this[a9V.o87][J8X][f8O];if(focusCapture===undefined){focusCapture=r0B;}$(this[c9J][N9J])[W7B](B8O)[w9J](B8O,function(e){var a8O="entDefaul";var d8O="rev";var k9J=g87;k9J+=d8O;k9J+=a8O;k9J+=a9V.W57;e[k9J]();});if(focusCapture&&(type===V5X||type===v9X)){var Z9J=o4X;Z9J+=c8O;Z9J+=N8O;var T9J=L47;T9J+=a9V.d87;$(p6B)[T9J](Z9J,function(){var g8O="tFocu";var Z8O='.DTE';var T8O="eng";var k8O="veElement";var w8O="TED";var Y9J=i47;Y9J+=z9X;Y9J+=T17;var X9J=k87;X9J+=D87;X9J+=w8O;var q9J=U8B;q9J+=a9V.W57;q9J+=u87;q9J+=k8O;var O9J=i47;O9J+=T8O;O9J+=a9V.W57;O9J+=T17;var g9J=g2O;g9J+=E47;g9J+=a9V.K57;g9J+=O4X;if($(document[Y5O])[g9J](Z8O)[O9J]===v57&&$(document[q9J])[P5B](X9J)[Y9J]===v57){var b9J=H47;b9J+=g8O;b9J+=a9V.o87;if(that[a9V.o87][b9J]){var z9J=U5B;z9J+=R5O;z9J+=a9V.o87;that[a9V.o87][Q9O][z9J]();}}});}this[i9J]();this[h9J](p9J,[type,this[a9V.o87][G9J]]);return r0B;};Editor[F9B][e9X]=function(type){var Y8O="Icb";var X8O='cancelOpen';var q8O="_clearDyna";var O8O="preO";var E9J=O8O;E9J+=p7X;var A9J=w67;A9J+=a9V.j87;A9J+=a9V.W57;if(this[A9J](E9J,[type,this[a9V.o87][p0X]])===m0B){var l9J=a9V.l57;l9J+=R67;l9J+=L5O;l9J+=D17;var K9J=g2X;K9J+=D17;K9J+=V3B;var R9J=a9V.t57;R9J+=L47;R9J+=a9V.x57;R9J+=a9V.K57;var F9J=G67;F9J+=B0B;F9J+=a9V.d87;F9J+=a9V.K57;var D9J=a9V.t57;D9J+=L47;D9J+=z17;var J9J=U8B;J9J+=J17;J9J+=a9V.d87;var U9J=q8O;U9J+=a9V.t57;U9J+=u87;U9J+=g9X;this[U9J]();this[C6X](X8O,[type,this[a9V.o87][J9J]]);if((this[a9V.o87][D9J]===F9J||this[a9V.o87][R9J]===K9J)&&this[a9V.o87][l9J]){var W9J=I0X;W9J+=a9V.o87;W9J+=a9V.K57;W9J+=Y8O;this[a9V.o87][W9J]();}this[a9V.o87][W2O]=o9B;return m0B;}this[a9V.o87][E8X]=type;return r0B;};Editor[F9B][V9J]=function(processing){var b8O="active";var u9J=s67;u9J+=d8X;var x9J=P1B;x9J+=F7B;x9J+=E47;var t9J=z4X;t9J+=R0O;var procClass=this[L2X][f6X][b8O];$([t9J,this[w9B][x9J]])[G4B](procClass,processing);this[a9V.o87][f6X]=processing;this[u9J](w0O,[processing]);};Editor[Q9J][d6X]=function(successCallback,errorCallback,formatdata,hide){var o4O="_ajax";var C4O='preSubmit';var P4O="onComp";var t8O="ange";var V8O="allIfCh";var W8O="dbTab";var K8O='initSubmit';var R8O="dataSource";var F8O="editCou";var J8O="tO";var U8O="bmi";var A8O="dbT";var G8O="reat";var p8O="yAjax";var h8O="ga";var i8O="_le";var z8O="Table";var z5J=d6X;z5J+=z8O;var b5J=a9V.o87;b5J+=a9V.K57;b5J+=z7B;var Y5J=i8O;Y5J+=h8O;Y5J+=a9V.l57;Y5J+=p8O;var C5J=a9V.l57;C5J+=G8O;C5J+=a9V.K57;var P5J=A8O;P5J+=a9V.V57;P5J+=a9V.f87;var s5J=E8O;s5J+=a9V.d87;s5J+=a9V.W57;var v5J=m2X;v5J+=U8O;v5J+=a9V.W57;var e5J=q87;e5J+=J8O;e5J+=g9B;var I5J=a9V.K57;I5J+=e3B;I5J+=D8O;I5J+=a9V.V57;var n5J=F8O;n5J+=d7B;var H5J=L47;H5J+=S17;H5J+=g87;H5J+=u87;var L5J=a9V.K57;L5J+=K87;L5J+=a9V.W57;var that=this;var i,iLen,eventRet,errorNodes;var changed=m0B,allData={},changedData={};var setBuilder=DataTable[L5J][H5J][l2B];var dataSource=this[a9V.o87][R8O];var fields=this[a9V.o87][v2X];var editCount=this[a9V.o87][n5J];var modifier=this[a9V.o87][t5X];var editFields=this[a9V.o87][K5X];var editData=this[a9V.o87][I5J];var opts=this[a9V.o87][e5J];var changedSubmit=opts[v5J];var submitParamsLocal;if(this[s5J](K8O,[this[a9V.o87][p0X]])===m0B){this[l8O](m0B);return;}var action=this[a9V.o87][p0X];var submitParams={"action":action,"data":{}};if(this[a9V.o87][P5J]){var S5J=W8O;S5J+=V3B;var M5J=a9V.W57;M5J+=a9V.V57;M5J+=D17;M5J+=V3B;submitParams[M5J]=this[a9V.o87][S5J];}if(action===C5J||action===v17){var N5J=V8O;N5J+=t8O;N5J+=a9V.x57;var c5J=a9V.V57;c5J+=i47;c5J+=i47;var o5J=a9V.K57;o5J+=U8B;o5J+=T17;$[o5J](editFields,function(idSrc,edit){var v4O="isEmptyObject";var u8O="ject";var x8O="EmptyOb";var a5J=e8B;a5J+=x8O;a5J+=u8O;var m5J=a9V.K57;m5J+=f0B;var allRowData={};var changedRowData={};$[m5J](fields,function(name,field){var e4O="compare";var I4O='-many-count';var n4O=/\[.*$/;var L4O="iGet";var Q8O="[";var y5J=a9V.B87;y5J+=c17;y5J+=W0X;if(edit[y5J][name]){var f5J=Q8O;f5J+=R3B;var j5J=a9V.t57;j5J+=v0B;j5J+=a0B;j5J+=L4O;var multiGet=field[j5J]();var builder=setBuilder(name);if(multiGet[idSrc]===undefined){var r5J=N2B;r5J+=H4O;var originalVal=field[r5J](edit[A2B]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=$[t8B](value)&&name[V9O](f5J)!==-s57?setBuilder(name[D8B](n4O,i3B)+I4O):o9B;builder(allRowData,value);if(manyBuilder){var B5J=V3B;B5J+=f8B;manyBuilder(allRowData,value[B5J]);}if(action===E6X&&(!editData[name]||!field[e4O](value,editData[name][idSrc]))){builder(changedRowData,value);changed=r0B;if(manyBuilder){var d5J=P4X;d5J+=T17;manyBuilder(changedRowData,value[d5J]);}}}});if(!$[v4O](allRowData)){allData[idSrc]=allRowData;}if(!$[a5J](changedRowData)){changedData[idSrc]=changedRowData;}});if(action===C9B||changedSubmit===c5J||changedSubmit===N5J&&changed){var w5J=k9O;w5J+=a9V.V57;submitParams[w5J]=allData;}else if(changedSubmit===s4O&&changed){var k5J=a9V.x57;k5J+=a9V.V57;k5J+=a9V.W57;k5J+=a9V.V57;submitParams[k5J]=changedData;}else{var O5J=h9B;O5J+=p9B;O5J+=G9B;var Z5J=P4O;Z5J+=V3B;Z5J+=R77;var T5J=x9X;T5J+=G9B;this[a9V.o87][T5J]=o9B;if(opts[Z5J]===K4B&&(hide===undefined||hide)){var g5J=s67;g5J+=a9V.l57;g5J+=l17;g5J+=a9V.K57;this[g5J](m0B);}else if(typeof opts[M4O]===O5J){opts[M4O](this);}if(successCallback){var q5J=a9V.l57;q5J+=a9V.V57;q5J+=i47;q5J+=i47;successCallback[q5J](this);}this[l8O](m0B);this[C6X](S4O);return;}}else if(action===f1B){$[O8B](editFields,function(idSrc,edit){var X5J=N2O;X5J+=d4B;submitParams[X5J][idSrc]=edit[A2B];});}this[Y5J](b5J,action,submitParams);submitParamsLocal=$[r9B](r0B,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[C6X](C4O,[submitParams,action])===m0B){this[l8O](m0B);return;}var submitWire=this[a9V.o87][Z8X]||this[a9V.o87][C2O]?this[o4O]:this[z5J];submitWire[D9B](this,submitParams,function(json,notGood,xhr){var y4O="mitSuccess";var m4O="_sub";var h5J=p0O;h5J+=r5X;h5J+=a9V.d87;var i5J=m4O;i5J+=y4O;that[i5J](json,notGood,submitParams,submitParamsLocal,that[a9V.o87][h5J],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var j4O="_submitError";var p5J=a9V.V57;p5J+=r2X;that[j4O](xhr,err,thrown,errorCallback,submitParams,that[a9V.o87][p5J]);},submitParams);};Editor[G5J][r4O]=function(data,success,error,submitParams){var a4O="modifi";var B4O="etObjectData";var f4O="_fnG";var U5J=f4O;U5J+=B4O;U5J+=Z0B;var E5J=d4O;E5J+=u87;var A5J=P3B;A5J+=a9V.W57;var that=this;var action=data[p0X];var out={data:[]};var idGet=DataTable[A5J][E5J][U5J](this[a9V.o87][I0O]);var idSet=DataTable[w8X][U2B][l2B](this[a9V.o87][I0O]);if(action!==D6X){var R5J=N2O;R5J+=d4B;var F5J=a9V.K57;F5J+=a9V.V57;F5J+=a9V.l57;F5J+=T17;var D5J=a4O;D5J+=R47;var J5J=a9V.B87;J5J+=c4O;J5J+=a9V.o87;var originalData=this[V8X](J5J,this[D5J]());$[F5J](data[R5J],function(key,vals){var x5J=g87;x5J+=v0B;x5J+=a9V.o87;x5J+=T17;var t5J=a9V.x57;t5J+=a9V.V57;t5J+=d4B;var V5J=a9V.l57;V5J+=G8B;V5J+=t77;var toSave;if(action===E6X){var l5J=a9V.K57;l5J+=f77;var K5J=N2O;K5J+=d4B;var rowData=originalData[key][K5J];toSave=$[l5J](r0B,{},rowData,vals);}else{var W5J=a9V.K57;W5J+=f77;toSave=$[W5J](r0B,{},vals);}if(action===V5J&&idGet(toSave)===undefined){idSet(toSave,+new Date()+i3B+key);}else{idSet(toSave,key);}out[t5J][x5J](toSave);});}success(out);};Editor[u5J][N4O]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var n7O='submitSuccess';var H7O="onC";var L7O='prep';var Q4O="Source";var x4O="eRem";var t4O="ataSource";var V4O="tRemo";var W4O="pos";var l4O="comm";var K4O='postEdit';var R4O="reEdi";var F4O='postCreate';var D4O='preCreate';var J4O='setData';var U4O="ataSourc";var E4O="oun";var A4O="itC";var h4O="submitUnsuccessf";var i4O="ors";var z4O="Er";var b4O="fieldErrors";var q4O="difie";var O4O="egacyAjax";var g4O="recei";var Z4O="rrors";var T4O="fieldE";var k4O="Complete";var F8J=m2X;F8J+=D17;F8J+=w4O;F8J+=k4O;var P8J=P4X;P8J+=T17;var s8J=T4O;s8J+=Z4O;var v8J=O3O;v8J+=L47;v8J+=E47;var n8J=a9V.K57;n8J+=g47;var H8J=g4O;H8J+=j47;H8J+=a9V.K57;var L8J=s67;L8J+=i47;L8J+=O4O;var Q5J=a9V.t57;Q5J+=L47;Q5J+=q4O;Q5J+=E47;var that=this;var setData;var fields=this[a9V.o87][v2X];var opts=this[a9V.o87][X4O];var modifier=this[a9V.o87][Q5J];this[L8J](H8J,action,json);this[C6X](Y4O,[json,submitParams,action,xhr]);if(!json[n8J]){var I8J=a9V.K57;I8J+=E47;I8J+=M67;json[I8J]=a9V.L87;}if(!json[b4O]){var e8J=q0B;e8J+=z4O;e8J+=E47;e8J+=i4O;json[e8J]=[];}if(notGood||json[v8J]||json[s8J][P8J]){var B8J=h4O;B8J+=D5B;var f8J=E8O;f8J+=d7B;var S8J=a9V.K57;S8J+=f0B;var M8J=a9V.K57;M8J+=E47;M8J+=M67;this[M8J](json[V5B]);$[S8J](json[b4O],function(i,err){var G4O="position";var p4O="onFieldError";var m8J=z4O;m8J+=E47;m8J+=L47;m8J+=E47;var o8J=a9V.K57;o8J+=g47;var C8J=a9V.d87;C8J+=a9V.V57;C8J+=a9V.t57;C8J+=a9V.K57;var field=fields[err[C8J]];field[o8J](err[M3O]||m8J);if(i===v57){var r8J=a9V.B87;r8J+=a0X;r8J+=j5X;r8J+=m7X;if(opts[p4O]===H8B){var j8J=X87;j8J+=g87;var y8J=E3X;y8J+=z17;$(that[w9B][i2O],that[a9V.o87][j7B])[a1B]({"scrollTop":$(field[y8J]())[G4O]()[j8J]},p57);field[L8B]();}else if(typeof opts[p4O]===r8J){opts[p4O](that,err);}}});this[f8J](B8J,[json]);if(errorCallback){errorCallback[D9B](that,json);}}else{var D8J=k7X;D8J+=a9V.W57;var p8J=f2X;p8J+=A4O;p8J+=E4O;p8J+=a9V.W57;var X8J=E47;X8J+=z6X;X8J+=N77;X8J+=a9V.K57;var a8J=a9V.l57;a8J+=G8B;a8J+=a9V.V57;a8J+=R77;var d8J=a9V.x57;d8J+=a9V.V57;d8J+=a9V.W57;d8J+=a9V.V57;var store={};if(json[d8J]&&(action===a8J||action===v17)){var q8J=a9V.x57;q8J+=a9V.V57;q8J+=a9V.W57;q8J+=a9V.V57;var O8J=a9V.l57;O8J+=L47;O8J+=a9V.t57;O8J+=w4O;var g8J=f7B;g8J+=U4O;g8J+=a9V.K57;var N8J=k9O;N8J+=a9V.V57;var c8J=g87;c8J+=E47;c8J+=a9V.K57;c8J+=g87;this[V8X](c8J,action,modifier,submitParamsLocal,json,store);for(var i=v57;i<json[N8J][o0B];i++){var w8J=D5X;w8J+=R77;setData=json[A2B][i];this[C6X](J4O,[json,setData,action]);if(action===w8J){this[C6X](D4O,[json,setData]);this[V8X](C9B,fields,setData,store);this[C6X]([C9B,F4O],[json,setData]);}else if(action===v17){var Z8J=s67;Z8J+=a9V.K57;Z8J+=Q2O;var T8J=g87;T8J+=R4O;T8J+=a9V.W57;var k8J=E8O;k8J+=a9V.d87;k8J+=a9V.W57;this[k8J](T8J,[json,setData]);this[V8X](E6X,modifier,fields,setData,store);this[Z8J]([E6X,K4O],[json,setData]);}}this[g8J](O8J,action,modifier,json[q8J],store);}else if(action===X8J){var h8J=l4O;h8J+=T67;var i8J=W4O;i8J+=V4O;i8J+=j47;i8J+=a9V.K57;var z8J=f7B;z8J+=t4O;var b8J=n67;b8J+=x4O;b8J+=r17;var Y8J=u4O;Y8J+=a9V.V57;Y8J+=Q4O;this[Y8J](L7O,action,modifier,submitParamsLocal,json,store);this[C6X](b8J,[json]);this[z8J](D6X,modifier,fields,store);this[C6X]([D6X,i8J],[json]);this[V8X](h8J,action,modifier,json[A2B],store);}if(editCount===this[a9V.o87][p8J]){var A8J=p17;A8J+=L47;A8J+=H47;var G8J=H7O;G8J+=B5B;G8J+=E8B;G8J+=j5O;this[a9V.o87][p0X]=o9B;if(opts[G8J]===A8J&&(hide===undefined||hide)){var E8J=s67;E8J+=I0X;E8J+=a9V.o87;E8J+=a9V.K57;this[E8J](json[A2B]?r0B:m0B);}else if(typeof opts[M4O]===a9V.Q57){var U8J=G9B;U8J+=V77;U8J+=B5B;U8J+=S5O;opts[U8J](this);}}if(successCallback){var J8J=a9V.l57;J8J+=a9V.V57;J8J+=i47;J8J+=i47;successCallback[J8J](that,json);}this[D8J](n7O,[json,setData,action]);}this[l8O](m0B);this[C6X](F8J,[json,setData,action]);};Editor[F9B][R8J]=function(xhr,err,thrown,errorCallback,submitParams,action){var v7O="sys";var e7O="tError";var I7O="ubmitCompl";var u8J=a9V.o87;u8J+=I7O;u8J+=j5O;var x8J=a9V.o87;x8J+=U2O;x8J+=J2O;x8J+=e7O;var t8J=k67;t8J+=j47;t8J+=a9V.j87;t8J+=a9V.W57;var W8J=v7O;W8J+=a9V.W57;W8J+=a9V.K57;W8J+=a9V.t57;var l8J=O3O;l8J+=L47;l8J+=E47;var K8J=s67;K8J+=d8X;this[K8J](Y4O,[o9B,submitParams,action,xhr]);this[l8J](this[X2B][V5B][W8J]);this[l8O](m0B);if(errorCallback){var V8J=a9V.l57;V8J+=a9V.V57;V8J+=i47;V8J+=i47;errorCallback[V8J](this,xhr,err,thrown);}this[t8J]([x8J,u8J],[xhr,err,thrown,submitParams]);};Editor[Q8J][L9X]=function(fn){var o7O="itComplete";var S7O="bServerSide";var M7O="oFeatures";var P7O="settin";var s7O="line";var C4J=D17;C4J+=v0B;C4J+=D17;C4J+=a9V.f87;var S4J=a9V.x57;S4J+=F1B;S4J+=m17;S4J+=O77;var M4J=G67;M4J+=s7O;var P4J=I5B;P4J+=m17;P4J+=O77;var n4J=a9V.W57;n4J+=a9V.V57;n4J+=D17;n4J+=V3B;var H4J=S17;H4J+=g87;H4J+=u87;var L4J=a9V.B87;L4J+=a9V.d87;var that=this;var dt=this[a9V.o87][Y0X]?new $[L4J][X1B][H4J](this[a9V.o87][n4J]):o9B;var ssp=m0B;if(dt){var I4J=P7O;I4J+=q67;ssp=dt[I4J]()[v57][M7O][S7O];}if(this[a9V.o87][f6X]){var e4J=C7O;e4J+=o7O;this[q7X](e4J,function(){var m7O="raw";if(ssp){var s4J=a9V.x57;s4J+=m7O;var v4J=L47;v4J+=a9V.d87;v4J+=a9V.K57;dt[v4J](s4J,fn);}else{setTimeout(function(){fn();},m57);}});return r0B;}else if(this[P4J]()===M4J||this[S4J]()===C4J){var m4J=I0X;m4J+=H47;var o4J=G9B;o4J+=a9V.K57;this[o4J](m4J,function(){if(!that[a9V.o87][f6X]){setTimeout(function(){fn();},m57);}else{var y4J=L47;y4J+=a9V.d87;y4J+=a9V.K57;that[y4J](S4O,function(e,json){var y7O='draw';if(ssp&&json){var j4J=G9B;j4J+=a9V.K57;dt[j4J](y7O,fn);}else{setTimeout(function(){fn();},m57);}});}})[c2X]();return r0B;}return m0B;};Editor[r4J][e9O]=function(name,arr){var f4J=x8B;f4J+=a9V.W57;f4J+=T17;for(var i=v57,ien=arr[f4J];i<ien;i++){if(name==arr[i]){return i;}}return-s57;};Editor[B4J]={"table":o9B,"ajaxUrl":o9B,"fields":[],"display":d4J,"ajax":o9B,"idSrc":j7O,"events":{},"i18n":{"create":{"button":a4J,"title":r7O,"submit":c4J},"edit":{"button":Z9B,"title":N4J,"submit":f7O},"remove":{"button":w4J,"title":B7O,"submit":k4J,"confirm":{"_":T4J,"1":Z4J}},"error":{"system":g4J},multi:{title:d7O,info:a7O,restore:O4J,noMulti:c7O},"datetime":{previous:N7O,next:q4J,months:[X4J,Y4J,w7O,k7O,b4J,T7O,z4J,Z7O,i4J,g7O,h4J,O7O],weekdays:[q7O,p4J,X7O,Y7O,b7O,G4J,A4J],amPm:[z7O,E4J],unknown:l7X}},formOptions:{bubble:$[U4J]({},Editor[f9B][R4B],{title:m0B,message:m0B,buttons:J4J,submit:D4J}),inline:$[r9B]({},Editor[F4J][R4B],{buttons:m0B,submit:s4O}),main:$[r9B]({},Editor[R4J][K4J])},legacyAjax:m0B};(function(){var t6O="[data-";var D6O='keyless';var X6O="wId";var g6O="drawType";var f6O="_fnGetObjectDataFn";var r6O="dSrc";var i7O="dataSources";var F6J=f4B;F6J+=B4B;var __dataSources=Editor[i7O]={};var __dtIsSsp=function(dt,editor){var E7O="atures";var A7O="oF";var G7O="erverS";var h7O="draw";var t4J=h7O;t4J+=p7O;t4J+=g87;t4J+=a9V.K57;var V4J=D17;V4J+=B77;V4J+=G7O;V4J+=Z17;var W4J=A7O;W4J+=a9V.K57;W4J+=E7O;var l4J=u5X;l4J+=a9V.W57;l4J+=C3B;l4J+=a9V.o87;return dt[l4J]()[v57][W4J][V4J]&&editor[a9V.o87][X4O][t4J]!==S5B;};var __dtApi=function(table){return $(table)[b0X]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var J7O="addCl";var U7O="ighlight";var u4J=T17;u4J+=U7O;var x4J=J7O;x4J+=k5B;node[x4J](u4J);setTimeout(function(){var K7O='noHighlight';var R7O="addCla";var F7O="removeC";var D7O="hlight";var G57=550;var H7J=T17;H7J+=T6B;H7J+=D7O;var L7J=F7O;L7J+=e6X;var Q4J=R7O;Q4J+=a6B;node[Q4J](K7O)[L7J](H7J);setTimeout(function(){var V7O="light";var W7O="igh";var l7O="noH";var n7J=l7O;n7J+=W7O;n7J+=V7O;node[d5B](n7J);},G57);},p57);},d57);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var I7J=G67;I7J+=m2O;I7J+=Q3B;dt[N8X](identifier)[I7J]()[O8B](function(idx){var u7O="identifier";var x7O="ow ";var t7O="Unable to find ";var f57=14;var s7J=B67;s7J+=x77;var row=dt[n17](idx);var data=row[A2B]();var idSrc=idFn(data);if(idSrc===undefined){var v7J=t7O;v7J+=E47;v7J+=x7O;v7J+=u7O;var e7J=O3O;e7J+=U47;Editor[e7J](v7J,f57);}out[idSrc]={idSrc:idSrc,data:data,node:row[B8X](),fields:fields,type:s7J};});};var __dtFieldsFromIdx=function(dt,fields,idx){var e6O='Unable to automatically determine field from source. Please specify the field name.';var I6O="aoColumns";var n6O="etting";var H6O="ditFi";var L6O="ditF";var Q7O="isEmptyObjec";var m7J=Q7O;m7J+=a9V.W57;var S7J=a9V.K57;S7J+=L6O;S7J+=u87;S7J+=L3B;var M7J=a9V.K57;M7J+=H6O;M7J+=L3B;var P7J=a9V.o87;P7J+=n6O;P7J+=a9V.o87;var field;var col=dt[P7J]()[v57][I6O][idx];var dataSrc=col[M7J]!==undefined?col[S7J]:col[H4O];var resolvedFields={};var run=function(field,dataSrc){var C7J=X17;C7J+=a9V.t57;C7J+=a9V.K57;if(field[C7J]()===dataSrc){resolvedFields[field[h2B]()]=field;}};$[O8B](fields,function(name,fieldInst){if($[t8B](dataSrc)){var o7J=i47;o7J+=a9V.K57;o7J+=f8B;for(var i=v57;i<dataSrc[o7J];i++){run(fieldInst,dataSrc[i]);}}else{run(fieldInst,dataSrc);}});if($[m7J](resolvedFields)){var y7J=a9V.K57;y7J+=G5B;y7J+=L47;y7J+=E47;Editor[y7J](e6O,y57);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){dt[v6O](identifier)[s6O]()[O8B](function(idx){var m6O="cell";var o6O="umn";var C6O="Name";var S6O="att";var M6O="attac";var k7J=P6O;k7J+=a9V.x57;var w7J=a9V.d87;w7J+=L47;w7J+=a9V.x57;w7J+=a9V.K57;var N7J=g17;N7J+=a9V.K57;N7J+=a9V.W57;var c7J=M6O;c7J+=T17;var a7J=S6O;a7J+=f0B;var d7J=E3X;d7J+=z17;d7J+=C6O;var B7J=a9V.l57;B7J+=Y47;B7J+=o6O;var f7J=k9O;f7J+=a9V.V57;var r7J=E47;r7J+=L47;r7J+=x77;var j7J=B67;j7J+=x77;var cell=dt[m6O](idx);var row=dt[j7J](idx[r7J]);var data=row[f7J]();var idSrc=idFn(data);var fields=forceFields||__dtFieldsFromIdx(dt,allFields,idx[B7J]);var isNode=typeof identifier===C0B&&identifier[d7J]||identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){prevAttach=out[idSrc][R4X];prevDisplayFields=out[idSrc][Z9O];}__dtRowSelector(out,dt,idx[n17],allFields,idFn);out[idSrc][a7J]=prevAttach||[];out[idSrc][c7J][Z8B](isNode?$(identifier)[N7J](v57):cell[w7J]());out[idSrc][Z9O]=prevDisplayFields||{};$[k7J](out[idSrc][Z9O],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var T7J=G67;T7J+=m2O;T7J+=a9V.K57;T7J+=a9V.o87;dt[v6O](o9B,identifier)[T7J]()[O8B](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var j6O='#';var y6O="\\";var g7J=y6O;g7J+=a9V.N87;g7J+=w87;var Z7J=h1X;Z7J+=u87;Z7J+=a9V.d87;Z7J+=g17;return typeof id===Z7J?j6O+id[D8B](/(:|\.|\[|\]|,)/g,g7J):j6O+id;};__dataSources[X1B]={individual:function(identifier,fieldNames){var q7J=a9V.W57;q7J+=a9V.V57;q7J+=D17;q7J+=V3B;var O7J=u87;O7J+=r6O;var idFn=DataTable[w8X][U2B][f6O](this[a9V.o87][O7J]);var dt=__dtApi(this[a9V.o87][q7J]);var fields=this[a9V.o87][v2X];var out={};var forceFields;var responsiveNode;if(fieldNames){if(!$[t8B](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[O8B](fieldNames,function(i,name){forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var Z6O="mn";var T6O="olu";var k6O="ows";var w6O="ell";var c6O="DataFn";var a6O="_fnGetObj";var d6O="isPlainObje";var B6O="lls";var h7J=A87;h7J+=B6O;var i7J=d6O;i7J+=j5X;var z7J=k2B;z7J+=i47;z7J+=l5X;var b7J=d4B;b7J+=D17;b7J+=V3B;var Y7J=a6O;Y7J+=j0B;Y7J+=a9V.W57;Y7J+=c6O;var X7J=L47;X7J+=S17;X7J+=g87;X7J+=u87;var idFn=DataTable[w8X][X7J][Y7J](this[a9V.o87][I0O]);var dt=__dtApi(this[a9V.o87][b7J]);var fields=this[a9V.o87][z7J];var out={};if($[i7J](identifier)&&(identifier[N8X]!==undefined||identifier[N6O]!==undefined||identifier[h7J]!==undefined)){var E7J=a9V.l57;E7J+=w6O;E7J+=a9V.o87;var p7J=n17;p7J+=a9V.o87;if(identifier[p7J]!==undefined){var G7J=E47;G7J+=k6O;__dtRowSelector(out,dt,identifier[G7J],fields,idFn);}if(identifier[N6O]!==undefined){var A7J=a9V.l57;A7J+=T6O;A7J+=Z6O;A7J+=a9V.o87;__dtColumnSelector(out,dt,identifier[A7J],fields,idFn);}if(identifier[E7J]!==undefined){var U7J=a9V.l57;U7J+=a9V.K57;U7J+=i47;U7J+=o77;__dtCellSelector(out,dt,identifier[U7J],fields,idFn);}}else{__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[a9V.o87][Y0X]);if(!__dtIsSsp(dt,this)){var D7J=a9V.d87;D7J+=L47;D7J+=a9V.x57;D7J+=a9V.K57;var J7J=E47;J7J+=L47;J7J+=x77;var row=dt[J7J][i5B](data);__dtHighlight(row[D7J]());}},edit:function(identifier,fields,data,store){var q6O="spli";var R7J=a9V.d87;R7J+=L47;R7J+=a9V.d87;R7J+=a9V.K57;var F7J=a9V.W57;F7J+=s3B;var dt=__dtApi(this[a9V.o87][F7J]);if(!__dtIsSsp(dt,this)||this[a9V.o87][X4O][g6O]===R7J){var Q7J=E3X;Q7J+=z17;var W7J=a9V.V57;W7J+=a9V.d87;W7J+=O77;var K7J=L47;K7J+=S17;K7J+=g87;K7J+=u87;var idFn=DataTable[w8X][K7J][f6O](this[a9V.o87][I0O]);var rowId=idFn(data);var row;try{var l7J=E47;l7J+=L47;l7J+=x77;row=dt[l7J](__dtjqId(rowId));}catch(e){row=dt;}if(!row[O6O]()){row=dt[n17](function(rowIdx,rowData,rowNode){return rowId==idFn(rowData);});}if(row[W7J]()){var x7J=q6O;x7J+=A87;var t7J=B67;t7J+=X6O;t7J+=a9V.o87;var V7J=B67;V7J+=x77;V7J+=j8B;row[A2B](data);var idx=$[S2X](rowId,store[V7J]);store[t7J][x7J](idx,s57);}else{var u7J=a9V.V57;u7J+=a9V.x57;u7J+=a9V.x57;row=dt[n17][u7J](data);}__dtHighlight(row[Q7J]());}},remove:function(identifier,fields,store){var Y6O="celled";var H6J=a9V.l57;H6J+=U7B;H6J+=Y6O;var L6J=a9V.W57;L6J+=s3B;var dt=__dtApi(this[a9V.o87][L6J]);var cancelled=store[H6J];if(cancelled[o0B]===v57){dt[N8X](identifier)[f1B]();}else{var S6J=G8B;S6J+=a9V.t57;S6J+=L47;S6J+=I6X;var s6J=D2O;s6J+=a9V.v87;var v6J=n17;v6J+=a9V.o87;var e6J=u87;e6J+=r6O;var I6J=L47;I6J+=S17;I6J+=C17;var n6J=a9V.K57;n6J+=K87;n6J+=a9V.W57;var idFn=DataTable[n6J][I6J][f6O](this[a9V.o87][e6J]);var indexes=[];dt[v6J](identifier)[s6J](function(){var b6O="ind";var P6J=G67;P6J+=N7X;var id=idFn(this[A2B]());if($[P6J](id,cancelled)===-s57){var M6J=b6O;M6J+=P3B;indexes[Z8B](this[M6J]());}});dt[N8X](indexes)[S6J]();}},prep:function(action,identifier,submit,json,store){var G6O="cancelle";var p6O="lled";var h6O="can";var z6O="cancelled";var j6J=E47;j6J+=z6X;j6J+=r17;var C6J=f2X;C6J+=u87;C6J+=a9V.W57;if(action===C6J){var o6J=B67;o6J+=x77;o6J+=j8B;var cancelled=json[z6O]||[];store[o6J]=$[U8X](submit[A2B],function(val,key){var i6O="mptyObject";var y6J=N2O;y6J+=d4B;var m6J=e8B;m6J+=e77;m6J+=i6O;return!$[m6J](submit[y6J][key])&&$[S2X](key,cancelled)===-s57?key:undefined;});}else if(action===j6J){var f6J=h6O;f6J+=A87;f6J+=p6O;var r6J=G6O;r6J+=a9V.x57;store[r6J]=json[f6J]||[];}},commit:function(action,identifier,data,store){var J6O="Sr";var U6O="rowIds";var E6O="abl";var A6O="tOpts";var Z6J=E3X;Z6J+=k17;var T6J=f2X;T6J+=u87;T6J+=A6O;var d6J=a9V.K57;d6J+=e3B;var B6J=a9V.W57;B6J+=E6O;B6J+=a9V.K57;var dt=__dtApi(this[a9V.o87][B6J]);if(action===d6J&&store[U6O][o0B]){var c6J=u2B;c6J+=J6O;c6J+=a9V.l57;var a6J=E47;a6J+=L47;a6J+=X6O;a6J+=a9V.o87;var ids=store[a6J];var idFn=DataTable[w8X][U2B][f6O](this[a9V.o87][c6J]);var row;var compare=function(id){return function(rowIdx,rowData,rowNode){return id==idFn(rowData);};};for(var i=v57,ien=ids[o0B];i<ien;i++){var k6J=a9V.V57;k6J+=a9V.d87;k6J+=O77;try{var N6J=E47;N6J+=L47;N6J+=x77;row=dt[N6J](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[O6O]()){var w6J=B67;w6J+=x77;row=dt[w6J](compare(ids[i]));}if(row[k6J]()){row[f1B]();}}}var drawType=this[a9V.o87][T6J][g6O];if(drawType!==Z6J){var g6J=a9V.x57;g6J+=E47;g6J+=a9V.V57;g6J+=x77;dt[g6J](drawType);}}};function __html_id(identifier){var l6O="`id` of: ";var K6O="editor-id` or ";var R6O="Could not find an element with `data-";var F6O='[data-editor-id="';var context=document;if(identifier!==D6O){var O6J=F3B;O6J+=R3B;context=$(F6O+identifier+O6J);if(context[o0B]===v57){context=typeof identifier===J8B?$(__dtjqId(identifier)):$(identifier);}if(context[o0B]===v57){var q6J=R6O;q6J+=K6O;q6J+=l6O;throw q6J+identifier;}}return context;}function __html_el(identifier,name){var W6O='[data-editor-field="';var X6J=F3B;X6J+=R3B;var context=__html_id(identifier);return $(W6O+name+X6J,context);}function __html_els(identifier,names){var Y6J=V3B;Y6J+=a9V.d87;Y6J+=g17;Y6J+=u8B;var out=$();for(var i=v57,ien=names[Y6J];i<ien;i++){out=out[i5B](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var u6O="r-value]";var V6O="ta-editor-value";var h6J=N2O;h6J+=V6O;var i6J=a9V.V57;i6J+=a9V.W57;i6J+=a9V.W57;i6J+=E47;var z6J=X9X;z6J+=g17;z6J+=u8B;var b6J=t6O;b6J+=a9V.K57;b6J+=x6O;b6J+=u6O;var el=__html_el(identifier,dataSrc);return el[Q6O](b6J)[z6J]?el[i6J](h6J):el[o8B]();}function __html_set(identifier,fields,data){$[O8B](fields,function(name,field){var v1O='data-editor-value';var I1O="aSr";var n1O="e]";var H1O="or-valu";var L1O="[data-edi";var val=field[I2X](data);if(val!==undefined){var G6J=L1O;G6J+=a9V.W57;G6J+=H1O;G6J+=n1O;var p6J=k9O;p6J+=I1O;p6J+=a9V.l57;var el=__html_el(identifier,field[p6J]());if(el[Q6O](G6J)[o0B]){var A6J=a9V.V57;A6J+=e1O;el[A6J](v1O,val);}else{var D6J=T17;D6J+=a9V.W57;D6J+=a9V.t57;D6J+=i47;el[O8B](function(){var M1O="removeChild";var P1O="firstCh";var s1O="ldN";var U6J=P4X;U6J+=T17;var E6J=W1B;E6J+=u87;E6J+=s1O;E6J+=l2X;while(this[E6J][U6J]){var J6J=P1O;J6J+=u87;J6J+=T2B;this[M1O](this[J6J]);}})[D6J](val);}}});}__dataSources[F6J]={initField:function(cfg){var o1O="bel=\"";var C1O="[data-editor-la";var W6J=P4X;W6J+=T17;var l6J=S1O;l6J+=i47;var K6J=F3B;K6J+=R3B;var R6J=C1O;R6J+=o1O;var label=$(R6J+(cfg[A2B]||cfg[h2B])+K6J);if(!cfg[l6J]&&label[W6J]){cfg[f5X]=label[o8B]();}},individual:function(identifier,fieldNames){var c1O='Cannot automatically determine field name from data source';var a1O='andSelf';var d1O="tor-field";var B1O="data-edi";var f1O="dBack";var r1O="tor-id]";var j1O="or-id";var y1O="nodeName";var m1O="ll";var e1J=L0B;e1J+=a9V.K57;e1J+=W0X;var I1J=a9V.l57;I1J+=a9V.V57;I1J+=m1O;var n1J=k2B;n1J+=T2B;n1J+=a9V.o87;var H1J=T17;H1J+=a9V.W57;H1J+=B4B;var L1J=i47;L1J+=a9V.j87;L1J+=g17;L1J+=u8B;var attachEl;if(identifier instanceof $||identifier[y1O]){var Q6J=a9V.K57;Q6J+=e3B;Q6J+=j1O;var u6J=t6O;u6J+=q87;u6J+=r1O;var x6J=a9V.V57;x6J+=a9V.x57;x6J+=f1O;attachEl=identifier;if(!fieldNames){var t6J=B1O;t6J+=d1O;var V6J=a9V.V57;V6J+=a9V.W57;V6J+=e1X;fieldNames=[$(identifier)[V6J](t6J)];}var back=$[j0O][v7X]?x6J:a1O;identifier=$(identifier)[P5B](u6J)[back]()[A2B](Q6J);}if(!identifier){identifier=D6O;}if(fieldNames&&!$[t8B](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames||fieldNames[L1J]===v57){throw c1O;}var out=__dataSources[H1J][n1J][I1J](this,identifier);var fields=this[a9V.o87][e1J];var forceFields={};$[O8B](fieldNames,function(i,name){forceFields[name]=fields[name];});$[O8B](out,function(id,set){var N1O="displayField";var M1J=N1O;M1J+=a9V.o87;var P1J=k2B;P1J+=T2B;P1J+=a9V.o87;var s1J=X87;s1J+=S17;s1J+=E47;s1J+=Y5X;var v1J=a9V.l57;v1J+=F77;v1J+=i47;set[S67]=v1J;set[R4X]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[s1J]();set[P1J]=fields;set[M1J]=forceFields;});return out;},fields:function(identifier){var m1J=I4X;m1J+=a9V.l57;m1J+=T17;var C1J=e8B;C1J+=S17;C1J+=E47;C1J+=Y5X;var S1J=f4B;S1J+=B4B;var out={};var self=__dataSources[S1J];if($[C1J](identifier)){var o1J=V3B;o1J+=a9V.d87;o1J+=g17;o1J+=u8B;for(var i=v57,ien=identifier[o1J];i<ien;i++){var res=self[v2X][D9B](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[a9V.o87][v2X];if(!identifier){identifier=D6O;}$[m1J](fields,function(name,field){var k1O="dataSrc";var w1O="lToD";var y1J=X9B;y1J+=w1O;y1J+=a9V.V57;y1J+=d4B;var val=__html_get(identifier,field[k1O]());field[y1J](data,val===o9B?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:T9O};return out;},create:function(fields,data){if(data){var f1J=u2B;f1J+=B77;f1J+=E47;f1J+=a9V.l57;var r1J=d4O;r1J+=u87;var j1J=a9V.K57;j1J+=K87;j1J+=a9V.W57;var idFn=DataTable[j1J][r1J][f6O](this[a9V.o87][f1J]);var id=idFn(data);try{var B1J=i47;B1J+=a9V.K57;B1J+=a9V.d87;B1J+=D0X;if(__html_id(id)[B1J]){__html_set(id,fields,data);}}catch(e){}}},edit:function(identifier,fields,data){var q1O="taFn";var O1O="nGetObjectDa";var g1O="_f";var Z1O="rc";var T1O="keyl";var c1J=T1O;c1J+=a9V.K57;c1J+=a6B;var a1J=u87;a1J+=a9V.x57;a1J+=B77;a1J+=Z1O;var d1J=g1O;d1J+=O1O;d1J+=q1O;var idFn=DataTable[w8X][U2B][d1J](this[a9V.o87][a1J]);var id=idFn(data)||c1J;__html_set(id,fields,data);},remove:function(identifier,fields){__html_id(identifier)[f1B]();}};}());Editor[L2X]={"wrapper":N1J,"processing":{"indicator":w1J,"active":k1J},"header":{"wrapper":T1J,"content":Z1J},"body":{"wrapper":K47,"content":g1J},"footer":{"wrapper":O1J,"content":q1J},"form":{"wrapper":X1J,"content":X1O,"tag":a9V.L87,"info":Y1O,"error":Y1J,"buttons":b1O,"button":z1O},"field":{"wrapper":b1J,"typePrefix":i1O,"namePrefix":h1O,"label":z1J,"input":p1O,"inputControl":i1J,"error":h1J,"msg-label":G1O,"msg-error":p1J,"msg-message":G1J,"msg-info":A1J,"multiValue":E1J,"multiInfo":A1O,"multiRestore":E1O,"multiNoEdit":U1O,"disabled":H5B},"actions":{"create":J1O,"edit":D1O,"remove":U1J},"inline":{"wrapper":J1J,"liner":D1J,"buttons":F1J},"bubble":{"wrapper":F1O,"liner":R1O,"table":R1J,"close":K1J,"pointer":K1O,"bg":l1J}};(function(){var H0q="removeSingle";var L0q="editSingle";var x3q="ws";var W3q='buttons-remove';var p3q="formButtons";var z3q="rmMessage";var S3q="select_single";var M3q="editor_edit";var v3q="NS";var e3q="TO";var I3q="BUT";var n3q="editor_c";var H3q="_rem";var L3q="eate";var Q1O="uttons-cr";var u1O="ns-";var x1O="editSingl";var t1O="Single";var W1O="gle";var l1O="selectedS";var N0p=l1O;N0p+=G67;N0p+=W1O;var c0p=P3B;c0p+=a9V.W57;c0p+=l7B;var a0p=j17;a0p+=N77;a0p+=a9V.K57;var d0p=a9V.K57;d0p+=K87;d0p+=a9V.W57;d0p+=l7B;var B0p=V1O;B0p+=t1O;var f0p=H0O;f0p+=a9V.d87;f0p+=a9V.x57;var r0p=P3B;r0p+=k8X;r0p+=a9V.x57;var j0p=x1O;j0p+=a9V.K57;var u3p=E47;u3p+=L47;u3p+=x77;u3p+=a9V.o87;var R3p=E17;R3p+=u1O;R3p+=f2X;R3p+=T67;var q3p=D17;q3p+=Q1O;q3p+=L3q;var T3p=P3B;T3p+=a9V.W57;if(DataTable[f0O]){var S3p=T0O;S3p+=H3q;S3p+=r17;var n3p=P3B;n3p+=R77;n3p+=z7B;var t1J=a9V.W57;t1J+=a9V.K57;t1J+=K87;t1J+=a9V.W57;var V1J=n3q;V1J+=E47;V1J+=L3q;var W1J=I3q;W1J+=e3q;W1J+=v3q;var ttButtons=DataTable[f0O][W1J];var ttButtonBase={sButtonText:o9B,editor:o9B,formTitle:o9B};ttButtons[V1J]=$[r9B](r0B,ttButtons[t1J],ttButtonBase,{formButtons:[{label:o9B,fn:function(e){this[N2X]();}}],fnClick:function(button,config){var s3q="formButt";var H3p=a9V.W57;H3p+=T67;H3p+=i47;H3p+=a9V.K57;var u1J=s3q;u1J+=L5X;var x1J=u87;x1J+=P3q;x1J+=a9V.d87;var editor=config[T0O];var i18nCreate=editor[x1J][G5X];var buttons=config[u1J];if(!buttons[v57][f5X]){var L3p=m2X;L3p+=D17;L3p+=a9V.t57;L3p+=T67;var Q1J=S1O;Q1J+=i47;buttons[v57][Q1J]=i18nCreate[L3p];}editor[G5X]({title:i18nCreate[H3p],buttons:buttons});}});ttButtons[M3q]=$[n3p](r0B,ttButtons[S3q],ttButtonBase,{formButtons:[{label:o9B,fn:function(e){this[N2X]();}}],fnClick:function(button,config){var m3q="fnGetSelectedIndexes";var C3q="rmButt";var M3p=a9V.W57;M3p+=u87;M3p+=Y6X;var P3p=f2X;P3p+=u87;P3p+=a9V.W57;var v3p=i47;v3p+=m5B;v3p+=F77;var e3p=U5B;e3p+=C3q;e3p+=L47;e3p+=M77;var I3p=f2X;I3p+=u87;I3p+=o3q;var selected=this[m3q]();if(selected[o0B]!==s57){return;}var editor=config[I3p];var i18nEdit=editor[X2B][v17];var buttons=config[e3p];if(!buttons[v57][v3p]){var s3p=C7O;s3p+=T67;buttons[v57][f5X]=i18nEdit[s3p];}editor[P3p](selected[v57],{title:i18nEdit[M3p],buttons:buttons});}});ttButtons[S3p]=$[r9B](r0B,ttButtons[y3q],ttButtonBase,{question:o9B,formButtons:[{label:o9B,fn:function(e){var C3p=a9V.o87;C3p+=U2O;C3p+=a9V.t57;C3p+=T67;var that=this;this[C3p](function(json){var B3q="fnSelectNone";var f3q="fnGetInstance";var r3q="bleTo";var j3q="Ta";var o3p=j3q;o3p+=r3q;o3p+=Y47;o3p+=a9V.o87;var tt=$[j0O][X1B][o3p][f3q]($(that[a9V.o87][Y0X])[b0X]()[Y0X]()[B8X]());tt[B3q]();});}}],fnClick:function(button,config){var g3q="dexes";var Z3q="etSelectedIn";var T3q="nG";var k3q="mov";var w3q="ttons";var N3q="formBu";var c3q="nfirm";var a3q="fir";var d3q="eplace";var k3p=E47;k3p+=d3q;var w3p=E47;w3p+=z6X;w3p+=L47;w3p+=I6X;var c3p=r5B;c3p+=a3q;c3p+=a9V.t57;var a3p=P4X;a3p+=T17;var d3p=Z4X;d3p+=a9V.d87;d3p+=L0B;d3p+=g0X;var B3p=a9V.l57;B3p+=L47;B3p+=c3q;var f3p=r5B;f3p+=L0B;f3p+=E47;f3p+=a9V.t57;var r3p=N3q;r3p+=w3q;var j3p=E47;j3p+=a9V.K57;j3p+=k3q;j3p+=a9V.K57;var y3p=u87;y3p+=w87;y3p+=u9X;y3p+=a9V.d87;var m3p=a9V.B87;m3p+=T3q;m3p+=Z3q;m3p+=g3q;var rows=this[m3p]();if(rows[o0B]===v57){return;}var editor=config[T0O];var i18nRemove=editor[y3p][j3p];var buttons=config[r3p];var question=typeof i18nRemove[f3p]===J8B?i18nRemove[B3p]:i18nRemove[i6X][rows[o0B]]?i18nRemove[d3p][rows[a3p]]:i18nRemove[c3p][s67];if(!buttons[v57][f5X]){var N3p=m3O;N3p+=a9V.t57;N3p+=u87;N3p+=a9V.W57;buttons[v57][f5X]=i18nRemove[N3p];}editor[w3p](rows,{message:question[k3p](/%d/g,rows[o0B]),title:i18nRemove[d9X],buttons:buttons});}});}var _buttons=DataTable[T3p][c9X];$[r9B](_buttons,{create:{text:function(dt,node,config){var q3q="reate";var O3q="ns.";var O3p=a9V.l57;O3p+=E47;O3p+=L3q;var g3p=a9V.K57;g3p+=x6O;g3p+=E47;var Z3p=E17;Z3p+=O3q;Z3p+=a9V.l57;Z3p+=q3q;return dt[X2B](Z3p,config[g3p][X2B][O3p][B5X]);},className:q3p,editor:o9B,formButtons:{text:function(editor){var Y3q="i18";var X3q="rea";var b3p=a9V.o87;b3p+=U2O;b3p+=a9V.t57;b3p+=T67;var Y3p=a9V.l57;Y3p+=X3q;Y3p+=a9V.W57;Y3p+=a9V.K57;var X3p=Y3q;X3p+=a9V.d87;return editor[X3p][Y3p][b3p];},action:function(e){var z3p=m3O;z3p+=w4O;this[z3p]();}},formMessage:o9B,formTitle:o9B,action:function(e,dt,node,config){var h3q="eat";var i3q="Buttons";var b3q="Ti";var U3p=m4B;U3p+=a9V.W57;U3p+=i47;U3p+=a9V.K57;var E3p=u87;E3p+=w87;E3p+=u9X;E3p+=a9V.d87;var A3p=v77;A3p+=b3q;A3p+=a9V.W57;A3p+=V3B;var G3p=U5B;G3p+=z3q;var p3p=v77;p3p+=i3q;var h3p=k3X;h3p+=h3q;h3p+=a9V.K57;var i3p=v17;i3p+=L47;i3p+=E47;var editor=config[i3p];var buttons=config[p3q];editor[h3p]({buttons:config[p3p],message:config[G3p],title:config[A3p]||editor[E3p][G5X][U3p]});}},edit:{extend:G3q,text:function(dt,node,config){var E3q='buttons.edit';var A3q="i1";var F3p=D17;F3p+=Q9X;F3p+=L47;F3p+=a9V.d87;var D3p=A3q;D3p+=F3O;var J3p=u87;J3p+=P3q;J3p+=a9V.d87;return dt[J3p](E3q,config[T0O][D3p][v17][F3p]);},className:R3p,editor:o9B,formButtons:{text:function(editor){var K3p=a9V.K57;K3p+=a9V.x57;K3p+=u87;K3p+=a9V.W57;return editor[X2B][K3p][N2X];},action:function(e){var l3p=a9V.o87;l3p+=v0B;l3p+=y2X;l3p+=T67;this[l3p]();}},formMessage:o9B,formTitle:o9B,action:function(e,dt,node,config){var F3q="formTitle";var D3q="formMessage";var J3q="nde";var x3p=a9V.W57;x3p+=T67;x3p+=i47;x3p+=a9V.K57;var t3p=q87;t3p+=a9V.W57;var V3p=i47;V3p+=U3q;var W3p=u87;W3p+=J3q;W3p+=t1X;W3p+=a9V.o87;var editor=config[T0O];var rows=dt[N8X]({selected:r0B})[s6O]();var columns=dt[N6O]({selected:r0B})[s6O]();var cells=dt[v6O]({selected:r0B})[W3p]();var items=columns[V3p]||cells[o0B]?{rows:rows,columns:columns,cells:cells}:rows;editor[v17](items,{message:config[D3q],buttons:config[p3q],title:config[F3q]||editor[X2B][t3p][x3p]});}},remove:{extend:G3q,limitTo:[u3p],text:function(dt,node,config){var l3q="emove";var K3q="ttons.";var L0p=u87;L0p+=w87;L0p+=u9X;L0p+=a9V.d87;var Q3p=R3q;Q3p+=K3q;Q3p+=E47;Q3p+=l3q;return dt[X2B](Q3p,config[T0O][L0p][f1B][B5X]);},className:W3q,editor:o9B,formButtons:{text:function(editor){return editor[X2B][f1B][N2X];},action:function(e){this[N2X]();}},formMessage:function(editor,dt){var t3q="dexe";var V3q="firm";var P0p=V3B;P0p+=f8B;var s0p=i47;s0p+=a9V.K57;s0p+=B6X;s0p+=T17;var v0p=Z4X;v0p+=a9V.d87;v0p+=V3q;var e0p=a9V.l57;e0p+=G9B;e0p+=L0B;e0p+=g0X;var I0p=E47;I0p+=z6X;I0p+=r17;var n0p=G67;n0p+=t3q;n0p+=a9V.o87;var H0p=E47;H0p+=L47;H0p+=x3q;var rows=dt[H0p]({selected:r0B})[n0p]();var i18n=editor[X2B][I0p];var question=typeof i18n[e0p]===J8B?i18n[v0p]:i18n[i6X][rows[o0B]]?i18n[i6X][rows[s0p]]:i18n[i6X][s67];return question[D8B](/%d/g,rows[P0p]);},formTitle:o9B,action:function(e,dt,node,config){var Q3q="mButto";var u3q="mT";var y0p=j17;y0p+=L47;y0p+=I6X;var m0p=x8X;m0p+=u3q;m0p+=T67;m0p+=V3B;var o0p=U5B;o0p+=z3q;var C0p=x8X;C0p+=Q3q;C0p+=a9V.d87;C0p+=a9V.o87;var S0p=B67;S0p+=x3q;var M0p=A0O;M0p+=a9V.K57;var editor=config[T0O];editor[M0p](dt[S0p]({selected:r0B})[s6O](),{buttons:config[C0p],message:config[o0p],title:config[m0p]||editor[X2B][y0p][d9X]});}}});_buttons[j0p]=$[r0p]({},_buttons[v17]);_buttons[L0q][f0p]=B0p;_buttons[H0q]=$[d0p]({},_buttons[a0p]);_buttons[H0q][c0p]=N0p;}());Editor[b2B]={};Editor[w0p]=function(input,opts){var k2q="calendar";var N2q=/[haA]/;var c2q=/[Hhm]|LT|LTS/;var a2q=/[YMD]|L(?!T)|l/;var d2q='editor-dateime-';var B2q='-time';var f2q='-date';var m2q='-month"/>';var o2q='-iconRight">';var C2q='-title">';var s2q='<select class="';var v2q='<span/>';var n2q='<button>';var V0q="time: Without momentjs only the format 'YYYY-MM-DD' can be used";var W0q="Editor date";var l0q='YYYY-MM-DD';var R0q="moment";var F0q="DateTim";var D0q="assPrefi";var J0q=" class=\"";var U0q="ss=\"";var E0q=" cl";var A0q="<div";var G0q="date\">";var p0q="Left\">";var h0q="-icon";var i0q="iou";var z0q="pre";var b0q="ton>";var Y0q="/div";var q0q="iv class";var O0q="ct class=\"";var g0q="<sele";var Z0q="l\">";var T0q="<span/";var k0q="ar\"/>";var w0q="ye";var N0q="/di";var c0q="r\"/>";var a0q="calen";var B0q="iv class=\"";var f0q="<d";var j0q="rror\"/";var y0q="-tit";var m0q="dar";var o0q="-cale";var C0q="-e";var M0q="DateT";var P0q="nce";var s0q="sta";var e0q="mat";var I0q="ruc";var n0q="nst";var O2p=J67;O2p+=n0q;O2p+=I0q;O2p+=o3q;var g2p=a9V.x57;g2p+=B5B;var Z2p=H5X;Z2p+=z7B;var T2p=m4B;T2p+=a9V.W57;T2p+=i47;T2p+=a9V.K57;var k2p=h5B;k2p+=a9V.t57;var w2p=a9V.K57;w2p+=G5B;w2p+=L47;w2p+=E47;var N2p=a9V.x57;N2p+=B5B;var c2p=a9V.x57;c2p+=L47;c2p+=a9V.t57;var a2p=h5B;a2p+=a9V.t57;var d2p=e0q;d2p+=W1B;var B2p=a9V.B87;B2p+=t2O;B2p+=F87;var f2p=v0q;f2p+=a9V.d87;f2p+=s0q;f2p+=P0q;var r2p=M0q;r2p+=S0q;var j2p=C0q;j2p+=E47;j2p+=B67;j2p+=E47;var y2p=a9V.B87;y2p+=u87;y2p+=a9V.d87;y2p+=a9V.x57;var m2p=a9V.B87;m2p+=G67;m2p+=a9V.x57;var o2p=o0q;o2p+=a9V.d87;o2p+=m0q;var C2p=y0q;C2p+=V3B;var S2p=a9V.B87;S2p+=u87;S2p+=a9V.d87;S2p+=a9V.x57;var M2p=a9V.B87;M2p+=u87;M2p+=z7B;var P2p=a9V.x57;P2p+=L47;P2p+=a9V.t57;var s2p=C0q;s2p+=j0q;s2p+=Y0B;var v2p=a9V.t57;v2p+=G67;v2p+=B4X;v2p+=Q3B;var e2p=r0q;e2p+=S0q;e2p+=n7B;var I2p=f0q;I2p+=B0q;var n2p=g0B;n2p+=Y2X;n2p+=Y0B;var H2p=d0q;H2p+=a0q;H2p+=N2O;H2p+=c0q;var L2p=L7B;L2p+=N0q;L2p+=O0B;var Q0p=d0q;Q0p+=w0q;Q0p+=k0q;var u0p=T0q;u0p+=Y0B;var x0p=d0q;x0p+=m17;x0p+=z47;x0p+=Z0q;var t0p=g0B;t0p+=b1B;var V0p=g0q;V0p+=O0q;var W0p=P2B;W0p+=Z0q;var l0p=f0q;l0p+=q0q;l0p+=X0q;l0p+=F3B;var K0p=L7B;K0p+=Y0q;K0p+=Y0B;var R0p=a9V.d87;R0p+=P3B;R0p+=a9V.W57;var F0p=m5X;F0p+=b0q;var D0p=V4B;D0p+=O0B;var J0p=z0q;J0p+=j47;J0p+=i0q;J0p+=a9V.o87;var U0p=h0q;U0p+=p0q;var E0p=d0q;E0p+=G0q;var A0p=A0q;A0p+=E0q;A0p+=a9V.V57;A0p+=U0q;var G0p=A0q;G0p+=J0q;var g0p=u87;g0p+=w87;g0p+=F3O;var Z0p=p17;Z0p+=D0q;Z0p+=K87;var T0p=F0q;T0p+=a9V.K57;var k0p=P3B;k0p+=k8X;k0p+=a9V.x57;this[a9V.l57]=$[k0p](r0B,{},Editor[T0p][n0O],opts);var classPrefix=this[a9V.l57][Z0p];var i18n=this[a9V.l57][g0p];if(!window[R0q]&&this[a9V.l57][K0q]!==l0q){var O0p=W0q;O0p+=V0q;throw O0p;}var timeBlock=function(type){var P2q='-iconDown">';var e2q='-label">';var H2q='-iconUp">';var L2q='-timeblock">';var Q0q="ious";var u0q="<div class=";var x0q="nex";var t0q="/button>";var h0p=g0B;h0p+=Y2X;h0p+=Y0B;var i0p=L7B;i0p+=t0q;var z0p=x0q;z0p+=a9V.W57;var b0p=u0q;b0p+=F3B;var Y0p=L7B;Y0p+=Y0q;Y0p+=Y0B;var X0p=F3B;X0p+=F0B;X0p+=Y0B;var q0p=n67;q0p+=D2O;q0p+=Q0q;return W2B+classPrefix+L2q+W2B+classPrefix+H2q+n2q+i18n[q0p]+I2q+H9B+W2B+classPrefix+e2q+v2q+s2q+classPrefix+l7X+type+X0p+Y0p+b0p+classPrefix+P2q+n2q+i18n[z0p]+i0p+h0p+H9B;};var gap=function(){var S2q="n>:</span>";var M2q="<spa";var p0p=M2q;p0p+=S2q;return p0p;};var structure=$(G0p+classPrefix+Q2B+A0p+classPrefix+E0p+W2B+classPrefix+C2q+W2B+classPrefix+U0p+n2q+i18n[J0p]+I2q+D0p+W2B+classPrefix+o2q+F0p+i18n[R0p]+I2q+K0p+l0p+classPrefix+W0p+v2q+V0p+classPrefix+m2q+t0p+W2B+classPrefix+x0p+u0p+s2q+classPrefix+Q0p+H9B+L2p+W2B+classPrefix+H2p+n2p+I2p+classPrefix+e2p+timeBlock(y2q)+gap()+timeBlock(v2p)+gap()+timeBlock(j2q)+timeBlock(r2q)+H9B+W2B+classPrefix+s2p+H9B);this[P2p]={container:structure,date:structure[M2p](t4X+classPrefix+f2q),title:structure[S2p](t4X+classPrefix+C2p),calendar:structure[V4X](t4X+classPrefix+o2p),time:structure[m2p](t4X+classPrefix+B2q),error:structure[y2p](t4X+classPrefix+j2p),input:$(input)};this[a9V.o87]={d:o9B,display:o9B,namespace:d2q+Editor[r2p][f2p]++,parts:{date:this[a9V.l57][B2p][U9O](a2q)!==o9B,time:this[a9V.l57][K0q][d2p](c2q)!==o9B,seconds:this[a9V.l57][K0q][V9O](h3B)!==-s57,hours12:this[a9V.l57][K0q][U9O](N2q)!==o9B}};this[a2p][p5B][o7B](this[c2p][w2q])[o7B](this[w9B][p87])[o7B](this[N2p][w2p]);this[k2p][w2q][o7B](this[w9B][T2p])[Z2p](this[g2p][k2q]);this[O2p]();};$[q2p](Editor[X2p][Y2p],{destroy:function(){var O2q="empty";var g2q="_hide";var T2q=".editor-";var i2p=T2q;i2p+=Z2q;var z2p=a9V.x57;z2p+=L47;z2p+=a9V.t57;var b2p=a9V.x57;b2p+=B5B;this[g2q]();this[b2p][p5B][W7B]()[O2q]();this[z2p][I9B][W7B](i2p);},errorMsg:function(msg){var q2q="mpty";var h2p=a9V.x57;h2p+=L47;h2p+=a9V.t57;var error=this[h2p][V5B];if(msg){error[o8B](msg);}else{var p2p=a9V.K57;p2p+=q2q;error[p2p]();}},hide:function(){var X2q="_hid";var G2p=X2q;G2p+=a9V.K57;this[G2p]();},max:function(date){var A2p=n0X;A2p+=K87;A2p+=D8O;A2p+=a9V.K57;this[a9V.l57][A2p]=date;this[Y2q]();this[b2q]();},min:function(date){var i2q="tCalander";var U2p=z2q;U2p+=a9V.K57;U2p+=i2q;var E2p=a9V.t57;E2p+=G67;E2p+=D8O;E2p+=a9V.K57;this[a9V.l57][E2p]=date;this[Y2q]();this[U2p]();},owns:function(node){var p2q="pare";var D2p=Z4X;D2p+=h2q;D2p+=k17;D2p+=E47;var J2p=p2q;J2p+=O4X;return $(node)[J2p]()[Q6O](this[w9B][D2p])[o0B]>v57;},val:function(set,write){var L9q="_setTime";var V2q=/(\d{4})\-(\d{2})\-(\d{2})/;var l2q="utc";var K2q="omentLo";var R2q="Val";var F2q="toD";var D2q="oment";var J2q="eToUt";var U2q="tri";var E2q="toS";var A2q="lander";var G2q="_setCa";var L9p=G2q;L9p+=A2q;var Q2p=H3B;Q2p+=P8O;var u2p=E2q;u2p+=U2q;u2p+=a9V.d87;u2p+=g17;if(set===undefined){return this[a9V.o87][a9V.x57];}if(set instanceof Date){var F2p=u4O;F2p+=J2q;F2p+=a9V.l57;this[a9V.o87][a9V.x57]=this[F2p](set);}else if(set===o9B||set===i3B){this[a9V.o87][a9V.x57]=o9B;}else if(typeof set===J8B){var R2p=a9V.t57;R2p+=D2q;if(window[R2p]){var V2p=F2q;V2p+=t77;var W2p=e8B;W2p+=R2q;W2p+=u2B;var l2p=a9V.t57;l2p+=K2q;l2p+=E1X;l2p+=a9V.K57;var K2p=a9V.t57;K2p+=D2q;var m=window[K2p][l2q](set,this[a9V.l57][K0q],this[a9V.l57][l2p],this[a9V.l57][W2q]);this[a9V.o87][a9V.x57]=m[W2p]()?m[V2p]():o9B;}else{var t2p=i77;t2p+=I77;t2p+=V77;var match=set[U9O](V2q);this[a9V.o87][a9V.x57]=match?new Date(Date[t2p](match[s57],match[P57]-s57,match[M57])):o9B;}}if(write||write===undefined){if(this[a9V.o87][a9V.x57]){this[t2q]();}else{var x2p=j47;x2p+=x1X;this[w9B][I9B][x2p](set);}}if(!this[a9V.o87][a9V.x57]){this[a9V.o87][a9V.x57]=this[x2q](new Date());}this[a9V.o87][M8B]=new Date(this[a9V.o87][a9V.x57][u2p]());this[a9V.o87][Q2p][u2q](s57);this[Q2q]();this[L9p]();this[L9q]();},_constructor:function(){var Q9q="UT";var W9q="setUTCFullYear";var G9q='keyup.editor-datetime';var z9q='pm';var b9q="minutesIncrement";var Y9q="_optionsTime";var X9q="editor-datetime-timeblock";var O9q='span';var g9q="meblock";var Z9q="editor-datetime-ti";var k9q="q";var N9q="onChange";var a9q="sec";var d9q="sTitle";var r9q="Tim";var y9q="12";var m9q="our";var o9q="tes";var C9q="minu";var S9q="ncrement";var M9q="ondsI";var P9q="amP";var s9q="atetime";var v9q="lick.editor-d";var e9q="-datetime c";var I9q="focus.editor";var H9q="sele";var M5p=a9V.l57;M5p+=i47;M5p+=o3X;M5p+=d0B;var F9p=H9q;F9p+=j5X;var D9p=r5B;D9p+=a9V.W57;D9p+=n9q;var X9p=I9q;X9p+=e9q;X9p+=v9q;X9p+=s9q;var q9p=L47;q9p+=a9V.d87;var O9p=u87;O9p+=a9V.d87;O9p+=g87;O9p+=B4X;var g9p=P9q;g9p+=a9V.t57;var Z9p=H47;Z9p+=a9V.l57;Z9p+=M9q;Z9p+=S9q;var T9p=H47;T9p+=a9V.l57;T9p+=G9B;T9p+=l5X;var k9p=C9q;k9p+=o9q;var w9p=T17;w9p+=m9q;w9p+=a9V.o87;w9p+=y9q;var N9p=j9q;N9p+=r9q;N9p+=a9V.K57;var c9p=f9q;c9p+=B9q;c9p+=d9q;var P9p=a9q;P9p+=L47;P9p+=a9V.d87;P9p+=l5X;var s9p=g2O;s9p+=E47;s9p+=a9V.W57;s9p+=a9V.o87;var H9p=g2O;H9p+=E47;H9p+=t7X;var that=this;var classPrefix=this[a9V.l57][c9q];var container=this[w9B][p5B];var i18n=this[a9V.l57][X2B];var onChange=this[a9V.l57][N9q];if(!this[a9V.o87][H9p][w2q]){var n9p=O4B;n9p+=a9V.o87;this[w9B][w2q][n9p](j9B,S5B);}if(!this[a9V.o87][w9q][p87]){var v9p=a9V.d87;v9p+=G9B;v9p+=a9V.K57;var e9p=a9V.x57;e9p+=F1B;e9p+=R1B;var I9p=a9V.l57;I9p+=a6B;this[w9B][p87][I9p](e9p,v9p);}if(!this[a9V.o87][s9p][P9p]){var r9p=G8B;r9p+=n6X;r9p+=I6X;var j9p=a9V.K57;j9p+=k9q;var y9p=L9O;y9p+=a9V.j87;var m9p=a9V.W57;m9p+=u87;m9p+=a9V.t57;m9p+=a9V.K57;var o9p=a9V.x57;o9p+=L47;o9p+=a9V.t57;var C9p=T9q;C9p+=Z9q;C9p+=g9q;var S9p=a9V.W57;S9p+=S0q;var M9p=a9V.x57;M9p+=L47;M9p+=a9V.t57;this[M9p][S9p][C7B](C9p)[j9X](P57)[f1B]();this[o9p][m9p][y9p](O9q)[j9p](s57)[r9p]();}if(!this[a9V.o87][w9q][q9q]){var a9p=i47;a9p+=a9V.V57;a9p+=M17;var d9p=T9q;d9p+=X9q;var B9p=a9V.l57;B9p+=T17;B9p+=S3O;B9p+=j0X;var f9p=m4B;f9p+=j2B;this[w9B][f9p][B9p](d9p)[a9p]()[f1B]();}this[c9p]();this[N9p](y2q,this[a9V.o87][w9q][w9p]?j57:c57,s57);this[Y9q](k9p,b57,this[a9V.l57][b9q]);this[Y9q](T9p,b57,this[a9V.l57][Z9p]);this[j9q](r2q,[z7O,z9q],i18n[g9p]);this[w9B][O9p][q9p](X9p,function(){var p9q="ont";var h9q=":disable";var i9q="ow";var A9p=z2q;A9p+=T17;A9p+=i9q;var G9p=j47;G9p+=a9V.V57;G9p+=i47;var p9p=h5B;p9p+=a9V.t57;var h9p=h9q;h9p+=a9V.x57;var i9p=u87;i9p+=a9V.o87;var z9p=G67;z9p+=g87;z9p+=v0B;z9p+=a9V.W57;var b9p=u87;b9p+=a9V.o87;var Y9p=a9V.l57;Y9p+=p9q;Y9p+=n9q;if(that[w9B][Y9p][b9p](S4X)||that[w9B][z9p][i9p](h9p)){return;}that[d8B](that[p9p][I9B][G9p](),m0B);that[A9p]();})[G9B](G9q,function(){var A9q="contain";var E9p=A9q;E9p+=a9V.K57;E9p+=E47;if(that[w9B][E9p][e8B](S4X)){var J9p=j47;J9p+=a9V.V57;J9p+=i47;var U9p=z4B;U9p+=a9V.W57;that[d8B](that[w9B][U9p][J9p](),m0B);}});this[w9B][D9p][G9B](v8X,F9p,function(){var C5q="_setTim";var S5q='-seconds';var P5q="iteOutput";var s5q="_wr";var e5q="ntain";var I5q="pm";var n5q="-a";var H5q="urs";var L5q="CHo";var u9q="s12";var x9q="etTime";var t9q='-ampm';var V9q='-hours';var l9q="play";var K9q='-year';var R9q="_correctMonth";var F9q='-month';var U9q="osition";var P5p=E9q;P5p+=U9q;var s5p=U5B;s5p+=Z2X;var v5p=u87;v5p+=a9V.d87;v5p+=J9q;var I5p=T17;I5p+=W5B;var L5p=d0q;L5p+=J2O;L5p+=a9V.d87;L5p+=D9q;var select=$(this);var val=select[d8B]();if(select[O9B](classPrefix+F9q)){var R9p=Q8B;R9p+=O77;that[R9q](that[a9V.o87][R9p],val);that[Q2q]();that[b2q]();}else if(select[O9B](classPrefix+K9q)){var K9p=Y0O;K9p+=l9q;that[a9V.o87][K9p][W9q](val);that[Q2q]();that[b2q]();}else if(select[O9B](classPrefix+V9q)||select[O9B](classPrefix+t9q)){var Q9p=z2q;Q9p+=x9q;var l9p=T17;l9p+=m9q;l9p+=u9q;if(that[a9V.o87][w9q][l9p]){var u9p=u5X;u9p+=Q9q;u9p+=L5q;u9p+=H5q;var x9p=g87;x9p+=a9V.t57;var t9p=n5q;t9p+=a9V.t57;t9p+=I5q;var V9p=a9V.x57;V9p+=L47;V9p+=a9V.t57;var W9p=a9V.l57;W9p+=L47;W9p+=e5q;W9p+=R47;var hours=$(that[w9B][W9p])[V4X](t4X+classPrefix+V9q)[d8B]()*s57;var pm=$(that[V9p][p5B])[V4X](t4X+classPrefix+t9p)[d8B]()===x9p;that[a9V.o87][a9V.x57][u9p](hours===j57&&!pm?v57:pm&&hours!==j57?hours+j57:hours);}else{that[a9V.o87][a9V.x57][v5q](val);}that[Q9p]();that[t2q](r0B);onChange();}else if(select[O9B](classPrefix+L5p)){var n5p=s5q;n5p+=P5q;var H5p=z2q;H5p+=e4B;H5p+=V87;that[a9V.o87][a9V.x57][M5q](val);that[H5p]();that[n5p](r0B);onChange();}else if(select[I5p](classPrefix+S5q)){var e5p=C5q;e5p+=a9V.K57;that[a9V.o87][a9V.x57][o5q](val);that[e5p]();that[t2q](r0B);onChange();}that[w9B][v5p][s5p]();that[P5p]();})[G9B](M5p,function(e){var t5q="foc";var V5q="Calande";var W5q="_se";var F5q="TCMonth";var D5q="etU";var J5q="CD";var E5q="rent";var A5q="selec";var p5q="ectedI";var i5q="selectedIndex";var b5q="Index";var Y5q='-iconUp';var X5q="tMont";var q5q="_correc";var O5q="Calander";var g5q="_set";var w5q="has";var c5q="sC";var a5q="ight";var d5q="-iconR";var B5q="asCl";var f5q="hasC";var r5q="iconDown";var j5q="ame";var y5q="opPropag";var m5q="utto";var m5p=D17;m5p+=m5q;m5p+=a9V.d87;var o5p=M17;o5p+=y5q;o5p+=x7B;o5p+=G9B;var C5p=a9V.o87;C5p+=F77;C5p+=j0B;C5p+=a9V.W57;var S5p=a9V.d87;S5p+=S77;S5p+=c77;S5p+=j5q;var nodeName=e[c6B][S5p][F9O]();if(nodeName===C5p){return;}e[o5p]();if(nodeName===m5p){var Y5p=d0q;Y5p+=r5q;var X5p=f5q;X5p+=m17;X5p+=a6B;var k5p=T17;k5p+=B5q;k5p+=k5B;var d5p=d5q;d5p+=a5q;var B5p=B6B;B5p+=c5q;B5p+=i47;B5p+=k5B;var j5p=Y0O;j5p+=N5q;var y5p=w5q;y5p+=G0O;var button=$(e[c6B]);var parent=button[a4B]();var select;if(parent[y5p](j5p)){return;}if(parent[O9B](classPrefix+k5q)){var f5p=a9V.x57;f5p+=G8X;f5p+=O77;var r5p=I5B;r5p+=i47;r5p+=e5B;that[a9V.o87][r5p][T5q](that[a9V.o87][f5p][Z5q]()-s57);that[Q2q]();that[b2q]();that[w9B][I9B][L8B]();}else if(parent[B5p](classPrefix+d5p)){var w5p=a9V.B87;w5p+=n4B;w5p+=v0B;w5p+=a9V.o87;var N5p=z4B;N5p+=a9V.W57;var c5p=g5q;c5p+=O5q;var a5p=q5q;a5p+=X5q;a5p+=T17;that[a5p](that[a9V.o87][M8B],that[a9V.o87][M8B][Z5q]()+s57);that[Q2q]();that[c5p]();that[w9B][N5p][w5p]();}else if(parent[k5p](classPrefix+Y5q)){var q5p=a9V.l57;q5p+=T17;q5p+=U7B;q5p+=N47;var O5p=i47;O5p+=a9V.j87;O5p+=P0B;O5p+=T17;var g5p=y3q;g5p+=f2X;g5p+=b5q;var Z5p=H47;Z5p+=i47;Z5p+=j0B;Z5p+=a9V.W57;var T5p=g87;T5p+=z5q;T5p+=a9V.W57;select=parent[T5p]()[V4X](Z5p)[v57];select[g5p]=select[i5q]!==select[L8O][O5p]-s57?select[i5q]+s57:v57;$(select)[q5p]();}else if(parent[X5p](classPrefix+Y5p)){var p5p=h5q;p5p+=p5q;p5p+=P5X;var h5p=G5q;h5p+=L47;h5p+=a9V.d87;h5p+=a9V.o87;var i5p=A5q;i5p+=a9V.W57;var z5p=L0B;z5p+=z7B;var b5p=g2O;b5p+=E5q;select=parent[b5p]()[z5p](i5p)[v57];select[i5q]=select[i5q]===v57?select[h5p][o0B]-s57:select[p5p]-s57;$(select)[U5q]();}else{var D5p=a9V.W57;D5p+=u87;D5p+=j2B;var J5p=g87;J5p+=c8X;J5p+=a9V.W57;J5p+=a9V.o87;var U5p=a9V.x57;U5p+=a9V.V57;U5p+=O77;var E5p=u5X;E5p+=Q9q;E5p+=J5q;E5p+=t77;var A5p=a9V.o87;A5p+=D5q;A5p+=F5q;var G5p=a9V.x57;G5p+=a9V.V57;G5p+=d4B;if(!that[a9V.o87][a9V.x57]){that[a9V.o87][a9V.x57]=that[x2q](new Date());}that[a9V.o87][a9V.x57][u2q](s57);that[a9V.o87][a9V.x57][W9q](button[G5p](R5q));that[a9V.o87][a9V.x57][A5p](button[A2B](K5q));that[a9V.o87][a9V.x57][E5p](button[A2B](U5p));that[t2q](r0B);if(!that[a9V.o87][J5p][D5p]){setTimeout(function(){var F5p=l5q;F5p+=u2B;F5p+=a9V.K57;that[F5p]();},m57);}else{var R5p=W5q;R5p+=a9V.W57;R5p+=V5q;R5p+=E47;that[R5p]();}onChange();}}else{var l5p=t5q;l5p+=l3B;var K5p=u87;K5p+=q47;K5p+=a9V.W57;that[w9B][K5p][l5p]();}});},_compareDates:function(a,b){var u5q="_dateToUtcString";var x5q="ateToUtcS";var W5p=f7B;W5p+=x5q;W5p+=e1X;W5p+=C3B;return this[W5p](a)===this[u5q](b);},_correctMonth:function(date,month){var e8q="setUTCD";var I8q="getUTCDate";var L8q="sInM";var Q5q="_day";var V5p=Q5q;V5p+=L8q;V5p+=H8q;var days=this[V5p](date[n8q](),month);var correctDays=date[I8q]()>days;date[T5q](month);if(correctDays){var t5p=e8q;t5p+=F87;t5p+=a9V.K57;date[t5p](days);date[T5q](month);}},_daysInMonth:function(year,month){var Z57=30;var T57=29;var k57=28;var isLeap=year%S57===v57&&(year%z57!==v57||year%h57===v57);var months=[g57,isLeap?T57:k57,g57,Z57,g57,Z57,g57,g57,Z57,g57,Z57,g57];return months[month];},_dateToUtc:function(s){var C8q="getHours";var S8q="getMonth";var M8q="getFullYear";var P8q="getM";var s8q="nds";var v8q="Seco";var L8p=G9X;L8p+=v8q;L8p+=s8q;var Q5p=P8q;Q5p+=u87;Q5p+=a9V.d87;Q5p+=D9q;var u5p=g17;u5p+=e4B;u5p+=n3B;u5p+=R77;var x5p=i77;x5p+=I77;x5p+=V77;return new Date(Date[x5p](s[M8q](),s[S8q](),s[u5p](),s[C8q](),s[Q5p](),s[L8p]()));},_dateToUtcString:function(d){var y8q="getUTCMon";var m8q="TCDate";var o8q="tU";var I8p=N47;I8p+=o8q;I8p+=m8q;var n8p=y8q;n8p+=a9V.W57;n8p+=T17;var H8p=E9q;H8p+=c1X;return d[n8q]()+l7X+this[H8p](d[n8p]()+s57)+l7X+this[j8q](d[I8p]());},_hide:function(){var B8q="Content";var f8q="TE_Body_";var y8p=a9V.l57;y8p+=i47;y8p+=r8q;y8p+=k87;var m8p=L47;m8p+=a9V.B87;m8p+=a9V.B87;var o8p=u7B;o8p+=a9V.x57;o8p+=O77;var C8p=T7B;C8p+=k87;var S8p=L47;S8p+=a9V.B87;S8p+=a9V.B87;var M8p=z4X;M8p+=f8q;M8p+=B8q;var P8p=L47;P8p+=a9V.B87;P8p+=a9V.B87;var s8p=a9V.x57;s8p+=a9V.K57;s8p+=T4X;s8p+=T17;var v8p=u9B;v8p+=n9q;var e8p=a9V.x57;e8p+=L47;e8p+=a9V.t57;var namespace=this[a9V.o87][d8q];this[e8p][v8p][s8p]();$(window)[P8p](t4X+namespace);$(document)[W7B](a8q+namespace);$(M8p)[S8p](C8p+namespace);$(o8p)[m8p](y8p+namespace);},_hours24To12:function(val){return val===v57?j57:val>j57?val-j57:val;},_htmlDay:function(day){var l8q="day";var K8q="year";var R8q='data-year="';var F8q='<td data-day="';var D8q='today';var U8q='day';var E8q='<td class="empty"></td>';var A8q="refix";var G8q="classP";var h8q="selecte";var i8q="\" class=";var z8q="on clas";var b8q="<butt";var Y8q="n ";var X8q="-b";var q8q="tton\" ";var O8q="\" type=\"b";var g8q="-day";var Z8q=" data-month=";var T8q="mon";var k8q="ay=\"";var w8q="-d";var N8q="\" data";var c8q="</td";var X8p=c8q;X8p+=Y0B;var q8p=a9V.x57;q8p+=a9V.V57;q8p+=O77;var O8p=F3B;O8p+=Y0B;var g8p=N8q;g8p+=w8q;g8p+=k8q;var Z8p=T8q;Z8p+=a9V.W57;Z8p+=T17;var T8p=F3B;T8p+=Z8q;T8p+=F3B;var k8p=g8q;k8p+=O8q;k8p+=v0B;k8p+=q8q;var w8p=X8q;w8p+=B4X;w8p+=X87;w8p+=Y8q;var N8p=b8q;N8p+=z8q;N8p+=Q0B;var c8p=i8q;c8p+=F3B;var a8p=a9V.x57;a8p+=a9V.V57;a8p+=O77;var d8p=h8q;d8p+=a9V.x57;var B8p=X87;B8p+=N2O;B8p+=O77;var f8p=p8q;f8p+=D17;f8p+=i47;f8p+=f2X;var r8p=G8q;r8p+=A8q;var j8p=a9V.K57;j8p+=a9V.t57;j8p+=g87;j8p+=U87;if(day[j8p]){return E8q;}var classes=[U8q];var classPrefix=this[a9V.l57][r8p];if(day[f8p]){classes[Z8B](J8q);}if(day[B8p]){classes[Z8B](D8q);}if(day[d8p]){classes[Z8B](G3q);}return F8q+day[a8p]+c8p+classes[K7X](V2B)+Q2B+N8p+classPrefix+w8p+classPrefix+k8p+R8q+day[K8q]+T8p+day[Z8p]+g8p+day[l8q]+O8p+day[q8p]+I2q+X8p;},_htmlMonth:function(year,month){var i4q='</tbody>';var z4q='</thead>';var b4q="_htmlMonthHead";var Y4q='<thead>';var X4q='<table class="';var q4q="itle";var O4q="iconRight";var g4q="eekNum";var Z4q=" w";var T4q='<tr>';var w4q="nsh";var N4q="WeekOfYe";var c4q="WeekNumber";var a4q="r>";var d4q="</t";var B4q="disableDays";var f4q="_compareDates";var r4q="reDates";var j4q="comp";var y4q="etUTCDay";var m4q="Hours";var o4q="setUTC";var C4q="econds";var S4q="tS";var M4q="maxDate";var P4q="firstDa";var s4q="UTC";var v4q="Utc";var e4q="_dateTo";var I4q="_daysInM";var n4q="Day";var H4q="etUTC";var Q8q="min";var u8q="Number";var x8q="ek";var t8q="showW";var V8q="tbod";var W8q="/table";var Y57=59;var a57=23;var C4p=L7B;C4p+=W8q;C4p+=Y0B;var S4p=L7B;S4p+=V8q;S4p+=O77;S4p+=Y0B;var t8p=t8q;t8p+=a9V.K57;t8p+=x8q;t8p+=u8q;var V8p=r0q;V8p+=s3B;var p8p=Q8q;p8p+=D87;p8p+=a9V.V57;p8p+=R77;var i8p=L4q;i8p+=D2B;i8p+=e5B;var z8p=g17;z8p+=H4q;z8p+=n4q;var b8p=I4q;b8p+=H8q;var Y8p=e4q;Y8p+=v4q;var now=this[Y8p](new Date()),days=this[b8p](year,month),before=new Date(Date[s4q](year,month,s57))[z8p](),data=[],row=[];if(this[a9V.l57][i8p]>v57){var h8p=P4q;h8p+=O77;before-=this[a9V.l57][h8p];if(before<v57){before+=C57;}}var cells=days+before,after=cells;while(after>C57){after-=C57;}cells+=C57-after;var minDate=this[a9V.l57][p8p];var maxDate=this[a9V.l57][M4q];if(minDate){var G8p=H47;G8p+=S4q;G8p+=C4q;minDate[v5q](v57);minDate[M5q](v57);minDate[G8p](v57);}if(maxDate){var A8p=o4q;A8p+=m4q;maxDate[A8p](a57);maxDate[M5q](Y57);maxDate[o5q](Y57);}for(var i=v57,r=v57;i<cells;i++){var D8p=l5q;D8p+=M8O;D8p+=D87;D8p+=e5B;var J8p=g87;J8p+=v0B;J8p+=a9V.o87;J8p+=T17;var U8p=g17;U8p+=y4q;var E8p=s67;E8p+=j4q;E8p+=a9V.V57;E8p+=r4q;var day=new Date(Date[s4q](year,month,s57+(i-before))),selected=this[a9V.o87][a9V.x57]?this[E8p](day,this[a9V.o87][a9V.x57]):m0B,today=this[f4q](day,now),empty=i<before||i>=days+before,disabled=minDate&&day<minDate||maxDate&&day>maxDate;var disableDays=this[a9V.l57][B4q];if($[t8B](disableDays)&&$[S2X](day[U8p](),disableDays)!==-s57){disabled=r0B;}else if(typeof disableDays===a9V.Q57&&disableDays(day)===r0B){disabled=r0B;}var dayConfig={day:s57+(i-before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[J8p](this[D8p](dayConfig));if(++r===C57){var W8p=d4q;W8p+=a4q;var l8p=g87;l8p+=v0B;l8p+=a9V.o87;l8p+=T17;var F8p=l1B;F8p+=c4q;if(this[a9V.l57][F8p]){var K8p=l5q;K8p+=M8O;K8p+=N4q;K8p+=c8X;var R8p=v0B;R8p+=w4q;R8p+=u87;R8p+=k4q;row[R8p](this[K8p](i-before,month,year));}data[l8p](T4q+row[K7X](i3B)+W8p);row=[];r=v57;}}var classPrefix=this[a9V.l57][c9q];var className=classPrefix+V8p;if(this[a9V.l57][t8p]){var x8p=Z4q;x8p+=g4q;x8p+=D17;x8p+=R47;className+=x8p;}if(minDate){var n4p=Y17;n4p+=e5B;var H4p=a9V.l57;H4p+=a6B;var L4p=a9V.x57;L4p+=f4X;var Q8p=a9V.B87;Q8p+=G67;Q8p+=a9V.x57;var u8p=i77;u8p+=I77;u8p+=V77;var underMin=minDate>new Date(Date[u8p](year,month-s57,s57,v57,v57,v57));this[w9B][d9X][Q8p](L4p+classPrefix+k5q)[H4p](n4p,underMin?S5B:C4B);}if(maxDate){var M4p=H4B;M4p+=L47;M4p+=o6B;var P4p=a9V.d87;P4p+=L47;P4p+=a9V.d87;P4p+=a9V.K57;var s4p=a9V.l57;s4p+=a9V.o87;s4p+=a9V.o87;var v4p=d0q;v4p+=O4q;var e4p=a9V.W57;e4p+=q4q;var I4p=i77;I4p+=I77;I4p+=V77;var overMax=maxDate<new Date(Date[I4p](year,month+s57,s57,v57,v57,v57));this[w9B][e4p][V4X](L7X+classPrefix+v4p)[s4p](j9B,overMax?P4p:M4p);}return X4q+className+Q2B+Y4q+this[b4q]()+z4q+S4p+data[K7X](i3B)+i4q+C4p;},_htmlMonthHead:function(){var D4q='<th>';var J4q="/t";var U4q="th>";var E4q="></";var A4q="<th";var G4q="showWeekNumber";var B4p=a9V.I87;B4p+=L47;B4p+=u87;B4p+=a9V.d87;var m4p=u87;m4p+=w87;m4p+=u9X;m4p+=a9V.d87;var o4p=L4q;o4p+=D2B;o4p+=e5B;var a=[];var firstDay=this[a9V.l57][o4p];var i18n=this[a9V.l57][m4p];var dayName=function(day){var p4q="days";var h4q="week";var y4p=h4q;y4p+=p4q;day+=firstDay;while(day>=C57){day-=C57;}return i18n[y4p][day];};if(this[a9V.l57][G4q]){var j4p=A4q;j4p+=E4q;j4p+=U4q;a[Z8B](j4p);}for(var i=v57;i<C57;i++){var f4p=L7B;f4p+=J4q;f4p+=T17;f4p+=Y0B;var r4p=g87;r4p+=v0B;r4p+=s0B;a[r4p](D4q+dayName(i)+f4p);}return a[B4p](i3B);},_htmlWeekOfYear:function(d,m,y){var V4q='-week">';var W4q="setD";var l4q="getD";var K4q="tDa";var R4q="d clas";var F4q="<t";var D57=86400000;var w4p=g0B;w4p+=a9V.W57;w4p+=a9V.x57;w4p+=Y0B;var N4p=F4q;N4p+=R4q;N4p+=Q0B;var c4p=N47;c4p+=K4q;c4p+=O77;var a4p=l4q;a4p+=t77;var d4p=W4q;d4p+=a9V.V57;d4p+=R77;var date=new Date(y,m,d,v57,v57,v57,v57);date[d4p](date[a4p]()+S57-(date[c4p]()||C57));var oneJan=new Date(y,v57,s57);var weekNum=Math[j3B](((date-oneJan)/D57+s57)/C57);return N4p+this[a9V.l57][c9q]+V4q+weekNum+w4p;},_options:function(selector,values,labels){var u4q='<option value="';var x4q="elect.";var t4q="ssPref";var g4p=z6X;g4p+=i8B;g4p+=O77;var Z4p=t9B;Z4p+=t4q;Z4p+=u87;Z4p+=K87;var T4p=a9V.o87;T4p+=x4q;var k4p=Z4X;k4p+=h2q;k4p+=r4X;if(!labels){labels=values;}var select=this[w9B][k4p][V4X](T4p+this[a9V.l57][Z4p]+l7X+selector);select[g4p]();for(var i=v57,ien=values[o0B];i<ien;i++){select[o7B](u4q+values[i]+Q2B+labels[i]+Q4q);}},_optionSet:function(selector,val){var I7q="unknown";var L7q="ect.";var i4p=u87;i4p+=w87;i4p+=u9X;i4p+=a9V.d87;var z4p=a9V.W57;z4p+=a9V.K57;z4p+=U7X;var b4p=a9V.B87;b4p+=G67;b4p+=a9V.x57;var Y4p=j47;Y4p+=a9V.V57;Y4p+=i47;var X4p=a9V.o87;X4p+=g87;X4p+=U7B;var q4p=h5q;q4p+=L7q;var O4p=H7q;O4p+=a9V.x57;var select=this[w9B][p5B][O4p](q4p+this[a9V.l57][c9q]+l7X+selector);var span=select[a4B]()[C7B](X4p);select[Y4p](val);var selected=select[b4p](n7q);span[o8B](selected[o0B]!==v57?selected[z4p]():this[a9V.l57][i4p][I7q]);},_optionsTime:function(select,count,inc){var S7q=" value=\"";var M7q="<o";var P7q="inArra";var s7q='select.';var v7q="ailable";var e7q="hoursAv";var p4p=e7q;p4p+=v7q;var h4p=a9V.B87;h4p+=u87;h4p+=a9V.d87;h4p+=a9V.x57;var classPrefix=this[a9V.l57][c9q];var sel=this[w9B][p5B][h4p](s7q+classPrefix+l7X+select);var start=v57,end=count;var allowed=this[a9V.l57][p4p];var render=count===j57?function(i){return i;}:this[j8q];if(count===j57){start=s57;end=r57;}for(var i=start;i<end;i+=inc){var G4p=P7q;G4p+=O77;if(!allowed||$[G4p](i,allowed)!==-s57){var A4p=M7q;A4p+=g87;A4p+=x2X;A4p+=S7q;sel[o7B](A4p+i+Q2B+render(i)+Q4q);}}},_optionsTitle:function(year,month){var T7q="_range";var k7q="months";var w7q="minDate";var N7q="maxDa";var c7q="tFullYear";var a7q="Year";var d7q="getFull";var f7q="getFullY";var r7q="ang";var j7q="yearR";var y7q="FullYear";var m7q="Rang";var o7q="yea";var C7q="_ra";var V4p=f9q;V4p+=i8B;V4p+=u87;V4p+=L5X;var W4p=C7q;W4p+=a9V.d87;W4p+=N47;var l4p=o7q;l4p+=E47;l4p+=m7q;l4p+=a9V.K57;var K4p=N47;K4p+=a9V.W57;K4p+=y7q;var R4p=j7q;R4p+=r7q;R4p+=a9V.K57;var F4p=f7q;F4p+=B7q;var D4p=d7q;D4p+=a7q;var J4p=N47;J4p+=c7q;var U4p=N7q;U4p+=R77;var E4p=u87;E4p+=P3q;E4p+=a9V.d87;var classPrefix=this[a9V.l57][c9q];var i18n=this[a9V.l57][E4p];var min=this[a9V.l57][w7q];var max=this[a9V.l57][U4p];var minYear=min?min[J4p]():o9B;var maxYear=max?max[D4p]():o9B;var i=minYear!==o9B?minYear:new Date()[F4p]()-this[a9V.l57][R4p];var j=maxYear!==o9B?maxYear:new Date()[K4p]()+this[a9V.l57][l4p];this[j9q](K5q,this[W4p](v57,y57),i18n[k7q]);this[V4p](R5q,this[T7q](i,j));},_pad:function(i){var Z7q='0';return i<m57?Z7q+i:i;},_position:function(){var g7q="width";var v7p=V3B;v7p+=a9V.B87;v7p+=a9V.W57;var n7p=u7B;n7p+=Q7B;var H7p=a9V.V57;H7p+=g87;H7p+=j1B;var L7p=O4B;L7p+=a9V.o87;var Q4p=u87;Q4p+=a9V.d87;Q4p+=Q5B;Q4p+=a9V.W57;var u4p=a9V.x57;u4p+=L47;u4p+=a9V.t57;var x4p=z4B;x4p+=a9V.W57;var t4p=a9V.x57;t4p+=B5B;var offset=this[t4p][x4p][V3X]();var container=this[u4p][p5B];var inputHeight=this[w9B][Q4p][x6B]();container[L7p]({top:offset[x3X]+inputHeight,left:offset[A9X]})[H7p](n7p);var calHeight=container[x6B]();var calWidth=container[J9X]();var scrollTop=$(window)[B1B]();if(offset[x3X]+inputHeight+calHeight-scrollTop>$(window)[F3X]()){var e7p=a9V.W57;e7p+=L47;e7p+=g87;var I7p=a9V.l57;I7p+=a9V.o87;I7p+=a9V.o87;var newTop=offset[x3X]-calHeight;container[I7p](e7p,newTop<v57?v57:newTop);}if(calWidth+offset[v7p]>$(window)[g7q]()){var s7p=i47;s7p+=a9V.K57;s7p+=k4q;var newLeft=$(window)[g7q]()-calWidth;container[M5B](s7p,newLeft<v57?v57:newLeft);}},_range:function(start,end){var a=[];for(var i=start;i<=end;i++){a[Z8B](i);}return a;},_setCalander:function(){var Y7q="_htmlMonth";var X7q="lendar";var q7q="pty";var O7q="getUTCFullY";if(this[a9V.o87][M8B]){var C7p=O7q;C7p+=B7q;var S7p=Y17;S7p+=e5B;var M7p=a9V.K57;M7p+=a9V.t57;M7p+=q7q;var P7p=a9V.l57;P7p+=a9V.V57;P7p+=X7q;this[w9B][P7p][M7p]()[o7B](this[Y7q](this[a9V.o87][S7p][C7p](),this[a9V.o87][M8B][Z5q]()));}},_setTitle:function(){var i7q="nSet";var z7q="CM";var y7p=a9V.x57;y7p+=F1B;y7p+=i47;y7p+=e5B;var m7p=b7q;m7p+=z7q;m7p+=H8q;var o7p=f9q;o7p+=P77;o7p+=i7q;this[o7p](K5q,this[a9V.o87][M8B][m7p]());this[h7q](R5q,this[a9V.o87][y7p][n8q]());},_setTime:function(){var W7q="getUTCMinutes";var l7q='minutes';var K7q="optionSet";var R7q="_hours24To12";var F7q="ionS";var D7q="_opt";var J7q="getUTCHours";var U7q="onSet";var E7q="_opti";var A7q="ionSe";var G7q="conds";var p7q="getSe";var N7p=p7q;N7p+=G7q;var c7p=s67;c7p+=X8B;c7p+=A7q;c7p+=a9V.W57;var a7p=E7q;a7p+=U7q;var d=this[a9V.o87][a9V.x57];var hours=d?d[J7q]():v57;if(this[a9V.o87][w9q][q9q]){var f7p=g87;f7p+=a9V.t57;var r7p=a9V.V57;r7p+=a9V.t57;var j7p=D7q;j7p+=F7q;j7p+=a9V.K57;j7p+=a9V.W57;this[j7p](y2q,this[R7q](hours));this[h7q](r2q,hours<j57?r7p:f7p);}else{var d7p=T17;d7p+=L47;d7p+=Z2O;d7p+=a9V.o87;var B7p=s67;B7p+=K7q;this[B7p](d7p,hours);}this[a7p](l7q,d?d[W7q]():v57);this[c7p](j2q,d?d[N7p]():v57);},_show:function(){var u7q='scroll.';var x7q="_pos";var t7q="resize.";var V7q="_Body";var g7p=L47;g7p+=a9V.d87;var Z7p=A6B;Z7p+=V7q;Z7p+=l47;var k7p=t3B;k7p+=t7q;var w7p=x7q;w7p+=T67;w7p+=r5X;w7p+=a9V.d87;var that=this;var namespace=this[a9V.o87][d8q];this[w7p]();$(window)[G9B](u7q+namespace+k7p+namespace,function(){var Q7q="posi";var T7p=s67;T7p+=Q7q;T7p+=x2X;that[T7p]();});$(Z7p)[g7p](u7q+namespace,function(){var H6q="sition";var L6q="_po";var O7p=L6q;O7p+=H6q;that[O7p]();});$(document)[G9B](a8q+namespace,function(e){if(e[N5X]===o57||e[N5X]===w57||e[N5X]===r57){var q7p=s67;q7p+=T17;q7p+=Z17;that[q7p]();}});setTimeout(function(){var n6q="cli";var Y7p=n6q;Y7p+=o6B;Y7p+=k87;var X7p=D17;X7p+=g7B;$(X7p)[G9B](Y7p+namespace,function(e){var I6q="targ";var h7p=I6q;h7p+=e4B;var i7p=i47;i7p+=U3q;var z7p=L0B;z7p+=a0B;z7p+=R47;var b7p=a9V.W57;b7p+=a9V.V57;b7p+=n7X;b7p+=a9V.W57;var parents=$(e[b7p])[P5B]();if(!parents[z7p](that[w9B][p5B])[i7p]&&e[h7p]!==that[w9B][I9B][v57]){var p7p=s67;p7p+=T17;p7p+=u87;p7p+=z17;that[p7p]();}});},m57);},_writeOutput:function(focus){var M6q="momentLocale";var P6q="ome";var s6q="ormat";var v6q="CMo";var e6q="tUTCDat";var K7p=a9V.x57;K7p+=L47;K7p+=a9V.t57;var R7p=g17;R7p+=a9V.K57;R7p+=e6q;R7p+=a9V.K57;var F7p=s67;F7p+=g2O;F7p+=a9V.x57;var D7p=b7q;D7p+=v6q;D7p+=d7B;D7p+=T17;var J7p=s67;J7p+=g87;J7p+=a9V.V57;J7p+=a9V.x57;var U7p=a9V.B87;U7p+=s6q;var E7p=v0B;E7p+=a9V.W57;E7p+=a9V.l57;var A7p=a9V.t57;A7p+=P6q;A7p+=d7B;var G7p=n6X;G7p+=a9V.t57;G7p+=a9V.K57;G7p+=d7B;var date=this[a9V.o87][a9V.x57];var out=window[G7p]?window[A7p][E7p](date,undefined,this[a9V.l57][M6q],this[a9V.l57][W2q])[U7p](this[a9V.l57][K0q]):date[n8q]()+l7X+this[J7p](date[D7p]()+s57)+l7X+this[F7p](date[R7p]());this[K7p][I9B][d8B](out);if(focus){var W7p=U5B;W7p+=R5O;W7p+=a9V.o87;var l7p=u87;l7p+=a9V.d87;l7p+=g87;l7p+=B4X;this[w9B][l7p][W7p]();}}});Editor[S6q][V7p]=v57;Editor[S6q][n0O]={classPrefix:t7p,disableDays:o9B,firstDay:s57,format:x7p,hoursAvailable:o9B,i18n:Editor[n0O][X2B][Z2q],maxDate:o9B,minDate:o9B,minutesIncrement:s57,momentStrict:r0B,momentLocale:u7p,onChange:function(){},secondsIncrement:s57,showWeekNumber:m0B,yearRange:m57};(function(){var Z2V='upload.editor';var C2V="_pi";var S2V="_picker";var s2V='keydown';var e2V="icker";var F0V="cker";var J0V="datepicker";var Y0V="datep";var T0V="prop";var B0V="cke";var m0V='input';var e0V="radio";var H0V="checked";var E3V='<div />';var G3V='input:last';var p3V='<label for="';var h3V='_';var O3V="_edi";var Z3V="nput";var k3V="checkbox";var a3V="separator";var P3V="_addOptions";var v3V='change.dte';var H3V="ip";var L3V="optio";var Q1q="_editor_val";var u1q="optionsPair";var i1q="textarea";var Y1q="sa";var q1q="_in";var O1q="password";var g1q="/>";var Z1q='text';var k1q="readonly";var w1q="_val";var N1q="hidden";var c1q="np";var a1q="_input";var m1q='div.clearValue button';var o1q='div.rendered';var K6q="_enabled";var J6q='" />';var G6q="tt";var w6q="inp";var f6q="_inp";var r6q="pes";var j6q="xten";var y6q="ect";var m6q="im";var o6q="tet";var C6q="Man";var f97=P3B;f97+=a9V.W57;f97+=l7B;var r97=F1X;r97+=C6q;r97+=O77;var t27=P6O;t27+=a9V.x57;var c27=N2O;c27+=o6q;c27+=m6q;c27+=a9V.K57;var J07=a9V.K57;J07+=q2B;J07+=a9V.d87;J07+=a9V.x57;var t37=H0O;t37+=z7B;var T1p=P3B;T1p+=a9V.W57;T1p+=l7B;var k1p=h5q;k1p+=y6q;var M1p=a9V.K57;M1p+=j6q;M1p+=a9V.x57;var n1p=a9V.K57;n1p+=j6q;n1p+=a9V.x57;var t6p=n6X;t6p+=z17;t6p+=o77;var Q7p=a9V.B87;Q7p+=c4O;Q7p+=p7O;Q7p+=r6q;var fieldTypes=Editor[Q7p];function _buttonText(conf,text){var a6q='div.upload button';var d6q="Choose file...";var B6q="uploadText";var L6p=f6q;L6p+=B4X;if(text===o9B||text===undefined){text=conf[B6q]||d6q;}conf[L6p][V4X](a6q)[o8B](text);}function _commonUpload(editor,conf,dropCallback){var r1q='input[type=file]';var C1q="rop";var s1q='dragover';var v1q='dragleave dragexit';var e1q='over';var x6q='div.drop';var t6q="Drag and drop a file here to upload";var V6q="dragDropText";var W6q="drop s";var l6q="dragDrop";var R6q='<div class="cell">';var F6q='<div class="row second">';var D6q='<div class="cell clearValue">';var U6q='<button class="';var E6q='<div class="editor_upload">';var A6q="clas";var p6q="s=\"eu_table\">";var h6q="lass=\"row";var i6q="cell upload\">";var z6q="e=\"file\"/>";var b6q="<input typ";var Y6q="<button class";var X6q="s=\"drop\"><span/></div>";var q6q="/div>";var O6q="ass=\"cell\">";var g6q="iv cl";var Z6q="s=\"rendered\"/";var T6q="<div clas";var k6q="</div";var N6q="ileReader";var c6q="nge";var R6p=a9V.l57;R6p+=B6B;R6p+=c6q;var U6p=a9V.l57;U6p+=i47;U6p+=o3X;U6p+=d0B;var E6p=L47;E6p+=a9V.d87;var d6p=d77;d6p+=N6q;var B6p=s67;B6p+=w6q;B6p+=v0B;B6p+=a9V.W57;var f6p=L7B;f6p+=a4X;f6p+=G2X;var r6p=L7B;r6p+=F0B;r6p+=H3B;r6p+=O0B;var j6p=k6q;j6p+=Y0B;var y6p=T6q;y6p+=Z6q;y6p+=Y0B;var m6p=L7B;m6p+=a9V.x57;m6p+=g6q;m6p+=O6q;var o6p=L7B;o6p+=q6q;var C6p=T6q;C6p+=X6q;var S6p=L7B;S6p+=F0B;S6p+=b1B;var M6p=Y6q;M6p+=p2X;var P6p=L7B;P6p+=F0B;P6p+=Y2X;P6p+=Y0B;var s6p=b6q;s6p+=z6q;var v6p=D2X;v6p+=U2X;v6p+=i6q;var e6p=E2X;e6p+=h6q;e6p+=n7B;var I6p=D2X;I6p+=F2X;I6p+=p6q;var n6p=R3q;n6p+=G6q;n6p+=L47;n6p+=a9V.d87;var H6p=A6q;H6p+=b5B;var btnClass=editor[H6p][v77][n6p];var container=$(E6q+I6p+e6p+v6p+U6q+btnClass+J6q+s6p+P6p+D6q+M6p+btnClass+J6q+S6p+H9B+F6q+R6q+C6p+o6p+m6p+y6p+j6p+r6p+H9B+f6p);conf[B6p]=container;conf[K6q]=r0B;_buttonText(conf);if(window[d6p]&&conf[l6q]!==m0B){var z6p=L47;z6p+=p7X;var b6p=L47;b6p+=a9V.d87;var X6p=L47;X6p+=a9V.d87;var O6p=L47;O6p+=a9V.d87;var N6p=a9V.x57;N6p+=E47;N6p+=L47;N6p+=g87;var c6p=a9V.B87;c6p+=u87;c6p+=z7B;var a6p=T9q;a6p+=W6q;a6p+=g87;a6p+=U7B;container[V4X](a6p)[D4B](conf[V6q]||t6q);var dragDrop=container[c6p](x6q);dragDrop[G9B](N6p,function(e){var I1q="originalEvent";var n1q="loa";var H1q="fer";var L1q="Trans";var Q6q="les";var u6q="enabled";var w6p=s67;w6p+=u6q;if(conf[w6p]){var g6p=f1B;g6p+=G0O;var Z6p=a9V.B87;Z6p+=u87;Z6p+=Q6q;var T6p=k9O;T6p+=a9V.V57;T6p+=L1q;T6p+=H1q;var k6p=v0B;k6p+=g87;k6p+=n1q;k6p+=a9V.x57;Editor[k6p](editor,conf,e[I1q][T6p][Z6p],_buttonText,dropCallback);dragDrop[g6p](e1q);}return m0B;})[O6p](v1q,function(e){var q6p=s67;q6p+=a9V.K57;q6p+=a9V.d87;q6p+=N5q;if(conf[q6p]){dragDrop[d5B](e1q);}return m0B;})[X6p](s1q,function(e){if(conf[K6q]){var Y6p=L47;Y6p+=I6X;Y6p+=E47;dragDrop[L5B](Y6p);}return m0B;});editor[b6p](z6p,function(){var P1q='dragover.DTE_Upload drop.DTE_Upload';$(p6B)[G9B](P1q,function(e){return m0B;});})[G9B](K4B,function(){var S1q="pload drop.DTE_Upload";var M1q="dragover.DTE_U";var i6p=M1q;i6p+=S1q;$(p6B)[W7B](i6p);});}else{var A6p=a9V.B87;A6p+=u87;A6p+=a9V.d87;A6p+=a9V.x57;var G6p=a9V.V57;G6p+=g87;G6p+=m9B;var p6p=E3X;p6p+=D87;p6p+=C1q;var h6p=i5B;h6p+=G0O;container[h6p](p6p);container[G6p](container[A6p](o1q));}container[V4X](m1q)[E6p](U6p,function(){var j1q="eldTy";var y1q="all";var F6p=a9V.l57;F6p+=y1q;var D6p=a9V.o87;D6p+=a9V.K57;D6p+=a9V.W57;var J6p=L0B;J6p+=j1q;J6p+=g87;J6p+=Q3B;Editor[J6p][F1X][D6p][F6p](editor,conf,i3B);});container[V4X](r1q)[G9B](R6p,function(){var l6p=u3B;l6p+=Q3B;var K6p=X1X;K6p+=M1X;Editor[K6p](editor,conf,this[l6p],_buttonText,function(ids){var B1q="=file]";var f1q="input[typ";var V6p=j47;V6p+=a9V.V57;V6p+=i47;var W6p=f1q;W6p+=a9V.K57;W6p+=B1q;dropCallback[D9B](editor,ids);container[V4X](W6p)[V6p](i3B);});});return container;}function _triggerChange(input){setTimeout(function(){var d1q="trigger";input[d1q](v8X,{editor:r0B,editorSet:r0B});},v57);}var baseFieldType=$[r9B](r0B,{},Editor[t6p][F4B],{get:function(conf){return conf[a1q][d8B]();},set:function(conf,val){var u6p=v0q;u6p+=c1q;u6p+=v0B;u6p+=a9V.W57;var x6p=j47;x6p+=a9V.V57;x6p+=i47;conf[a1q][x6p](val);_triggerChange(conf[u6p]);},enable:function(conf){var Q6p=g87;Q6p+=E47;Q6p+=L47;Q6p+=g87;conf[a1q][Q6p](J8q,m0B);},disable:function(conf){var L1p=n67;L1p+=i3X;conf[a1q][L1p](J8q,r0B);},canReturnSubmit:function(conf,node){return r0B;}});fieldTypes[N1q]={create:function(conf){var H1p=d8B;H1p+=v0B;H1p+=a9V.K57;conf[w1q]=conf[H1p];return o9B;},get:function(conf){return conf[w1q];},set:function(conf,val){conf[w1q]=val;}};fieldTypes[k1q]=$[n1p](r0B,{},baseFieldType,{create:function(conf){var T1q="nput/>";var P1p=f6q;P1p+=v0B;P1p+=a9V.W57;var s1p=a9V.V57;s1p+=a9V.W57;s1p+=a9V.W57;s1p+=E47;var v1p=u87;v1p+=a9V.x57;var e1p=a9V.K57;e1p+=U7X;e1p+=l7B;var I1p=S1X;I1p+=T1q;conf[a1q]=$(I1p)[a5X]($[e1p]({id:Editor[s1X](conf[v1p]),type:Z1q,readonly:q9B},conf[s1p]||{}));return conf[P1p][v57];}});fieldTypes[D4B]=$[M1p](r0B,{},baseFieldType,{create:function(conf){var y1p=s67;y1p+=z4B;y1p+=a9V.W57;var m1p=a9V.W57;m1p+=P3B;m1p+=a9V.W57;var o1p=u87;o1p+=a9V.x57;var C1p=L7B;C1p+=I9B;C1p+=g1q;var S1p=v0q;S1p+=a9V.d87;S1p+=Q5B;S1p+=a9V.W57;conf[S1p]=$(C1p)[a5X]($[r9B]({id:Editor[s1X](conf[o1p]),type:m1p},conf[a5X]||{}));return conf[y1p][v57];}});fieldTypes[O1q]=$[r9B](r0B,{},baseFieldType,{create:function(conf){var z1q="ut/";var b1q="eI";var X1q="wor";var c1p=q1q;c1p+=g87;c1p+=B4X;var a1p=a9V.V57;a1p+=e1O;var d1p=g87;d1p+=k5B;d1p+=X1q;d1p+=a9V.x57;var B1p=u87;B1p+=a9V.x57;var f1p=Y1q;f1p+=a9V.B87;f1p+=b1q;f1p+=a9V.x57;var r1p=L7B;r1p+=w6q;r1p+=z1q;r1p+=Y0B;var j1p=s67;j1p+=I9B;conf[j1p]=$(r1p)[a5X]($[r9B]({id:Editor[f1p](conf[B1p]),type:d1p},conf[a1p]||{}));return conf[c1p][v57];}});fieldTypes[i1q]=$[r9B](r0B,{},baseFieldType,{create:function(conf){var G1q="area/";var p1q="<text";var h1q="afeI";var w1p=a9V.o87;w1p+=h1q;w1p+=a9V.x57;var N1p=p1q;N1p+=G1q;N1p+=Y0B;conf[a1q]=$(N1p)[a5X]($[r9B]({id:Editor[w1p](conf[u2B])},conf[a5X]||{}));return conf[a1q][v57];},canReturnSubmit:function(conf,node){return m0B;}});fieldTypes[k1p]=$[T1p](r0B,{},baseFieldType,{_addOptions:function(conf,opts,append){var x1q="pairs";var t1q="placeholderDisabled";var V1q="placeholder";var W1q="derV";var l1q="rValue";var K1q="olde";var R1q="eh";var F1q="rDisabled";var D1q="eholde";var J1q="plac";var U1q="isa";var E1q="_editor_";var A1q="placehol";var elOpts=conf[a1q][v57][L8O];var countOffset=v57;if(!append){var g1p=A1q;g1p+=E7X;var Z1p=i47;Z1p+=a9V.K57;Z1p+=f8B;elOpts[Z1p]=v57;if(conf[g1p]!==undefined){var b1p=E1q;b1p+=j47;b1p+=x1X;var Y1p=a9V.x57;Y1p+=U1q;Y1p+=H4B;Y1p+=f2X;var X1p=J1q;X1p+=D1q;X1p+=F1q;var q1p=J1q;q1p+=R1q;q1p+=K1q;q1p+=l1q;var O1p=A1q;O1p+=W1q;O1p+=a9V.V57;O1p+=v1X;var placeholderValue=conf[O1p]!==undefined?conf[q1p]:i3B;countOffset+=s57;elOpts[v57]=new Option(conf[V1q],placeholderValue);var disabled=conf[t1q]!==undefined?conf[X1p]:r0B;elOpts[v57][N1q]=disabled;elOpts[v57][Y1p]=disabled;elOpts[v57][b1p]=placeholderValue;}}else{countOffset=elOpts[o0B];}if(opts){Editor[x1q](opts,conf[u1q],function(val,label,i,attr){var option=new Option(label,val);option[Q1q]=val;if(attr){$(option)[a5X](attr);}elOpts[i+countOffset]=option;});}},create:function(conf){var M3V="ipOpts";var e3V="lect";var I3V="<s";var n3V="afeId";var U1p=L3V;U1p+=M77;var p1p=z9B;p1p+=H3V;p1p+=i47;p1p+=a9V.K57;var h1p=a9V.o87;h1p+=n3V;var i1p=a9V.V57;i1p+=e1O;var z1p=I3V;z1p+=a9V.K57;z1p+=e3V;z1p+=g1q;conf[a1q]=$(z1p)[i1p]($[r9B]({id:Editor[h1p](conf[u2B]),multiple:conf[p1p]===r0B},conf[a5X]||{}))[G9B](v3V,function(e,d){var s3V="_lastS";var G1p=f2X;G1p+=u87;G1p+=a9V.W57;G1p+=U47;if(!d||!d[G1p]){var E1p=g17;E1p+=e4B;var A1p=s3V;A1p+=e4B;conf[A1p]=fieldTypes[y3q][E1p](conf);}});fieldTypes[y3q][P3V](conf,conf[U1p]||conf[M3V]);return conf[a1q][v57];},update:function(conf,options,append){var S3V="tSet";var F1p=q1q;F1p+=g87;F1p+=B4X;var J1p=s67;J1p+=o5X;J1p+=S3V;fieldTypes[y3q][P3V](conf,options,append);var lastSet=conf[J1p];if(lastSet!==undefined){var D1p=a9V.o87;D1p+=F77;D1p+=a9V.K57;D1p+=j5X;fieldTypes[D1p][u5X](conf,lastSet,r0B);}_triggerChange(conf[F1p]);},get:function(conf){var j3V="epara";var y3V="separato";var m3V="multiple";var C3V="toArr";var V1p=V3B;V1p+=f8B;var K1p=C3V;K1p+=a9V.V57;K1p+=O77;var val=conf[a1q][V4X](n7q)[U8X](function(){var o3V="ditor_val";var R1p=s67;R1p+=a9V.K57;R1p+=o3V;return this[R1p];})[K1p]();if(conf[m3V]){var W1p=y3V;W1p+=E47;var l1p=a9V.o87;l1p+=j3V;l1p+=o3q;return conf[l1p]?val[K7X](conf[W1p]):val;}return val[V1p]?val[v57]:o9B;},set:function(conf,val,localUpdate){var w3V="_inpu";var d3V="_lastSet";var B3V="ple";var f3V="isArr";var r3V="ceholder";var s37=o4B;s37+=m4B;s37+=g87;s37+=V3B;var v37=E8B;v37+=a9V.V57;v37+=r3V;var n37=a9V.K57;n37+=a9V.V57;n37+=a9V.l57;n37+=T17;var H37=G5q;H37+=L47;H37+=a9V.d87;var L37=a9V.B87;L37+=G67;L37+=a9V.x57;var Q1p=L47;Q1p+=B9q;var u1p=f6q;u1p+=v0B;u1p+=a9V.W57;var x1p=f3V;x1p+=e5B;var t1p=r47;t1p+=T9B;t1p+=B3V;if(!localUpdate){conf[d3V]=val;}if(conf[t1p]&&conf[a3V]&&!$[t8B](val)){val=typeof val===J8B?val[j2O](conf[a3V]):[];}else if(!$[x1p](val)){val=[val];}var i,len=val[o0B],found,allFound=m0B;var options=conf[u1p][V4X](Q1p);conf[a1q][L37](H37)[n37](function(){var N3V="or_val";var c3V="cte";var e37=H47;e37+=V3B;e37+=c3V;e37+=a9V.x57;found=m0B;for(i=v57;i<len;i++){var I37=n9X;I37+=N3V;if(this[I37]==val[i]){found=r0B;allFound=r0B;break;}}this[e37]=found;});if(conf[v37]&&!allFound&&!conf[s37]&&options[o0B]){options[v57][V1O]=r0B;}if(!localUpdate){var P37=w3V;P37+=a9V.W57;_triggerChange(conf[P37]);}return allFound;},destroy:function(conf){var M37=L47;M37+=a9V.B87;M37+=a9V.B87;conf[a1q][M37](v3V);}});fieldTypes[k3V]=$[r9B](r0B,{},baseFieldType,{_addOptions:function(conf,opts,append){var g3V="Pai";var T3V="emp";var val,label;var jqInput=conf[a1q];var offset=v57;if(!append){var S37=T3V;S37+=U87;jqInput[S37]();}else{var C37=u87;C37+=Z3V;offset=$(C37,jqInput)[o0B];}if(opts){var m37=G5q;m37+=L5X;m37+=g3V;m37+=E47;var o37=g2O;o37+=u87;o37+=E47;o37+=a9V.o87;Editor[o37](opts,conf[m37],function(val,label,i,attr){var A3V=":las";var i3V='<div>';var z3V="id=\"";var b3V="<input ";var Y3V="box\" />";var X3V="\" type=\"check";var q3V="_va";var a37=O3V;a37+=o3q;a37+=q3V;a37+=i47;var d37=F87;d37+=a9V.W57;d37+=E47;var B37=V4B;B37+=O0B;var f37=u87;f37+=a9V.x57;var r37=X3V;r37+=Y3V;var j37=u87;j37+=a9V.x57;var y37=b3V;y37+=z3V;jqInput[o7B](i3V+y37+Editor[s1X](conf[j37])+h3V+(i+offset)+r37+p3V+Editor[s1X](conf[f37])+h3V+(i+offset)+Q2B+label+n9B+B37);$(G3V,jqInput)[d37](I1X,val)[v57][a37]=val;if(attr){var N37=a9V.V57;N37+=a9V.W57;N37+=e1X;var c37=z4B;c37+=a9V.W57;c37+=A3V;c37+=a9V.W57;$(c37,jqInput)[N37](attr);}});}},create:function(conf){var T37=s67;T37+=u87;T37+=q47;T37+=a9V.W57;var k37=H3V;k37+=s77;k37+=g87;k37+=t7X;var w37=L3V;w37+=a9V.d87;w37+=a9V.o87;conf[a1q]=$(E3V);fieldTypes[k3V][P3V](conf,conf[w37]||conf[k37]);return conf[T37][v57];},get:function(conf){var t3V="dValue";var V3V="unselecte";var l3V='input:checked';var K3V="lectedValue";var R3V="nse";var F3V="arator";var D3V="oin";var J3V="ara";var U3V="sep";var z37=U3V;z37+=J3V;z37+=o3q;var b37=a9V.I87;b37+=D3V;var Y37=a9V.o87;Y37+=o2O;Y37+=F3V;var O37=v0B;O37+=R3V;O37+=K3V;var Z37=s67;Z37+=G67;Z37+=g87;Z37+=B4X;var out=[];var selected=conf[Z37][V4X](l3V);if(selected[o0B]){selected[O8B](function(){var W3V="_editor_v";var g37=W3V;g37+=x1X;out[Z8B](this[g37]);});}else if(conf[O37]!==undefined){var X37=V3V;X37+=t3V;var q37=g87;q37+=v0B;q37+=a9V.o87;q37+=T17;out[q37](conf[X37]);}return conf[a3V]===undefined||conf[Y37]===o9B?out:out[b37](conf[z37]);},set:function(conf,val){var L0V='|';var Q3V="ator";var u3V="separ";var x3V="trin";var p37=a9V.o87;p37+=x3V;p37+=g17;var h37=u87;h37+=c1q;h37+=v0B;h37+=a9V.W57;var i37=v0q;i37+=c1q;i37+=v0B;i37+=a9V.W57;var jqInputs=conf[i37][V4X](h37);if(!$[t8B](val)&&typeof val===p37){var G37=u3V;G37+=Q3V;val=val[j2O](conf[G37]||L0V);}else if(!$[t8B](val)){val=[val];}var i,len=val[o0B],found;jqInputs[O8B](function(){found=m0B;for(i=v57;i<len;i++){if(this[Q1q]==val[i]){found=r0B;break;}}this[H0V]=found;});_triggerChange(jqInputs);},enable:function(conf){var n0V="isabl";var J37=a9V.x57;J37+=n0V;J37+=a9V.K57;J37+=a9V.x57;var U37=g87;U37+=E47;U37+=L47;U37+=g87;var E37=u87;E37+=Z3V;var A37=a9V.B87;A37+=u87;A37+=a9V.d87;A37+=a9V.x57;conf[a1q][A37](E37)[U37](J37,m0B);},disable:function(conf){var l37=a9V.x57;l37+=V9B;l37+=a9V.x57;var K37=g87;K37+=E47;K37+=L47;K37+=g87;var R37=u87;R37+=c1q;R37+=v0B;R37+=a9V.W57;var F37=L0B;F37+=a9V.d87;F37+=a9V.x57;var D37=v0q;D37+=a9V.d87;D37+=J9q;conf[D37][F37](R37)[K37](l37,r0B);},update:function(conf,options,append){var I0V="_addOpti";var V37=I0V;V37+=L5X;var W37=g17;W37+=a9V.K57;W37+=a9V.W57;var checkbox=fieldTypes[k3V];var currVal=checkbox[W37](conf);checkbox[V37](conf,options,append);checkbox[u5X](conf,currVal);}});fieldTypes[e0V]=$[t37](r0B,{},baseFieldType,{_addOptions:function(conf,opts,append){var v0V="ai";var val,label;var jqInput=conf[a1q];var offset=v57;if(!append){var x37=z6X;x37+=g87;x37+=a9V.W57;x37+=O77;jqInput[x37]();}else{var Q37=i47;Q37+=U3q;var u37=z4B;u37+=a9V.W57;offset=$(u37,jqInput)[Q37];}if(opts){var L07=g87;L07+=v0V;L07+=P3O;Editor[L07](opts,conf[u1q],function(val,label,i,attr){var C0V='" type="radio" name="';var S0V='<input id="';var M0V="<di";var P0V="ut:last";var s0V="itor_";var s07=k67;s07+=a9V.x57;s07+=s0V;s07+=d8B;var v07=a9V.V57;v07+=G6q;v07+=E47;var e07=w6q;e07+=P0V;var I07=g0B;I07+=H3B;I07+=O0B;var n07=M0V;n07+=O0B;var H07=a9V.V57;H07+=F7B;H07+=a9V.d87;H07+=a9V.x57;jqInput[H07](n07+S0V+Editor[s1X](conf[u2B])+h3V+(i+offset)+C0V+conf[h2B]+J6q+p3V+Editor[s1X](conf[u2B])+h3V+(i+offset)+Q2B+label+n9B+I07);$(e07,jqInput)[v07](I1X,val)[v57][s07]=val;if(attr){$(G3V,jqInput)[a5X](attr);}});}},create:function(conf){var o0V="_addOp";var o07=H3V;o07+=s77;o07+=g9B;var C07=i3X;C07+=m4B;C07+=L47;C07+=M77;var S07=o0V;S07+=x2X;S07+=a9V.o87;var M07=Q6B;M07+=a9V.x57;M07+=r5X;var P07=v0q;P07+=Z3V;conf[P07]=$(E3V);fieldTypes[M07][S07](conf,conf[C07]||conf[o07]);this[G9B](A8X,function(){var y07=I4X;y07+=W1B;var m07=q1q;m07+=g87;m07+=B4X;conf[m07][V4X](m0V)[y07](function(){var r0V="checke";var j0V="ecked";var y0V="_preC";var j07=y0V;j07+=T17;j07+=j0V;if(this[j07]){var r07=r0V;r07+=a9V.x57;this[r07]=r0B;}});});return conf[a1q][v57];},get:function(conf){var f0V="input:c";var d07=s67;d07+=c0O;d07+=V47;d07+=d8B;var B07=f0V;B07+=k6B;B07+=B0V;B07+=a9V.x57;var f07=s67;f07+=G67;f07+=J9q;var el=conf[f07][V4X](B07);return el[o0B]?el[v57][d07]:undefined;},set:function(conf,val){var d0V="t:checked";var g07=z4B;g07+=d0V;var Z07=L0B;Z07+=a9V.d87;Z07+=a9V.x57;var c07=z4B;c07+=a9V.W57;var a07=a9V.B87;a07+=u87;a07+=z7B;var that=this;conf[a1q][a07](c07)[O8B](function(){var k0V="preCheck";var w0V="_preChecked";var N0V="cked";var c0V="preCh";var a0V="tor_val";var w07=O3V;w07+=a0V;var N07=s67;N07+=c0V;N07+=a9V.K57;N07+=N0V;this[N07]=m0B;if(this[w07]==val){var k07=W1B;k07+=a9V.K57;k07+=B0V;k07+=a9V.x57;this[k07]=r0B;this[w0V]=r0B;}else{var T07=s67;T07+=k0V;T07+=f2X;this[H0V]=m0B;this[T07]=m0B;}});_triggerChange(conf[a1q][Z07](g07));},enable:function(conf){var Y07=H3B;Y07+=Y1q;Y07+=H4B;Y07+=f2X;var X07=n67;X07+=i3X;var q07=a9V.B87;q07+=u87;q07+=a9V.d87;q07+=a9V.x57;var O07=s67;O07+=G67;O07+=Q5B;O07+=a9V.W57;conf[O07][q07](m0V)[X07](Y07,m0B);},disable:function(conf){var z07=u87;z07+=a9V.d87;z07+=J9q;var b07=a9V.B87;b07+=u87;b07+=z7B;conf[a1q][b07](z07)[T0V](J8q,r0B);},update:function(conf,options,append){var Z0V="[valu";var U07=a9V.V57;U07+=a9V.W57;U07+=a9V.W57;U07+=E47;var E07=i47;E07+=a9V.j87;E07+=P0B;E07+=T17;var A07=F3B;A07+=R3B;var G07=Z0V;G07+=a9V.K57;G07+=X0q;G07+=F3B;var p07=z4B;p07+=a9V.W57;var h07=f6q;h07+=B4X;var i07=Q6B;i07+=a9V.x57;i07+=u87;i07+=L47;var radio=fieldTypes[i07];var currVal=radio[G9X](conf);radio[P3V](conf,options,append);var inputs=conf[h07][V4X](p07);radio[u5X](conf,inputs[Q6O](G07+currVal+A07)[E07]?currVal:inputs[j9X](v57)[U07](I1X));}});fieldTypes[w2q]=$[J07](r0B,{},baseFieldType,{create:function(conf){var E0V='date';var i0V="RFC_2822";var z0V="Format";var b0V="icke";var X0V="dateFormat";var q0V='jqueryui';var O0V='<input />';var g0V="tepicker";var e27=q1q;e27+=Q5B;e27+=a9V.W57;var F07=a9V.x57;F07+=a9V.V57;F07+=g0V;var D07=a9V.V57;D07+=a9V.W57;D07+=e1X;conf[a1q]=$(O0V)[a5X]($[r9B]({id:Editor[s1X](conf[u2B]),type:Z1q},conf[D07]));if($[F07]){var K07=c1X;K07+=a9V.x57;K07+=d6B;K07+=a6B;var R07=q1q;R07+=Q5B;R07+=a9V.W57;conf[R07][K07](q0V);if(!conf[X0V]){var W07=Y0V;W07+=b0V;W07+=E47;var l07=k9O;l07+=a9V.K57;l07+=z0V;conf[l07]=$[W07][i0V];}setTimeout(function(){var A0V='#ui-datepicker-div';var G0V="epicker";var p0V="teFor";var h0V="Im";var n27=L47;n27+=g87;n27+=a9V.W57;n27+=a9V.o87;var L27=w2q;L27+=h0V;L27+=a9V.V57;L27+=N47;var Q07=N2O;Q07+=p0V;Q07+=n0X;Q07+=a9V.W57;var u07=D17;u07+=i67;u07+=T17;var x07=P3B;x07+=a9V.W57;x07+=a9V.K57;x07+=z7B;var t07=k9O;t07+=G0V;var V07=q1q;V07+=g87;V07+=B4X;$(conf[V07])[t07]($[x07]({showOn:u07,dateFormat:conf[Q07],buttonImage:conf[L27],buttonImageOnly:r0B,onSelect:function(){var H27=s67;H27+=G67;H27+=g87;H27+=B4X;conf[H27][L8B]()[L1B]();}},conf[n27]));$(A0V)[M5B](j9B,S5B);},m57);}else{var I27=a9V.W57;I27+=O77;I27+=g87;I27+=a9V.K57;conf[a1q][a5X](I27,E0V);}return conf[e27][v57];},set:function(conf,val){var R0V="setDate";var D0V="epi";var U0V="Datepicker";var v27=T17;v27+=F2X;v27+=U0V;if($[J0V]&&conf[a1q][O9B](v27)){var s27=k9O;s27+=D0V;s27+=F0V;conf[a1q][s27](R0V,val)[U5q]();}else{var M27=j47;M27+=a9V.V57;M27+=i47;var P27=s67;P27+=G67;P27+=Q5B;P27+=a9V.W57;$(conf[P27])[M27](val);}},enable:function(conf){var K0V="nab";if($[J0V]){var C27=a9V.K57;C27+=K0V;C27+=i47;C27+=a9V.K57;var S27=Y0V;S27+=r8q;S27+=a9V.K57;S27+=E47;conf[a1q][S27](C27);}else{var o27=H3B;o27+=a9V.o87;o27+=m5B;o27+=y5B;$(conf[a1q])[T0V](o27,m0B);}},disable:function(conf){var W0V="disabl";var l0V="pic";if($[J0V]){var y27=p8q;y27+=a9V.f87;var m27=w2q;m27+=l0V;m27+=d0B;m27+=R47;conf[a1q][m27](y27);}else{var f27=W0V;f27+=f2X;var r27=g87;r27+=B67;r27+=g87;var j27=v0q;j27+=c1q;j27+=v0B;j27+=a9V.W57;$(conf[j27])[r27](f27,r0B);}},owns:function(conf,node){var x0V='div.ui-datepicker';var t0V="datepicker-header";var V0V="div.ui-";var a27=V0V;a27+=t0V;var d27=g87;d27+=z5q;d27+=a9V.W57;d27+=a9V.o87;var B27=a4B;B27+=a9V.o87;return $(node)[B27](x0V)[o0B]||$(node)[d27](a27)[o0B]?r0B:m0B;}});fieldTypes[c27]=$[r9B](r0B,{},baseFieldType,{create:function(conf){var M2V="_closeFn";var v2V="keyInput";var I2V="put ";var n2V="<in";var H2V="Id";var L2V="af";var Q0V="_pic";var u0V="rmat";var G27=p17;G27+=L47;G27+=H47;var b27=O9X;b27+=Z0B;var Y27=i3X;Y27+=a9V.W57;Y27+=a9V.o87;var q27=u87;q27+=w87;q27+=u9X;q27+=a9V.d87;var O27=U5B;O27+=u0V;var g27=Q0V;g27+=d0B;g27+=a9V.K57;g27+=E47;var Z27=a9V.W57;Z27+=a9V.K57;Z27+=U7X;var T27=u87;T27+=a9V.x57;var k27=a9V.o87;k27+=L2V;k27+=a9V.K57;k27+=H2V;var w27=n2V;w27+=I2V;w27+=g1q;var N27=s67;N27+=G67;N27+=Q5B;N27+=a9V.W57;conf[N27]=$(w27)[a5X]($[r9B](r0B,{id:Editor[k27](conf[T27]),type:Z27},conf[a5X]));conf[g27]=new Editor[S6q](conf[a1q],$[r9B]({format:conf[O27],i18n:this[q27][Z2q],onChange:function(){var X27=s67;X27+=w6q;X27+=B4X;_triggerChange(conf[X27]);}},conf[Y27]));conf[b27]=function(){var i27=t1B;i27+=z17;var z27=E9q;z27+=e2V;conf[z27][i27]();};if(conf[v2V]===m0B){var h27=s67;h27+=u87;h27+=q47;h27+=a9V.W57;conf[h27][G9B](s2V,function(e){var P2V="entDefau";var p27=n67;p27+=D2O;p27+=P2V;p27+=a0B;e[p27]();});}this[G9B](G27,conf[M2V]);return conf[a1q][v57];},set:function(conf,val){var A27=j47;A27+=a9V.V57;A27+=i47;conf[S2V][A27](val);_triggerChange(conf[a1q]);},owns:function(conf,node){var o2V="owns";var E27=C2V;E27+=o6B;E27+=R47;return conf[E27][o2V](node);},errorMessage:function(conf,msg){var m2V="rMsg";var U27=a9V.K57;U27+=G5B;U27+=L47;U27+=m2V;conf[S2V][U27](msg);},destroy:function(conf){var j2V="loseFn";var y2V="oy";var R27=a9V.x57;R27+=Q3B;R27+=e1X;R27+=y2V;var F27=E9q;F27+=e2V;var D27=s67;D27+=a9V.l57;D27+=j2V;var J27=I0X;J27+=H47;this[W7B](J27,conf[D27]);conf[a1q][W7B](s2V);conf[F27][R27]();},minDate:function(conf,min){var l27=J2O;l27+=a9V.d87;var K27=s67;K27+=g87;K27+=u87;K27+=F0V;conf[K27][l27](min);},maxDate:function(conf,max){var r2V="ker";var V27=a9V.t57;V27+=a9V.V57;V27+=K87;var W27=C2V;W27+=a9V.l57;W27+=r2V;conf[W27][V27](max);}});fieldTypes[F1X]=$[t27](r0B,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var x27=a9V.o87;x27+=a9V.K57;x27+=a9V.W57;Editor[b2B][F1X][x27][D9B](editor,conf,val[v57]);});return container;},get:function(conf){var u27=s67;u27+=d8B;return conf[u27];},set:function(conf,val){var T2V='noClear';var k2V="clearText";var w2V="moveClas";var N2V='No file';var c2V="appen";var a2V="<span";var d2V="ileTe";var B2V="noF";var f2V="earTex";var S97=s67;S97+=j47;S97+=x1X;var M97=G67;M97+=J9q;var P97=a9V.B87;P97+=u87;P97+=a9V.d87;P97+=a9V.x57;var s97=q1q;s97+=g87;s97+=B4X;var e97=p17;e97+=f2V;e97+=a9V.W57;var Q27=H3B;Q27+=P8O;conf[w1q]=val;var container=conf[a1q];if(conf[Q27]){var rendered=container[V4X](o1q);if(conf[w1q]){rendered[o8B](conf[M8B](conf[w1q]));}else{var I97=B2V;I97+=d2V;I97+=K87;I97+=a9V.W57;var n97=a2V;n97+=Y0B;var H97=c2V;H97+=a9V.x57;var L97=a9V.K57;L97+=a9V.t57;L97+=i8B;L97+=O77;rendered[L97]()[H97](n97+(conf[I97]||N2V)+P9B);}}var button=container[V4X](m1q);if(val&&conf[e97]){var v97=E47;v97+=a9V.K57;v97+=w2V;v97+=a9V.o87;button[o8B](conf[k2V]);container[v97](T2V);}else{container[L5B](T2V);}conf[s97][P97](M97)[i9O](Z2V,[conf[S97]]);},enable:function(conf){var g2V="_en";var o97=g2V;o97+=a9V.V57;o97+=H4B;o97+=f2X;var C97=u87;C97+=a9V.d87;C97+=J9q;conf[a1q][V4X](C97)[T0V](J8q,m0B);conf[o97]=r0B;},disable:function(conf){var O2V="enabl";var j97=s67;j97+=O2V;j97+=f2X;var y97=a9V.x57;y97+=V9B;y97+=a9V.x57;var m97=a9V.B87;m97+=u87;m97+=a9V.d87;m97+=a9V.x57;conf[a1q][m97](m0V)[T0V](y97,r0B);conf[j97]=m0B;},canReturnSubmit:function(conf,node){return m0B;}});fieldTypes[r97]=$[f97](r0B,{},baseFieldType,{create:function(conf){var z2V='button.remove';var b2V='multi';var q2V="ddCla";var w97=L47;w97+=a9V.d87;var N97=a9V.V57;N97+=q2V;N97+=a6B;var editor=this;var container=_commonUpload(editor,conf,function(val){var Y2V="ncat";var X2V="oadM";var c97=a9V.o87;c97+=a9V.K57;c97+=a9V.W57;var a97=v0B;a97+=E8B;a97+=X2V;a97+=O6O;var d97=Z4X;d97+=Y2V;var B97=s67;B97+=d8B;conf[w1q]=conf[B97][d97](val);Editor[b2B][a97][c97][D9B](editor,conf,conf[w1q]);});container[N97](b2V)[w97](b9B,z2V,function(e){var G2V='idx';var p2V="stopPropagation";var h2V="_v";var i2V="loadM";var O97=a9V.o87;O97+=a9V.K57;O97+=a9V.W57;var g97=F67;g97+=i2V;g97+=U7B;g97+=O77;var Z97=F4B;Z97+=a9V.o87;var T97=h2V;T97+=x1X;var k97=N2O;k97+=d4B;e[p2V]();var idx=$(this)[k97](G2V);conf[T97][C2X](idx,s57);Editor[Z97][g97][O97][D9B](editor,conf,conf[w1q]);});return container;},get:function(conf){return conf[w1q];},set:function(conf,val){var e9V='No files';var I9V='<span>';var n9V="noFil";var H9V="an>";var L9V="sp";var F2V="<u";var D2V=" array as a value";var J2V="Upload collections must have an";var U2V="dler";var E2V="erHan";var A2V="trigg";var V97=s67;V97+=j47;V97+=a9V.V57;V97+=i47;var W97=A2V;W97+=E2V;W97+=U2V;var l97=a9V.B87;l97+=u87;l97+=a9V.d87;l97+=a9V.x57;var K97=v0q;K97+=a9V.d87;K97+=J9q;var Y97=a9V.x57;Y97+=u87;Y97+=P8O;var q97=n4X;q97+=X9O;if(!val){val=[];}if(!$[q97](val)){var X97=J2V;X97+=D2V;throw X97;}conf[w1q]=val;var that=this;var container=conf[a1q];if(conf[Y97]){var z97=V3B;z97+=a9V.d87;z97+=P0B;z97+=T17;var b97=a9V.K57;b97+=W9X;b97+=U87;var rendered=container[V4X](o1q)[b97]();if(val[z97]){var p97=a9V.K57;p97+=a9V.V57;p97+=a9V.l57;p97+=T17;var h97=H5X;h97+=n5X;var i97=F2V;i97+=i47;i97+=F0B;i97+=Y0B;var list=$(i97)[h97](rendered);$[p97](val,function(i,file){var Q2V=' <button class="';var u2V='<li>';var x2V="ppend";var t2V="x=\"";var V2V=" remove\" data-";var W2V="n>";var l2V="\">&times;</";var K2V="i>";var R2V="</l";var D97=R2V;D97+=K2V;var J97=l2V;J97+=E17;J97+=W2V;var U97=V2V;U97+=u2B;U97+=t2V;var E97=R3q;E97+=G6q;E97+=L47;E97+=a9V.d87;var A97=U5B;A97+=E47;A97+=a9V.t57;var G97=a9V.V57;G97+=x2V;list[G97](u2V+conf[M8B](file,i)+Q2V+that[L2X][A97][E97]+U97+i+J97+D97);});}else{var R97=L7B;R97+=F0B;R97+=L9V;R97+=H9V;var F97=n9V;F97+=x0O;rendered[o7B](I9V+(conf[F97]||e9V)+R97);}}conf[K97][l97](m0V)[W97](Z2V,[conf[V97]]);},enable:function(conf){var x97=G67;x97+=Q5B;x97+=a9V.W57;var t97=a9V.B87;t97+=G67;t97+=a9V.x57;conf[a1q][t97](x97)[T0V](J8q,m0B);conf[K6q]=r0B;},disable:function(conf){var v9V="nabled";var Q97=k67;Q97+=v9V;var u97=H7q;u97+=a9V.x57;conf[a1q][u97](m0V)[T0V](J8q,r0B);conf[Q97]=m0B;},canReturnSubmit:function(conf,node){return m0B;}});}());if(DataTable[w8X][L57]){var n57=P3B;n57+=a9V.W57;var H57=a9V.K57;H57+=U7X;H57+=a9V.K57;H57+=z7B;$[H57](Editor[b2B],DataTable[n57][s9V]);}DataTable[w8X][s9V]=Editor[b2B];Editor[H4X]={};Editor[I57][P9V]=M9V;Editor[S9V]=e57;return Editor;}));

/*! AutoFill 2.2.2
 * ©2008-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     AutoFill
 * @description Add Excel like click and drag auto-fill options to DataTables
 * @version     2.2.2
 * @file        dataTables.autoFill.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _instance = 0;

/** 
 * AutoFill provides Excel like auto-fill features for a DataTable
 *
 * @class AutoFill
 * @constructor
 * @param {object} oTD DataTables settings object
 * @param {object} oConfig Configuration object for AutoFill
 */
var AutoFill = function( dt, opts )
{
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw( "Warning: AutoFill requires DataTables 1.10.8 or greater");
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.autoFill,
		AutoFill.defaults,
		opts
	);

	/**
	 * @namespace Settings object which contains customisable information for AutoFill instance
	 */
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		/** @type {String} Unique namespace for events attached to the document */
		namespace: '.autoFill'+(_instance++),

		/** @type {Object} Cached dimension information for use in the mouse move event handler */
		scroll: {},

		/** @type {integer} Interval object used for smooth scrolling */
		scrollInterval: null,

		handle: {
			height: 0,
			width: 0
		},

		/**
		 * Enabled setting
		 * @type {Boolean}
		 */
		enabled: false
	};


	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		/** @type {jQuery} AutoFill handle */
		handle: $('<div class="dt-autofill-handle"/>'),

		/**
		 * @type {Object} Selected cells outline - Need to use 4 elements,
		 *   otherwise the mouse over if you back into the selected rectangle
		 *   will be over that element, rather than the cells!
		 */
		select: {
			top:    $('<div class="dt-autofill-select top"/>'),
			right:  $('<div class="dt-autofill-select right"/>'),
			bottom: $('<div class="dt-autofill-select bottom"/>'),
			left:   $('<div class="dt-autofill-select left"/>')
		},

		/** @type {jQuery} Fill type chooser background */
		background: $('<div class="dt-autofill-background"/>'),

		/** @type {jQuery} Fill type chooser */
		list: $('<div class="dt-autofill-list">'+this.s.dt.i18n('autoFill.info', '')+'<ul/></div>'),

		/** @type {jQuery} DataTables scrolling container */
		dtScroll: null,

		/** @type {jQuery} Offset parent element */
		offsetParent: null
	};


	/* Constructor logic */
	this._constructor();
};



$.extend( AutoFill.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods (exposed via the DataTables API below)
	 */
	enabled: function ()
	{
		return this.s.enabled;
	},


	enable: function ( flag )
	{
		var that = this;

		if ( flag === false ) {
			return this.disable();
		}

		this.s.enabled = true;

		this._focusListener();

		this.dom.handle.on( 'mousedown', function (e) {
			that._mousedown( e );
			return false;
		} );

		return this;
	},

	disable: function ()
	{
		this.s.enabled = false;

		this._focusListenerRemove();

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the RowReorder instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtScroll = $('div.dataTables_scrollBody', this.s.dt.table().container());

		// Make the instance accessible to the API
		dt.settings()[0].autoFill = this;

		if ( dtScroll.length ) {
			this.dom.dtScroll = dtScroll;

			// Need to scroll container to be the offset parent
			if ( dtScroll.css('position') === 'static' ) {
				dtScroll.css( 'position', 'relative' );
			}
		}

		if ( this.c.enable !== false ) {
			this.enable();
		}

		dt.on( 'destroy.autoFill', function () {
			that._focusListenerRemove();
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Display the AutoFill drag handle by appending it to a table cell. This
	 * is the opposite of the _detach method.
	 *
	 * @param  {node} node TD/TH cell to insert the handle into
	 * @private
	 */
	_attach: function ( node )
	{
		var dt = this.s.dt;
		var idx = dt.cell( node ).index();
		var handle = this.dom.handle;
		var handleDim = this.s.handle;

		if ( ! idx || dt.columns( this.c.columns ).indexes().indexOf( idx.column ) === -1 ) {
			this._detach();
			return;
		}

		if ( ! this.dom.offsetParent ) {
			// We attach to the table's offset parent
			this.dom.offsetParent = $( dt.table().node() ).offsetParent();
		}

		if ( ! handleDim.height || ! handleDim.width ) {
			// Append to document so we can get its size. Not expecting it to
			// change during the life time of the page
			handle.appendTo( 'body' );
			handleDim.height = handle.outerHeight();
			handleDim.width = handle.outerWidth();
		}

		// Might need to go through multiple offset parents
		var offset = this._getPosition( node, this.dom.offsetParent );

		this.dom.attachedTo = node;
		handle
			.css( {
				top: offset.top + node.offsetHeight - handleDim.height,
				left: offset.left + node.offsetWidth - handleDim.width
			} )
			.appendTo( this.dom.offsetParent );
	},


	/**
	 * Determine can the fill type should be. This can be automatic, or ask the
	 * end user.
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_actionSelector: function ( cells )
	{
		var that = this;
		var dt = this.s.dt;
		var actions = AutoFill.actions;
		var available = [];

		// "Ask" each plug-in if it wants to handle this data
		$.each( actions, function ( key, action ) {
			if ( action.available( dt, cells ) ) {
				available.push( key );
			}
		} );

		if ( available.length === 1 && this.c.alwaysAsk === false ) {
			// Only one action available - enact it immediately
			var result = actions[ available[0] ].execute( dt, cells );
			this._update( result, cells );
		}
		else {
			// Multiple actions available - ask the end user what they want to do
			var list = this.dom.list.children('ul').empty();

			// Add a cancel option
			available.push( 'cancel' );

			$.each( available, function ( i, name ) {
				list.append( $('<li/>')
					.append(
						'<div class="dt-autofill-question">'+
							actions[ name ].option( dt, cells )+
						'<div>'
					)
					.append( $('<div class="dt-autofill-button">' )
						.append( $('<button class="'+AutoFill.classes.btn+'">'+dt.i18n('autoFill.button', '&gt;')+'</button>')
							.on( 'click', function () {
								var result = actions[ name ].execute(
									dt, cells, $(this).closest('li')
								);
								that._update( result, cells );

								that.dom.background.remove();
								that.dom.list.remove();
							} )
						)
					)
				);
			} );

			this.dom.background.appendTo( 'body' );
			this.dom.list.appendTo( 'body' );

			this.dom.list.css( 'margin-top', this.dom.list.outerHeight()/2 * -1 );
		}
	},


	/**
	 * Remove the AutoFill handle from the document
	 *
	 * @private
	 */
	_detach: function ()
	{
		this.dom.attachedTo = null;
		this.dom.handle.detach();
	},


	/**
	 * Draw the selection outline by calculating the range between the start
	 * and end cells, then placing the highlighting elements to draw a rectangle
	 *
	 * @param  {node}   target End cell
	 * @param  {object} e      Originating event
	 * @private
	 */
	_drawSelection: function ( target, e )
	{
		// Calculate boundary for start cell to this one
		var dt = this.s.dt;
		var start = this.s.start;
		var startCell = $(this.dom.start);
		var endCell = $(target);
		var end = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( endCell.parent()[0] ),
			column: endCell.index()
		};
		var colIndx = dt.column.index( 'toData', end.column );

		// Be sure that is a DataTables controlled cell
		if ( ! dt.cell( endCell ).any() ) {
			return;
		}

		// if target is not in the columns available - do nothing
		if ( dt.columns( this.c.columns ).indexes().indexOf( colIndx ) === -1 ) {
			return;
		}

		this.s.end = end;

		var top, bottom, left, right, height, width;

		top    = start.row    < end.row    ? startCell : endCell;
		bottom = start.row    < end.row    ? endCell   : startCell;
		left   = start.column < end.column ? startCell : endCell;
		right  = start.column < end.column ? endCell   : startCell;

		top    = this._getPosition( top ).top;
		left   = this._getPosition( left ).left;
		height = this._getPosition( bottom ).top + bottom.outerHeight() - top;
		width  = this._getPosition( right ).left + right.outerWidth() - left;

		var select = this.dom.select;
		select.top.css( {
			top: top,
			left: left,
			width: width
		} );

		select.left.css( {
			top: top,
			left: left,
			height: height
		} );

		select.bottom.css( {
			top: top + height,
			left: left,
			width: width
		} );

		select.right.css( {
			top: top,
			left: left + width,
			height: height
		} );
	},


	/**
	 * Use the Editor API to perform an update based on the new data for the
	 * cells
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_editor: function ( cells )
	{
		var dt = this.s.dt;
		var editor = this.c.editor;

		if ( ! editor ) {
			return;
		}

		// Build the object structure for Editor's multi-row editing
		var idValues = {};
		var nodes = [];
		var fields = editor.fields();

		for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
			for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
				var cell = cells[i][j];

				// Determine the field name for the cell being edited
				var col = dt.settings()[0].aoColumns[ cell.index.column ];
				var fieldName = col.editField;

				if ( fieldName === undefined ) {
					var dataSrc = col.mData;

					// dataSrc is the `field.data` property, but we need to set
					// using the field name, so we need to translate from the
					// data to the name
					for ( var k=0, ken=fields.length ; k<ken ; k++ ) {
						var field = editor.field( fields[k] );

						if ( field.dataSrc() === dataSrc ) {
							fieldName = field.name();
							break;
						}
					}
				}

				if ( ! fieldName ) {
					throw 'Could not automatically determine field data. '+
						'Please see https://datatables.net/tn/11';
				}

				if ( ! idValues[ fieldName ] ) {
					idValues[ fieldName ] = {};
				}

				var id = dt.row( cell.index.row ).id();
				idValues[ fieldName ][ id ] = cell.set;

				// Keep a list of cells so we can activate the bubble editing
				// with them
				nodes.push( cell.index );
			}
		}

		// Perform the edit using bubble editing as it allows us to specify
		// the cells to be edited, rather than using full rows
		editor
			.bubble( nodes, false )
			.multiSet( idValues )
			.submit();
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name+'.dt', args );
		} );
	},


	/**
	 * Attach suitable listeners (based on the configuration) that will attach
	 * and detach the AutoFill handle in the document.
	 *
	 * @private
	 */
	_focusListener: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var namespace = this.s.namespace;
		var focus = this.c.focus !== null ?
			this.c.focus :
			dt.init().keys || dt.settings()[0].keytable ?
				'focus' :
				'hover';

		// All event listeners attached here are removed in the `destroy`
		// callback in the constructor
		if ( focus === 'focus' ) {
			dt
				.on( 'key-focus.autoFill', function ( e, dt, cell ) {
					that._attach( cell.node() );
				} )
				.on( 'key-blur.autoFill', function ( e, dt, cell ) {
					that._detach();
				} );
		}
		else if ( focus === 'click' ) {
			$(dt.table().body()).on( 'click'+namespace, 'td, th', function (e) {
				that._attach( this );
			} );

			$(document.body).on( 'click'+namespace, function (e) {
				if ( ! $(e.target).parents().filter( dt.table().body() ).length ) {
					that._detach();
				}
			} );
		}
		else {
			$(dt.table().body())
				.on( 'mouseenter'+namespace, 'td, th', function (e) {
					that._attach( this );
				} )
				.on( 'mouseleave'+namespace, function (e) {
					if ( $(e.relatedTarget).hasClass('dt-autofill-handle') ) {
						return;
					}

					that._detach();
				} );
		}
	},


	_focusListenerRemove: function ()
	{
		var dt = this.s.dt;

		dt.off( '.autoFill' );
		$(dt.table().body()).off( this.s.namespace );
		$(document.body).off( this.s.namespace );
	},


	/**
	 * Get the position of a node, relative to another, including any scrolling
	 * offsets.
	 * @param  {Node}   node         Node to get the position of
	 * @param  {jQuery} targetParent Node to use as the parent
	 * @return {object}              Offset calculation
	 * @private
	 */
	_getPosition: function ( node, targetParent )
	{
		var
			currNode = $(node),
			currOffsetParent,
			position,
			top = 0,
			left = 0;

		if ( ! targetParent ) {
			targetParent = $( this.s.dt.table().node() ).offsetParent();
		}

		do {
			position = currNode.position();
			currOffsetParent = currNode.offsetParent();

			top += position.top + currOffsetParent.scrollTop();
			left += position.left + currOffsetParent.scrollLeft();

			// Emergency fall back. Shouldn't happen, but just in case!
			if ( currNode.get(0).nodeName.toLowerCase() === 'body' ) {
				break;
			}

			currNode = currOffsetParent; // for next loop
		}
		while ( currOffsetParent.get(0) !== targetParent.get(0) )

		return {
			top: top,
			left: left
		};
	},


	/**
	 * Start mouse drag - selects the start cell
	 *
	 * @param  {object} e Mouse down event
	 * @private
	 */
	_mousedown: function ( e )
	{
		var that = this;
		var dt = this.s.dt;

		this.dom.start = this.dom.attachedTo;
		this.s.start = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( $(this.dom.start).parent()[0] ),
			column: $(this.dom.start).index()
		};

		$(document.body)
			.on( 'mousemove.autoFill', function (e) {
				that._mousemove( e );
			} )
			.on( 'mouseup.autoFill', function (e) {
				that._mouseup( e );
			} );

		var select = this.dom.select;
		var offsetParent = $( dt.table().node() ).offsetParent();
		select.top.appendTo( offsetParent );
		select.left.appendTo( offsetParent );
		select.right.appendTo( offsetParent );
		select.bottom.appendTo( offsetParent );

		this._drawSelection( this.dom.start, e );

		this.dom.handle.css( 'display', 'none' );

		// Cache scrolling information so mouse move doesn't need to read.
		// This assumes that the window and DT scroller will not change size
		// during an AutoFill drag, which I think is a fair assumption
		var scrollWrapper = this.dom.dtScroll;
		this.s.scroll = {
			windowHeight: $(window).height(),
			windowWidth:  $(window).width(),
			dtTop:        scrollWrapper ? scrollWrapper.offset().top : null,
			dtLeft:       scrollWrapper ? scrollWrapper.offset().left : null,
			dtHeight:     scrollWrapper ? scrollWrapper.outerHeight() : null,
			dtWidth:      scrollWrapper ? scrollWrapper.outerWidth() : null
		};
	},


	/**
	 * Mouse drag - selects the end cell and update the selection display for
	 * the end user
	 *
	 * @param  {object} e Mouse move event
	 * @private
	 */
	_mousemove: function ( e )
	{	
		var that = this;
		var dt = this.s.dt;
		var name = e.target.nodeName.toLowerCase();
		if ( name !== 'td' && name !== 'th' ) {
			return;
		}

		this._drawSelection( e.target, e );
		this._shiftScroll( e );
	},


	/**
	 * End mouse drag - perform the update actions
	 *
	 * @param  {object} e Mouse up event
	 * @private
	 */
	_mouseup: function ( e )
	{
		$(document.body).off( '.autoFill' );

		var dt = this.s.dt;
		var select = this.dom.select;
		select.top.remove();
		select.left.remove();
		select.right.remove();
		select.bottom.remove();

		this.dom.handle.css( 'display', 'block' );

		// Display complete - now do something useful with the selection!
		var start = this.s.start;
		var end = this.s.end;

		// Haven't selected multiple cells, so nothing to do
		if ( start.row === end.row && start.column === end.column ) {
			return;
		}

		// Build a matrix representation of the selected rows
		var rows       = this._range( start.row, end.row );
		var columns    = this._range( start.column, end.column );
		var selected   = [];
		var dtSettings = dt.settings()[0];
		var dtColumns  = dtSettings.aoColumns;

		// Can't use Array.prototype.map as IE8 doesn't support it
		// Can't use $.map as jQuery flattens 2D arrays
		// Need to use a good old fashioned for loop
		for ( var rowIdx=0 ; rowIdx<rows.length ; rowIdx++ ) {
			selected.push(
				$.map( columns, function (column) {
					var cell = dt.cell( ':eq('+rows[rowIdx]+')', column+':visible', {page:'current'} );
					var data = cell.data();
					var cellIndex = cell.index();
					var editField = dtColumns[ cellIndex.column ].editField;

					if ( editField !== undefined ) {
						data = dtSettings.oApi._fnGetObjectDataFn( editField )( dt.row( cellIndex.row ).data() );
					}

					return {
						cell:  cell,
						data:  data,
						label: cell.data(),
						index: cellIndex
					};
				} )
			);
		}

		this._actionSelector( selected );
		
		// Stop shiftScroll
		clearInterval( this.s.scrollInterval );
		this.s.scrollInterval = null;
	},


	/**
	 * Create an array with a range of numbers defined by the start and end
	 * parameters passed in (inclusive!).
	 * 
	 * @param  {integer} start Start
	 * @param  {integer} end   End
	 * @private
	 */
	_range: function ( start, end )
	{
		var out = [];
		var i;

		if ( start <= end ) {
			for ( i=start ; i<=end ; i++ ) {
				out.push( i );
			}
		}
		else {
			for ( i=start ; i>=end ; i-- ) {
				out.push( i );
			}
		}

		return out;
	},


	/**
	 * Move the window and DataTables scrolling during a drag to scroll new
	 * content into view. This is done by proximity to the edge of the scrolling
	 * container of the mouse - for example near the top edge of the window
	 * should scroll up. This is a little complicated as there are two elements
	 * that can be scrolled - the window and the DataTables scrolling view port
	 * (if scrollX and / or scrollY is enabled).
	 *
	 * @param  {object} e Mouse move event object
	 * @private
	 */
	_shiftScroll: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var scroll = this.s.scroll;
		var runInterval = false;
		var scrollSpeed = 5;
		var buffer = 65;
		var
			windowY = e.pageY - document.body.scrollTop,
			windowX = e.pageX - document.body.scrollLeft,
			windowVert, windowHoriz,
			dtVert, dtHoriz;

		// Window calculations - based on the mouse position in the window,
		// regardless of scrolling
		if ( windowY < buffer ) {
			windowVert = scrollSpeed * -1;
		}
		else if ( windowY > scroll.windowHeight - buffer ) {
			windowVert = scrollSpeed;
		}

		if ( windowX < buffer ) {
			windowHoriz = scrollSpeed * -1;
		}
		else if ( windowX > scroll.windowWidth - buffer ) {
			windowHoriz = scrollSpeed;
		}

		// DataTables scrolling calculations - based on the table's position in
		// the document and the mouse position on the page
		if ( scroll.dtTop !== null && e.pageY < scroll.dtTop + buffer ) {
			dtVert = scrollSpeed * -1;
		}
		else if ( scroll.dtTop !== null && e.pageY > scroll.dtTop + scroll.dtHeight - buffer ) {
			dtVert = scrollSpeed;
		}

		if ( scroll.dtLeft !== null && e.pageX < scroll.dtLeft + buffer ) {
			dtHoriz = scrollSpeed * -1;
		}
		else if ( scroll.dtLeft !== null && e.pageX > scroll.dtLeft + scroll.dtWidth - buffer ) {
			dtHoriz = scrollSpeed;
		}

		// This is where it gets interesting. We want to continue scrolling
		// without requiring a mouse move, so we need an interval to be
		// triggered. The interval should continue until it is no longer needed,
		// but it must also use the latest scroll commands (for example consider
		// that the mouse might move from scrolling up to scrolling left, all
		// with the same interval running. We use the `scroll` object to "pass"
		// this information to the interval. Can't use local variables as they
		// wouldn't be the ones that are used by an already existing interval!
		if ( windowVert || windowHoriz || dtVert || dtHoriz ) {
			scroll.windowVert = windowVert;
			scroll.windowHoriz = windowHoriz;
			scroll.dtVert = dtVert;
			scroll.dtHoriz = dtHoriz;
			runInterval = true;
		}
		else if ( this.s.scrollInterval ) {
			// Don't need to scroll - remove any existing timer
			clearInterval( this.s.scrollInterval );
			this.s.scrollInterval = null;
		}

		// If we need to run the interval to scroll and there is no existing
		// interval (if there is an existing one, it will continue to run)
		if ( ! this.s.scrollInterval && runInterval ) {
			this.s.scrollInterval = setInterval( function () {
				// Don't need to worry about setting scroll <0 or beyond the
				// scroll bound as the browser will just reject that.
				if ( scroll.windowVert ) {
					document.body.scrollTop += scroll.windowVert;
				}
				if ( scroll.windowHoriz ) {
					document.body.scrollLeft += scroll.windowHoriz;
				}

				// DataTables scrolling
				if ( scroll.dtVert || scroll.dtHoriz ) {
					var scroller = that.dom.dtScroll[0];

					if ( scroll.dtVert ) {
						scroller.scrollTop += scroll.dtVert;
					}
					if ( scroll.dtHoriz ) {
						scroller.scrollLeft += scroll.dtHoriz;
					}
				}
			}, 20 );
		}
	},


	/**
	 * Update the DataTable after the user has selected what they want to do
	 *
	 * @param  {false|undefined} result Return from the `execute` method - can
	 *   be false internally to do nothing. This is not documented for plug-ins
	 *   and is used only by the cancel option.
	 * @param {array} cells Information about the selected cells from the key
	 *     up function, argumented with the set values
	 * @private
	 */
	_update: function ( result, cells )
	{
		// Do nothing on `false` return from an execute function
		if ( result === false ) {
			return;
		}

		var dt = this.s.dt;
		var cell;

		// Potentially allow modifications to the cells matrix
		this._emitEvent( 'preAutoFill', [ dt, cells ] );

		this._editor( cells );

		// Automatic updates are not performed if `update` is null and the
		// `editor` parameter is passed in - the reason being that Editor will
		// update the data once submitted
		var update = this.c.update !== null ?
			this.c.update :
			this.c.editor ?
				false :
				true;

		if ( update ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cell = cells[i][j];

					cell.cell.data( cell.set );
				}
			}

			dt.draw(false);
		}

		this._emitEvent( 'autoFill', [ dt, cells ] );
	}
} );


/**
 * AutoFill actions. The options here determine how AutoFill will fill the data
 * in the table when the user has selected a range of cells. Please see the
 * documentation on the DataTables site for full details on how to create plug-
 * ins.
 *
 * @type {Object}
 */
AutoFill.actions = {
	increment: {
		available: function ( dt, cells ) {
			return $.isNumeric( cells[0][0].label );
		},

		option: function ( dt, cells ) {
			return dt.i18n(
				'autoFill.increment',
				'Increment / decrement each cell by: <input type="number" value="1">'
			);
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data * 1;
			var increment = $('input', node).val() * 1;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;

					value += increment;
				}
			}
		}
	},

	fill: {
		available: function ( dt, cells ) {
			return true;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fill', 'Fill all cells with <i>'+cells[0][0].label+'</i>' );
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;
				}
			}
		}
	},

	fillHorizontal: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillHorizontal', 'Fill cells horizontally' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[i][0].data;
				}
			}
		}
	},

	fillVertical: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillVertical', 'Fill cells vertically' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[0][j].data;
				}
			}
		}
	},

	// Special type that does not make itself available, but is added
	// automatically by AutoFill if a multi-choice list is shown. This allows
	// sensible code reuse
	cancel: {
		available: function () {
			return false;
		},

		option: function ( dt ) {
			return dt.i18n('autoFill.cancel', 'Cancel' );
		},

		execute: function () {
			return false;
		}
	}
};


/**
 * AutoFill version
 * 
 * @static
 * @type      String
 */
AutoFill.version = '2.2.2';


/**
 * AutoFill defaults
 * 
 * @namespace
 */
AutoFill.defaults = {
	/** @type {Boolean} Ask user what they want to do, even for a single option */
	alwaysAsk: false,

	/** @type {string|null} What will trigger a focus */
	focus: null, // focus, click, hover

	/** @type {column-selector} Columns to provide auto fill for */
	columns: '', // all

	/** @type {Boolean} Enable AutoFill on load */
	enable: true,

	/** @type {boolean|null} Update the cells after a drag */
	update: null, // false is editor given, true otherwise

	/** @type {DataTable.Editor} Editor instance for automatic submission */
	editor: null
};


/**
 * Classes used by AutoFill that are configurable
 * 
 * @namespace
 */
AutoFill.classes = {
	/** @type {String} Class used by the selection button */
	btn: 'btn'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - Not documented
Api.register( 'autoFill()', function () {
	return this;
} );

Api.register( 'autoFill().enabled()', function () {
	var ctx = this.context[0];

	return ctx.autoFill ?
		ctx.autoFill.enabled() :
		false;
} );

Api.register( 'autoFill().enable()', function ( flag ) {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.autoFill ) {
			ctx.autoFill.enable( flag );
		}
	} );
} );

Api.register( 'autoFill().disable()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.autoFill ) {
			ctx.autoFill.disable();
		}
	} );
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.autofill', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.autoFill;
	var defaults = DataTable.defaults.autoFill;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new AutoFill( settings, opts  );
		}
	}
} );


// Alias for access
DataTable.AutoFill = AutoFill;
DataTable.AutoFill = AutoFill;


return AutoFill;
}));


/*! Buttons for DataTables 1.5.1
 * ©2016-2017 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node
	 * @param  {node} node Button node
	 * @return {jQuery} Button element
	 */
	node: function ( node )
	{
		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function () {
			that.destroy();
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className )
					.attr( 'role', 'menu') ;
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var button = $('<'+buttonDom.tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}

				button.blur();
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( buttonDom.tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade ) {
	if ( fade === undefined ) {
		fade = 400;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.appendTo( 'body' )
			.fadeIn( fade );
	}
	else {
		$('body > div.'+className)
			.fadeOut( fade, function () {
				$(this)
					.removeClass( className )
					.remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			tag: 'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.5.1';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		action: function ( e, dt, button, config ) {
			var host = button;
			var collectionParent = $(button).parents('div.dt-button-collection');
			var hostPosition = host.position();
			var tableContainer = $( dt.table().container() );
			var multiLevel = false;
			var insertPoint = host;

			// Remove any old collection
			if ( collectionParent.length ) {
				multiLevel = $('.dt-button-collection').position();
				insertPoint = collectionParent;
				$('body').trigger( 'click.dtb-collection' );
			}

			config._collection
				.addClass( config.collectionLayout )
				.css( 'display', 'none' )
				.insertAfter( insertPoint )
				.fadeIn( config.fade );
			

			var position = config._collection.css( 'position' );

			if ( multiLevel && position === 'absolute' ) {
				config._collection.css( {
					top: multiLevel.top,
					left: multiLevel.left
				} );
			}
			else if ( position === 'absolute' ) {
				config._collection.css( {
					top: hostPosition.top + host.outerHeight(),
					left: hostPosition.left
				} );

				// calculate overflow when positioned beneath
				var tableBottom = tableContainer.offset().top + tableContainer.height();
				var listBottom = hostPosition.top + host.outerHeight() + config._collection.outerHeight();
				var bottomOverflow = listBottom - tableBottom;
				
				// calculate overflow when positioned above
				var listTop = hostPosition.top - config._collection.outerHeight();
				var tableTop = tableContainer.offset().top;
				var topOverflow = tableTop - listTop;
				
				// if bottom overflow is larger, move to the top because it fits better
				if (bottomOverflow > topOverflow) {
					config._collection.css( 'top', hostPosition.top - config._collection.outerHeight() - 5);
				}

				var listRight = hostPosition.left + config._collection.outerWidth();
				var tableRight = tableContainer.offset().left + tableContainer.width();
				if ( listRight > tableRight ) {
					config._collection.css( 'left', hostPosition.left - ( listRight - tableRight ) );
				}
			}
			else {
				// Fix position - centre on screen
				var top = config._collection.height() / 2;
				if ( top > $(window).height() / 2 ) {
					top = $(window).height() / 2;
				}

				config._collection.css( 'marginTop', top*-1 );
			}

			if ( config.background ) {
				Buttons.background( true, config.backgroundClassName, config.fade );
			}

			// Need to break the 'thread' for the collection button being
			// activated by a click - it would also trigger this event
			setTimeout( function () {
				// This is bonkers, but if we don't have a click listener on the
				// background element, iOS Safari will ignore the body click
				// listener below. An empty function here is all that is
				// required to make it work...
				$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

				$('body').on( 'click.dtb-collection', function (e) {
					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';

					if ( ! $(e.target).parents()[back]().filter( config._collection ).length ) {
						config._collection
							.fadeOut( config.fade, function () {
								config._collection.detach();
							} );

						$('div.dt-button-background').off( 'click.dtb-collection' );
						Buttons.background( false, config.backgroundClassName, config.fade );

						$('body').off( 'click.dtb-collection' );
						dt.off( 'buttons-action.b-internal' );
					}
				} );
			}, 10 );

			if ( config.autoClose ) {
				dt.on( 'buttons-action.b-internal', function () {
					$('div.dt-button-background').click();
				} );
			}
		},
		background: true,
		collectionLayout: '',
		backgroundClassName: 'dt-button-background',
		autoClose: false,
		fade: 400,
		attr: {
			'aria-haspopup': true
		}
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( text( dt ) );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = $.trim( filename.replace( '*', $('head > title').text() ) );
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		}
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [ rows ];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	return {
		header: header,
		footer: footer,
		body:   body
	};
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons || DataTable.defaults.buttons;

		return new Buttons( api, opts ).container();
	},
	cFeature: "B"
} );


return Buttons;
}));


/*!
 * Flash export buttons for Buttons and DataTables.
 * 2015-2017 SpryMedia Ltd - datatables.net/license
 *
 * ZeroClipbaord - MIT license
 * Copyright (c) 2012 Joseph Huckaby
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ZeroClipboard dependency
 */

/*
 * ZeroClipboard 1.0.4 with modifications
 * Author: Joseph Huckaby
 * License: MIT
 *
 * Copyright (c) 2012 Joseph Huckaby
 */
var ZeroClipboard_TableTools = {
	version: "1.0.4-TableTools2",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: '', // URL to movie
	nextId: 1, // ID of next movie

	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') {
			thingy = document.getElementById(thingy);
		}
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				this.className = this.className.replace( new RegExp("\\s*" + name + "\\s*"), " ").replace(/^\s+/, '').replace(/\s+$/, '');
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			};
		}
		return thingy;
	},

	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},

	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},

	log: function ( str ) {
		console.log( 'Flash: '+str );
	},

	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},

	getDOMObjectPosition: function(obj) {
		// get absolute coordinates for dom element
		var info = {
			left: 0,
			top: 0,
			width: obj.width ? obj.width : obj.offsetWidth,
			height: obj.height ? obj.height : obj.offsetHeight
		};

		if ( obj.style.width !== "" ) {
			info.width = obj.style.width.replace("px","");
		}

		if ( obj.style.height !== "" ) {
			info.height = obj.style.height.replace("px","");
		}

		while (obj) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return info;
	},

	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};

		// unique ID
		this.id = ZeroClipboard_TableTools.nextId++;
		this.movieId = 'ZeroClipboard_TableToolsMovie_' + this.id;

		// register client with singleton to receive flash events
		ZeroClipboard_TableTools.register(this.id, this);

		// create movie
		if (elem) {
			this.glue(elem);
		}
	}
};

ZeroClipboard_TableTools.Client.prototype = {

	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	fileName: '', // default file save name
	action: 'copy', // action to perform
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	sized: false,
	sheetName: '', // default sheet name for excel export

	glue: function(elem, title) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard_TableTools.$(elem);

		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 99;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
		}

		// find X/Y position of domElement
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);

		// create floating DIV above element
		this.div = document.createElement('div');
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '0px';
		style.top = '0px';
		style.width = (box.width) + 'px';
		style.height = box.height + 'px';
		style.zIndex = zIndex;

		if ( typeof title != "undefined" && title !== "" ) {
			this.div.title = title;
		}
		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		}

		// style.backgroundColor = '#f00'; // debug
		if ( this.domElement ) {
			this.domElement.appendChild(this.div);
			this.div.innerHTML = this.getHTML( box.width, box.height ).replace(/&/g, '&amp;');
		}
	},

	positionElement: function() {
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
		var style = this.div.style;

		style.position = 'absolute';
		//style.left = (this.domElement.offsetLeft)+'px';
		//style.top = this.domElement.offsetTop+'px';
		style.width = box.width + 'px';
		style.height = box.height + 'px';

		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		} else {
			return;
		}

		var flash = this.div.childNodes[0];
		flash.width = box.width;
		flash.height = box.height;
	},

	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id +
			'&width=' + width +
			'&height=' + height;

		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},

	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},

	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},

	destroy: function() {
		// destroy control and floater
		var that = this;

		if (this.domElement && this.div) {
			$(this.div).remove();

			this.domElement = null;
			this.div = null;

			$.each( ZeroClipboard_TableTools.clients, function ( id, client ) {
				if ( client === that ) {
					delete ZeroClipboard_TableTools.clients[ id ];
				}
			} );
		}
	},

	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard_TableTools.$(elem);
			if (!this.domElement) {
				this.hide();
			}
		}

		if (this.domElement && this.div) {
			var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},

	clearText: function() {
		// clear the text to be copy / saved
		this.clipText = '';
		if (this.ready) {
			this.movie.clearText();
		}
	},

	appendText: function(newText) {
		// append text to that which is to be copied / saved
		this.clipText += newText;
		if (this.ready) { this.movie.appendText(newText) ;}
	},

	setText: function(newText) {
		// set text to be copied to be copied / saved
		this.clipText = newText;
		if (this.ready) { this.movie.setText(newText) ;}
	},

	setFileName: function(newText) {
		// set the file name
		this.fileName = newText;
		if (this.ready) {
			this.movie.setFileName(newText);
		}
	},

	setSheetData: function(data) {
		// set the xlsx sheet data
		if (this.ready) {
			this.movie.setSheetData( JSON.stringify( data ) );
		}
	},

	setAction: function(newText) {
		// set action (save or copy)
		this.action = newText;
		if (this.ready) {
			this.movie.setAction(newText);
		}
	},

	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		this.handlers[eventName].push(func);
	},

	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) {
			this.movie.setHandCursor(enabled);
		}
	},

	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},

	receiveEvent: function(eventName, args) {
		var self;

		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');

		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}

				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}

				this.ready = true;
				this.movie.clearText();
				this.movie.appendText( this.clipText );
				this.movie.setFileName( this.fileName );
				this.movie.setAction( this.action );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;

			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					//this.domElement.addClass('hover');
					if (this.recoverActive) {
						this.domElement.addClass('active');
					}
				}
				break;

			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					//this.domElement.removeClass('hover');
				}
				break;

			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;

			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName

		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];

				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
};

ZeroClipboard_TableTools.hasFlash = function ()
{
	try {
		var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		if (fo) {
			return true;
		}
	}
	catch (e) {
		if (
			navigator.mimeTypes &&
			navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
			navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin
		) {
			return true;
		}
	}

	return false;
};

// For the Flash binding to work, ZeroClipboard_TableTools must be on the global
// object list
window.ZeroClipboard_TableTools = ZeroClipboard_TableTools;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * If a Buttons instance is initlaised before it is placed into the DOM, Flash
 * won't be able to bind to it, so we need to wait until it is available, this
 * method abstracts that out.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {jQuery} node  Button
 */
var _glue = function ( flash, node )
{
	var id = node.attr('id');

	if ( node.parents('html').length ) {
		flash.glue( node[0], '' );
	}
	else {
		setTimeout( function () {
			_glue( flash, node );
		}, 500 );
	}
};

/**
 * Get the sheet name for Excel exports.
 *
 * @param {object}  config       Button configuration
 */
var _sheetname = function ( config )
{
	var sheetName = 'Sheet1';

	if ( config.sheetName ) {
		sheetName = config.sheetName.replace(/[\[\]\*\/\\\?\:]/g, '');
	}

	return sheetName;
};

/**
 * Set the flash text. This has to be broken up into chunks as the Javascript /
 * Flash bridge has a size limit. There is no indication in the Flash
 * documentation what this is, and it probably depends upon the browser.
 * Experimentation shows that the point is around 50k when data starts to get
 * lost, so an 8K limit used here is safe.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {string}        data  Data to send to Flash
 */
var _setText = function ( flash, data )
{
	var parts = data.match(/[\s\S]{1,8192}/g) || [];

	flash.clearText();
	for ( var i=0, len=parts.length ; i<len ; i++ )
	{
		flash.appendText( parts[i] );
	}
};

/**
 * Get the newline character(s)
 *
 * @param {object}  config Button configuration
 * @return {string}        Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param  {DataTable.Api} dt     DataTables API instance
 * @param  {object}        config Button configuration
 * @return {object}               The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var boundary = config.fieldBoundary;
	var separator = config.fieldSeparator;
	var reBoundary = new RegExp( boundary, 'g' );
	var escapeChar = config.escapeChar !== undefined ?
		config.escapeChar :
		'\\';
	var join = function ( a ) {
		var s = '';

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + ('' + a[i]).replace( reBoundary, escapeChar+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer && data.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};


// Basic initialisation for the buttons is common between them
var flashButton = {
	available: function () {
		return ZeroClipboard_TableTools.hasFlash();
	},

	init: function ( dt, button, config ) {
		// Insert the Flash movie
		ZeroClipboard_TableTools.moviePath = DataTable.Buttons.swfPath;
		var flash = new ZeroClipboard_TableTools.Client();

		flash.setHandCursor( true );
		flash.addEventListener('mouseDown', function(client) {
			config._fromFlash = true;
			dt.button( button[0] ).trigger();
			config._fromFlash = false;
		} );

		_glue( flash, button );

		config._flash = flash;
	},

	destroy: function ( dt, button, config ) {
		config._flash.destroy();
	},

	fieldSeparator: ',',

	fieldBoundary: '"',

	exportOptions: {},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	filename: '*',

	extension: '.csv',

	header: true,

	footer: false
};


/**
 * Convert from numeric position to letter for column names in Excel
 * @param  {int} n Column number
 * @return {string} Column letter(s) name
 */
function createCellPos( n ){
	var ordA = 'A'.charCodeAt(0);
	var ordZ = 'Z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
	var s = "";

	while( n >= 0 ) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}

	return s;
}

/**
 * Create an XML node and add any children, attributes, etc without needing to
 * be verbose in the DOM.
 *
 * @param  {object} doc      XML document
 * @param  {string} nodeName Node name
 * @param  {object} opts     Options - can be `attr` (attributes), `children`
 *   (child nodes) and `text` (text content)
 * @return {node}            Created node
 */
function _createNode( doc, nodeName, opts ){
	var tempNode = doc.createElement( nodeName );

	if ( opts ) {
		if ( opts.attr ) {
			$(tempNode).attr( opts.attr );
		}

		if ( opts.children ) {
			$.each( opts.children, function ( key, value ) {
				tempNode.appendChild( value );
			} );
		}

		if ( opts.text !== null && opts.text !== undefined ) {
			tempNode.appendChild( doc.createTextNode( opts.text ) );
		}
	}

	return tempNode;
}

/**
 * Get the width for an Excel column based on the contents of that column
 * @param  {object} data Data for export
 * @param  {int}    col  Column index
 * @return {int}         Column width
 */
function _excelColWidth( data, col ) {
	var max = data.header[col].length;
	var len, lineSplit, str;

	if ( data.footer && data.footer[col].length > max ) {
		max = data.footer[col].length;
	}

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var point = data.body[i][col];
		str = point !== null && point !== undefined ?
			point.toString() :
			'';

		// If there is a newline character, workout the width of the column
		// based on the longest line in the string
		if ( str.indexOf('\n') !== -1 ) {
			lineSplit = str.split('\n');
			lineSplit.sort( function (a, b) {
				return b.length - a.length;
			} );

			len = lineSplit[0].length;
		}
		else {
			len = str.length;
		}

		if ( len > max ) {
			max = len;
		}

		// Max width rather than having potentially massive column widths
		if ( max > 40 ) {
			return 52; // 40 * 1.3
		}
	}

	max *= 1.3;

	// And a min width
	return max > 6 ? max : 6;
}

  var _serialiser = "";
    if (typeof window.XMLSerializer === 'undefined') {
        _serialiser = new function () {
            this.serializeToString = function (input) {
                return input.xml
            }
        };
    } else {
        _serialiser =  new XMLSerializer();
    }

    var _ieExcel;


/**
 * Convert XML documents in an object to strings
 * @param  {object} obj XLSX document object
 */
function _xlsxToStrings( obj ) {
	if ( _ieExcel === undefined ) {
		// Detect if we are dealing with IE's _awful_ serialiser by seeing if it
		// drop attributes
		_ieExcel = _serialiser
			.serializeToString(
				$.parseXML( excelStrings['xl/worksheets/sheet1.xml'] )
			)
			.indexOf( 'xmlns:r' ) === -1;
	}

	$.each( obj, function ( name, val ) {
		if ( $.isPlainObject( val ) ) {
			_xlsxToStrings( val );
		}
		else {
			if ( _ieExcel ) {
				// IE's XML serialiser will drop some name space attributes from
				// from the root node, so we need to save them. Do this by
				// replacing the namespace nodes with a regular attribute that
				// we convert back when serialised. Edge does not have this
				// issue
				var worksheet = val.childNodes[0];
				var i, ien;
				var attrs = [];

				for ( i=worksheet.attributes.length-1 ; i>=0 ; i-- ) {
					var attrName = worksheet.attributes[i].nodeName;
					var attrValue = worksheet.attributes[i].nodeValue;

					if ( attrName.indexOf( ':' ) !== -1 ) {
						attrs.push( { name: attrName, value: attrValue } );

						worksheet.removeAttribute( attrName );
					}
				}

				for ( i=0, ien=attrs.length ; i<ien ; i++ ) {
					var attr = val.createAttribute( attrs[i].name.replace( ':', '_dt_b_namespace_token_' ) );
					attr.value = attrs[i].value;
					worksheet.setAttributeNode( attr );
				}
			}

			var str = _serialiser.serializeToString(val);

			// Fix IE's XML
			if ( _ieExcel ) {
				// IE doesn't include the XML declaration
				if ( str.indexOf( '<?xml' ) === -1 ) {
					str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;
				}

				// Return namespace attributes to being as such
				str = str.replace( /_dt_b_namespace_token_/g, ':' );
			}

			// Safari, IE and Edge will put empty name space attributes onto
			// various elements making them useless. This strips them out
			str = str.replace( /<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>' );

			obj[ name ] = str;
		}
	} );
}

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
	"_rels/.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
		'</Relationships>',

	"xl/_rels/workbook.xml.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
		'</Relationships>',

	"[Content_Types].xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
			'<Default Extension="xml" ContentType="application/xml" />'+
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
			'<Default Extension="jpeg" ContentType="image/jpeg" />'+
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
		'</Types>',

	"xl/workbook.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
			'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
			'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
			'<bookViews>'+
				'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
			'</bookViews>'+
			'<sheets>'+
				'<sheet name="" sheetId="1" r:id="rId1"/>'+
			'</sheets>'+
		'</workbook>',

	"xl/worksheets/sheet1.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<sheetData/>'+
			'<mergeCells count="0"/>'+
		'</worksheet>',

	"xl/styles.xml":
		'<?xml version="1.0" encoding="UTF-8"?>'+
		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<numFmts count="6">'+
				'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
				'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
				'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
				'<numFmt numFmtId="167" formatCode="0.0%"/>'+
				'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
				'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
			'</numFmts>'+
			'<fonts count="5" x14ac:knownFonts="1">'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<color rgb="FFFFFFFF" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<b />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<i />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<u />'+
				'</font>'+
			'</fonts>'+
			'<fills count="6">'+
				'<fill>'+
					'<patternFill patternType="none" />'+
				'</fill>'+
				'<fill>'+ // Excel appears to use this as a dotted background regardless of values but
					'<patternFill patternType="none" />'+ // to be valid to the schema, use a patternFill
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD9D9D9" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD99795" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6efce" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6cfef" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
			'</fills>'+
			'<borders count="2">'+
				'<border>'+
					'<left />'+
					'<right />'+
					'<top />'+
					'<bottom />'+
					'<diagonal />'+
				'</border>'+
				'<border diagonalUp="false" diagonalDown="false">'+
					'<left style="thin">'+
						'<color auto="1" />'+
					'</left>'+
					'<right style="thin">'+
						'<color auto="1" />'+
					'</right>'+
					'<top style="thin">'+
						'<color auto="1" />'+
					'</top>'+
					'<bottom style="thin">'+
						'<color auto="1" />'+
					'</bottom>'+
					'<diagonal />'+
				'</border>'+
			'</borders>'+
			'<cellStyleXfs count="1">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
			'</cellStyleXfs>'+
			'<cellXfs count="61">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="left"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="center"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="right"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="fill"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment textRotation="90"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment wrapText="1"/>'+
				'</xf>'+
				'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
			'</cellXfs>'+
			'<cellStyles count="1">'+
				'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
			'</cellStyles>'+
			'<dxfs count="0" />'+
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
		'</styleSheet>'
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
var _excelSpecials = [
	{ match: /^\-?\d+\.\d%$/,       style: 60, fmt: function (d) { return d/100; } }, // Precent with d.p.
	{ match: /^\-?\d+\.?\d*%$/,     style: 56, fmt: function (d) { return d/100; } }, // Percent
	{ match: /^\-?\$[\d,]+.?\d*$/,  style: 57 }, // Dollars
	{ match: /^\-?£[\d,]+.?\d*$/,   style: 58 }, // Pounds
	{ match: /^\-?€[\d,]+.?\d*$/,   style: 59 }, // Euros
	{ match: /^\([\d,]+\)$/,        style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
	{ match: /^\([\d,]+\.\d{2}\)$/, style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
	{ match: /^[\d,]+$/,            style: 63 }, // Numbers with thousand separators
	{ match: /^[\d,]+\.\d{2}$/,     style: 64 }  // Numbers with 2d.p. and thousands separators
];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables options and methods
 */

// Set the default SWF path
DataTable.Buttons.swfPath = '//cdn.datatables.net/buttons/'+DataTable.Buttons.version+'/swf/flashExport.swf';

// Method to allow Flash buttons to be resized when made visible - as they are
// of zero height and width if initialised hidden
DataTable.Api.register( 'buttons.resize()', function () {
	$.each( ZeroClipboard_TableTools.clients, function ( i, client ) {
		if ( client.domElement !== undefined && client.domElement.parentNode ) {
			client.positionElement();
		}
	} );
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Button definitions
 */

// Copy to clipboard
DataTable.ext.buttons.copyFlash = $.extend( {}, flashButton, {
	className: 'buttons-copy buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		// Check that the trigger did actually occur due to a Flash activation
		if ( ! config._fromFlash ) {
			return;
		}

		this.processing( true );

		var flash = config._flash;
		var exportData = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var newline = _newLine(config);
		var output = exportData.str;

		if ( info.title ) {
			output = info.title + newline + newline + output;
		}

		if ( info.messageTop ) {
			output = info.messageTop + newline + newline + output;
		}

		if ( info.messageBottom ) {
			output = output + newline + newline + info.messageBottom;
		}

		if ( config.customize ) {
			output = config.customize( output, config );
		}

		flash.setAction( 'copy' );
		_setText( flash, output );

		this.processing( false );

		dt.buttons.info(
			dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
			dt.i18n( 'buttons.copySuccess', {
				_: 'Copied %d rows to clipboard',
				1: 'Copied 1 row to clipboard'
			}, data.rows ),
			3000
		);
	},

	fieldSeparator: '\t',

	fieldBoundary: ''
} );

// CSV save file
DataTable.ext.buttons.csvFlash = $.extend( {}, flashButton, {
	className: 'buttons-csv buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var flash = config._flash;
		var data = _exportData( dt, config );
		var output = config.customize ?
			config.customize( data.str, config ) :
			data.str;

		flash.setAction( 'csv' );
		flash.setFileName( _filename( config ) );
		_setText( flash, output );
	},

	escapeChar: '"'
} );

// Excel save file - this is really a CSV file using UTF-8 that Excel can read
DataTable.ext.buttons.excelFlash = $.extend( {}, flashButton, {
	className: 'buttons-excel buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var flash = config._flash;
		var rowPos = 0;
		var rels = $.parseXML( excelStrings['xl/worksheets/sheet1.xml'] ) ; //Parses xml
		var relsGet = rels.getElementsByTagName( "sheetData" )[0];

		var xlsx = {
			_rels: {
				".rels": $.parseXML( excelStrings['_rels/.rels'] )
			},
			xl: {
				_rels: {
					"workbook.xml.rels": $.parseXML( excelStrings['xl/_rels/workbook.xml.rels'] )
				},
				"workbook.xml": $.parseXML( excelStrings['xl/workbook.xml'] ),
				"styles.xml": $.parseXML( excelStrings['xl/styles.xml'] ),
				"worksheets": {
					"sheet1.xml": rels
				}

			},
			"[Content_Types].xml": $.parseXML( excelStrings['[Content_Types].xml'])
		};

		var data = dt.buttons.exportData( config.exportOptions );
		var currentRow, rowNode;
		var addRow = function ( row ) {
			currentRow = rowPos+1;
			rowNode = _createNode( rels, "row", { attr: {r:currentRow} } );

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				// Concat both the Cell Columns as a letter and the Row of the cell.
				var cellId = createCellPos(i) + '' + currentRow;
				var cell = null;

				// For null, undefined of blank cell, continue so it doesn't create the _createNode
				if ( row[i] === null || row[i] === undefined || row[i] === '' ) {
					if ( config.createEmptyCells === true ) {
						row[i] = '';
					}
					else {
						continue;
					}
				}

				row[i] = $.trim( row[i] );

				// Special number formatting options
				for ( var j=0, jen=_excelSpecials.length ; j<jen ; j++ ) {
					var special = _excelSpecials[j];

					// TODO Need to provide the ability for the specials to say
					// if they are returning a string, since at the moment it is
					// assumed to be a number
					if ( row[i].match && ! row[i].match(/^0\d+/) && row[i].match( special.match ) ) {
						var val = row[i].replace(/[^\d\.\-]/g, '');

						if ( special.fmt ) {
							val = special.fmt( val );
						}

						cell = _createNode( rels, 'c', {
							attr: {
								r: cellId,
								s: special.style
							},
							children: [
								_createNode( rels, 'v', { text: val } )
							]
						} );

						break;
					}
				}

				if ( ! cell ) {
					if ( typeof row[i] === 'number' || (
						row[i].match &&
						row[i].match(/^-?\d+(\.\d+)?$/) &&
						! row[i].match(/^0\d+/) )
					) {
						// Detect numbers - don't match numbers with leading zeros
						// or a negative anywhere but the start
						cell = _createNode( rels, 'c', {
							attr: {
								t: 'n',
								r: cellId
							},
							children: [
								_createNode( rels, 'v', { text: row[i] } )
							]
						} );
					}
					else {
						// String output - replace non standard characters for text output
						var text = ! row[i].replace ?
							row[i] :
							row[i].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

						cell = _createNode( rels, 'c', {
							attr: {
								t: 'inlineStr',
								r: cellId
							},
							children:{
								row: _createNode( rels, 'is', {
									children: {
										row: _createNode( rels, 't', {
											text: text
										} )
									}
								} )
							}
						} );
					}
				}

				rowNode.appendChild( cell );
			}

			relsGet.appendChild(rowNode);
			rowPos++;
		};

		$( 'sheets sheet', xlsx.xl['workbook.xml'] ).attr( 'name', _sheetname( config ) );

		if ( config.customizeData ) {
			config.customizeData( data );
		}

		var mergeCells = function ( row, colspan ) {
			var mergeCells = $('mergeCells', rels);

			mergeCells[0].appendChild( _createNode( rels, 'mergeCell', {
				attr: {
					ref: 'A'+row+':'+createCellPos(colspan)+row
				}
			} ) );
			mergeCells.attr( 'count', mergeCells.attr( 'count' )+1 );
			$('row:eq('+(row-1)+') c', rels).attr( 's', '51' ); // centre
		};

		// Title and top messages
		var exportInfo = dt.buttons.exportInfo( config );
		if ( exportInfo.title ) {
			addRow( [exportInfo.title], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		if ( exportInfo.messageTop ) {
			addRow( [exportInfo.messageTop], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Table itself
		if ( config.header ) {
			addRow( data.header, rowPos );
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		for ( var n=0, ie=data.body.length ; n<ie ; n++ ) {
			addRow( data.body[n], rowPos );
		}

		if ( config.footer && data.footer ) {
			addRow( data.footer, rowPos);
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		// Below the table
		if ( exportInfo.messageBottom ) {
			addRow( [exportInfo.messageBottom], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Set column widths
		var cols = _createNode( rels, 'cols' );
		$('worksheet', rels).prepend( cols );

		for ( var i=0, ien=data.header.length ; i<ien ; i++ ) {
			cols.appendChild( _createNode( rels, 'col', {
				attr: {
					min: i+1,
					max: i+1,
					width: _excelColWidth( data, i ),
					customWidth: 1
				}
			} ) );
		}

		// Let the developer customise the document if they want to
		if ( config.customize ) {
			config.customize( xlsx );
		}

		_xlsxToStrings( xlsx );

		flash.setAction( 'excel' );
		flash.setFileName( exportInfo.filename );
		flash.setSheetData( xlsx );
		_setText( flash, '' );

		this.processing( false );
	},

	extension: '.xlsx',
	
	createEmptyCells: false
} );



// PDF export
DataTable.ext.buttons.pdfFlash = $.extend( {}, flashButton, {
	className: 'buttons-pdf buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		// Set the text
		var flash = config._flash;
		var data = dt.buttons.exportData( config.exportOptions );
		var info = dt.buttons.exportInfo( config );
		var totalWidth = dt.table().node().offsetWidth;

		// Calculate the column width ratios for layout of the table in the PDF
		var ratios = dt.columns( config.columns ).indexes().map( function ( idx ) {
			return dt.column( idx ).header().offsetWidth / totalWidth;
		} );

		flash.setAction( 'pdf' );
		flash.setFileName( info.filename );

		_setText( flash, JSON.stringify( {
			title:         info.title || '',
			messageTop:    info.messageTop || '',
			messageBottom: info.messageBottom || '',
			colWidth:      ratios.toArray(),
			orientation:   config.orientation,
			size:          config.pageSize,
			header:        config.header ? data.header : null,
			footer:        config.footer ? data.footer : null,
			body:          data.body
		} ) );

		this.processing( false );
	},

	extension: '.pdf',

	orientation: 'portrait',

	pageSize: 'A4',

	newline: '\n'
} );


return DataTable.Buttons;
}));


/*!
 * Print button for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _link = document.createElement( 'a' );

/**
 * Clone link and style tags, taking into account the need to change the source
 * path.
 *
 * @param  {node}     el Element to convert
 */
var _styleToAbs = function( el ) {
	var url;
	var clone = $(el).clone()[0];
	var linkHost;

	if ( clone.nodeName.toLowerCase() === 'link' ) {
		clone.href = _relToAbs( clone.href );
	}

	return clone.outerHTML;
};

/**
 * Convert a URL from a relative to an absolute address so it will work
 * correctly in the popup window which has no base URL.
 *
 * @param  {string} href URL
 */
var _relToAbs = function( href ) {
	// Assign to a link on the original page so the browser will do all the
	// hard work of figuring out where the file actually is
	_link.href = href;
	var linkHost = _link.host;

	// IE doesn't have a trailing slash on the host
	// Chrome has it on the pathname
	if ( linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
		linkHost += '/';
	}

	return _link.protocol+"//"+linkHost+_link.pathname+_link.search;
};


DataTable.ext.buttons.print = {
	className: 'buttons-print',

	text: function ( dt ) {
		return dt.i18n( 'buttons.print', 'Print' );
	},

	action: function ( e, dt, button, config ) {
		var data = dt.buttons.exportData(
			$.extend( {decodeEntities: false}, config.exportOptions ) // XSS protection
		);
		var exportInfo = dt.buttons.exportInfo( config );

		var addRow = function ( d, tag ) {
			var str = '<tr>';

			for ( var i=0, ien=d.length ; i<ien ; i++ ) {
				str += '<'+tag+'>'+d[i]+'</'+tag+'>';
			}

			return str + '</tr>';
		};

		// Construct a table for printing
		var html = '<table class="'+dt.table().node().className+'">';

		if ( config.header ) {
			html += '<thead>'+ addRow( data.header, 'th' ) +'</thead>';
		}

		html += '<tbody>';
		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			html += addRow( data.body[i], 'td' );
		}
		html += '</tbody>';

		if ( config.footer && data.footer ) {
			html += '<tfoot>'+ addRow( data.footer, 'th' ) +'</tfoot>';
		}
		html += '</table>';

		// Open a new window for the printable table
		var win = window.open( '', '' );
		win.document.close();

		// Inject the title and also a copy of the style and link tags from this
		// document so the table can retain its base styling. Note that we have
		// to use string manipulation as IE won't allow elements to be created
		// in the host document and then appended to the new window.
		var head = '<title>'+exportInfo.title+'</title>';
		$('style, link').each( function () {
			head += _styleToAbs( this );
		} );

		try {
			win.document.head.innerHTML = head; // Work around for Edge
		}
		catch (e) {
			$(win.document.head).html( head ); // Old IE
		}

		// Inject the table and other surrounding information
		win.document.body.innerHTML =
			'<h1>'+exportInfo.title+'</h1>'+
			'<div>'+(exportInfo.messageTop || '')+'</div>'+
			html+
			'<div>'+(exportInfo.messageBottom || '')+'</div>';

		$(win.document.body).addClass('dt-print-view');

		$('img', win.document.body).each( function ( i, img ) {
			img.setAttribute( 'src', _relToAbs( img.getAttribute('src') ) );
		} );

		if ( config.customize ) {
			config.customize( win );
		}

		// Allow stylesheets time to load
		setTimeout( function () {
			if ( config.autoPrint ) {
				win.print(); // blocking - so close will not
				win.close(); // execute until this is done
			}
		}, 1000 );
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};


return DataTable.Buttons;
}));


/*! Scroller 1.4.4
 * ©2011-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Scroller
 * @description Virtual rendering for DataTables
 * @version     1.4.4
 * @file        dataTables.scroller.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2011-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Scroller is a virtual rendering plug-in for DataTables which allows large
 * datasets to be drawn on screen every quickly. What the virtual rendering means
 * is that only the visible portion of the table (and a bit to either side to make
 * the scrolling smooth) is drawn, while the scrolling container gives the
 * visual impression that the whole table is visible. This is done by making use
 * of the pagination abilities of DataTables and moving the table around in the
 * scrolling container DataTables adds to the page. The scrolling container is
 * forced to the height it would be for the full table display using an extra
 * element.
 *
 * Note that rows in the table MUST all be the same height. Information in a cell
 * which expands on to multiple lines will cause some odd behaviour in the scrolling.
 *
 * Scroller is initialised by simply including the letter 'S' in the sDom for the
 * table you want to have this feature enabled on. Note that the 'S' must come
 * AFTER the 't' parameter in `dom`.
 *
 * Key features include:
 *   <ul class="limit_length">
 *     <li>Speed! The aim of Scroller for DataTables is to make rendering large data sets fast</li>
 *     <li>Full compatibility with deferred rendering in DataTables for maximum speed</li>
 *     <li>Display millions of rows</li>
 *     <li>Integration with state saving in DataTables (scrolling position is saved)</li>
 *     <li>Easy to use</li>
 *   </ul>
 *
 *  @class
 *  @constructor
 *  @global
 *  @param {object} dt DataTables settings object or API instance
 *  @param {object} [opts={}] Configuration object for FixedColumns. Options 
 *    are defined by {@link Scroller.defaults}
 *
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.0+
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').DataTable( {
 *            "scrollY": "200px",
 *            "ajax": "media/dataset/large.txt",
 *            "dom": "frtiS",
 *            "deferRender": true
 *        } );
 *    } );
 */
var Scroller = function ( dt, opts ) {
	/* Sanity check - you just know it will happen */
	if ( ! (this instanceof Scroller) ) {
		alert( "Scroller warning: Scroller must be initialised with the 'new' keyword." );
		return;
	}

	if ( opts === undefined ) {
		opts = {};
	}

	/**
	 * Settings object which contains customisable information for the Scroller instance
	 * @namespace
	 * @private
	 * @extends Scroller.defaults
	 */
	this.s = {
		/**
		 * DataTables settings object
		 *  @type     object
		 *  @default  Passed in as first parameter to constructor
		 */
		"dt": $.fn.dataTable.Api( dt ).settings()[0],

		/**
		 * Pixel location of the top of the drawn table in the viewport
		 *  @type     int
		 *  @default  0
		 */
		"tableTop": 0,

		/**
		 * Pixel location of the bottom of the drawn table in the viewport
		 *  @type     int
		 *  @default  0
		 */
		"tableBottom": 0,

		/**
		 * Pixel location of the boundary for when the next data set should be loaded and drawn
		 * when scrolling up the way.
		 *  @type     int
		 *  @default  0
		 *  @private
		 */
		"redrawTop": 0,

		/**
		 * Pixel location of the boundary for when the next data set should be loaded and drawn
		 * when scrolling down the way. Note that this is actually calculated as the offset from
		 * the top.
		 *  @type     int
		 *  @default  0
		 *  @private
		 */
		"redrawBottom": 0,

		/**
		 * Auto row height or not indicator
		 *  @type     bool
		 *  @default  0
		 */
		"autoHeight": true,

		/**
		 * Number of rows calculated as visible in the visible viewport
		 *  @type     int
		 *  @default  0
		 */
		"viewportRows": 0,

		/**
		 * setTimeout reference for state saving, used when state saving is enabled in the DataTable
		 * and when the user scrolls the viewport in order to stop the cookie set taking too much
		 * CPU!
		 *  @type     int
		 *  @default  0
		 */
		"stateTO": null,

		/**
		 * setTimeout reference for the redraw, used when server-side processing is enabled in the
		 * DataTables in order to prevent DoSing the server
		 *  @type     int
		 *  @default  null
		 */
		"drawTO": null,

		heights: {
			jump: null,
			page: null,
			virtual: null,
			scroll: null,

			/**
			 * Height of rows in the table
			 *  @type     int
			 *  @default  0
			 */
			row: null,

			/**
			 * Pixel height of the viewport
			 *  @type     int
			 *  @default  0
			 */
			viewport: null
		},

		topRowFloat: 0,
		scrollDrawDiff: null,
		loaderVisible: false,
		forceReposition: false
	};

	// @todo The defaults should extend a `c` property and the internal settings
	// only held in the `s` property. At the moment they are mixed
	this.s = $.extend( this.s, Scroller.oDefaults, opts );

	// Workaround for row height being read from height object (see above comment)
	this.s.heights.row = this.s.rowHeight;

	/**
	 * DOM elements used by the class instance
	 * @private
	 * @namespace
	 *
	 */
	this.dom = {
		"force":    document.createElement('div'),
		"scroller": null,
		"table":    null,
		"loader":   null
	};

	// Attach the instance to the DataTables instance so it can be accessed in
	// future. Don't initialise Scroller twice on the same table
	if ( this.s.dt.oScroller ) {
		return;
	}

	this.s.dt.oScroller = this;

	/* Let's do it */
	this._fnConstruct();
};



$.extend( Scroller.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Calculate the pixel position from the top of the scrolling container for
	 * a given row
	 *  @param {int} iRow Row number to calculate the position of
	 *  @returns {int} Pixels
	 *  @example
	 *    $(document).ready(function() {
	 *      $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sAjaxSource": "media/dataset/large.txt",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "fnInitComplete": function (o) {
	 *          // Find where row 25 is
	 *          alert( o.oScroller.fnRowToPixels( 25 ) );
	 *        }
	 *      } );
	 *    } );
	 */
	"fnRowToPixels": function ( rowIdx, intParse, virtual )
	{
		var pixels;

		if ( virtual ) {
			pixels = this._domain( 'virtualToPhysical', rowIdx * this.s.heights.row );
		}
		else {
			var diff = rowIdx - this.s.baseRowTop;
			pixels = this.s.baseScrollTop + (diff * this.s.heights.row);
		}

		return intParse || intParse === undefined ?
			parseInt( pixels, 10 ) :
			pixels;
	},


	/**
	 * Calculate the row number that will be found at the given pixel position
	 * (y-scroll).
	 *
	 * Please note that when the height of the full table exceeds 1 million
	 * pixels, Scroller switches into a non-linear mode for the scrollbar to fit
	 * all of the records into a finite area, but this function returns a linear
	 * value (relative to the last non-linear positioning).
	 *  @param {int} iPixels Offset from top to calculate the row number of
	 *  @param {int} [intParse=true] If an integer value should be returned
	 *  @param {int} [virtual=false] Perform the calculations in the virtual domain
	 *  @returns {int} Row index
	 *  @example
	 *    $(document).ready(function() {
	 *      $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sAjaxSource": "media/dataset/large.txt",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "fnInitComplete": function (o) {
	 *          // Find what row number is at 500px
	 *          alert( o.oScroller.fnPixelsToRow( 500 ) );
	 *        }
	 *      } );
	 *    } );
	 */
	"fnPixelsToRow": function ( pixels, intParse, virtual )
	{
		var diff = pixels - this.s.baseScrollTop;
		var row = virtual ?
			this._domain( 'physicalToVirtual', pixels ) / this.s.heights.row :
			( diff / this.s.heights.row ) + this.s.baseRowTop;

		return intParse || intParse === undefined ?
			parseInt( row, 10 ) :
			row;
	},


	/**
	 * Calculate the row number that will be found at the given pixel position (y-scroll)
	 *  @param {int} iRow Row index to scroll to
	 *  @param {bool} [bAnimate=true] Animate the transition or not
	 *  @returns {void}
	 *  @example
	 *    $(document).ready(function() {
	 *      $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sAjaxSource": "media/dataset/large.txt",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "fnInitComplete": function (o) {
	 *          // Immediately scroll to row 1000
	 *          o.oScroller.fnScrollToRow( 1000 );
	 *        }
	 *      } );
	 *     
	 *      // Sometime later on use the following to scroll to row 500...
	 *          var oSettings = $('#example').dataTable().fnSettings();
	 *      oSettings.oScroller.fnScrollToRow( 500 );
	 *    } );
	 */
	"fnScrollToRow": function ( iRow, bAnimate )
	{
		var that = this;
		var ani = false;
		var px = this.fnRowToPixels( iRow );

		// We need to know if the table will redraw or not before doing the
		// scroll. If it will not redraw, then we need to use the currently
		// displayed table, and scroll with the physical pixels. Otherwise, we
		// need to calculate the table's new position from the virtual
		// transform.
		var preRows = ((this.s.displayBuffer-1)/2) * this.s.viewportRows;
		var drawRow = iRow - preRows;
		if ( drawRow < 0 ) {
			drawRow = 0;
		}

		if ( (px > this.s.redrawBottom || px < this.s.redrawTop) && this.s.dt._iDisplayStart !== drawRow ) {
			ani = true;
			px = this.fnRowToPixels( iRow, false, true );

			// If we need records outside the current draw region, but the new
			// scrolling position is inside that (due to the non-linear nature
			// for larger numbers of records), we need to force position update.
			if ( this.s.redrawTop < px && px < this.s.redrawBottom ) {
				this.s.forceReposition = true;
				bAnimate = false;
			}
		}

		if ( typeof bAnimate == 'undefined' || bAnimate )
		{
			this.s.ani = ani;
			$(this.dom.scroller).animate( {
				"scrollTop": px
			}, function () {
				// This needs to happen after the animation has completed and
				// the final scroll event fired
				setTimeout( function () {
					that.s.ani = false;
				}, 25 );
			} );
		}
		else
		{
			$(this.dom.scroller).scrollTop( px );
		}
	},


	/**
	 * Calculate and store information about how many rows are to be displayed
	 * in the scrolling viewport, based on current dimensions in the browser's
	 * rendering. This can be particularly useful if the table is initially
	 * drawn in a hidden element - for example in a tab.
	 *  @param {bool} [bRedraw=true] Redraw the table automatically after the recalculation, with
	 *    the new dimensions forming the basis for the draw.
	 *  @returns {void}
	 *  @example
	 *    $(document).ready(function() {
	 *      // Make the example container hidden to throw off the browser's sizing
	 *      document.getElementById('container').style.display = "none";
	 *      var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sAjaxSource": "media/dataset/large.txt",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "fnInitComplete": function (o) {
	 *          // Immediately scroll to row 1000
	 *          o.oScroller.fnScrollToRow( 1000 );
	 *        }
	 *      } );
	 *     
	 *      setTimeout( function () {
	 *        // Make the example container visible and recalculate the scroller sizes
	 *        document.getElementById('container').style.display = "block";
	 *        oTable.fnSettings().oScroller.fnMeasure();
	 *      }, 3000 );
	 */
	"fnMeasure": function ( bRedraw )
	{
		if ( this.s.autoHeight )
		{
			this._fnCalcRowHeight();
		}

		var heights = this.s.heights;

		if ( heights.row ) {
			heights.viewport = $.contains(document, this.dom.scroller) ?
				$(this.dom.scroller).height() :
				this._parseHeight($(this.dom.scroller).css('height'));

			// If collapsed (no height) use the max-height parameter
			if ( ! heights.viewport ) {
				heights.viewport = this._parseHeight($(this.dom.scroller).css('max-height'));
			}

			this.s.viewportRows = parseInt( heights.viewport / heights.row, 10 )+1;
			this.s.dt._iDisplayLength = this.s.viewportRows * this.s.displayBuffer;
		}

		if ( bRedraw === undefined || bRedraw )
		{
			this.s.dt.oInstance.fnDraw( false );
		}
	},


	/**
	 * Get information about current displayed record range. This corresponds to
	 * the information usually displayed in the "Info" block of the table.
	 *
	 * @returns {object} info as an object:
	 *  {
	 *      start: {int}, // the 0-indexed record at the top of the viewport
	 *      end:   {int}, // the 0-indexed record at the bottom of the viewport
	 *  }
	*/
	"fnPageInfo": function()
	{
		var 
			dt = this.s.dt,
			iScrollTop = this.dom.scroller.scrollTop,
			iTotal = dt.fnRecordsDisplay(),
			iPossibleEnd = Math.ceil(this.fnPixelsToRow(iScrollTop + this.s.heights.viewport, false, this.s.ani));

		return {
			start: Math.floor(this.fnPixelsToRow(iScrollTop, false, this.s.ani)),
			end: iTotal < iPossibleEnd ? iTotal-1 : iPossibleEnd-1
		};
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods (they are of course public in JS, but recommended as private)
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Initialisation for Scroller
	 *  @returns {void}
	 *  @private
	 */
	"_fnConstruct": function ()
	{
		var that = this;

		/* Sanity check */
		if ( !this.s.dt.oFeatures.bPaginate ) {
			this.s.dt.oApi._fnLog( this.s.dt, 0, 'Pagination must be enabled for Scroller' );
			return;
		}

		/* Insert a div element that we can use to force the DT scrolling container to
		 * the height that would be required if the whole table was being displayed
		 */
		this.dom.force.style.position = "relative";
		this.dom.force.style.top = "0px";
		this.dom.force.style.left = "0px";
		this.dom.force.style.width = "1px";

		this.dom.scroller = $('div.'+this.s.dt.oClasses.sScrollBody, this.s.dt.nTableWrapper)[0];
		this.dom.scroller.appendChild( this.dom.force );
		this.dom.scroller.style.position = "relative";

		this.dom.table = $('>table', this.dom.scroller)[0];
		this.dom.table.style.position = "absolute";
		this.dom.table.style.top = "0px";
		this.dom.table.style.left = "0px";

		// Add class to 'announce' that we are a Scroller table
		$(this.s.dt.nTableWrapper).addClass('DTS');

		// Add a 'loading' indicator
		if ( this.s.loadingIndicator )
		{
			this.dom.loader = $('<div class="dataTables_processing DTS_Loading">'+this.s.dt.oLanguage.sLoadingRecords+'</div>')
				.css('display', 'none');

			$(this.dom.scroller.parentNode)
				.css('position', 'relative')
				.append( this.dom.loader );
		}

		/* Initial size calculations */
		if ( this.s.heights.row && this.s.heights.row != 'auto' )
		{
			this.s.autoHeight = false;
		}
		this.fnMeasure( false );

		/* Scrolling callback to see if a page change is needed - use a throttled
		 * function for the save save callback so we aren't hitting it on every
		 * scroll
		 */
		this.s.ingnoreScroll = true;
		this.s.stateSaveThrottle = this.s.dt.oApi._fnThrottle( function () {
			that.s.dt.oApi._fnSaveState( that.s.dt );
		}, 500 );
		$(this.dom.scroller).on( 'scroll.DTS', function (e) {
			that._fnScroll.call( that );
		} );

		/* In iOS we catch the touchstart event in case the user tries to scroll
		 * while the display is already scrolling
		 */
		$(this.dom.scroller).on('touchstart.DTS', function () {
			that._fnScroll.call( that );
		} );

		/* Update the scroller when the DataTable is redrawn */
		this.s.dt.aoDrawCallback.push( {
			"fn": function () {
				if ( that.s.dt.bInitialised ) {
					that._fnDrawCallback.call( that );
				}
			},
			"sName": "Scroller"
		} );

		/* On resize, update the information element, since the number of rows shown might change */
		$(window).on( 'resize.DTS', function () {
			that.fnMeasure( false );
			that._fnInfo();
		} );

		/* Add a state saving parameter to the DT state saving so we can restore the exact
		 * position of the scrolling
		 */
		var initialStateSave = true;
		this.s.dt.oApi._fnCallbackReg( this.s.dt, 'aoStateSaveParams', function (oS, oData) {
			/* Set iScroller to saved scroll position on initialization.
			 */
			if(initialStateSave && that.s.dt.oLoadedState){
				oData.iScroller = that.s.dt.oLoadedState.iScroller;
				oData.iScrollerTopRow = that.s.dt.oLoadedState.iScrollerTopRow;
				initialStateSave = false;
			} else {
				oData.iScroller = that.dom.scroller.scrollTop;
				oData.iScrollerTopRow = that.s.topRowFloat;
			}
		}, "Scroller_State" );

		if ( this.s.dt.oLoadedState ) {
			this.s.topRowFloat = this.s.dt.oLoadedState.iScrollerTopRow || 0;
		}

		// Measure immediately. Scroller will have been added using preInit, so
		// we can reliably do this here. We could potentially also measure on
		// init complete, which would be useful for cases where the data is Ajax
		// loaded and longer than a single line.
		$(this.s.dt.nTable).one( 'init.dt', function () {
			that.fnMeasure();
		} );

		/* Destructor */
		this.s.dt.aoDestroyCallback.push( {
			"sName": "Scroller",
			"fn": function () {
				$(window).off( 'resize.DTS' );
				$(that.dom.scroller).off('touchstart.DTS scroll.DTS');
				$(that.s.dt.nTableWrapper).removeClass('DTS');
				$('div.DTS_Loading', that.dom.scroller.parentNode).remove();
				$(that.s.dt.nTable).off( 'init.dt' );

				that.dom.table.style.position = "";
				that.dom.table.style.top = "";
				that.dom.table.style.left = "";
			}
		} );
	},


	/**
	 * Scrolling function - fired whenever the scrolling position is changed.
	 * This method needs to use the stored values to see if the table should be
	 * redrawn as we are moving towards the end of the information that is
	 * currently drawn or not. If needed, then it will redraw the table based on
	 * the new position.
	 *  @returns {void}
	 *  @private
	 */
	"_fnScroll": function ()
	{
		var
			that = this,
			heights = this.s.heights,
			iScrollTop = this.dom.scroller.scrollTop,
			iTopRow;

		if ( this.s.skip ) {
			return;
		}

		if ( this.s.ingnoreScroll ) {
			return;
		}

		/* If the table has been sorted or filtered, then we use the redraw that
		 * DataTables as done, rather than performing our own
		 */
		if ( this.s.dt.bFiltered || this.s.dt.bSorted ) {
			this.s.lastScrollTop = 0;
			return;
		}

		/* Update the table's information display for what is now in the viewport */
		this._fnInfo();

		/* We don't want to state save on every scroll event - that's heavy
		 * handed, so use a timeout to update the state saving only when the
		 * scrolling has finished
		 */
		clearTimeout( this.s.stateTO );
		this.s.stateTO = setTimeout( function () {
			that.s.dt.oApi._fnSaveState( that.s.dt );
		}, 250 );

		/* Check if the scroll point is outside the trigger boundary which would required
		 * a DataTables redraw
		 */
		if ( this.s.forceReposition || iScrollTop < this.s.redrawTop || iScrollTop > this.s.redrawBottom ) {

			var preRows = Math.ceil( ((this.s.displayBuffer-1)/2) * this.s.viewportRows );

			if ( Math.abs( iScrollTop - this.s.lastScrollTop ) > heights.viewport || this.s.ani || this.s.forceReposition ) {
				iTopRow = parseInt(this._domain( 'physicalToVirtual', iScrollTop ) / heights.row, 10) - preRows;
				this.s.topRowFloat = this._domain( 'physicalToVirtual', iScrollTop ) / heights.row;
			}
			else {
				iTopRow = this.fnPixelsToRow( iScrollTop ) - preRows;
				this.s.topRowFloat = this.fnPixelsToRow( iScrollTop, false );
			}

			this.s.forceReposition = false;

			if ( iTopRow <= 0 ) {
				/* At the start of the table */
				iTopRow = 0;
			}
			else if ( iTopRow + this.s.dt._iDisplayLength > this.s.dt.fnRecordsDisplay() ) {
				/* At the end of the table */
				iTopRow = this.s.dt.fnRecordsDisplay() - this.s.dt._iDisplayLength;
				if ( iTopRow < 0 ) {
					iTopRow = 0;
				}
			}
			else if ( iTopRow % 2 !== 0 ) {
				// For the row-striping classes (odd/even) we want only to start
				// on evens otherwise the stripes will change between draws and
				// look rubbish
				iTopRow++;
			}

			if ( iTopRow != this.s.dt._iDisplayStart ) {
				/* Cache the new table position for quick lookups */
				this.s.tableTop = $(this.s.dt.nTable).offset().top;
				this.s.tableBottom = $(this.s.dt.nTable).height() + this.s.tableTop;

				var draw =  function () {
					if ( that.s.scrollDrawReq === null ) {
						that.s.scrollDrawReq = iScrollTop;
					}

					that.s.dt._iDisplayStart = iTopRow;
					that.s.dt.oApi._fnDraw( that.s.dt );
				};

				/* Do the DataTables redraw based on the calculated start point - note that when
				 * using server-side processing we introduce a small delay to not DoS the server...
				 */
				if ( this.s.dt.oFeatures.bServerSide ) {
					clearTimeout( this.s.drawTO );
					this.s.drawTO = setTimeout( draw, this.s.serverWait );
				}
				else {
					draw();
				}

				if ( this.dom.loader && ! this.s.loaderVisible ) {
					this.dom.loader.css( 'display', 'block' );
					this.s.loaderVisible = true;
				}
			}
		}
		else {
			this.s.topRowFloat = this._domain( 'physicalToVirtual', iScrollTop ) / heights.row;
		}

		this.s.lastScrollTop = iScrollTop;
		this.s.stateSaveThrottle();
	},


	/**
	 * Convert from one domain to another. The physical domain is the actual
	 * pixel count on the screen, while the virtual is if we had browsers which
	 * had scrolling containers of infinite height (i.e. the absolute value)
	 *
	 *  @param {string} dir Domain transform direction, `virtualToPhysical` or
	 *    `physicalToVirtual` 
	 *  @returns {number} Calculated transform
	 *  @private
	 */
	_domain: function ( dir, val )
	{
		var heights = this.s.heights;
		var coeff;

		// If the virtual and physical height match, then we use a linear
		// transform between the two, allowing the scrollbar to be linear
		if ( heights.virtual === heights.scroll ) {
			return val;
		}

		// Otherwise, we want a non-linear scrollbar to take account of the
		// redrawing regions at the start and end of the table, otherwise these
		// can stutter badly - on large tables 30px (for example) scroll might
		// be hundreds of rows, so the table would be redrawing every few px at
		// the start and end. Use a simple quadratic to stop this. It does mean
		// the scrollbar is non-linear, but with such massive data sets, the
		// scrollbar is going to be a best guess anyway
		var xMax = (heights.scroll - heights.viewport) / 2;
		var yMax = (heights.virtual - heights.viewport) / 2;

		coeff = yMax / ( xMax * xMax );

		if ( dir === 'virtualToPhysical' ) {
			if ( val < yMax ) {
				return Math.pow(val / coeff, 0.5);
			}
			else {
				val = (yMax*2) - val;
				return val < 0 ?
					heights.scroll :
					(xMax*2) - Math.pow(val / coeff, 0.5);
			}
		}
		else if ( dir === 'physicalToVirtual' ) {
			if ( val < xMax ) {
				return val * val * coeff;
			}
			else {
				val = (xMax*2) - val;
				return val < 0 ?
					heights.virtual :
					(yMax*2) - (val * val * coeff);
			}
		}
	},

	/**
	 * Parse CSS height property string as number
	 *
	 * An attempt is made to parse the string as a number. Currently supported units are 'px',
	 * 'vh', and 'rem'. 'em' is partially supported; it works as long as the parent element's
	 * font size matches the body element. Zero is returned for unrecognized strings.
	 *  @param {string} cssHeight CSS height property string
	 *  @returns {number} height
	 *  @private
	 */
	_parseHeight: function(cssHeight) {
		var height;
		var matches = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(px|em|rem|vh)$/.exec(cssHeight);

		if (matches === null) {
			return 0;
		}

		var value = parseFloat(matches[1]);
		var unit = matches[2];

		if ( unit === 'px' ) {
			height = value;
		}
		else if ( unit === 'vh' ) {
			height = ( value / 100 ) * $(window).height();
		}
		else if ( unit === 'rem' ) {
			height = value * parseFloat($(':root').css('font-size'));
		}
		else if ( unit === 'em' ) {
			height = value * parseFloat($('body').css('font-size'));
		}

		return height ?
			height :
			0;
	},


	/**
	 * Draw callback function which is fired when the DataTable is redrawn. The main function of
	 * this method is to position the drawn table correctly the scrolling container for the rows
	 * that is displays as a result of the scrolling position.
	 *  @returns {void}
	 *  @private
	 */
	"_fnDrawCallback": function ()
	{
		var
			that = this,
			heights = this.s.heights,
			iScrollTop = this.dom.scroller.scrollTop,
			iActualScrollTop = iScrollTop,
			iScrollBottom = iScrollTop + heights.viewport,
			iTableHeight = $(this.s.dt.nTable).height(),
			displayStart = this.s.dt._iDisplayStart,
			displayLen = this.s.dt._iDisplayLength,
			displayEnd = this.s.dt.fnRecordsDisplay();

		// Disable the scroll event listener while we are updating the DOM
		this.s.skip = true;

		// Resize the scroll forcing element
		this._fnScrollForce();

		// Reposition the scrolling for the updated virtual position if needed
		if ( displayStart === 0 ) {
			// Linear calculation at the top of the table
			iScrollTop = this.s.topRowFloat * heights.row;
		}
		else if ( displayStart + displayLen >= displayEnd ) {
			// Linear calculation that the bottom as well
			iScrollTop = heights.scroll - ((displayEnd - this.s.topRowFloat) * heights.row);
		}
		else {
			// Domain scaled in the middle
			iScrollTop = this._domain( 'virtualToPhysical', this.s.topRowFloat * heights.row );
		}

		this.dom.scroller.scrollTop = iScrollTop;

		// Store positional information so positional calculations can be based
		// upon the current table draw position
		this.s.baseScrollTop = iScrollTop;
		this.s.baseRowTop = this.s.topRowFloat;

		// Position the table in the virtual scroller
		var tableTop = iScrollTop - ((this.s.topRowFloat - displayStart) * heights.row);
		if ( displayStart === 0 ) {
			tableTop = 0;
		}
		else if ( displayStart + displayLen >= displayEnd ) {
			tableTop = heights.scroll - iTableHeight;
		}

		this.dom.table.style.top = tableTop+'px';

		/* Cache some information for the scroller */
		this.s.tableTop = tableTop;
		this.s.tableBottom = iTableHeight + this.s.tableTop;

		// Calculate the boundaries for where a redraw will be triggered by the
		// scroll event listener
		var boundaryPx = (iScrollTop - this.s.tableTop) * this.s.boundaryScale;
		this.s.redrawTop = iScrollTop - boundaryPx;
		this.s.redrawBottom = iScrollTop + boundaryPx > heights.scroll - heights.viewport - heights.row ?
			heights.scroll - heights.viewport - heights.row :
			iScrollTop + boundaryPx;

		this.s.skip = false;

		// Restore the scrolling position that was saved by DataTable's state
		// saving Note that this is done on the second draw when data is Ajax
		// sourced, and the first draw when DOM soured
		if ( this.s.dt.oFeatures.bStateSave && this.s.dt.oLoadedState !== null &&
			 typeof this.s.dt.oLoadedState.iScroller != 'undefined' )
		{
			// A quirk of DataTables is that the draw callback will occur on an
			// empty set if Ajax sourced, but not if server-side processing.
			var ajaxSourced = (this.s.dt.sAjaxSource || that.s.dt.ajax) && ! this.s.dt.oFeatures.bServerSide ?
				true :
				false;

			if ( ( ajaxSourced && this.s.dt.iDraw == 2) ||
			     (!ajaxSourced && this.s.dt.iDraw == 1) )
			{
				setTimeout( function () {
					$(that.dom.scroller).scrollTop( that.s.dt.oLoadedState.iScroller );
					that.s.redrawTop = that.s.dt.oLoadedState.iScroller - (heights.viewport/2);

					// In order to prevent layout thrashing we need another
					// small delay
					setTimeout( function () {
						that.s.ingnoreScroll = false;
					}, 0 );
				}, 0 );
			}
		}
		else {
			that.s.ingnoreScroll = false;
		}

		// Because of the order of the DT callbacks, the info update will
		// take precedence over the one we want here. So a 'thread' break is
		// needed.  Only add the thread break if bInfo is set
		if ( this.s.dt.oFeatures.bInfo ) {
			setTimeout( function () {
				that._fnInfo.call( that );
			}, 0 );
		}

		// Hide the loading indicator
		if ( this.dom.loader && this.s.loaderVisible ) {
			this.dom.loader.css( 'display', 'none' );
			this.s.loaderVisible = false;
		}
	},


	/**
	 * Force the scrolling container to have height beyond that of just the
	 * table that has been drawn so the user can scroll the whole data set.
	 *
	 * Note that if the calculated required scrolling height exceeds a maximum
	 * value (1 million pixels - hard-coded) the forcing element will be set
	 * only to that maximum value and virtual / physical domain transforms will
	 * be used to allow Scroller to display tables of any number of records.
	 *  @returns {void}
	 *  @private
	 */
	_fnScrollForce: function ()
	{
		var heights = this.s.heights;
		var max = 1000000;

		heights.virtual = heights.row * this.s.dt.fnRecordsDisplay();
		heights.scroll = heights.virtual;

		if ( heights.scroll > max ) {
			heights.scroll = max;
		}

		// Minimum height so there is always a row visible (the 'no rows found'
		// if reduced to zero filtering)
		this.dom.force.style.height = heights.scroll > this.s.heights.row ?
			heights.scroll+'px' :
			this.s.heights.row+'px';
	},


	/**
	 * Automatic calculation of table row height. This is just a little tricky here as using
	 * initialisation DataTables has tale the table out of the document, so we need to create
	 * a new table and insert it into the document, calculate the row height and then whip the
	 * table out.
	 *  @returns {void}
	 *  @private
	 */
	"_fnCalcRowHeight": function ()
	{
		var dt = this.s.dt;
		var origTable = dt.nTable;
		var nTable = origTable.cloneNode( false );
		var tbody = $('<tbody/>').appendTo( nTable );
		var container = $(
			'<div class="'+dt.oClasses.sWrapper+' DTS">'+
				'<div class="'+dt.oClasses.sScrollWrapper+'">'+
					'<div class="'+dt.oClasses.sScrollBody+'"></div>'+
				'</div>'+
			'</div>'
		);

		// Want 3 rows in the sizing table so :first-child and :last-child
		// CSS styles don't come into play - take the size of the middle row
		$('tbody tr:lt(4)', origTable).clone().appendTo( tbody );
		while( $('tr', tbody).length < 3 ) {
			tbody.append( '<tr><td>&nbsp;</td></tr>' );
		}

		$('div.'+dt.oClasses.sScrollBody, container).append( nTable );

		// If initialised using `dom`, use the holding element as the insert point
		var insertEl = this.s.dt.nHolding || origTable.parentNode;

		if ( ! $(insertEl).is(':visible') ) {
			insertEl = 'body';
		}

		container.appendTo( insertEl );
		this.s.heights.row = $('tr', tbody).eq(1).outerHeight();

		container.remove();
	},


	/**
	 * Update any information elements that are controlled by the DataTable based on the scrolling
	 * viewport and what rows are visible in it. This function basically acts in the same way as
	 * _fnUpdateInfo in DataTables, and effectively replaces that function.
	 *  @returns {void}
	 *  @private
	 */
	"_fnInfo": function ()
	{
		if ( !this.s.dt.oFeatures.bInfo )
		{
			return;
		}

		var
			dt = this.s.dt,
			language = dt.oLanguage,
			iScrollTop = this.dom.scroller.scrollTop,
			iStart = Math.floor( this.fnPixelsToRow(iScrollTop, false, this.s.ani)+1 ),
			iMax = dt.fnRecordsTotal(),
			iTotal = dt.fnRecordsDisplay(),
			iPossibleEnd = Math.ceil( this.fnPixelsToRow(iScrollTop+this.s.heights.viewport, false, this.s.ani) ),
			iEnd = iTotal < iPossibleEnd ? iTotal : iPossibleEnd,
			sStart = dt.fnFormatNumber( iStart ),
			sEnd = dt.fnFormatNumber( iEnd ),
			sMax = dt.fnFormatNumber( iMax ),
			sTotal = dt.fnFormatNumber( iTotal ),
			sOut;

		if ( dt.fnRecordsDisplay() === 0 &&
			   dt.fnRecordsDisplay() == dt.fnRecordsTotal() )
		{
			/* Empty record set */
			sOut = language.sInfoEmpty+ language.sInfoPostFix;
		}
		else if ( dt.fnRecordsDisplay() === 0 )
		{
			/* Empty record set after filtering */
			sOut = language.sInfoEmpty +' '+
				language.sInfoFiltered.replace('_MAX_', sMax)+
					language.sInfoPostFix;
		}
		else if ( dt.fnRecordsDisplay() == dt.fnRecordsTotal() )
		{
			/* Normal record set */
			sOut = language.sInfo.
					replace('_START_', sStart).
					replace('_END_',   sEnd).
					replace('_MAX_',   sMax).
					replace('_TOTAL_', sTotal)+
				language.sInfoPostFix;
		}
		else
		{
			/* Record set after filtering */
			sOut = language.sInfo.
					replace('_START_', sStart).
					replace('_END_',   sEnd).
					replace('_MAX_',   sMax).
					replace('_TOTAL_', sTotal) +' '+
				language.sInfoFiltered.replace(
					'_MAX_',
					dt.fnFormatNumber(dt.fnRecordsTotal())
				)+
				language.sInfoPostFix;
		}

		var callback = language.fnInfoCallback;
		if ( callback ) {
			sOut = callback.call( dt.oInstance,
				dt, iStart, iEnd, iMax, iTotal, sOut
			);
		}

		var n = dt.aanFeatures.i;
		if ( typeof n != 'undefined' )
		{
			for ( var i=0, iLen=n.length ; i<iLen ; i++ )
			{
				$(n[i]).html( sOut );
			}
		}

		// DT doesn't actually (yet) trigger this event, but it will in future
		$(dt.nTable).triggerHandler( 'info.dt' );
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/**
 * Scroller default settings for initialisation
 *  @namespace
 *  @name Scroller.defaults
 *  @static
 */
Scroller.defaults = /** @lends Scroller.defaults */{
	/**
	 * Indicate if Scroller show show trace information on the console or not. This can be
	 * useful when debugging Scroller or if just curious as to what it is doing, but should
	 * be turned off for production.
	 *  @type     bool
	 *  @default  false
	 *  @static
	 *  @example
	 *    var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "oScroller": {
	 *          "trace": true
	 *        }
	 *    } );
	 */
	"trace": false,

	/**
	 * Scroller will attempt to automatically calculate the height of rows for it's internal
	 * calculations. However the height that is used can be overridden using this parameter.
	 *  @type     int|string
	 *  @default  auto
	 *  @static
	 *  @example
	 *    var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "oScroller": {
	 *          "rowHeight": 30
	 *        }
	 *    } );
	 */
	"rowHeight": "auto",

	/**
	 * When using server-side processing, Scroller will wait a small amount of time to allow
	 * the scrolling to finish before requesting more data from the server. This prevents
	 * you from DoSing your own server! The wait time can be configured by this parameter.
	 *  @type     int
	 *  @default  200
	 *  @static
	 *  @example
	 *    var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "oScroller": {
	 *          "serverWait": 100
	 *        }
	 *    } );
	 */
	"serverWait": 200,

	/**
	 * The display buffer is what Scroller uses to calculate how many rows it should pre-fetch
	 * for scrolling. Scroller automatically adjusts DataTables' display length to pre-fetch
	 * rows that will be shown in "near scrolling" (i.e. just beyond the current display area).
	 * The value is based upon the number of rows that can be displayed in the viewport (i.e.
	 * a value of 1), and will apply the display range to records before before and after the
	 * current viewport - i.e. a factor of 3 will allow Scroller to pre-fetch 1 viewport's worth
	 * of rows before the current viewport, the current viewport's rows and 1 viewport's worth
	 * of rows after the current viewport. Adjusting this value can be useful for ensuring
	 * smooth scrolling based on your data set.
	 *  @type     int
	 *  @default  7
	 *  @static
	 *  @example
	 *    var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "oScroller": {
	 *          "displayBuffer": 10
	 *        }
	 *    } );
	 */
	"displayBuffer": 9,

	/**
	 * Scroller uses the boundary scaling factor to decide when to redraw the table - which it
	 * typically does before you reach the end of the currently loaded data set (in order to
	 * allow the data to look continuous to a user scrolling through the data). If given as 0
	 * then the table will be redrawn whenever the viewport is scrolled, while 1 would not
	 * redraw the table until the currently loaded data has all been shown. You will want
	 * something in the middle - the default factor of 0.5 is usually suitable.
	 *  @type     float
	 *  @default  0.5
	 *  @static
	 *  @example
	 *    var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "oScroller": {
	 *          "boundaryScale": 0.75
	 *        }
	 *    } );
	 */
	"boundaryScale": 0.5,

	/**
	 * Show (or not) the loading element in the background of the table. Note that you should
	 * include the dataTables.scroller.css file for this to be displayed correctly.
	 *  @type     boolean
	 *  @default  false
	 *  @static
	 *  @example
	 *    var oTable = $('#example').dataTable( {
	 *        "sScrollY": "200px",
	 *        "sDom": "frtiS",
	 *        "bDeferRender": true,
	 *        "oScroller": {
	 *          "loadingIndicator": true
	 *        }
	 *    } );
	 */
	"loadingIndicator": false
};

Scroller.oDefaults = Scroller.defaults;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Scroller version
 *  @type      String
 *  @default   See code
 *  @name      Scroller.version
 *  @static
 */
Scroller.version = "1.4.4";



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Legacy `dom` parameter initialisation support
if ( typeof $.fn.dataTable == "function" &&
     typeof $.fn.dataTableExt.fnVersionCheck == "function" &&
     $.fn.dataTableExt.fnVersionCheck('1.10.0') )
{
	$.fn.dataTableExt.aoFeatures.push( {
		"fnInit": function( oDTSettings ) {
			var init = oDTSettings.oInit;
			var opts = init.scroller || init.oScroller || {};
			
			new Scroller( oDTSettings, opts );
		},
		"cFeature": "S",
		"sFeature": "Scroller"
	} );
}
else
{
	alert( "Warning: Scroller requires DataTables 1.10.0 or greater - www.datatables.net/download");
}

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtscroller', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.scroller;
	var defaults = DataTable.defaults.scroller;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new Scroller( settings, opts  );
		}
	}
} );


// Attach Scroller to DataTables so it can be accessed as an 'extra'
$.fn.dataTable.Scroller = Scroller;
$.fn.DataTable.Scroller = Scroller;


// DataTables 1.10 API method aliases
var Api = $.fn.dataTable.Api;

Api.register( 'scroller()', function () {
	return this;
} );

// Undocumented and deprecated - is it actually useful at all?
Api.register( 'scroller().rowToPixels()', function ( rowIdx, intParse, virtual ) {
	var ctx = this.context;

	if ( ctx.length && ctx[0].oScroller ) {
		return ctx[0].oScroller.fnRowToPixels( rowIdx, intParse, virtual );
	}
	// undefined
} );

// Undocumented and deprecated - is it actually useful at all?
Api.register( 'scroller().pixelsToRow()', function ( pixels, intParse, virtual ) {
	var ctx = this.context;

	if ( ctx.length && ctx[0].oScroller ) {
		return ctx[0].oScroller.fnPixelsToRow( pixels, intParse, virtual );
	}
	// undefined
} );

// Undocumented and deprecated - use `row().scrollTo()` instead
Api.register( 'scroller().scrollToRow()', function ( row, ani ) {
	this.iterator( 'table', function ( ctx ) {
		if ( ctx.oScroller ) {
			ctx.oScroller.fnScrollToRow( row, ani );
		}
	} );

	return this;
} );

Api.register( 'row().scrollTo()', function ( ani ) {
	var that = this;

	this.iterator( 'row', function ( ctx, rowIdx ) {
		if ( ctx.oScroller ) {
			var displayIdx = that
				.rows( { order: 'applied', search: 'applied' } )
				.indexes()
				.indexOf( rowIdx );

			ctx.oScroller.fnScrollToRow( displayIdx, ani );
		}
	} );

	return this;
} );

Api.register( 'scroller.measure()', function ( redraw ) {
	this.iterator( 'table', function ( ctx ) {
		if ( ctx.oScroller ) {
			ctx.oScroller.fnMeasure( redraw );
		}
	} );

	return this;
} );

Api.register( 'scroller.page()', function() {
	var ctx = this.context;

	if ( ctx.length && ctx[0].oScroller ) {
		return ctx[0].oScroller.fnPageInfo();
	}
	// undefined
} );

return Scroller;
}));


/*! Select for DataTables 1.2.5
 * 2015-2018 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.2.5
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.2.5';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + dt.table().node().id );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( window.getSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( $.trim(selection.toString()) !== '' ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.dataTables_wrapper')[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + dt.table().node().id, function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


