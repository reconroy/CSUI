import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import useEditorSettingsStore from '../store/editorSettingsStore'
import useEditorSync from '../hooks/useEditorSync'

const LiveEditorPreview = () => {
  const editorRef = useRef(null)
  const [language, setLanguage] = useState('javascript')

  // Get Monaco options from settings store
  const { getMonacoOptions } = useEditorSettingsStore()

  // Register with editor sync system
  const { registerEditor, unregisterEditor } = useEditorSync()

  // Sample code for different languages
  const sampleCode = {
    javascript: `// Welcome to CodeSpace Live Preview!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
const numbers = [];
for (let i = 0; i < 10; i++) {
  numbers.push(fibonacci(i));
}

console.log('Fibonacci sequence:', numbers);

// Modern JavaScript features
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Arrow functions and destructuring
const processUser = ({ name, age, email }) => ({
  displayName: name.toUpperCase(),
  isAdult: age >= 18,
  contact: email.toLowerCase()
});`,

    python: `# Welcome to CodeSpace Live Preview!
def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Calculate first 10 Fibonacci numbers
numbers = [fibonacci(i) for i in range(10)]
print(f"Fibonacci sequence: {numbers}")

# Class example
class User:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

    @property
    def display_name(self):
        return self.name.upper()

    @property
    def is_adult(self):
        return self.age >= 18

    def __str__(self):
        return f"User({self.name}, {self.age})"

# Usage
user = User("Alice", 25, "alice@example.com")
print(f"User: {user.display_name}, Adult: {user.is_adult}")`,

    typescript: `// Welcome to CodeSpace Live Preview!
interface User {
  name: string;
  age: number;
  email: string;
}

interface FibonacciResult {
  sequence: number[];
  count: number;
}

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generic function example
function processArray<T>(items: T[], processor: (item: T) => T): T[] {
  return items.map(processor);
}

// Calculate Fibonacci sequence
const generateFibonacci = (count: number): FibonacciResult => {
  const sequence: number[] = [];
  for (let i = 0; i < count; i++) {
    sequence.push(fibonacci(i));
  }
  return { sequence, count };
};

// Usage with type safety
const result = generateFibonacci(10);
console.log(\`Generated \${result.count} numbers: \${result.sequence}\`);

// Modern TypeScript features
const processUser = ({ name, age, email }: User): Partial<User> => ({
  name: name.toUpperCase(),
  email: email.toLowerCase()
});`,

    html: `<!DOCTYPE html>
<!-- Welcome to CodeSpace Live Preview! -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeSpace Preview</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 CodeSpace</h1>
            <p>Your collaborative coding environment</p>
        </div>

        <div class="feature-grid">
            <div class="feature-card">
                <h3>⚡ Real-time Collaboration</h3>
                <p>Code together with your team in real-time</p>
            </div>

            <div class="feature-card">
                <h3>🎨 Customizable Editor</h3>
                <p>Personalize your coding experience</p>
            </div>

            <div class="feature-card">
                <h3>🔧 Multiple Languages</h3>
                <p>Support for all popular programming languages</p>
            </div>
        </div>
    </div>
</body>
</html>`,

    css: `/* Welcome to CodeSpace Live Preview! */

/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* CSS Custom Properties */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --text-color: #333;
  --bg-color: #f8f9fa;
  --border-radius: 8px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Modern Layout with Grid */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  min-height: 100vh;
  gap: 1rem;
  padding: 1rem;
}

/* Flexbox Navigation */
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

/* Modern Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

/* CSS Grid Card Layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
  }
}`
  }

  const [code, setCode] = useState(sampleCode[language])

  // Update code when language changes
  useEffect(() => {
    setCode(sampleCode[language])
  }, [language])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor

    // Define custom theme matching the app's dark theme with green accents
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

    // Register editor with sync system
    registerEditor(editor)

    // Set up editor with current settings
    editor.updateOptions(getMonacoOptions())
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        unregisterEditor(editorRef.current)
      }
    }
  }, [unregisterEditor])

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Language Selector */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-600/30">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:border-green-500 focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-gray-400">
          Live Preview • Changes apply instantly
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          width="100%"
          height="100%"
          language={language}
          value={code}
          onChange={setCode}
          onMount={handleEditorDidMount}
          theme="codespace-dark"
          options={{
            ...getMonacoOptions(),
            readOnly: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 }
          }}
          loading={
            <div className="flex items-center justify-center w-full h-full bg-gray-800">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                <p className="text-gray-400 text-sm">Loading preview...</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default LiveEditorPreview
