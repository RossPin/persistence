export default e => { 
  if (e.target.src !== "/Character_Placeholder.png") { 
    e.target.onerror = null; 
    e.target.src="/Character_Placeholder.png"; 
  }
} 