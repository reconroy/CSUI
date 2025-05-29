import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Default Monaco Editor Settings
const DEFAULT_EDITOR_SETTINGS = {
  // Basic Settings
  fontSize: 14,
  fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'SF Mono', Monaco, Menlo, 'Ubuntu Mono', monospace",
  fontWeight: 'normal',
  lineHeight: 1.5,
  letterSpacing: 0,
  
  // Theme and Appearance
  theme: 'vs-dark',
  colorTheme: 'codespace-dark', // Custom theme
  
  // Line Numbers
  lineNumbers: 'on', // 'on' | 'off' | 'relative' | 'interval'
  lineNumbersMinChars: 3,
  
  // Indentation
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,
  trimAutoWhitespace: true,
  
  // Word Wrapping
  wordWrap: 'on', // 'off' | 'on' | 'wordWrapColumn' | 'bounded'
  wordWrapColumn: 80,
  wordWrapMinified: true,
  wrappingIndent: 'indent', // 'none' | 'same' | 'indent' | 'deepIndent'
  
  // Scrolling
  scrollBeyondLastLine: false,
  scrollBeyondLastColumn: 5,
  smoothScrolling: true,
  mouseWheelScrollSensitivity: 1,
  fastScrollSensitivity: 5,
  
  // Cursor
  cursorStyle: 'line', // 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin'
  cursorWidth: 2,
  cursorBlinking: 'smooth', // 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
  cursorSmoothCaretAnimation: true,
  
  // Selection
  selectOnLineNumbers: true,
  selectionHighlight: true,
  occurrencesHighlight: true,
  renderLineHighlight: 'all', // 'none' | 'gutter' | 'line' | 'all'
  renderLineHighlightOnlyWhenFocus: false,
  
  // Minimap
  minimapEnabled: true,
  minimapSide: 'right', // 'left' | 'right'
  minimapSize: 'proportional', // 'proportional' | 'fill' | 'fit'
  minimapShowSlider: 'mouseover', // 'always' | 'mouseover'
  minimapRenderCharacters: true,
  minimapMaxColumn: 120,
  
  // Code Folding
  folding: true,
  foldingStrategy: 'indentation', // 'auto' | 'indentation'
  foldingHighlight: true,
  unfoldOnClickAfterEndOfLine: false,
  showFoldingControls: 'always', // 'always' | 'mouseover'
  
  // Suggestions and IntelliSense
  quickSuggestions: true,
  quickSuggestionsDelay: 10,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on', // 'on' | 'smart' | 'off'
  acceptSuggestionOnCommitCharacter: true,
  snippetSuggestions: 'top', // 'top' | 'bottom' | 'inline' | 'none'
  wordBasedSuggestions: true,
  suggestSelection: 'first', // 'first' | 'recentlyUsed' | 'recentlyUsedByPrefix'
  
  // Bracket Matching
  matchBrackets: 'always', // 'never' | 'near' | 'always'
  bracketPairColorization: true,
  guides: {
    bracketPairs: true,
    bracketPairsHorizontal: true,
    highlightActiveBracketPair: true,
    indentation: true,
    highlightActiveIndentation: true
  },
  
  // Auto-completion and Formatting
  autoIndent: 'full', // 'none' | 'keep' | 'brackets' | 'advanced' | 'full'
  formatOnType: true,
  formatOnPaste: true,
  autoClosingBrackets: 'always', // 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'
  autoClosingQuotes: 'always', // 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'
  autoSurround: 'languageDefined', // 'languageDefined' | 'quotes' | 'brackets' | 'never'
  
  // Find and Replace
  find: {
    seedSearchStringFromSelection: 'always', // 'never' | 'always' | 'selection'
    autoFindInSelection: 'never', // 'never' | 'always' | 'multiline'
    addExtraSpaceOnTop: true,
    loop: true
  },
  
  // Whitespace and Rendering
  renderWhitespace: 'selection', // 'none' | 'boundary' | 'selection' | 'trailing' | 'all'
  renderControlCharacters: false,
  renderIndentGuides: true,
  highlightActiveIndentGuide: true,
  renderValidationDecorations: 'editable', // 'editable' | 'on' | 'off'
  
  // Performance
  stopRenderingLineAfter: 10000,
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  
  // Accessibility
  accessibilitySupport: 'auto', // 'auto' | 'off' | 'on'
  accessibilityPageSize: 10,
  
  // Advanced
  contextmenu: true,
  mouseStyle: 'text', // 'text' | 'default' | 'copy'
  multiCursorModifier: 'alt', // 'ctrlCmd' | 'alt'
  multiCursorMergeOverlapping: true,
  multiCursorPaste: 'spread', // 'spread' | 'full'
  columnSelection: false,
  copyWithSyntaxHighlighting: true,
  useTabStops: true,
  emptySelectionClipboard: true,
  
  // Editor Layout
  automaticLayout: true,
  glyphMargin: true,
  lineDecorationsWidth: 10,
  lineNumbersWidth: 50,
  overviewRulerBorder: true,
  overviewRulerLanes: 3,
  hideCursorInOverviewRuler: false,
  
  // Hover
  hover: {
    enabled: true,
    delay: 300,
    sticky: true
  },
  
  // Parameter Hints
  parameterHints: {
    enabled: true,
    cycle: false
  },
  
  // Code Lens
  codeLens: true,
  codeLensFontFamily: '',
  codeLensFontSize: 12,
  
  // Links
  links: true,
  
  // Comments
  comments: {
    insertSpace: true,
    ignoreEmptyLines: true
  }
}

const useEditorSettingsStore = create(
  persist(
    (set, get) => ({
      // Current editor settings
      settings: { ...DEFAULT_EDITOR_SETTINGS },
      
      // Actions
      updateSetting: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          [key]: value
        }
      })),
      
      updateNestedSetting: (parentKey, childKey, value) => set((state) => ({
        settings: {
          ...state.settings,
          [parentKey]: {
            ...state.settings[parentKey],
            [childKey]: value
          }
        }
      })),
      
      updateMultipleSettings: (newSettings) => set((state) => ({
        settings: {
          ...state.settings,
          ...newSettings
        }
      })),
      
      resetToDefaults: () => set({
        settings: { ...DEFAULT_EDITOR_SETTINGS }
      }),
      
      resetCategory: (category) => {
        const categoryDefaults = getCategoryDefaults(category)
        set((state) => ({
          settings: {
            ...state.settings,
            ...categoryDefaults
          }
        }))
      },
      
      // Get settings for Monaco Editor
      getMonacoOptions: () => {
        const state = get()
        return convertToMonacoOptions(state.settings)
      },
      
      // Get settings for API (to save to database)
      getSettingsForAPI: () => {
        const state = get()
        return state.settings
      },
      
      // Load settings from API (from database)
      loadSettingsFromAPI: (apiSettings) => set({
        settings: {
          ...DEFAULT_EDITOR_SETTINGS,
          ...apiSettings
        }
      }),
      
      // Get default settings
      getDefaults: () => ({ ...DEFAULT_EDITOR_SETTINGS })
    }),
    {
      name: 'editor-settings-storage',
      partialize: (state) => ({
        settings: state.settings
      })
    }
  )
)

// Helper function to get category defaults
const getCategoryDefaults = (category) => {
  const defaults = { ...DEFAULT_EDITOR_SETTINGS }
  
  switch (category) {
    case 'appearance':
      return {
        fontSize: defaults.fontSize,
        fontFamily: defaults.fontFamily,
        fontWeight: defaults.fontWeight,
        lineHeight: defaults.lineHeight,
        letterSpacing: defaults.letterSpacing,
        theme: defaults.theme,
        colorTheme: defaults.colorTheme
      }
    case 'editor':
      return {
        lineNumbers: defaults.lineNumbers,
        tabSize: defaults.tabSize,
        insertSpaces: defaults.insertSpaces,
        wordWrap: defaults.wordWrap,
        cursorStyle: defaults.cursorStyle,
        cursorBlinking: defaults.cursorBlinking
      }
    case 'features':
      return {
        minimapEnabled: defaults.minimapEnabled,
        folding: defaults.folding,
        quickSuggestions: defaults.quickSuggestions,
        bracketPairColorization: defaults.bracketPairColorization
      }
    default:
      return {}
  }
}

