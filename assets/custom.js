$(document).ready(function() {
    const allDocsAccordian = document.querySelectorAll('.docs-accordion');

    // first time page load
    $("#docContent").load('./documentation/elements/close.html');

    $(".docs-accordion").click(function(e) {
        let page = '';
        const elementId = e.target && e.target.id;

        if (!!elementId && elementId) removeClass();

        if (elementId === 'accordion-elements') {
            page = 'elements/typography';
            addClass('accordion-typography');
        } else if (elementId === 'accordion-layouts') {
            page = 'layouts/flexbox';
            addClass('accordion-flexbox');
        } else if (elementId === 'accordion-components') {
            page = 'components/accordions';
            addClass('accordion-accordions');
        } else if (elementId === 'accordion-utilities') {
            page = 'utilities/borders';
            addClass('accordion-borders');
        } else {
            e.target.classList.add('active');
            page = e.target.dataset && e.target.dataset['page'] || '';
        }

        if (!!page) $("#docContent").load('./documentation/' + page + '.html');
    });

    addClass = function(id) {
        document.querySelector('#' + id).classList.add('active');
    }

    removeClass = function() {
        allDocsAccordian.forEach((_accordian) => {
            const element = $(_accordian).find('a') || [];
            if (element && element.length) element[0].classList.remove('active');
        });
    }

});