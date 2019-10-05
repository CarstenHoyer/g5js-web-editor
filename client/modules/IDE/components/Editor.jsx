import PropTypes from 'prop-types';
import React from 'react';
import CodeMirror from 'codemirror';
import beautifyJS from 'js-beautify';
import 'codemirror/mode/css/css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/css-lint';
import 'codemirror/addon/lint/html-lint';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/edit/matchbrackets';

import { JSHINT } from 'jshint';
import { CSSLint } from 'csslint';
import { HTMLHint } from 'htmlhint';
import InlineSVG from 'react-inlinesvg';
import classNames from 'classnames';
import { debounce } from 'lodash';
import '../../../utils/htmlmixed';
import '../../../utils/p5-javascript';
import '../../../utils/webGL-clike';
import Timer from './Timer';
import EditorAccessibility from './EditorAccessibility';
import { metaKey, } from '../../../utils/metaKey';

import search from '../../../utils/codemirror-search';

search(CodeMirror);

const beautifyCSS = beautifyJS.css;
const beautifyHTML = beautifyJS.html;

window.JSHINT = JSHINT;
window.CSSLint = CSSLint;
window.HTMLHint = HTMLHint;

const beepUrl = require('../../../sounds/audioAlert.mp3');
const unsavedChangesDotUrl = require('../../../images/unsaved-changes-dot.svg');
const rightArrowUrl = require('../../../images/right-arrow.svg');
const leftArrowUrl = require('../../../images/left-arrow.svg');

