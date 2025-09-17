import { useState } from "react";

const NaturalLanguageConfig = ({ onExecuteCommand }) => {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    setResult("");

    try {
      // Send command to Gemini AI backend
      const response = await fetch('http://localhost:5000/api/nl/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ command })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(`✅ Successfully executed: ${command}`);
        setCommand("");
        // Command executed successfully by backend
        // No need to call onExecuteCommand since backend handled it
      } else {
        setResult(`❌ Error: ${data.error || data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Now using Gemini AI backend for parsing

  const examples = [
    "Create a permission for viewing reports",
    "I want to make a new role called Manager", 
    "Let the Editor role have permission to edit users",
    "Give Admin the ability to manage all users",
    "Make a permission for publishing content",
    "Create Supervisor role",
    "Remove permission from Editor role"
  ];

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">🤖 Natural Language Configuration</h2>
        <p className="text-sm opacity-70">Configure permissions and roles using plain English commands</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Type any command in natural language... e.g., 'I want to create a permission for managing users'"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              rows={3}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !command.trim()}
          >
            {loading ? "Processing..." : "Execute Command"}
          </button>
        </form>

        {result && (
          <div className={`alert ${result.includes('✅') ? 'alert-success' : 'alert-error'}`}>
            <span>{result}</span>
          </div>
        )}

        <div className="divider">Examples</div>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <button
              key={index}
              className="btn btn-ghost btn-sm w-full justify-start"
              onClick={() => setCommand(example)}
            >
              💡 {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageConfig;