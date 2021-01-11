import $ from 'jquery';
import Pages from './module/Pages';

$.summernote = $.extend(true, $.summernote, {
  options: {
    modules: {
      'pages': Pages,
    },
    // toolbar
    pages: {
      orientation: {
        icon: 'Orientation&nbsp;<span class="caret"></span>',
        menu: [
          'Portrait',
          'Landscape',
        ],
      }
    },
    toolbar: [
      ...$.summernote.options.toolbar,
      ['pages', ['orientation', 'test']],
    ],
    blockquoteBreakingLevel:0,
    keyMap: {
      pc: {
        'CTRL+ENTER': 'pages.insertPageBreak',
      },
      mac: {
        'CMD+ENTER': 'pages.insertPageBreak',
      },
    },
    lang: {
      'en-US': {
        pages: {
          orientation: {
            icon: 'Orientation&nbsp;<span class="caret"></span>',
            menu: [
              'Portrait',
              'Landscape',
            ]
          },
        },
      },
    },
  },
});