const IS_TAB_INDENT = false;
const INDENTATION_AMOUNT = 2;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.tidyCode = this.tidyCode.bind(this);

    this.updateLintingMessageAccessibility = debounce((annotations) => {
      props.clearLintMessage();
      annotations.forEach((x) => {
        if (x.from.line > -1) {
          props.updateLintMessage(x.severity, (x.from.line + 1), x.message);
        }
      });
      if (props.lintMessages.length > 0 && props.lintWarning) {
        this.beep.play();
      }
    }, 2000);
    this.showFind = this.showFind.bind(this);
    this.findNext = this.findNext.bind(this);
    this.findPrev = this.findPrev.bind(this);
    this.getContent = this.getContent.bind(this);
  }

  componentDidMount() {
    const {
      theme,
      lineNumbers,
      linewrap,
      hideRuntimeErrorWarning,
      files,
      file,
      setUnsavedChanges,
      updateFileContent,
      clearConsole,
      startRefreshSketch,
      fontSize,
      provideController
    } = this.props

    this.beep = new Audio(beepUrl);
    this.widgets = [];
    this._cm = CodeMirror(this.codemirrorContainer, { // eslint-disable-line
      theme: `p5-${theme}`,
      lineNumbers,
      styleActiveLine: true,
      inputStyle: 'contenteditable',
      lineWrapping: linewrap,
      fixedGutter: false,
      foldGutter: true,
      foldOptions: { widget: '\u2026' },
      gutters: ['CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      keyMap: 'sublime',
      highlightSelectionMatches: true, // highlight current search match
      // styleSelectedText: true,
      matchBrackets: true,
      lint: {
        onUpdateLinting: ((annotations) => {
          hideRuntimeErrorWarning();
          this.updateLintingMessageAccessibility(annotations);
        }),
        options: {
          'asi': true,
          'eqeqeq': false,
          '-W041': false,
          'esversion': 7
        }
      }
    });

    delete this._cm.options.lint.options.errors;

    this._cm.setOption('extraKeys', {
      Tab: (cm) => cm.replaceSelection(' '.repeat(INDENTATION_AMOUNT)),
      [`${metaKey}-Enter`]: () => null,
      [`Shift-${metaKey}-Enter`]: () => null,
      [`${metaKey}-F`]: 'findPersistent',
      [`${metaKey}-G`]: 'findNext',
      [`Shift-${metaKey}-G`]: 'findPrev',
    });

    this.initializeDocuments(files);
    this._cm.swapDoc(this._docs[file.id]);

    this._cm.on('change', debounce(() => {
      const {
        autorefresh,
        isPlaying,
      } = this.props
      setUnsavedChanges(true);
      updateFileContent(file.id, this._cm.getValue());
      if (autorefresh && isPlaying) {
        clearConsole();
        startRefreshSketch();
      }
    }, 400));

    this._cm.on('keyup', () => {
      const temp = `line ${parseInt((this._cm.getCursor().line) + 1, 10)}`;
      document.getElementById('current-line').innerHTML = temp;
    });

    this._cm.on('keydown', (_cm, e) => {
      // 9 === Tab
      if (e.keyCode === 9 && e.shiftKey) {
        this.tidyCode();
      }
    });

    this._cm.getWrapperElement().style['font-size'] = `${fontSize}px`;

    provideController({
      tidyCode: this.tidyCode,
      showFind: this.showFind,
      findNext: this.findNext,
      findPrev: this.findPrev,
      getContent: this.getContent
    });
  }

  componentWillUpdate(nextProps) {
    const { files } = this.props
    // check if files have changed
    if (files[0].id !== nextProps.files[0].id) {
      // then need to make CodeMirror documents
      this.initializeDocuments(nextProps.files);
    }
    if (files.length !== nextProps.files.length) {
      this.initializeDocuments(nextProps.files);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      file,
      setUnsavedChanges,
      fontSize,
      linewrap,
      theme,
      lineNumbers,
      consoleEvents,
      showRuntimeErrorWarning,
      runtimeErrorWarningVisible
    } = this.props
    if (file.content !== prevProps.file.content && file.content !== this._cm.getValue()) {
      const oldDoc = this._cm.swapDoc(this._docs[file.id]);
      this._docs[prevProps.file.id] = oldDoc;
      this._cm.focus();
      if (!prevProps.unsavedChanges) {
        setTimeout(() => setUnsavedChanges(false), 400);
      }
    }
    if (fontSize !== prevProps.fontSize) {
      this._cm.getWrapperElement().style['font-size'] = `${fontSize}px`;
    }
    if (linewrap !== prevProps.linewrap) {
      this._cm.setOption('lineWrapping', linewrap);
    }
    if (theme !== prevProps.theme) {
      this._cm.setOption('theme', `p5-${theme}`);
    }
    if (lineNumbers !== prevProps.lineNumbers) {
      this._cm.setOption('lineNumbers', lineNumbers);
    }

    if (prevProps.consoleEvents !== consoleEvents) {
      showRuntimeErrorWarning();
    }
    for (let i = 0; i < this._cm.lineCount(); i += 1) {
      this._cm.removeLineClass(i, 'background', 'line-runtime-error');
    }
    if (runtimeErrorWarningVisible) {
      consoleEvents.forEach((consoleEvent) => {
        if (consoleEvent.method === 'error') {
          if (consoleEvent.data
            && consoleEvent.data[0]
            && consoleEvent.data[0].indexOf
            && consoleEvent.data[0].indexOf(')') > -1) {
            const n = consoleEvent.data[0].replace(')', '').split(' ');
            const lineNumber = parseInt(n[n.length - 1], 10) - 1;
            const { source } = consoleEvent;
            const fileName = file.name;
            const errorFromJavaScriptFile = (`${source}.js` === fileName);
            const errorFromIndexHTML = ((source === fileName) && (fileName === 'index.html'));
            if (!Number.isNaN(lineNumber) && (errorFromJavaScriptFile || errorFromIndexHTML)) {
              this._cm.addLineClass(lineNumber, 'background', 'line-runtime-error');
            }
          }
        }
      });
    }
  }

  componentWillUnmount() {
    const { provideController } = this.props
    this._cm = null;
    provideController(null);
  }

  getFileMode(fileName) {
    let mode;
    if (fileName.match(/.+\.js$/i)) {
      mode = 'javascript';
    } else if (fileName.match(/.+\.css$/i)) {
      mode = 'css';
    } else if (fileName.match(/.+\.html$/i)) {
      mode = 'htmlmixed';
    } else if (fileName.match(/.+\.json$/i)) {
      mode = 'application/json';
    } else if (fileName.match(/.+\.(frag|vert)$/i)) {
      mode = 'clike';
    } else {
      mode = 'text/plain';
    }
    return mode;
  }

  getContent() {
    const { file } = this.props
    const content = this._cm.getValue();
    const updatedFile = { ...file, content };
    return updatedFile;
  }

  findPrev() {
    this._cm.focus();
    this._cm.execCommand('findPrev');
  }

  findNext() {
    this._cm.focus();
    this._cm.execCommand('findNext');
  }

  showFind() {
    this._cm.execCommand('findPersistent');
  }

  tidyCode() {
    const beautifyOptions = {
      indent_size: INDENTATION_AMOUNT,
      indent_with_tabs: IS_TAB_INDENT
    };

    const mode = this._cm.getOption('mode');
    if (mode === 'javascript') {
      this._cm.doc.setValue(beautifyJS(this._cm.doc.getValue(), beautifyOptions));
    } else if (mode === 'css') {
      this._cm.doc.setValue(beautifyCSS(this._cm.doc.getValue(), beautifyOptions));
    } else if (mode === 'htmlmixed') {
      this._cm.doc.setValue(beautifyHTML(this._cm.doc.getValue(), beautifyOptions));
    }
  }

  initializeDocuments(files) {
    this._docs = {};
    files.forEach((file) => {
      if (file.name !== 'root') {
        this._docs[file.id] = CodeMirror.Doc(file.content, this.getFileMode(file.name)) // eslint-disable-line
      }
    });
  }

  toggleEditorOptions() {
    const { editorOptionsVisible, closeEditorOptions, showEditorOptions } = this.props
    if (editorOptionsVisible) {
      closeEditorOptions();
    } else {
      this.optionsButton.focus();
      showEditorOptions();
    }
  }

  render() {
    const {
      isExpanded,
      editorOptionsVisible,
      file,
      collapseSidebar,
      expandSidebar,
      unsavedChanges,
      projectSavedTime,
      isUserOwner,
      lintMessages
    } = this.props
    const editorSectionClass = classNames({
      'editor': true,
      'sidebar--contracted': !isExpanded,
      'editor--options': editorOptionsVisible
    });

    const editorHolderClass = classNames({
      'editor-holder': true,
      'editor-holder--hidden': file.fileType === 'folder' || file.url
    });

    return (
      <section
        title="code editor"
        role="main"
        className={editorSectionClass}
      >
        <header className="editor__header">
          <button
            type="button"
            aria-label="collapse file navigation"
            className="sidebar__contract"
            onClick={collapseSidebar}
          >
            <InlineSVG src={leftArrowUrl} />
          </button>
          <button
            type="button"
            aria-label="expand file navigation"
            className="sidebar__expand"
            onClick={expandSidebar}
          >
            <InlineSVG src={rightArrowUrl} />
          </button>
          <div className="editor__file-name">
            <span>
              {file.name}
              {unsavedChanges ? <InlineSVG src={unsavedChangesDotUrl} /> : null}
            </span>
            <Timer
              projectSavedTime={projectSavedTime}
              isUserOwner={isUserOwner}
            />
          </div>
        </header>
        <div ref={(element) => { this.codemirrorContainer = element; }} className={editorHolderClass}>
        </div>
        <EditorAccessibility
          lintMessages={lintMessages}
        />
      </section>
    );
  }
}

