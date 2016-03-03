/*jslint browser: true*/
/*global jQuery */

(function( $ ) {
	
	var modelExportButton = $('button#modelExport');
	var exportContainer = $('#export-container');

	//var url = 'https://localhost/depar/export/export';

	var autoSubmitFormData;

	modelExportButton.on('click', function(e) {
		e.preventDefault();
		var formData = autoSubmitFormData = $('#autosubmit').serializeObject();
		console.log(formData);
		//var combinedData = formData.concat(filter);
		//console.log(filter);
		var finalObj = formData;


		$.post(exportUrl+'/step/form', formData, function(data) {
			exportContainer.html(data);

			var exportForm = $('#exportOptionsForm');
			var newValue = exportForm.find('#type').val().toLowerCase();
			exportForm.find('.export-class-' + newValue).removeClass('hidden');
		});

		//console.log(combinedData);
		console.log(autoSubmitFormData);
	});

	exportContainer.on('change', 'select#type', function(e) {
		var typeSelect = $(this);
		var exportForm = typeSelect.closest('form');

		var newValue = typeSelect.val().toLowerCase();

		console.log(exportForm.find('.export-class-' + newValue));
		exportForm.find('.export-class-group').addClass('hidden');
		exportForm.find('.export-class-' + newValue).removeClass('hidden');

	});

	exportContainer.on('submit', '#exportOptionsForm', function(e) {
		e.preventDefault();
		var exportOptionsForm = $(this);

		var type = exportOptionsForm.find('select[name="type"]').val();
		//remove unneeded groups
		exportOptionsForm.find('fieldset.export-class-group').not('#fieldset-'+type).remove();
		
		var exportOptionsFormData = exportOptionsForm.serializeObject();
		var finalObj = $.extend(exportOptionsFormData, autoSubmitFormData);

		$.post(exportUrl+'/step/batch', finalObj, function(data) {
			exportContainer.html(data);
			Gems_Task_TaskRunnerBatch_export_data_Start();
			exportContainer.find("script").each(function(i) {
                
            });
		});
	});

} (jQuery));
