/*!
 * jQuery pagination plugin v1.4.2
 * http://josecebe.github.io/twbs-pagination/
 *
 * Copyright 2014-2018, Eugene Simakin
 * Released under Apache 2.0 license
 * http://apache.org/licenses/LICENSE-2.0.html
 */
(function ($, window, document, undefined) {

    'use strict';

    var old = $.fn.twbsPagination;

    // PROTOTYPE AND CONSTRUCTOR

    var TwbsPagination = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.twbsPagination.defaults, options);

        if (this.options.start < 0 || this.options.start > this.options.total) {
            throw new Error('Start page option is incorrect');
        }

        this.options.total = parseInt(this.options.total);
        if (this.options.total < 0 || isNaN(this.options.total)) {
            throw new Error('Total pages option is not correct!');
        }

        this.options.visiblePages = parseInt(this.options.visiblePages);
        if (isNaN(this.options.visiblePages)) {
            throw new Error('Visible pages option is not correct!');
        }

        if (this.options.beforePageClick instanceof Function) {
            this.$element.first().on('beforePage', this.options.beforePageClick);
        }

        if (this.options.onPageClick instanceof Function) {
            this.$element.first().on('page', this.options.onPageClick);
        }

        // hide if only one page exists
        if (this.options.hideOnlyOnePage && this.totalPages == 1) {
            return this;
        }

        var tagName = (typeof this.$element.prop === 'function') ?
            this.$element.prop('tagName') : this.$element.attr('tagName');

        if (tagName === 'UL') {
            this.$listContainer = this.$element;
        } else {
            var elements = this.$element;
            var $newListContainer = $([]);
            elements.each(function(index) {
                var $newElem = $("<ul></ul>");
                $(this).append($newElem);
                $newListContainer.push($newElem[0]);
            });
            this.$listContainer = $newListContainer;
            this.$element = $newListContainer;
        }

        this.$listContainer.addClass(this.options.paginationClass);

        this.totalPages = Math.ceil(this.options.total / this.options.length)
        this.currentPage = Math.ceil(this.options.start / this.options.length) + 1;

        this.render(this.getPages(this.currentPage));
        this.setupEvents();

        return this;
    };

    TwbsPagination.prototype = {

        constructor: TwbsPagination,

        destroy: function () {
            this.$element.empty();
            this.$element.removeData('twbs-pagination');
            this.$element.off('page');

            return this;
        },

        show: function (page, click = false) {
            if (page < 1 || page > this.totalPages) {
                throw new Error('Page is incorrect.');
            }
            this.currentPage = page;

            this.$element.trigger('beforePage', page);

            var pages = this.getPages(page);
            this.render(pages);
            // this.setupEvents();

            this.$element.trigger('page', (page-1)*this.options.length);
            return pages;
        },

        onlyShow: function (page, click = false) {
            if (page < 1 || page > this.totalPages) {
                this.totalPage = 0;
                this.currentPage = 0;
            }
            this.currentPage = page;

            this.$element.trigger('beforePage', page);

            var pages = this.getPages(page);
            this.render(pages);
            // this.setupEvents();
            return pages;
        },

        enable: function () {
            this.show(this.currentPage);
        },

        disable: function () {
            var _this = this;
            this.$listContainer.off('click').on('click', 'li', function (evt) {
                evt.preventDefault();
            });
            this.$listContainer.children().each(function () {
                var $this = $(this);
                if (!$this.hasClass(_this.options.activeClass)) {
                    $(this).addClass(_this.options.disabledClass);
                }
            });
        },

        buildListItems: function (pages) {
            var listItems = [];

            if (this.options.first) {
                listItems.push(this.buildItem('first', 1));
            }

            if (this.options.prev) {
                var start = Math.floor((pages.currentPage - 1) / this.options.visiblePages) * this.options.visiblePages + 1;
                var prev = start > 1 ? start - 1 : this.options.loop ? this.totalPages : 1;
                listItems.push(this.buildItem('prev', prev));
            }

            for (var i = 0; i < pages.numeric.length; i++) {
                listItems.push(this.buildItem('page', pages.numeric[i]));
            }

            if (this.options.next) {
                var end = Math.floor((pages.currentPage - 1) / this.options.visiblePages) * this.options.visiblePages + this.options.visiblePages;
                var next = end < this.totalPages ? end + 1 : this.options.loop ? 1 : this.totalPages;
                listItems.push(this.buildItem('next', next));
            }

            if (this.options.last) {
                listItems.push(this.buildItem('last', this.totalPages));
            }

            return listItems;
        },

        buildItem: function (type, page) {
            var $itemContainer = $('<li></li>'),
                $itemContent = $('<a></a>'),
                itemText = this.options[type] ? this.makeText(this.options[type], page) : page;

            $itemContainer.addClass(this.options[type + 'Class']);
            $itemContainer.data('page', page);
            $itemContainer.data('page-type', type);
            $itemContainer.append($itemContent.attr('href', this.makeHref(page)).addClass(this.options.anchorClass).html(itemText));

            return $itemContainer;
        },

        getPages: function (currentPage) {
            var pages = [];

            var start = Math.floor((currentPage - 1) / this.options.visiblePages) * this.options.visiblePages + 1;
            var end = start + this.options.visiblePages - 1;

            var visiblePages = this.options.visiblePages;
            if (visiblePages > this.totalPages) {
                visiblePages = this.totalPages;
            }

            // handle boundary case
            if (start <= 0) {
                start = 1;
                end = visiblePages;
            }
            if (end > this.totalPages) {
                start = Math.floor((this.totalPages - 1) / this.options.visiblePages) * this.options.visiblePages + 1;
                end = this.totalPages;
            }
            if (this.totalPages > 0) {
                var itPage = start;
                while (itPage <= end) {
                    pages.push(itPage);
                    itPage++;
                }
            }

            return {"currentPage": currentPage, "numeric": pages};
        },

        render: function (pages) {
            var _this = this;
            this.$listContainer.children().remove();
            var items = this.buildListItems(pages);
            $.each(items, function(key, item){
                _this.$listContainer.append(item);
            });

            this.$listContainer.children().each(function () {
                var $this = $(this),
                    pageType = $this.data('page-type');

                switch (pageType) {
                    case 'page':
                        if ($this.data('page') === pages.currentPage) {
                            $this.addClass(_this.options.activeClass);
                        }
                        break;
                    case 'first':
                            $this.toggleClass(_this.options.disabledClass, _this.totalPages == 0 || pages.currentPage === 1);
                        break;
                    case 'last':
                            $this.toggleClass(_this.options.disabledClass, _this.totalPages == 0 || pages.currentPage === _this.totalPages);
                        break;
                    case 'prev':
                            $this.toggleClass(_this.options.disabledClass, _this.totalPages == 0 || !_this.options.loop && pages.currentPage === 1);
                        break;
                    case 'next':
                            $this.toggleClass(_this.options.disabledClass, _this.totalPages == 0 || !_this.options.loop && pages.currentPage === _this.totalPages);
                        break;
                    default:
                        break;
                }

            });
        },

        setupEvents: function () {
            var _this = this;
            this.$listContainer.off('click').on('click', 'li', function (evt) {
                var $this = $(this);
                if ($this.hasClass(_this.options.disabledClass) || $this.hasClass(_this.options.activeClass)) {
                    return false;
                }
                // Prevent click event if href is not set.
                !_this.options.href && evt.preventDefault();
                _this.show(parseInt($this.data('page')), true);
            });
        },

        changeTotalPages: function(total, start, length) {
            this.totalPages = Math.ceil(total / length)
            this.currentPage = Math.ceil(start / length) + 1;
    
            // return this.show(this.currentPage);
            return this.onlyShow(this.currentPage);
        },

        makeHref: function (page) {
            return this.options.href ? this.generateQueryString(page) : "#";
        },

        makeText: function (text, page) {
            return text.replace(this.options.pageVariable, page)
                .replace(this.totalPagesVariable, this.totalPages)
        },

        getPageFromQueryString: function (searchStr) {
            var search = this.getSearchString(searchStr),
                regex = new RegExp(this.options.pageVariable + '(=([^&#]*)|&|#|$)'),
                page = regex.exec(search);
            if (!page || !page[2]) {
                return null;
            }
            page = decodeURIComponent(page[2]);
            page = parseInt(page);
            if (isNaN(page)) {
                return null;
            }
            return page;
        },

        generateQueryString: function (pageNumber, searchStr) {
            var search = this.getSearchString(searchStr),
                regex = new RegExp(this.options.pageVariable + '=*[^&#]*');
            if (!search) return '';
            return '?' + search.replace(regex, this.options.pageVariable + '=' + pageNumber);
        },

        getSearchString: function (searchStr) {
            var search = searchStr || window.location.search;
            if (search === '') {
                return null;
            }
            if (search.indexOf('?') === 0) search = search.substr(1);
            return search;
        },

        getCurrentPage: function () {
            return this.currentPage;
        },

        getTotalPages: function () {
            return this.totalPages;
        }
    };

    // PLUGIN DEFINITION

    $.fn.twbsPagination = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('twbs-pagination');
        var options = typeof option === 'object' ? option : {};

        if (!data) $this.data('twbs-pagination', (data = new TwbsPagination(this, options) ));
        if (typeof option === 'string') methodReturn = data[ option ].apply(data, args);

        return ( methodReturn === undefined ) ? $this : methodReturn;
    };

    $.fn.twbsPagination.defaults = {
        start: 0,
        length: 10,
        total: 0,
        visiblePages: 5,
        initiateStartPageClick: false,
        hideOnlyOnePage: false,
        href: false,
        pageVariable: '{{page}}',
        totalPagesVariable: '{{total_pages}}',
        page: null,
        first: '',
        prev: '이전',
        next: '다음',
        last: '',
        loop: false,
        beforePageClick: null,
        onPageClick: null,
        paginationClass: 'pagination',
        nextClass: 'page-next',
        prevClass: 'page-prev',
        lastClass: 'page-last',
        firstClass: 'page-first',
        pageClass: '',
        activeClass: 'active',
        disabledClass: 'disabled',
        anchorClass: 'page-link'
    };

    $.fn.twbsPagination.Constructor = TwbsPagination;

    $.fn.twbsPagination.noConflict = function () {
        $.fn.twbsPagination = old;
        return this;
    };

    $.fn.twbsPagination.version = "1.4.2";

})(window.jQuery, window, document);