// Helper function to convert settings to Monaco Editor options
const convertToMonacoOptions = (settings) => {
  return {
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    fontWeight: settings.fontWeight,
    lineHeight: settings.lineHeight,
    letterSpacing: settings.letterSpacing,
    theme: settings.colorTheme,
    lineNumbers: settings.lineNumbers,
    lineNumbersMinChars: settings.lineNumbersMinChars,
    tabSize: settings.tabSize,
    insertSpaces: settings.insertSpaces,
    detectIndentation: settings.detectIndentation,
    trimAutoWhitespace: settings.trimAutoWhitespace,
    wordWrap: settings.wordWrap,
    wordWrapColumn: settings.wordWrapColumn,
    wordWrapMinified: settings.wordWrapMinified,
    wrappingIndent: settings.wrappingIndent,
    scrollBeyondLastLine: settings.scrollBeyondLastLine,
    scrollBeyondLastColumn: settings.scrollBeyondLastColumn,
    smoothScrolling: settings.smoothScrolling,
    mouseWheelScrollSensitivity: settings.mouseWheelScrollSensitivity,
    fastScrollSensitivity: settings.fastScrollSensitivity,
    cursorStyle: settings.cursorStyle,
    cursorWidth: settings.cursorWidth,
    cursorBlinking: settings.cursorBlinking,
    cursorSmoothCaretAnimation: settings.cursorSmoothCaretAnimation,
    selectOnLineNumbers: settings.selectOnLineNumbers,
    selectionHighlight: settings.selectionHighlight,
    occurrencesHighlight: settings.occurrencesHighlight,
    renderLineHighlight: settings.renderLineHighlight,
    renderLineHighlightOnlyWhenFocus: settings.renderLineHighlightOnlyWhenFocus,
    minimap: {
      enabled: settings.minimapEnabled,
      side: settings.minimapSide,
      size: settings.minimapSize,
      showSlider: settings.minimapShowSlider,
      renderCharacters: settings.minimapRenderCharacters,
      maxColumn: settings.minimapMaxColumn
    },
    folding: settings.folding,
    foldingStrategy: settings.foldingStrategy,
    foldingHighlight: settings.foldingHighlight,
    unfoldOnClickAfterEndOfLine: settings.unfoldOnClickAfterEndOfLine,
    showFoldingControls: settings.showFoldingControls,
    quickSuggestions: settings.quickSuggestions,
    quickSuggestionsDelay: settings.quickSuggestionsDelay,
    suggestOnTriggerCharacters: settings.suggestOnTriggerCharacters,
    acceptSuggestionOnEnter: settings.acceptSuggestionOnEnter,
    acceptSuggestionOnCommitCharacter: settings.acceptSuggestionOnCommitCharacter,
    snippetSuggestions: settings.snippetSuggestions,
    wordBasedSuggestions: settings.wordBasedSuggestions,
    suggestSelection: settings.suggestSelection,
    matchBrackets: settings.matchBrackets,
    bracketPairColorization: { enabled: settings.bracketPairColorization },
    guides: settings.guides,
    autoIndent: settings.autoIndent,
    formatOnType: settings.formatOnType,
    formatOnPaste: settings.formatOnPaste,
    autoClosingBrackets: settings.autoClosingBrackets,
    autoClosingQuotes: settings.autoClosingQuotes,
    autoSurround: settings.autoSurround,
    find: settings.find,
    renderWhitespace: settings.renderWhitespace,
    renderControlCharacters: settings.renderControlCharacters,
    renderIndentGuides: settings.renderIndentGuides,
    highlightActiveIndentGuide: settings.highlightActiveIndentGuide,
    renderValidationDecorations: settings.renderValidationDecorations,
    stopRenderingLineAfter: settings.stopRenderingLineAfter,
    disableLayerHinting: settings.disableLayerHinting,
    disableMonospaceOptimizations: settings.disableMonospaceOptimizations,
    accessibilitySupport: settings.accessibilitySupport,
    accessibilityPageSize: settings.accessibilityPageSize,
    contextmenu: settings.contextmenu,
    mouseStyle: settings.mouseStyle,
    multiCursorModifier: settings.multiCursorModifier,
    multiCursorMergeOverlapping: settings.multiCursorMergeOverlapping,
    multiCursorPaste: settings.multiCursorPaste,
    columnSelection: settings.columnSelection,
    copyWithSyntaxHighlighting: settings.copyWithSyntaxHighlighting,
    useTabStops: settings.useTabStops,
    emptySelectionClipboard: settings.emptySelectionClipboard,
    automaticLayout: settings.automaticLayout,
    glyphMargin: settings.glyphMargin,
    lineDecorationsWidth: settings.lineDecorationsWidth,
    lineNumbersWidth: settings.lineNumbersWidth,
    overviewRulerBorder: settings.overviewRulerBorder,
    overviewRulerLanes: settings.overviewRulerLanes,
    hideCursorInOverviewRuler: settings.hideCursorInOverviewRuler,
    hover: settings.hover,
    parameterHints: settings.parameterHints,
    codeLens: settings.codeLens,
    codeLensFontFamily: settings.codeLensFontFamily,
    codeLensFontSize: settings.codeLensFontSize,
    links: settings.links,
    comments: settings.comments
  }
}

export default useEditorSettingsStore
export { DEFAULT_EDITOR_SETTINGS }
