jQuery(document).ready(function($) {

	// var defaultCities = [ 'Copenhagen', 'New York', 'Berlin', 'Budapest' ];

	initBoards();

	/**
	 * Init cities render
	 */
	function initBoards() {
		displayBoards();
		displayCards();
	}

	/**
	 * Output data from JSON
	 */
	function displayBoards() {
		var apiUrl = getApiURL() + getBoardsEndpoint()
			+ '?' + getApiKey()
			+ '&' + getToken();

		$.getJSON(apiUrl, function(data) {
			var items = [];
			var itemClass = 'boards';

			$.each(data, function(key, board) {
				if (board.starred) {
					items.push(
						'<li id="board-' + board.id + '" class="item-board">' +
						'<input type="checkbox" id="' + board.id + '"><label for="' + board.id + '">' + board.name + '</label></li>'
					);
				}
			});

			$( '<ul/>', {
				'class': 'item ' + itemClass,
				html: items.join( '' )
			} ).appendTo( '.boards-container' );
		});

		$(document).on('click', '.item-board', function() {
			displayCards();
		});
	}

	/**
	 * Output data from JSON
	 */
	function displayCards() {
		var boardsIDs = getBoardsChecked();
		$('.cards-container').hide();

		var apiUrl = getApiURL() + getSearchEndpoint()
			+ '?' + getFilters(boardsIDs)
			+ '&' + getApiKey()
			+ '&' + getToken();

		$.getJSON(apiUrl, function(data) {
			var items = [];
			var itemClass = 'cards';

			$.each(data, function(key, board) {
				$.each(board, function(key, card) {
					if (card.id && !card.closed) {
						console.log(card);
						items.push(
							'<li id="card-' + card.id + '" class="item-card">' +
							'<div class="list">' + card.list.name + '</div>' + card.name + '</li>'
						);
					}
				});
			});

			$('.cards-container').html(
				$( '<ul/>', {
					'class': 'item unsorted ' + itemClass,
					html: items.join( '' )
				} )
			);
		})
		.done(function() {
			sortCards();
		});

	}

	/**
	 * Sort cards by list names
	 */
	function sortCards() {
		var cards = $('.item-card');
		var lists = $('.list', cards);
		var items = [];

		$.each(lists, function() {
			var text = $(this).text();

			if (text) {
				if ($.inArray(convertToSlug(text), items) == -1) {
					items.push(convertToSlug(text));

					$('.cards-container').append(
						$( '<ul/>', {
							'class': 'item list cards ' + convertToSlug(text) + '',
							html: '<li class="list-name">' + text + '</li>'
						} )
					);
				}
			}
		});

		$.each(cards, function() {
			var listSlug = convertToSlug($('.list', this).text());

			$(this).appendTo('.list.' + listSlug);
			$('.cards-container').show();
		});
	}

	/**
	 * Get API URL
	 */
	function getApiURL() {
		return 'https://api.trello.com/';
	}

	/**
	 * Get API Endpoint
	 */
	function getBoardsEndpoint() {
		return '1/members/me/boards';
	}

	/**
	 * Get API Endpoint
	 */
	function getListsEndpoint(listID) {
		return '1/lists/' + listID;
	}

	/**
	 * Get API Endpoint
	 */
	function getSearchEndpoint() {
		return '1/search';
	}

	/**
	 * Get Filters
	 */
	function getFilters(boardsIDs) {
		return 'query=member:me&idBoards=' + boardsIDs + '&modelTypes=cards&cards_limit=1000&card_list=true';
	}

	/**
	 * Get API Key
	 */
	function getApiKey() {
		return 'key=f0944475808dea0f1ddd2e33e7d12875';
	}

	/**
	 * Get Token
	 */
	function getToken() {
		return 'token=3350c6469a7cdca043419c0ac8fd82a5e8eb93fb1660db997fa4d5ff7827e262';
	}

	function getBoardsChecked() {
		var checked = $('.boards input:checked');
		var boardsIDs = '';

		$.each(checked, function(key, board) {
			boardsIDs += board.id + ',';
		});

		return boardsIDs.slice(0,-1);
	}

	function convertToSlug(text)
	{
	    return text
	        .toLowerCase()
	        .replace(/[^\w ]+/g,'')
	        .replace(/ +/g,'-')
	        ;
	}

} );