Editor.propTypes = {
  lineNumbers: PropTypes.bool.isRequired,
  lintWarning: PropTypes.bool.isRequired,
  linewrap: PropTypes.bool.isRequired,
  lintMessages: PropTypes.arrayOf(PropTypes.shape({
    severity: PropTypes.string.isRequired,
    line: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  })).isRequired,
  consoleEvents: PropTypes.arrayOf(PropTypes.shape({
    method: PropTypes.string.isRequired,
    args: PropTypes.arrayOf(PropTypes.string)
  })),
  updateLintMessage: PropTypes.func.isRequired,
  clearLintMessage: PropTypes.func.isRequired,
  updateFileContent: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
    url: PropTypes.string
  }).isRequired,
  editorOptionsVisible: PropTypes.bool.isRequired,
  showEditorOptions: PropTypes.func.isRequired,
  closeEditorOptions: PropTypes.func.isRequired,
  setUnsavedChanges: PropTypes.func.isRequired,
  startRefreshSketch: PropTypes.func.isRequired,
  autorefresh: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
  projectSavedTime: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  collapseSidebar: PropTypes.func.isRequired,
  expandSidebar: PropTypes.func.isRequired,
  isUserOwner: PropTypes.bool,
  clearConsole: PropTypes.func.isRequired,
  showRuntimeErrorWarning: PropTypes.func.isRequired,
  hideRuntimeErrorWarning: PropTypes.func.isRequired,
  runtimeErrorWarningVisible: PropTypes.bool.isRequired,
  provideController: PropTypes.func.isRequired
};

Editor.defaultProps = {
  isUserOwner: false,
  consoleEvents: [],
};

export default Editor;
