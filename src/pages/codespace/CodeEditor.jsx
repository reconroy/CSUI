import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FiLayout, FiColumns } from 'react-icons/fi';
import useEditorSettingsStore from '../../store/editorSettingsStore';
import useEditorSync from '../../hooks/useEditorSync';
import Terminal from '../../components/Terminal';
import judge0Service from '../../services/judge0Service';

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('// Welcome to CodeSpace!\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [editorLoading, setEditorLoading] = useState(true);
  const [editorError, setEditorError] = useState(null);
  const [terminalPosition, setTerminalPosition] = useState('below');

  // Editor settings from store
  const { getMonacoOptions } = useEditorSettingsStore();

  // Register with editor sync system
  const { registerEditor, unregisterEditor } = useEditorSync();

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

  // Load terminal position from localStorage on component mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('terminalPosition');
    if (savedPosition) {
      setTerminalPosition(savedPosition);
    }
  }, []);

  // Save terminal position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('terminalPosition', terminalPosition);
  }, [terminalPosition]);

  const toggleTerminalPosition = () => {
    setTerminalPosition(prevPosition => (prevPosition === 'below' ? 'right' : 'below'));
  };

  // Monaco Editor configuration
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorLoading(false);

    // Register editor with sync system
    registerEditor(editor);

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

  // Handle editor content changes
  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        unregisterEditor(editorRef.current);
      }
    };
  }, [unregisterEditor]);

  // Code execution using Judge0 API
  const runCode = async () => {
    if (!judge0Service.isConfigured()) {
      setOutput('Judge0 API key not configured. Please add REACT_APP_RAPIDAPI_KEY to your .env file.');
      setShowTerminal(true);
      return;
    }

    setIsRunning(true);
    setShowTerminal(true);
    setOutput('');

    try {
      const result = await judge0Service.executeCode(code, language);
      if (result.success) {
        setOutput(result.output || 'Code executed successfully (no output)');
      } else {
        setOutput(result.error || `Execution failed: ${result.status}`);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setOutput(`Execution failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Get available languages from Judge0 service
  const languages = judge0Service.getAvailableLanguages().map(lang => ({
    value: lang.id,
    label: lang.name,
    icon: getLanguageIcon(lang.id)
  }));

  // Helper function to get language icons
  function getLanguageIcon(lang) {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔵',
      csharp: '🔷',
      php: '🐘',
      ruby: '💎',
      go: '🐹',
      rust: '🦀',
      kotlin: '🎯',
      swift: '🍎',
      typescript: '🔷',
      sql: '🗄️',
      bash: '💻',
      r: '📊',
      scala: '⚖️',
      perl: '🐪',
      lua: '🌙',
      dart: '🎯'
    };
    return icons[lang] || '🔤';
  }

  // return (
  //   <div className="w-full h-full flex flex-col bg-gray-900 overflow-hidden">
  //     {/* Top Toolbar */}
  //     <div className="flex items-center justify-between p-3 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 flex-shrink-0">
  //       <div className="flex items-center space-x-4">
  //         {/* Language Selector */}
  //         <div className="flex items-center space-x-2">
  //           <label className="text-sm text-gray-300">Language:</label>
  //           <select
  //             value={language}
  //             onChange={(e) => setLanguage(e.target.value)}
  //             className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm"
  //           >
  //             {languages.map((lang) => (
  //               <option key={lang.value} value={lang.value}>
  //                 {lang.icon} {lang.label}
  //               </option>
  //             ))}
  //           </select>
  //         </div>

  //         {/* File Name */}
  //         <div className="flex items-center space-x-2">
  //           <span className="text-sm text-gray-400">File:</span>
  //           <span className="text-sm text-white font-mono">
  //             main.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language}
  //           </span>
  //         </div>
  //       </div>

  //       <div className="flex items-center space-x-2">
  //         {/* Run Button */}
  //         <button
  //           onClick={runCode}
  //           disabled={isRunning}
  //           className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
  //         >
  //           {isRunning ? (
  //             <>
  //               <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
  //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //               </svg>
  //               <span>Running...</span>
  //             </>
  //           ) : (
  //             <>
  //               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h1m4 0h1M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
  //               </svg>
  //               <span>Run</span>
  //             </>
  //           )}
  //         </button>

  //         {/* Terminal Toggle Button */}
  //         <button
  //           onClick={() => setShowTerminal(!showTerminal)}
  //           className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
  //             showTerminal
  //               ? 'bg-green-600 hover:bg-green-700 text-white'
  //               : 'bg-gray-700 hover:bg-gray-600 text-white'
  //           }`}
  //         >
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
  //           </svg>
  //           <span>Terminal</span>
  //         </button>

  //         {/* Terminal Position Toggle Button */}
  //         <button
  //           onClick={toggleTerminalPosition}
  //           className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
  //         >
  //           {terminalPosition === 'below' ? <FiColumns /> : <FiLayout />}
  //           <span>Toggle Terminal Position</span>
  //         </button>
  //       </div>
  //     </div>

  //     {/* Editor and Terminal Layout */}
  //     <div className={`flex-1 flex min-h-0 overflow-hidden ${terminalPosition === 'right' ? 'flex-row' : 'flex-col'}`}>
  //       {/* Code Editor */}
  //       <div className="flex-1 min-h-0 overflow-hidden">
  //         <Editor
  //           width="100%"
  //           height="100%"
  //           language={language}
  //           value={code}
  //           onChange={handleEditorChange}
  //           onMount={handleEditorDidMount}
  //           theme="vs-dark"
  //           options={getMonacoOptions()}
  //         />
  //       </div>

  //       {/* Terminal Output */}
  //       {showTerminal && (
  //         <Terminal
  //           setOutput={setOutput}
  //           setShowTerminal={setShowTerminal}
  //           output={output || 'Ready to run code...'}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );

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

        {/* Terminal Toggle Button */}
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

        {/* Terminal Position Toggle Button */}
        <button
          onClick={toggleTerminalPosition}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
        >
          {terminalPosition === 'below' ? <FiColumns /> : <FiLayout />}
          <span>Toggle Terminal Position</span>
        </button>
      </div>
    </div>

    {/* Editor and Terminal Layout */}
    <div className={`flex-1 flex ${terminalPosition === 'right' ? 'flex-row' : 'flex-col'} min-h-0 overflow-hidden`}>
      {/* Code Editor */}
      <div className={terminalPosition === 'right' ? "w-3/4 min-h-0 overflow-hidden" : "h-3/5 min-h-0 overflow-hidden"}>
        <Editor
          width="100%"
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={getMonacoOptions()}
        />
      </div>

      {/* Terminal Output */}
      {showTerminal && (
        <div className={terminalPosition === 'right' ? "w-1/4 min-h-0 overflow-hidden" : "h-2/5 min-h-0 overflow-hidden"}>
          <Terminal
            setOutput={setOutput}
            setShowTerminal={setShowTerminal}
            output={output || 'Ready to run code...'}
          />
        </div>
      )}
    </div>
  </div>
);

};

export default CodeEditor;
