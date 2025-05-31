// Judge0 API Service for code execution
// You'll need to get your RapidAPI key from: https://rapidapi.com/judge0-official/api/judge0-ce

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'

// Language IDs for Judge0 API
export const LANGUAGE_IDS = {
  javascript: 63,    // Node.js
  python: 71,        // Python 3
  java: 62,          // Java
  cpp: 54,           // C++ (GCC 9.2.0)
  c: 50,             // C (GCC 9.2.0)
  csharp: 51,        // C# (Mono 6.6.0.161)
  php: 68,           // PHP
  ruby: 72,          // Ruby
  go: 60,            // Go
  rust: 73,          // Rust
  kotlin: 78,        // Kotlin
  swift: 83,         // Swift
  typescript: 74,    // TypeScript
  sql: 82,           // SQL (SQLite)
  bash: 46,          // Bash
  r: 80,             // R
  scala: 81,         // Scala
  perl: 85,          // Perl
  lua: 64,           // Lua
  dart: 90,          // Dart
}

// Language display names
export const LANGUAGE_NAMES = {
  javascript: 'JavaScript (Node.js)',
  python: 'Python 3',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  kotlin: 'Kotlin',
  swift: 'Swift',
  typescript: 'TypeScript',
  sql: 'SQL',
  bash: 'Bash',
  r: 'R',
  scala: 'Scala',
  perl: 'Perl',
  lua: 'Lua',
  dart: 'Dart',
}

class Judge0Service {
  constructor() {
    // You need to set your RapidAPI key here
    // Get it from: https://rapidapi.com/judge0-official/api/judge0-ce
    this.apiKey = import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY
    this.headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    }
  }

  /**
   * Submit code for execution
   * @param {string} sourceCode - The source code to execute
   * @param {string} language - Programming language
   * @param {string} stdin - Input for the program (optional)
   * @returns {Promise<string>} - Submission token
   */
  async submitCode(sourceCode, language, stdin = '') {
    const languageId = LANGUAGE_IDS[language]
    
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`)
    }

    const payload = {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
      // Optional: Add CPU and memory limits
      cpu_time_limit: 2, // 2 seconds
      memory_limit: 128000, // 128 MB
    }

    try {
      const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.token
    } catch (error) {
      console.error('Error submitting code:', error)
      throw new Error('Failed to submit code for execution')
    }
  }

  /**
   * Get submission result
   * @param {string} token - Submission token
   * @returns {Promise<Object>} - Execution result
   */
  async getSubmissionResult(token) {
    try {
      const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
        method: 'GET',
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error getting submission result:', error)
      throw new Error('Failed to get execution result')
    }
  }

  /**
   * Execute code and wait for result
   * @param {string} sourceCode - The source code to execute
   * @param {string} language - Programming language
   * @param {string} stdin - Input for the program (optional)
   * @returns {Promise<Object>} - Execution result
   */
  async executeCode(sourceCode, language, stdin = '') {
    try {
      // Submit code
      const token = await this.submitCode(sourceCode, language, stdin)
      
      // Poll for result
      let result
      let attempts = 0
      const maxAttempts = 30 // Maximum 30 seconds wait time
      
      do {
        await this.delay(1000) // Wait 1 second between polls
        result = await this.getSubmissionResult(token)
        attempts++
      } while (result.status.id <= 2 && attempts < maxAttempts) // Status 1: In Queue, Status 2: Processing

      return this.formatResult(result)
    } catch (error) {
      console.error('Error executing code:', error)
      throw error
    }
  }

  /**
   * Format execution result for display
   * @param {Object} result - Raw Judge0 result
   * @returns {Object} - Formatted result
   */
  formatResult(result) {
    const status = result.status
    
    return {
      success: status.id === 3, // Status 3: Accepted
      status: status.description,
      statusId: status.id,
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      executionTime: result.time ? `${result.time}s` : null,
      memoryUsage: result.memory ? `${result.memory} KB` : null,
      exitCode: result.exit_code,
      // Raw result for debugging
      raw: result
    }
  }

  /**
   * Utility function to delay execution
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get available languages
   * @returns {Array} - Array of language objects
   */
  getAvailableLanguages() {
    return Object.keys(LANGUAGE_IDS).map(key => ({
      id: key,
      name: LANGUAGE_NAMES[key],
      languageId: LANGUAGE_IDS[key]
    }))
  }

  /**
   * Check if API key is configured
   * @returns {boolean}
   */
  isConfigured() {
    return this.apiKey && this.apiKey !== 'YOUR_RAPIDAPI_KEY_HERE'
  }
}

// Export singleton instance
const judge0Service = new Judge0Service()
export default judge0Service
