const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-slate-50\b/g, to: 'bg-slate-950' },
  { from: /bg-white\b/g, to: 'bg-slate-900' },
  { from: /text-slate-900\b/g, to: 'text-white' },
  { from: /text-slate-800\b/g, to: 'text-slate-100' },
  { from: /text-slate-700\b/g, to: 'text-slate-300' },
  { from: /text-slate-600\b/g, to: 'text-slate-400' },
  { from: /text-slate-500\b/g, to: 'text-slate-400' },
  { from: /border-slate-200\b/g, to: 'border-slate-800' },
  { from: /border-slate-100\b/g, to: 'border-slate-800/50' },
  { from: /border-slate-300\b/g, to: 'border-slate-700' },
  { from: /hover:bg-slate-100\b/g, to: 'hover:bg-slate-800' },
  { from: /hover:bg-slate-50\b/g, to: 'hover:bg-slate-800/50' },
  { from: /hover:bg-slate-200\b/g, to: 'hover:bg-slate-700' },
  { from: /bg-slate-100\b/g, to: 'bg-slate-800' },
  { from: /divide-slate-100\b/g, to: 'divide-slate-800' },
  
  { from: /bg-emerald-50\b/g, to: 'bg-emerald-500/10' },
  { from: /bg-emerald-100\b/g, to: 'bg-emerald-500/20' },
  { from: /text-emerald-700\b/g, to: 'text-emerald-400' },
  { from: /text-emerald-600\b/g, to: 'text-emerald-500' },
  { from: /border-emerald-100\b/g, to: 'border-emerald-500/20' },
  { from: /border-emerald-200\b/g, to: 'border-emerald-500/30' },
  
  { from: /bg-red-50\b/g, to: 'bg-red-500/10' },
  { from: /bg-red-100\b/g, to: 'bg-red-500/20' },
  { from: /text-red-700\b/g, to: 'text-red-400' },
  { from: /text-red-600\b/g, to: 'text-red-500' },
  { from: /border-red-200\b/g, to: 'border-red-500/20' },

  { from: /bg-blue-50\b/g, to: 'bg-blue-500/10' },
  { from: /bg-blue-100\b/g, to: 'bg-blue-500/20' },
  { from: /text-blue-800\b/g, to: 'text-blue-300' },
  { from: /text-blue-700\b/g, to: 'text-blue-400' },
  { from: /text-blue-600\b/g, to: 'text-blue-500' },
  { from: /border-blue-100\b/g, to: 'border-blue-500/20' },

  { from: /bg-amber-50\b/g, to: 'bg-amber-500/10' },
  { from: /border-amber-200\b/g, to: 'border-amber-500/20' },
  { from: /text-amber-900\b/g, to: 'text-amber-300' },
  { from: /text-amber-800\b/g, to: 'text-amber-400' },

  { from: /bg-purple-100\b/g, to: 'bg-purple-500/20' },
  { from: /text-purple-600\b/g, to: 'text-purple-400' },

  { from: /stroke="#e2e8f0"/g, to: 'stroke="#334155"' },
  { from: /fill: '#64748b'/g, to: "fill: '#94a3b8'" },
  { from: /color: '#0f172a'/g, to: "color: '#f8fafc'" },
  { from: /boxShadow: '0 4px 6px -1px rgb\(0 0 0 \/ 0.1\)'/g, to: "backgroundColor: '#1e293b', borderColor: '#334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'" },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
