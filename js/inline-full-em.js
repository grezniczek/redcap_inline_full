// Inline Full EM
// @ts-check
;(function() {

//#region Variables and Initialization

const APP_NAME = 'Inline Fulls';

if (typeof window['REDCap'] == 'undefined') {
    window['REDCap'] = {
        EM: {}
    };
}
if (typeof window['REDCap']['EM'] == 'undefined') {
    window['REDCap']['EM'] = {
        RUB: {}
    };
}
if (typeof window['REDCap']['EM']['RUB'] == 'undefined') {
    window['REDCap']['EM']['RUB'] = {};
}
window['REDCap']['EM']['RUB']['InlineFull'] = {
    init: init,
};

let config;

function init(data) {
    config = data;
    log(config);
    $(function() {
        setup();
        setupPiped();
    });
}

//#endregion

//#region Setup fullscreen capabilites

function setup() {
    for (const target in config.targets) {
        const this_target = config.targets[target];
        try {
            log('Processing "' + target + '":', this_target);
            if (this_target.type == 'file') {
                const $container = $('#fileupload-container-' + target);
                // Watch for changes
                const $input = $container.parents('td.data').find('input[name="' + target + '"]');
                $input.on('change', function() {
                    const $container = $('#fileupload-container-' + target);
                    const currentVal = $input.val();
                    // Reset any pipe receivers
                    $('.piperec-'+window['event_id']+'-'+target+'-link, .piperec-'+window['event_id']+'-'+target+'-inline').each(function() {
                        $(this).siblings('.inline-full-wrapper').remove();
                    });
                    if (currentVal == '') {
                        log('Removing @INLINE-FULL from "' + target + '".')
                        $container.find('.inline-full-wrapper, [data-inline-full-action]').remove();
                        $container.find('a.filedownloadlink').unwrap();
                    }
                    else if ($container.find('.inline-full-wrapper').length == 0) {
                        setTimeout(function() {
                            addWrapper($container, true);
                            setupPiped(target);
                        }, 200);
                    }
                    else {
                        // Update any pipings
                        setTimeout(function() {
                            setupPiped(target);
                        }, 200);
                    }
                })
                // Add controls
                if (this_target.inline) {
                    addWrapper($container, true);
                }
                else {
                    addViewer($container, target, 'file');
                }
            }
            else if (this_target.type == 'descriptive') {
                const $container = $('tr[sq_id="' + target + '"] div.div_attach');
                addViewer($container, target, 'descriptive');
            }
        }
        catch (err) {
            error(err);
        }
    }
}

function setupPiped(source = '') {
    const inlineContainers = [];
    const linkContainers = [];
    const piperecs = [];
    if (source == '') {
        for (const target in config.targets) {
            const $pipingReceivers = $('[data-mlm-field="' + target + '"] span.piping_receiver');
            $pipingReceivers.each(function() {
                piperecs.push(this);
            });
        }
    }
    else {
        $('.piperec-'+window['event_id']+'-'+source+'-link, .piperec-'+window['event_id']+'-'+source+'-inline').each(function() {
            piperecs.push(this);
        });
    }
    for (const piperec of piperecs) {
        const $piprec = $(piperec);
        piperec.classList.forEach(function(v, k, p) {
            if (v.endsWith('-inline')) {
                inlineContainers.push($piprec);
                return;
            }
            else if (v.endsWith('-link')) {
                linkContainers.push($piprec);
                return;
            }
        });
    }
    for (const $container of inlineContainers) {
        addWrapper($container, false);
    }
    for (const $container of linkContainers) {
        addViewer($container);
    }
}

/**
 * 
 * @param {JQuery<HTMLElement>} $container 
 * @param {string} fuField
 * @param {string} type
 */
function addViewer($container, fuField = '', type = 'file') {
    const href = $container.find('a').attr('href')?.replace('file_download.php', 'image_view.php');
    const fileName = ((fuField == '' || type == 'descriptive') ? $container.find('a').text() ?? '' : $container.find('.fu-fn').text() ?? '').toString();
    const fileExt = (fileName.split('.').pop() ?? '').toLowerCase();
    const $viewer = $('<div class="inline-full-wrapper inline-full-viewer"></div>');
    const $controls = $('<div class="inline-full-controls"></div>');
    const $btnGoMax = $('<button data-rc-attrs="title=global_168" title="' + window['lang'].global_168 + '" class="btn btn-light btn-xs inline' + (type == 'file' ? ' ml-2' : '') + '" data-inline-full-action="go-max"><i class="far fa-eye"></i></button>');
    $btnGoMax.on('click', function(e) {
        e.preventDefault();
        $viewer.addClass('inline-full-fullscreen');
        $controls.css('background-color', $('body').css('background-color'));
        $viewer.css('background-color', $('body').css('background-color'));
        $('body').addClass('inline-full-body');
        $controls.show();
        $controls.find('button[data-inline-full-action="end-max"]').trigger('focus');
    });
    const $btnEndMax = $('<button data-rc-attrs="title=global_167" title="' + window['lang'].global_167 + '" class="btn btn-light btn-xs" data-inline-full-action="end-max"><i class="far fa-eye-slash"></i></button>');
    $btnEndMax.on('click', function(e) {
        e.preventDefault();
        $viewer.removeClass('inline-full-fullscreen');
        $controls.css('background-color', 'transparent');
        $viewer.css('background-color', 'transparent');
        $('body').removeClass('inline-full-body');
    });
    if (config.isSurvey) {
        $controls.append('<span class="inline-powered-by">Powered by <b>REDCap</b></span>');
    }
    else {
        $controls.append($('#project-menu-logo img').clone().css('height','2.3em'));
    }
    $controls.append($btnEndMax);
    const $wrapper = $('<div class="inline-full-linkwrapper"></div>');
    if (fuField == '') {
        $wrapper.addClass('left');
    }
    if (type == 'file') {
        $container.find(fuField == '' ? 'a' : 'a.filedownloadlink').wrap($wrapper);
        $container.find('.inline-full-linkwrapper').append($btnGoMax);
    }
    else {
        $container.append($btnGoMax);
    }
    $viewer.append($controls);
    if (fileExt == 'pdf') {
        $viewer.append($('<object data="' + href + '" type="application/pdf" class="inline-full-pdf"></object>'));
    }
    else if (['bmp','gif','jpg','jpeg','jfif','pjpeg','pjp','png','svg','tif','tiff','webp'].includes(fileExt)) {
        $viewer.append($('<img src="' + href + '" class="inline-full-img">'));
    }
    $container.after($viewer);
}

/**
 * 
 * @param {JQuery<HTMLElement>} $container 
 * @param {boolean} goMaxAfterLink 
 * @returns 
 */
function addWrapper($container, goMaxAfterLink) {
    const $viewer = $container.find('object, img').first();
    if ($viewer.length < 1) return;
    const isImage = $viewer.is('img');
    if (isImage) {
        $viewer.addClass('inline-full-img');
        $viewer.attr('data-inline-full-maxwidth', $viewer.css('max-width'));
    }
    else {
        $viewer.addClass('inline-full-pdf');
        $viewer.css('height', '').css('max-width', '');
    }
    let $wrapper = $('<div class="inline-full-wrapper"></div>');
    const $controls = $('<div class="inline-full-controls"></div>');
    const $btnGoMax = $('<button data-rc-attrs="title=global_168" title="' + window['lang'].global_168 + '" class="btn btn-light btn-xs" data-inline-full-action="go-max"><i class="fas fa-expand"></i></button>');
    $btnGoMax.on('click', function(e) {
        e.preventDefault();
        $wrapper.addClass('inline-full-fullscreen');
        $controls.css('background-color', $('body').css('background-color'));
        $wrapper.css('background-color', $('body').css('background-color'));
        if (isImage) {
            $viewer.css('max-width','100%');
        }
        $('body').addClass('inline-full-body');
        $controls.show();
        $controls.find('button[data-inline-full-action="end-max"]').trigger('focus');
    });
    const $btnEndMax = $('<button data-rc-attrs="title=global_167" title="' + window['lang'].global_167 + '" class="btn btn-light btn-xs" data-inline-full-action="end-max"><i class="fas fa-compress"></i></i></button>');
    $btnEndMax.on('click', function(e) {
        e.preventDefault();
        $wrapper.removeClass('inline-full-fullscreen');
        $controls.css('background-color', 'transparent');
        $wrapper.css('background-color', 'transparent');
        if (isImage) {
            $viewer.css('max-width', $viewer.attr('data-inline-full-maxwidth') ?? '');
        }
        $('body').removeClass('inline-full-body');
        if (goMaxAfterLink) {
            $controls.hide();
        }
    });
    if (goMaxAfterLink) {
        $controls.hide();
        $btnGoMax.addClass('inline');
        $container.find('a.filedownloadlink').wrap('<div class="inline-full-linkwrapper"></div>');
        $container.find('.inline-full-linkwrapper').append($btnGoMax);
    }
    else {
        $controls.append($btnGoMax);
    }
    $controls.append($btnEndMax);
    $viewer.wrap($wrapper);
    $wrapper = $container.find('.inline-full-wrapper');
    $wrapper.prepend($controls);
}

//#endregion

//#region Debug Logging
/**
 * Logs a message to the console when in debug mode
 */
function log() {
    if (!config.debug) return;
    let ln = '??';
    try {
        const line = ((new Error).stack ?? '').split('\n')[2];
        const parts = line.split(':');
        ln = parts[parts.length - 2];
    }
    catch { }
    log_print(ln, 'log', arguments);
}
/**
 * Logs a warning to the console when in debug mode
 */
function warn() {
    if (!config.debug) return;
    let ln = '??';
    try {
        const line = ((new Error).stack ?? '').split('\n')[2];
        const parts = line.split(':');
        ln = parts[parts.length - 2];
    }
    catch { }
    log_print(ln, 'warn', arguments);
}
/**
 * Logs an error to the console when in debug mode
 */
function error() {
    let ln = '??';
    try {
        const line = ((new Error).stack ?? '').split('\n')[2];
        const parts = line.split(':');
        ln = parts[parts.length - 2];
    }
    catch { }
    log_print(ln, 'error', arguments);
}
/**
 * Prints to the console
 * @param {string} ln Line number where log was called from
 * @param {'log'|'warn'|'error'} mode 
 * @param {IArguments} args 
 */
function log_print(ln, mode, args) {
    const prompt = APP_NAME + ' [' + ln + ']';
    switch(args.length) {
        case 1: 
            console[mode](prompt, args[0]);
            break;
        case 2: 
            console[mode](prompt, args[0], args[1]);
            break;
        case 3: 
            console[mode](prompt, args[0], args[1], args[2]);
            break;
        case 4: 
            console[mode](prompt, args[0], args[1], args[2], args[3]);
            break;
        case 5: 
            console[mode](prompt, args[0], args[1], args[2], args[3], args[4]);
            break;
        case 6: 
            console[mode](prompt, args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        default: 
            console[mode](prompt, args);
            break;
    }
}
//#endregion

})();