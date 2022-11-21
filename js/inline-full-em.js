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
    $(fullscreenize);
}

//#endregion

//#region Fullscreen Toggle

function fullscreenize() {
    for (const target in config.targets) {
        const this_target = config.targets[target];
        try {
            log('Processing "' + target + '":', this_target);
            if (this_target.inline) {
                const $container = $('#fileupload-container-' + target);
                // Find viewer
                const $viewer = $container.find('object, iframe').first();
                if ($viewer.length < 1) continue;
                $viewer.addClass('inline-full-viewer');
                $viewer.css('height', '').css('max-width', '');
                const $wrapper = $('<div class="inline-full-wrapper"></div>');
                this_target.$controls = $('<div class="inline-fullscreen-controls"></div>').on('click', function(e) {
                    e.preventDefault();
                    const action = $(e.target).attr('data-inline-fullscreen-action') ?? $(e.target).parent('button').first().attr('data-inline-fullscreen-action');
                    if (action == 'go-max') {
                        this_target.$wrapper.addClass('inline-full-fullscreen');
                        this_target.$controls.css('background-color', $('body').css('background-color'));
                        $('body').addClass('inline-full-body');
                    }
                    else if (action == 'end-max') {
                        this_target.$wrapper.removeClass('inline-full-fullscreen');
                        this_target.$controls.css('background-color', 'transparent');
                        $('body').removeClass('inline-full-body');
                    }
                });
                this_target.$controls.append('<button data-rc-attrs="title=global_168" title="' + window['lang'].global_168 + '" class="btn btn-light btn-xs" data-inline-fullscreen-action="go-max"><i class="fas fa-expand"></i></button>');
                this_target.$controls.append('<button data-rc-attrs="title=global_167" title="' + window['lang'].global_167 + '" class="btn btn-light btn-xs" data-inline-fullscreen-action="end-max"><i class="fas fa-compress"></i></i></button>');

                $viewer.wrap($wrapper);
                this_target.$wrapper = $container.find('.inline-full-wrapper');
                this_target.$wrapper.prepend(this_target.$controls);
                
            }
            else {

            }
        }
        catch (err) {
            error(err);
        }
    }
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