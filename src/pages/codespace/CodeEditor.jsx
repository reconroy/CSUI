import React, { useEffect, useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

const CodeEditor = () => {
  const editorRef = useRef(null)
  const [code, setCode] = useState('// Welcome to CodeSpace!\nconsole.log("Hello, World!");')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [editorLoading, setEditorLoading] = useState(true)
  const [editorError, setEditorError] = useState(null)

  // Prevent back navigation to login/auth pages
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.pathname);
    };
    window.addEventListener('popstate', preventBackNavigation);
    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  // Monaco Editor configuration
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorLoading(false);

    // Define custom theme matching your app's dark theme with green accents
    monaco.editor.defineTheme('codespace-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '10B981', fontStyle: 'bold' },
        { token: 'string', foreground: 'FCD34D' },
        { token: 'number', foreground: 'F87171' },
        { token: 'function', foreground: '60A5FA' },
        { token: 'variable', foreground: 'E5E7EB' },
        { token: 'type', foreground: 'A78BFA' },
      ],
      colors: {
        'editor.background': '#111827',
        'editor.foreground': '#E5E7EB',
        'editor.lineHighlightBackground': '#1F2937',
        'editor.selectionBackground': '#10B98150',
        'editor.inactiveSelectionBackground': '#10B98130',
        'editorCursor.foreground': '#10B981',
        'editorLineNumber.foreground': '#6B7280',
        'editorLineNumber.activeForeground': '#10B981',
        'editor.findMatchBackground': '#10B98150',
        'editor.findMatchHighlightBackground': '#10B98130',
        'editorWidget.background': '#1F2937',
        'editorWidget.border': '#374151',
        'editorSuggestWidget.background': '#1F2937',
        'editorSuggestWidget.border': '#374151',
        'editorSuggestWidget.selectedBackground': '#10B98150',
      }
    });

    // Set the custom theme
    monaco.editor.setTheme('codespace-dark');
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  // Code execution simulation (you can replace this with actual API calls)
  const runCode = async () => {
    setIsRunning(true);
    setShowTerminal(true);
    setOutput('Running code...\n');

    try {
      // Simulate code execution delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock output based on language
      let mockOutput = '';
      switch (language) {
        case 'javascript':
          mockOutput = '> node index.js\nHello, World!\nCode executed successfully!';
          break;
        case 'python':
          mockOutput = '> python main.py\nHello, World!\nCode executed successfully!';
          break;
        case 'html':
          mockOutput = '> Opening in browser...\nHTML rendered successfully!';
          break;
        default:
          mockOutput = `> Running ${language} code...\nOutput: Hello, World!\nExecution completed!`;
      }

      setOutput(mockOutput);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '📄' },
    { value: 'markdown', label: 'Markdown', icon: '📝' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Name */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">File:</span>
            <span className="text-sm text-white font-mono">
              main.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Run Button */}
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Running...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h1m4 0h1M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                <span>Run</span>
              </>
            )}
          </button>

          {/* Terminal Toggle */}
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
              showTerminal
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Terminal</span>
          </button>
        </div>
      </div>

      {/* Editor and Terminal Layout */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Code Editor */}
        <div className={`${showTerminal ? 'flex-1' : 'flex-1'} relative min-h-0 overflow-hidden`}>
          {editorLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <p className="text-gray-400">Loading Monaco Editor...</p>
              </div>
            </div>
          )}

          {editorError && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col z-10">
              <div className="flex items-center justify-center flex-1">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-medium">Monaco Editor failed to load</p>
                    <p className="text-gray-500 text-sm mt-1">Using fallback text editor</p>
                  </div>
                </div>
              </div>

              {/* Fallback textarea editor */}
              <div className="flex-1 p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-gray-800 text-white font-mono text-sm p-4 border border-gray-600 rounded-lg resize-none focus:outline-none focus:border-green-500"
                  placeholder="// Start coding here..."
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          <div className="w-full h-full">
            <Editor
              width="100%"
              height="100%"
              language={language}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              loading={
                <div className="flex items-center justify-center w-full h-full bg-gray-900">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <p className="text-gray-400">Loading Monaco Editor...</p>
                  </div>
                </div>
              }
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                contextmenu: true,
                selectOnLineNumbers: true,
                glyphMargin: true,
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'always',
                unfoldOnClickAfterEndOfLine: false,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
                padding: { top: 10, bottom: 10 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
                renderWhitespace: 'selection',
              }}
            />
          </div>
        </div>

        {/* Terminal Output */}
        {showTerminal && (
          <div className="h-64 bg-gray-900 border-t border-gray-700/50 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400 ml-2">Terminal</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setOutput('')}
                  className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {output || 'Ready to run code...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor